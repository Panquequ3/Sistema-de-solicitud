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

const Filtro = () => {
  const [eventos, setEventos] = useState([]); // Ejemplos temporales
  const [filtro, setFiltro] = useState('');
  const { solicitudes, obtenerSolicitudes } = useContext(SolicitudesContext);

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
        exclusive // Solo una opción puede ser seleccionada a la vez
        onChange={handleFilter}
        className="filter-button"
      >
        <ToggleButton value="">Todos</ToggleButton>
        <ToggleButton value="pendiente">Pendientes</ToggleButton>
        <ToggleButton value="aceptado">Aceptados</ToggleButton>
        <ToggleButton value="denegado">Denegados</ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};

export default Filtro;