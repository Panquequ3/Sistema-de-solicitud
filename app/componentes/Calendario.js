"use client";

import { useEffect, useRef, useState, useContext } from 'react';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ModalSolicitud from './pop-up/ModalSolicitud';
import { SolicitudesContext } from "@/app/context/SolicitudesContext";

// Componente que renderiza el calendario con las reservas del estudio

const Calendario = () => {
  const calendarRef = useRef(null); // almacenará el calendario
  const calendarInstanceRef = useRef(null); // almacenará una instancia del calendario
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [eventos, setEventos] = useState([]);
  const { solicitudes, obtenerSolicitudes, accionEnProgreso } = useContext(SolicitudesContext);

  const filtra = async () => { 
    const evento = solicitudes
      .filter(solicitud => solicitud.estado === "aceptado" || solicitud.estado === "pendiente")
      .map((solicitud) => {
        return {
          title: solicitud.nombre_estudiante,
          start: solicitud.fecha,
          time: `${solicitud.hora_inicio.slice(0,5)} - ${solicitud.hora_fin.slice(0,5)}`,
          color: (solicitud.estado === "aceptado" ? "#92db56" : "#6ccaee"),
          hora_inicio: solicitud.hora_inicio.slice(0,5) // Para comparar y ordenar los eventos
        };
      }).sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio)); // Ordenamos lexicográficamente
      
      setEventos(evento);
  }

  // useEffect para obtener las solicitudes al montar el componente
  useEffect(() => {
    obtenerSolicitudes();
  }, []);

  // useEffect para obtener las solicitudes en un intervalo de tiempo
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!accionEnProgreso.current){
        obtenerSolicitudes();
      }
    }, 300000); // 5 minutos 300000

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
}, []);

  useEffect(() => {
    filtra();
  }, [solicitudes]);

// useEffect para inicializar el calendario solo una vez
useEffect(() => {
  if (calendarRef.current) {
    calendarInstanceRef.current = new Calendar(calendarRef.current, {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      dayMaxEventRows: true,
      moreLinkText: 'más', 
      events: eventos,
      locale: 'es',
      buttonText: { today: 'Hoy', },
      dateClick: function(info) {
        setFechaSeleccionada(info.dateStr);
        setModalAbierto(true); // Abrir el modal al seleccionar una fecha
        accionEnProgreso.current = true;
      },
      eventClick: function(info) {
        setFechaSeleccionada(info.event.startStr);
        setModalAbierto(true); // Abrir el modal al seleccionar un evento
        accionEnProgreso.current = true;
      },
    });
    calendarInstanceRef.current.render();
  }
}, []);

  // useEffect para actualizar los eventos del calendario sin cambiar la vista
  useEffect(() => {
    if (calendarInstanceRef.current) {
      calendarInstanceRef.current.removeAllEvents();
      calendarInstanceRef.current.addEventSource(eventos);
    }
  }, [eventos]);

  return (
    <div>
      <div className="calendario" ref={calendarRef} id="calendar"></div>

      <ModalSolicitud
        modalAbierto={modalAbierto}
        setModalAbierto={setModalAbierto}
        fechaSeleccionada={fechaSeleccionada}
        events={eventos}
      />

    </div>
  );
};

export default Calendario;

  // const obtenerSolicitudes = async () => {
  //   try {
  //     const response = await fetch('http://localhost:8000/solicitudesInfo/');
  //     if (!response.ok) {
  //       throw new Error('Fallo al obtener solicitudes');
  //     }
  //     const data = await response.json();
      
  //     const evento = data
  //     .filter(solicitud => solicitud.estado === "aceptado" || solicitud.estado === "pendiente")
  //     .map((solicitud) => {
  //       return {
  //         title: solicitud.nombre_estudiante,
  //         start: solicitud.fecha,
  //         time: `${solicitud.hora_inicio.slice(0,5)} - ${solicitud.hora_fin.slice(0,5)}`,
  //         color: (solicitud.estado === "aceptado" ? "#92db56" : "#6ccaee"),
  //         hora_inicio: solicitud.hora_inicio.slice(0,5) // Para comparar y ordenar los eventos
  //       };
  //     }).sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio)); // Ordenamos lexicográficamente
      
  //     setEventos(evento);
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };