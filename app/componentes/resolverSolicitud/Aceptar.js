import "@/app/globals.css";
import { useState } from 'react';
import Notificacion from "./Notificacion";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Confirmacion from "../Confirmacion";

// Componente: Botón que permite aceptar una solicitud pendiente

const Aceptar = ({ id_solicitud, destinatario }) => { 
    const motivo = `Hola ${destinatario.nombre}, Su solicitud fue ACEPTADA`;
    const pie = `Mensaje generado automáticamente por el sistema, no responder.`;
    const contacto = `Cualquier duda, contactar con: admin@test.cl`;

    const [enviarNotificacion, setEnviarNotificacion] = useState(false);
    const [abrirDialogo, setAbrirDialogo] = useState(false);
    const [exito, setExito] = useState(false); // ALmacena si se realizó con éxito el aceptar la solicitud

    const handleClose = () => {
      setAbrirDialogo(false);
    };

    const crearEstado = async () => {
        try {
            const response = await fetch(`http://localhost:8000/estado/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    estado: "aceptado"
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

    const actualizaSolicitud = async (e) => {

        e.preventDefault();

        const id_estado = await crearEstado();
        if (!id_estado){
            alert("hubo un error! no se encontró el id");
            return;
        }
        console.log(id_solicitud);
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


            // actualizar(); // Actualizamos la lista de solicitudes

            setEnviarNotificacion(true); // Notificamos por correo
            setAbrirDialogo(false);
            setExito(true); // Se realizó con exito la acción

            return data.id_estado;

        } catch (error) {
            console.error("Error:", error);
            return null;
        }

    }

    return (
        <>
            <button className='accept-button' onClick={(e) => setAbrirDialogo(true)} >
            Aceptar
            </button> 
            {enviarNotificacion && 
            <Notificacion destinatario={destinatario.email} 
            cuerpo={`${motivo} <br><br>  ${contacto} <br><br>${pie}`} />}

            <Dialog
            open={abrirDialogo}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            slotProps={{ backdrop: { style: { backgroundColor: "#17264A80" } } }}
            >
                <DialogTitle id="alert-dialog-title">
                {"Aceptar solicitud"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        ¿Desea aceptar la solicitud de {destinatario.nombre}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <button className='accept-button' onClick={actualizaSolicitud}>Aceptar</button>
                    <button className='deny-button' onClick={handleClose}>Cancelar</button>
                </DialogActions>
            </Dialog>
            <Confirmacion 
            contenido={`Se aceptó con éxito la solicitud de ${destinatario.nombre}`}
            abierto={exito}
            setAbierto={setExito}
            // actualizar={actualizar}
             />
        </>
      );

};

export default Aceptar;