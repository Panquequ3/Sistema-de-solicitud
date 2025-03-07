"use client";

import { useState, useContext } from 'react';
import HacerSolicitud from "./HacerSolicitud";
import ConfirmarSolicitud from "./ConfirmarSolicitud";
import { SolicitudesContext } from "@/app/context/SolicitudesContext";

// Componente modal (pop up) que despliega la lista de solicitudes
// y un boton que dirigue a la posibilidad de hacer una solicitud

const ModalSolicitud = ({
    modalAbierto,
    setModalAbierto,
    fechaSeleccionada,
    events
}) => {
  const [resolverAbierto, setResolverAbierto] = useState(false);
  const [condicion, setCondicion] = useState({contenido: '', codigo: ''});
  const [solicitudAbierto, setSolicitudAbierto] = useState(false);
  const { accionEnProgreso } = useContext(SolicitudesContext);
  const [idSolicitud, setIdSolicitud] = useState('');
  // Si hay eventos, los filtramos
  const eventos = events.length > 0 ? 
                  events.filter(event => event.start === fechaSeleccionada) :
                  {}

  // Función que maneja que el modal se cierre
  const handleClose = () => {
    setModalAbierto(false);
    accionEnProgreso.current = false;
  };

  const obtenerCondicion = async (id_solicitud) => {
    try {
      const response = await fetch(`http://localhost:8000/condicion/${id_solicitud}`);
      if (!response.ok) {
        throw new Error('Fallo al obtener la condicion de la solicitud');
      }
      const data = await response.json();
      console.log(data); // Verifica la estructura de los datos

      setCondicion({contenido: data.contenido, codigo: data.codigo});

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleClick = (id_solicitud) => {
    console.log("resolviendo");
    setResolverAbierto(true);
    setIdSolicitud(id_solicitud);
    accionEnProgreso.current = true;
    obtenerCondicion(id_solicitud);
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
    accionEnProgreso.current = true;
  };


  return (
    <div>
      {modalAbierto && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-content">
            <div className="modal-header" style={{ position: "sticky", top: "0", backgroundColor: "#F6F8F7"}}>
              <h2 className="header-title">¿Desea hacer una solicitud? </h2>
              <button className="application-button" onClick={handleApplication} > 
                Hacer una solicitud 
              </button>
            </div>
            <h4 className="subtitle">Reservas del estudio para el día {fechaSeleccionada}</h4>
            <div className="application-list">
                <ul>
                  {/* Verifica que existan eventos, de existir entonces renderiza el componente */}
                  { eventos.length > 0 ? (
                  eventos.map((event, index) => (
                    <div style={{ backgroundColor: event.color}} className="application" key={index}> 
                      <p className='application-text'>{event.title} - Sala {event.sala}</p>
                      {event.status === "en revision" && 
                        <span style={{ color: 'blue', cursor: 'pointer', marginTop: "14px"}} onClick={() => handleClick(event.id_solicitud)}>
                        resolver
                        </span>
                      }
                      <p className='application-text'>{event.time}</p>
                    </div>
                  )) 
                ) : (
                  <li>No hay reservas para esta fecha.</li>
                )}
                </ul>
              </div>
              <button onClick={handleClose} className="close-button">
                Cerrar
              </button>
          </div>
        </div>
      )}

      <ConfirmarSolicitud 
        condicion={condicion.contenido}
        codigo={condicion.codigo}
        resolverAbierto={resolverAbierto}
        setResolverAbierto={setResolverAbierto}
        id_solicitud={idSolicitud}
      />
      {solicitudAbierto && (
        <HacerSolicitud
          solicitudAbierto={solicitudAbierto}
          setSolicitudAbierto={setSolicitudAbierto}
        />
      )}
    </div>
  );
};

export default ModalSolicitud;