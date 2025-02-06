"use client";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper'; // Solo para dar apariencia
import Aceptar from './Aceptar';
import Denegar from './Denegar';
import Descripcion from './Descripcion';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useEffect, useState } from 'react';

// Componente que lista todas las solicitudes para ser visualizadas y resueltas
// por el administrador

const ListarSolicitud = () => {
  const [descAbierto, setDescAbierto] = useState(false);
  const [descripcion, setDescripcion] = useState(null);
  const [eventos, setEventos] = useState([]); // Ejemplos temporales
  const [filtro, setFiltro] = useState('');

  const obtenerSolicitudes = async () => {
    try {
      const response = await fetch('http://localhost:8000/solicitudesInfo/');
      if (!response.ok) {
        throw new Error('Fallo al obtener solicitudes');
      }
      const data = await response.json();
      
      const evento = data
      .filter(solicitud => filtro === '' || solicitud.estado === filtro) // Filtrar por estado
      .map((solicitud) => {
        return {
          title: solicitud.nombre_estudiante,
          email: solicitud.email,
          start: solicitud.fecha,
          desc: solicitud.descripcion,
          startTime: solicitud.hora_inicio.slice(0,5), // Obtenemos el string que nos interesa
          endTime: solicitud.hora_fin.slice(0,5), // o sea, solo el HH:MM
          id_solicitud: solicitud.id_solicitud,
          status: solicitud.estado,
        };
      }).sort((a, b) => {
        // Si el segundo elemento (b) ya fue resuelto, entonces el primero (a) debe ir antes
        if (b.status !== "pendiente" && a.status === "pendiente" ) return -1; 

        // Si el segundo elemento (b) no ha sido resuelto, entonces el primero (a) debe ir después
        if (b.status === "pendiente" && a.status !== "pendiente" ) return 1; 

        // Si ya fueron resueltos, da igual el orden
        if (b.status !== "pendiente" && a.status !== "pendiente") return 0; 

        // Si ninguno ha sido resuelto ordenamos por id, de menor (más antiguo) a mayor (más reciente)
        return a.id_solicitud - b.id_solicitud;
        });
      
      setEventos(evento);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  useEffect(() => {
    obtenerSolicitudes();
  }, [filtro]);

  const handleDescClick = (desc) => {
    setDescripcion(desc);
    setDescAbierto(true);
  };

  const handleFilter = (event, nuevoFiltro) => {
    if (nuevoFiltro !== null) {
      setFiltro(nuevoFiltro);
    }
    
  }

  return (
    <div>
      <ToggleButtonGroup
        color="default"
        value={filtro}
        exclusive // Solo un botón puede ser seleccionado a la vez
        onChange={handleFilter}
        className="filter-button"
      >
        <ToggleButton value="">Todos</ToggleButton>
        <ToggleButton value="pendiente">Pendientes</ToggleButton>
        <ToggleButton value="aceptado">Aceptados</ToggleButton>
        <ToggleButton value="denegado">Denegados</ToggleButton>
      </ToggleButtonGroup>

      <TableContainer component={Paper} className="table-container">
        <Table sx={{ minWidth: 650 }}>
          <TableHead className="table-header">
            <TableRow>
              <TableCell>Estudiante</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Fecha</TableCell>
              <TableCell align="right">Horario</TableCell>
              <TableCell align="right">Descripción</TableCell>
              <TableCell align="right">Resolver</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            
            {eventos.map((event) => (
              <TableRow
                className="table-cell-hover"
                key={event.id_solicitud}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row" >
                  {event.title}
                </TableCell>
                <TableCell align="right">{event.email}</TableCell>
                <TableCell align="right">{event.start}</TableCell>
                <TableCell align="right">{event.startTime} - {event.endTime}</TableCell>
                <TableCell align="right">
                  <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => handleDescClick(event.desc)}>
                    ver descripción
                  </span>
                  </TableCell>
                <TableCell align="right">
                {(event.status === "pendiente") ? (
                  <div className='approval-buttons'>
                    <Aceptar id_solicitud = {event.id_solicitud} 
                            actualizar = {obtenerSolicitudes}
                            destinatario={{email: event.email, nombre: event.title}}
                            />
                    <Denegar id_solicitud={event.id_solicitud} 
                              actualizar = {obtenerSolicitudes}
                              destinatario={{email: event.email, nombre: event.title}}/>
                  </div>
                ) : (
                  <span>
                  {event.status === "denegado" ? "Denegado" : "Aceptado"}
                  </span>                  
                )}
                  </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {descripcion && 
        <Descripcion
        modalAbierto={descAbierto}
        setModalAbierto={setDescAbierto}
        contenido={descripcion}
       />}
    </div>
  );
};

export default ListarSolicitud;