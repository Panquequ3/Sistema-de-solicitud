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
import { useEffect, useState } from 'react';

// Componente que lista todas las solicitudes pendientes para ser visualizadas
// por el administrador

const ListarSolicitud = () => {
  const [descAbierto, setDescAbierto] = useState(false);
  const [descripcion, setDescripcion] = useState(null);
  const [eventos, setEventos] = useState([]); // Ejemplos temporales

  const obtenerSolicitudes = async () => {
    try {
      const response = await fetch('http://localhost:8000/solicitudesEstudiantes/');
      if (!response.ok) {
        throw new Error('Fallo al obtener solicitudes');
      }
      const data = await response.json();
      
      const evento = data.map((solicitud) => {
        return {
          title: solicitud.nombre_estudiante,
          email: solicitud.email,
          start: solicitud.fecha,
          desc: solicitud.descripcion,
          startTime: solicitud.hora_inicio,
          endTime: solicitud.hora_fin,
        };
      });
      
      setEventos(evento);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  useEffect(() => {
    obtenerSolicitudes();
  }, []);

  const handleDescClick = (desc) => {
    setDescripcion(desc);
    setDescAbierto(true);
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                key={event.title}
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
                  <div className='approval-buttons'>
                    <Aceptar />
                    <Denegar />
                  </div>
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