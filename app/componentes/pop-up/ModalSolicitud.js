"use client";

import { useState } from 'react';
import HacerSolicitud from "./HacerSolicitud";


// Componente modal (pop up) que despliega la lista de solicitudes
// y un boton que dirigue a la posibilidad de hacer una solicitud

const ModalSolicitud = ({
    modalAbierto,
    setModalAbierto,
    fechaSeleccionada,
    events,
    actualizar,
}) => {

  const [solicitudAbierto, setSolicitudAbierto] = useState(false);
  // Si hay eventos, los filtramos
  const eventos = events.length > 0 ? 
                  events.filter(event => event.start === fechaSeleccionada) :
                  {}

  // Función que maneja que el modal se cierre
  const handleClose = () => {
    setModalAbierto(false);
  };

  // Función que maneja que al hacer click fuera del modal, este se cierre
  const handleOverlayClick = (ev) => {
    if (ev.target === ev.currentTarget) {
      handleClose();
    }
  };
  const handleApplication = () => {
    setModalAbierto(false);
    setSolicitudAbierto(true);
  };


  return (
    <div>
      {modalAbierto && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="header-title">¿Desea hacer una solicitud? </h2>
              <button className="application-button" onClick={handleApplication} > 
                Hacer una solicitud 
              </button>
            </div>
                <h4 className="subtitle">Reservas del estudio para el día {fechaSeleccionada}</h4>
                <ul>
                  {/* Verifica que existan eventos, de existir entonces renderiza el componente */}
                  { eventos.length > 0 ? (
                  eventos.map((event, index) => (
                    <div className="application" key={index}>{event.title} - {event.time}</div>
                  )) 
                ) : (
                  <li>No hay reservas para esta fecha.</li>
                )}
                </ul>
            <button onClick={handleClose} className="close-button">
              Cerrar
            </button>
          </div>
        </div>
      )}
      {solicitudAbierto && (
        <HacerSolicitud
          solicitudAbierto={solicitudAbierto}
          setSolicitudAbierto={setSolicitudAbierto}
          actualizar={actualizar}
        />
      )}
    </div>
  );
};

export default ModalSolicitud;