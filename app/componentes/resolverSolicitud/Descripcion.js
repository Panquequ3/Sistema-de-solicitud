"use client";

import { useState } from 'react';

// Componente modal (pop up) que despliega la descripcion de la
// solicitud 

const Descripcion = ({
    modalAbierto,
    setModalAbierto,
    contenido
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
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div style={{ maxHeight: "700px", maxWidth:"550px" }} className="modal-content">
            <div style={{ textAlign: 'left', marginBottom: '10px' }}>
             Descripción
            </div>
            <div>
              <div style={{ background:"white", padding:"10px", 
                            borderRadius: "10px", textAlign: 'left' }}>
                {contenido}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={handleClose} className="close-button">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Descripcion;