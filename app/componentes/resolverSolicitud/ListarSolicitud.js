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
import { useState } from 'react';
// Componente que lista todas las solicitudes pendientes para ser visualizadas
// por el administrador

const ListarSolicitud = () => {
  const [descAbierto, setDescAbierto] = useState(false);
  const [descripcion, setDescripcion] = useState(null);
  const [eventos, setEventos] = useState([
    { title: 'Solicitud 1', email: 'usuario1@example.com', start: '2025-01-01', startTime: '14:00', endTime: '15:30', desc: 'Voy con estudiante 2' },
    { title: 'Solicitud 2', email: 'usuario2@example.com', start: '2025-01-01', startTime: '16:00', endTime: '18:30', desc: 'Necesitamos la sala urgente' },
    { title: 'Solicitud 3', email: 'usuario3@example.com', start: '2025-01-01', startTime: '19:00', endTime: '22:00', desc: 'Hola' },
    { title: 'Solicitud 4', email: 'usuario4@example.com', start: '2025-01-01', startTime: '08:00', endTime: '10:00', desc: 'Chao' },
    { title: 'Solicitud 5', email: 'usuario5@example.com', start: '2025-01-01', startTime: '23:00', endTime: '02:00', desc: 'Por favor' },
    { title: 'Solicitud 6', email: 'usuario6@example.com', start: '2025-01-05', startTime: '01:00', endTime: '03:00', desc: 'Somos 3, estudiante 1, 2 y 3' },
    { title: 'Solicitud 7', email: 'usuario7@example.com', start: '2025-01-05', startTime: '14:00', endTime: '16:00', desc: 'Voy solo yo' },
    { title: 'Solicitud 8', email: 'usuario8@example.com', start: '2025-01-05', startTime: '17:30', endTime: '20:00', desc: 'Holi' },
  ]); // Ejemplos temporales

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
                  <div>
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
        descripcion={descripcion}
       />}
    </div>
  );
};

export default ListarSolicitud;