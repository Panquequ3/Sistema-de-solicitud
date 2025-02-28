import "@/app/globals.css";
import { useState } from "react";
import Justificacion from "./Justificacion";

import Confirmacion from "../Confirmacion";
import Notificacion from "./Notificacion";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';


// Componente: Botón que permite denegar una solicitud pendiente

const Denegar = ({ id_solicitud, destinatario }) => { 
    const [enviarNotificacion, setEnviarNotificacion] = useState(false);
    const [modalAbierto, setModalAbierto] = useState(false); // Para abrir el pop up de la justificacion
    const [exito, setExito] = useState(false); // ALmacena si se realizó con éxito el aceptar la solicitud
    const [justificacion, setJustificacion] = useState('');
    const [error, setError] = useState(false);


    const motivo = `Hola ${destinatario.nombre}, Su solicitud fue DENEGADA: `;
    const pie = `Mensaje generado automáticamente por el sistema, no responder.`;
    const contacto = `Cualquier duda, contactar con: admin@test.cl`;
  

    const handleClose = () => {
        setModalAbierto(false);
      };

    // Funcion que setea el valor en la justificacion
    const handleChange = (ev) => {
        setJustificacion(ev.target.value);
    };


    // Se crea el estado denegado para asignarlo a la solicitud
    const crearEstado = async () => {
        try {
            const response = await fetch(`http://localhost:8000/estado/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    estado: "denegado"
                }),
            });

            if (!response.ok) {
                throw new Error("Fallo al crear el estado");
            }

            const data = await response.json();
            return data.id_estado;
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    };

    // Se actualiza su estado a denegado en la DB
    const actualizaSolicitud = async () => {

        const id_estado = await crearEstado();
        if (!id_estado){
            alert("hubo un error! no se encontró el id");
            return;
        }
        
        try {
            const response = await fetch(`http://localhost:8000/solicitudes/${id_solicitud}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id_estado: id_estado
                }),
            });

            if (!response.ok) {
                throw new Error("Fallo al actualizar el estado de la solicitud");
            }

            const data = await response.json();
            return data.id_estado;

        } catch (error) {
            console.error("Error:", error);
            return null;
        }

    }

  // Función que llama a la API para crear la justificación en la DB
  const enviaJustificacion = async () => {

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


        setEnviarNotificacion(true); // Notificamos por correo
        setModalAbierto(false);
        setExito(true);

        

    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

const handleSubmit = async (e) => {
    e.preventDefault();
    if (justificacion === '') {
        setError(true);
        return;
      }
    actualizaSolicitud();
    enviaJustificacion(); 
};
    return (
        <div>
            <button className='deny-button' onClick={(e) => setModalAbierto(true)} >
            Denegar
            </button> 
            {enviarNotificacion && 
            <Notificacion destinatario={destinatario.email} 
            cuerpo={`${motivo} <br><br> ${justificacion} <br><br> ${contacto} <br><br>${pie}`} />}

            {/* {modalAbierto && 
            <Justificacion
            abrirDialogo={modalAbierto}
            setAbrirDialogo={setModalAbierto}
            id_solicitud={id_solicitud}
            destinatario={destinatario}
            />} */}

            <Dialog
            open={modalAbierto}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            slotProps={{ backdrop: { style: { backgroundColor: "#17264A80" } } }}
            >
                <DialogTitle id="alert-dialog-title">
                {"Justificación"}
                </DialogTitle>
                <DialogContent>
                    <p style={{ textAlign: 'left', fontSize: '16px'}}>¿Desea denegar la solicitud de {destinatario.nombre}?</p>
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
                </DialogContent>
                <DialogActions>
                    <button className='accept-button' onClick={handleSubmit}>Aceptar</button>
                    <button className='deny-button' onClick={handleClose}>Cancelar</button>
                </DialogActions>
            </Dialog>

            <Confirmacion 
            contenido={`Solicitud denegada con éxito`}
            abierto={exito}
            setAbierto={setExito}
            // actualizar={actualizar}
             />
        </div>
      );

};

export default Denegar;