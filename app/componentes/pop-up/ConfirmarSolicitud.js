"use client";

import { useState, useContext } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { SolicitudesContext } from "@/app/context/SolicitudesContext";

const ConfirmarSolicitud = ({
    condicion,
    codigo,
    resolverAbierto,
    setResolverAbierto,
    id_solicitud

}) => {
  const { obtenerSolicitudes } = useContext(SolicitudesContext);
  const [resolver, setResolver] = useState(false);
  const [intento, setIntento] = useState('');
  const [correcto, setCorrecto] = useState(false);
  const [estado, setEstado] = useState('');
  const [codigoError, setCodigoError] = useState({
    error: false,
    msj: "",
})

const crearEstado = async () => {
    console.log(estado);

    if (estado === '') return null;
    try {
        const response = await fetch(`http://localhost:8000/estado/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                estado: estado
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

const actualizaSolicitud = async () => {

    const id_estado = await crearEstado();
    if (!id_estado){
        alert("hubo un error! no se encontró el id");
        accionEnProgreso.current = false;
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

  const verificar = (eleccion) => {
    setEstado(eleccion);

    if (!intento) {
        setCorrecto(false);
        setCodigoError({
            error: true,
            msj: "Ingrese el código",
        })
    } else if (intento !== codigo) {
        setCorrecto(false);
        setCodigoError({
            error: true,
            msj: "Incorrecto",
        })
    } else {
        setCorrecto(true);
        setResolver(false);
        actualizaSolicitud();
        setCodigoError({
            error: false,
            msj: "",
        })   
    }
  }

  const actualiza = () => {
    setCorrecto(false);
    setResolverAbierto(false);
    obtenerSolicitudes();
  }

  return (
    <div>
        <Dialog
        open={resolverAbierto}
        onClose={() => setResolverAbierto(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        slotProps={{ backdrop: { style: { backgroundColor: "#17264A80" } } }}
        >
            <DialogTitle id="alert-dialog-title">
            {"Aceptar o denegar solicitud"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Condición: {condicion}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <button className='accept-button' onClick={() => setResolver(true)}>Resolver</button>
                <button className='deny-button' onClick={() => setResolverAbierto(false)}>Cancelar</button>
            </DialogActions>
        </Dialog>
      
      
        <Dialog
        open={resolver}
        onClose={() => setResolver(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        slotProps={{ backdrop: { style: { backgroundColor: "#17264A80" } } }}
        >
            <DialogTitle id="alert-dialog-title">
            {"Aceptar o denegar solicitud"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    ¿Desea confirmar la solicitud?
                </DialogContentText>
                <div>
                    <TextField 
                        required 
                        className="input-field"
                        placeholder="Ingrese el código" 
                        variant="outlined" 
                        error={codigoError.error}
                        helperText={codigoError.msj}
                        value={intento}
                        onChange={(e) => setIntento(e.target.value)}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <button className='accept-button' onClick={() => verificar("aceptado")}>Aceptar</button>
                <button className='deny-button' onClick={() => verificar("denegado")}>Denegar</button>
                <button className='deny-button' onClick={() => setResolver(false)}>Cancelar</button>
            </DialogActions>
        </Dialog>
      
        <Dialog
        open={correcto}
        onClose={() => setCorrecto(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        slotProps={{ backdrop: { style: { backgroundColor: "#17264A80" } } }}
        >
            <DialogTitle id="alert-dialog-title">
            {"¡Listo!"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Solicitud confirmada con éxito.
                </DialogContentText>

            </DialogContent>
            <DialogActions>
                <button className='accept-button' onClick={actualiza}>Listo</button>
            </DialogActions>
        </Dialog>
    </div>
  );
};

export default ConfirmarSolicitud;