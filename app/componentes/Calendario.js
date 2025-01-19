"use client";

import { useEffect, useRef, useState } from 'react';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ModalSolicitud from './modal/ModalSolicitud';

// Componente que renderiza el calendario con las reservas del estudio

const Calendario = () => {
  const calendarRef = useRef(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [events, setEvents] = useState([
    { title: 'Solicitud 1', start: '2025-01-01', time: '14:00' },
    { title: 'Solicitud 2', start: '2025-01-01', time: '16:00' },
    { title: 'Solicitud 3', start: '2025-01-01', time: '19:00' },
    { title: 'Solicitud 8', start: '2025-01-01', time: '8:00' },
    { title: 'Solicitud 4', start: '2025-01-01', time: '23:00' },
    { title: 'Solicitud 5', start: '2025-01-05', time: '1:00' },
    { title: 'Solicitud 6', start: '2025-01-05', time: '14:00' },
    { title: 'Solicitud 7', start: '2025-01-05', time: '17:30' },
  ]);

  useEffect(() => {
    const calendar = new Calendar(calendarRef.current, {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      events: events,
      locale: 'es',
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
  }, []);


  return (
    <div>
      <div className="calendario" ref={calendarRef} id="calendar"></div>

      <ModalSolicitud
        modalAbierto={modalAbierto}
        setModalAbierto={setModalAbierto}
        fechaSeleccionada={fechaSeleccionada}
        events={events}
      />

    </div>
  );
};

export default Calendario;