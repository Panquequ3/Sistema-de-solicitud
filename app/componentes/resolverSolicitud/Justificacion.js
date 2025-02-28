"use client";

import { useState } from 'react';
import Notificacion from "./Notificacion";

// Componente que despliega un modal (pop up) 
// para ingresar el justificativo al denegar una solicitud

const Justificacion = ({
    modalAbierto,
    setModalAbierto,
    id_solicitud,
    destinatario
}) => {
  const motivo = `Hola ${destinatario.nombre}, Su solicitud fue DENEGADA: `;
  const pie = `Mensaje generado automáticamente por el sistema, no responder.`;
  const contacto = `Cualquier duda, contactar con: admin@test.cl`;

  const [justificacion, setJustificacion] = useState('');
  const [error, setError] = useState(false);
  const [enviarNotificacion, setEnviarNotificacion] = useState(false);
  

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (justificacion === '') {
            alert('La justificación no puede estar vacía');
            setError(true);
            return;
          }
        setModalAbierto(false);
        await enviaJustificacion(); 
    };

  // Funcion que setea el valor en la justificacion
  const handleChange = (ev) => {
    setJustificacion(ev.target.value);
  };

  // Función que llama a la API para crear la justificación en la DB
  const enviaJustificacion = async () => {
    setModalAbierto(true);

    try {
        const response = await fetch(`http://localhost:8000/justificacion/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id_solicitud: id_solicitud,
                contenido: justificacion
            }),
        });

        if (!response.ok) {
            throw new Error("Fallo al guardar la justificacion");
        }

        const data = await response.json();
        console.log("Justificación guardada:", data); // Log de depuración

        // Actualizamos la lista de solicitudes

        setEnviarNotificacion(true); // Notificamos por correo

    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

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
      {enviarNotificacion && 
      <Notificacion destinatario={destinatario.email} 
      cuerpo={`${motivo} <br><br> ${justificacion} <br><br>${contacto}<br><br>${pie}`} />}
    </div>
  );
};

export default Justificacion;