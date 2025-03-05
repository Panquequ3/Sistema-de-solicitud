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
import Buscador from './Buscador';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useEffect, useState, useContext } from 'react';


import { SolicitudesContext } from "@/app/context/SolicitudesContext";

// Componente que lista todas las solicitudes para ser visualizadas y resueltas
// por el administrador

const ListarSolicitud = () => {
  const [descAbierto, setDescAbierto] = useState(false);
  const [descripcion, setDescripcion] = useState(null);
  const [eventos, setEventos] = useState([]); // Ejemplos temporales
  const [filtro, setFiltro] = useState('');
  const { solicitudes, obtenerSolicitudes, accionEnProgreso } = useContext(SolicitudesContext);

  const filtra = async () => { 
    const evento = solicitudes
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
          sala: solicitud.sala
        };
      }).sort((a, b) => {
        // Si el segundo elemento (b) ya fue resuelto, entonces el primero (a) debe ir antes
        if (b.status !== "pendiente" && a.status === "pendiente" ) return -1; 

        // Si el segundo elemento (b) no ha sido resuelto, entonces el primero (a) debe ir después
        if (b.status === "pendiente" && a.status !== "pendiente" ) return 1; 

        // Si ya fueron resueltos, ordenamos por fecha
        if (b.status !== "pendiente" && a.status !== "pendiente") {
          const dateA = new Date(a.start);
          const dateB = new Date(b.start);
          return dateB - dateA;
        }

        // Si ninguno ha sido resuelto ordenamos por id, de menor (más antiguo) a mayor (más reciente)
        return a.id_solicitud - b.id_solicitud;
        });

        setEventos(evento);
  }

  
  useEffect(() => {
    obtenerSolicitudes();
  }, []);

  useEffect(() => {
    filtra();
  }, [solicitudes, filtro]);

    // Intervalo para actualizar las solicitudes cada 5 minutos
  useEffect(() => {
      const intervalId = setInterval(() => {
        if (!accionEnProgreso.current){
          obtenerSolicitudes();
        }
      }, 300000); // 5 minutos 300000
  
      // Limpiar el intervalo cuando el componente se desmonte
      return () => clearInterval(intervalId);
  }, []);

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
      <div className='filter-div'>
      <ToggleButtonGroup
        color="default"
        value={filtro}
        exclusive // Solo una opción puede ser seleccionada a la vez
        onChange={handleFilter}
        className="filter-button"
      >
        <ToggleButton value="">Todos</ToggleButton>
        <ToggleButton value="pendiente">Pendientes</ToggleButton>
        <ToggleButton value="aceptado">Aceptados</ToggleButton>
        <ToggleButton value="denegado">Denegados</ToggleButton>
      </ToggleButtonGroup>
      <h4 className="page-subtitle"> Nota: Las solicitudes pendientes están ordenadas de la más antigua a la más reciente.</h4>
      <Buscador setEventos={setEventos}/>
      </div>
      <TableContainer component={Paper} className="table-container">
        <Table sx={{ minWidth: 650 }}>
          <TableHead className="table-header">
            <TableRow>
            <TableCell>ID</TableCell>
              <TableCell>Estudiante</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Sala</TableCell>
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
                  {event.id_solicitud}
                </TableCell>
                <TableCell component="th" scope="row" >
                  {event.title}
                </TableCell>
                <TableCell align="right">{event.email}</TableCell>
                <TableCell align="right">Sala {event.sala}</TableCell>
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
                            destinatario={{email: event.email, nombre: event.title}}
                            />
                    <Denegar id_solicitud={event.id_solicitud} 
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