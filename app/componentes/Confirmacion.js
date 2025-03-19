import "@/app/globals.css";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useContext } from 'react';

import { SolicitudesContext } from "@/app/context/SolicitudesContext";

// Componente que despliega un dialogo que indica que se realizó con exito una acción

const Confirmacion = ({ contenido, abierto, setAbierto}) => { 
    const { obtenerSolicitudes, accionEnProgreso } = useContext(SolicitudesContext);

    const handleClose =  async () => {
      setAbierto(false);
      accionEnProgreso.current = false; // Ya no estamos realizando una acción
      obtenerSolicitudes(); // Actualizamos la lista de solicitudes
    };

    return (
        <>
            <Dialog
            open={abierto}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            slotProps={{ backdrop: { style: { backgroundColor: "#17264A80" } } }}
            >
                
                <DialogTitle id="alert-dialog-title">
                {"¡Listo!"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description"
                    sx={{ maxWidth: '450px'}}>
                        {contenido}, esperando confirmación del estudiante.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <button className='accept-button' onClick={handleClose}>Cerrar</button>
                </DialogActions>
            </Dialog>
        </>
      );

};

export default Confirmacion;