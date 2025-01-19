"use client";

import { useState } from 'react';

// Componente modal (pop up) que despliega la lista de solicitudes
// y un boton que dirigue a la posibilidad de hacer una solicitud

const Descripcion = ({
    modalAbierto,
    setModalAbierto,
    descripcion
}) => {


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



  return (
    <div>
      {modalAbierto && (
        <div className="descrip-overlay" onClick={handleOverlayClick}>
          <div className="descrip-content">
            <p>{descripcion}</p>
            <button onClick={handleClose} className="close-button">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Descripcion;