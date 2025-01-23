"use client";

import { useEffect, useRef, useState } from 'react';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ModalSolicitud from './pop-up/ModalSolicitud';
import { format } from 'date-fns';

// Componente que renderiza el calendario con las reservas del estudio

const Calendario = () => {
  const calendarRef = useRef(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [eventos, setEventos] = useState([]);

  const obtenerEstudiante = async (id_estudiante) => {
    try {
      const response = await fetch(`http://localhost:8000/estudiante/${id_estudiante}`);
      if (!response.ok) {
        throw new Error('Fallo al encontrar al estudiante');
      }
      const data = await response.json();
      return `${data.nombre} ${data.apellido}`;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
  };

  // Función para obtener todas las solicitudes desde la API
  const obtenerSolicitudes = async () => {
    try {
      const response = await fetch('http://localhost:8000/solicitudes/');
      if (!response.ok) {
        throw new Error('Fallo al obtener solicitudes');
      }
      const data = await response.json();
      
      // Utilizamos Promise.all para manejar multiples llamadas asincronas
      const evento = await Promise.all(data.map(async (solicitud) => {
        const nombreEstudiante = await obtenerEstudiante(solicitud.id_estudiante);
        return {
          title: `Solicitud de ${nombreEstudiante}`,
          start: solicitud.fecha,
          time: `${solicitud.hora_inicio} - ${solicitud.hora_fin}`,
        };
      }));
      
      setEventos(evento);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // useEffect para obtener las solicitudes al montar el componente
  useEffect(() => {
    obtenerSolicitudes();
  }, []);

  useEffect(() => {
    const calendar = new Calendar(calendarRef.current, {
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
      },
      eventClick: function(info) {
        setFechaSeleccionada(info.event.startStr);
        setModalAbierto(true); // Abrir el modal al seleccionar un evento
      },
    });
    calendar.render();
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