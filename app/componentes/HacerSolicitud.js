"use client";

import { useState } from 'react';

// Componente modal (pop up) que despliega la interfaz de solicitar
// una reserva del estudio

const HacerSolicitud = ({
    solicitudAbierto,
    setSolicitudAbierto,
}) => {

    const [value, setValue] = useState(null);
    // Función que maneja que el modal se cierre
    const handleClose = () => {
        setSolicitudAbierto(false);
    };

    // Función que maneja que al hacer click fuera del modal, este se cierre
    const handleOverlayClick = (ev) => {
        if (ev.target === ev.currentTarget) {
        handleClose();
        }
    };

  return (
    <div>
      {solicitudAbierto && (
        <div className="application-overlay" onClick={handleOverlayClick}>
          <div className="application-content">
            <div className="date">
                <h2>Seleccione fecha y hora de la reserva</h2>
            
            </div>
            <div className="time">
                <h2>Ingrese horario</h2>
            </div>
            <div className="information">
                <h2>Ingrese sus datos</h2>
            </div>
            <footer>
                <button onClick={handleClose} className="send">
                Enviar solicitud
                </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default HacerSolicitud;