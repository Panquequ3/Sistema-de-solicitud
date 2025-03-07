import "@/app/globals.css";
import { useState, useContext } from 'react';
import Notificacion from "./Notificacion";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Confirmacion from "../Confirmacion";
import { SolicitudesContext } from "@/app/context/SolicitudesContext";


// Componente: Botón que permite aceptar una solicitud pendiente

const Aceptar = ({ id_solicitud, destinatario, estado }) => { 
    const motivo = `Hola ${destinatario.nombre}, Su solicitud fue ACEPTADA`;
    const pie = `Mensaje generado automáticamente por el sistema, no responder.`;
    const contacto = `Cualquier duda, contactar con: admin@test.cl`;
    const [cuerpo, setCuerpo] = useState('');

    const [condicion, setCondicion] = useState('');
    const [codigo, setCodigo] = useState('');
    const [error, setError] = useState(false);
    const [enviarNotificacion, setEnviarNotificacion] = useState(false);
    const [abrirDialogo, setAbrirDialogo] = useState(false);
    const [exito, setExito] = useState(false); // ALmacena si se realizó con éxito el aceptar la solicitud
    const { accionEnProgreso } = useContext(SolicitudesContext);

    const shortid = require('shortid');


    const handleClose = () => {
        setAbrirDialogo(false);
        accionEnProgreso.current = false;
    };

    const handleOpenDialog = () => {
        setAbrirDialogo(true);
        accionEnProgreso.current = true;
    }

    const crearEstado = async () => {
        try {
            const response = await fetch(`http://localhost:8000/estado/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    estado: (estado === "pendiente") ? ("en revision") : ("aceptado")
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

    const enviaCondicion = async () => {
        const codigo = shortid.generate();

        try {
            const response = await fetch(`http://localhost:8000/condicion/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id_solicitud: id_solicitud,
                    contenido: condicion,
                    codigo: codigo
                }),
            });
    
            if (!response.ok) {
                throw new Error("Fallo al guardar la condicion");
            }
    
            const data = await response.json();
            console.log("Condicion guardada:", data); // Log de depuración
            setCuerpo(`Confirme su solicitud en el sistema con el siguiente codigo: ${codigo}`);

    
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    }

    const actualizaSolicitud = async (e) => {
        e.preventDefault();
        if (condicion === '') {
            setError(true);
            return;
        }
        const id_estado = await crearEstado();
        if (!id_estado){
            alert("hubo un error! no se encontró el id");
            accionEnProgreso.current = false;
            return;
        }
        enviaCondicion();

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
            <button className='accept-button' onClick={handleOpenDialog} >
            Aceptar
            </button> 
            {enviarNotificacion && 
            <Notificacion destinatario={destinatario.email} 
            cuerpo={`${motivo} ${(condicion !== '') ? ("<br><br> Condición: <br><br> " + condicion + "<br><br>" + cuerpo) : ('')} 
            <br><br> ${contacto} <br><br> ${pie}`} />}

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
                        {(estado === "pendiente") && (
                            <div>
                            <textarea
                                value={condicion}
                                onChange={(e) => setCondicion(e.target.value)}
                                style={{
                                    borderColor: error ? 'red' : 'gray', // Cambia el color del borde si hay error
                                }}
                                className="text-area"
                                placeholder="Inserte la condición"
                            />
                            </div>
                        )}
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
             />
        </>
      );

};

export default Aceptar;