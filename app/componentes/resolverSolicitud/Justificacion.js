"use client";

import { useState } from 'react';

// Componente que despliega un modal (pop up) 
// para ingresar el justificativo al denegar una solicitud

const Justificacion = ({
    modalAbierto,
    setModalAbierto,
}) => {

  const [justificacion, setJustificacion] = useState('');
  const [error, setError] = useState(false);
    // Función simulada para enviar la solicitud (TEMPORAL)
    const sendRequest = async () => {
        // Simula el envío de la solicitud sin hacer nada
        alert("Solicitud denegada");
    };
    
    // Función para manejar el envío del formulario (TEMPORAL)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (justificacion === '') {
            alert('La justificación no puede estar vacía');
            setError(true);
            return;
          }
        setModalAbierto(false);
        await sendRequest(); // Llama a la función simulada
    };

  const handleChange = (ev) => {
    setJustificacion(ev.target.value);
  };

  return (
    <div>
      {modalAbierto && (
        <div className="modal-overlay" >
          <div className="modal-content">
            <div style={{ textAlign: 'left', marginBottom: '10px', fontWeight: 'bold', fontSize: '20px' }}>
             Justificación:
            </div>
            <div>
              <textarea
                value={justificacion}
                onChange={handleChange}
                style={{
                    borderColor: error ? 'red' : 'gray', // Cambia el color del borde si hay error
                }}
                className="text-area"
                placeholder="Inserte la justificación"
              />
              {error && 
                <div style={{ textAlign: 'center', color: 'red' }}>
                La justificación no puede estar vacía
                </div>}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={handleSubmit} className="close-button">
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Justificacion;