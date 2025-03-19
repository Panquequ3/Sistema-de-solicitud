"use client";

import { useEffect, useRef, useState, useContext } from 'react';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ModalSolicitud from './pop-up/ModalSolicitud';
import { SolicitudesContext } from "@/app/context/SolicitudesContext";

// Componente que renderiza el calendario con las reservas del estudio, de aquí se 
// despliega tambien la posibilidad de ver las solicitudes con más detalle y realizar una

const Calendario = () => {
  const calendarRef = useRef(null); // almacenará el calendario
  const calendarInstanceRef = useRef(null); // almacenará una instancia del calendario
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [eventos, setEventos] = useState([]);
  const { solicitudes, obtenerSolicitudes, accionEnProgreso } = useContext(SolicitudesContext);

  /* Función para mostrar solo aquellas que no están denegadas */
  const filtra = async () => { 
    const evento = solicitudes
      .filter(solicitud => solicitud.estado !== "denegado")
      .map((solicitud) => {
        return {
          title: solicitud.nombre_estudiante,
          start: solicitud.fecha,
          time: `${solicitud.hora_inicio.slice(0,5)} - ${solicitud.hora_fin.slice(0,5)}`,
          sala: solicitud.sala, 
          hora_inicio: solicitud.hora_inicio.slice(0,5), // Para comparar y ordenar los eventos
          status: solicitud.estado,
          id_solicitud: solicitud.id_solicitud,
          color: (solicitud.estado === "aceptado" ? "#92db56" : (solicitud.estado === "en revision" ? "#FFD951" : "#6ccaee" )),
          textColor:" #000000"
        };
      }).sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio)); // Ordenamos lexicográficamente las horas de inicio
      
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