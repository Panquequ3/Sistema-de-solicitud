"use client";

import { useState } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import 'dayjs/locale/es';

// Componente modal (pop up) que despliega la interfaz de solicitar
// una reserva del estudio

const textStyle = { m: 1, width:'40ch', '& .MuiOutlinedInput-root': { borderRadius: '20px' }}
const timeStyle = {m: 1, width:'25ch', '& .MuiOutlinedInput-root': { borderRadius: '20px' }}

const HacerSolicitud = ({
    solicitudAbierto,
    setSolicitudAbierto,
}) => {
    const [nombre, setNombre] = useState('')
    const [apellido, setApellido] = useState('')
    const [email, setEmail] = useState('')
    const [fecha, setFecha] = useState(null)
    const [horaInicio, setHoraInicio] = useState(null)
    const [horaFin, setHoraFin] = useState(null)

    /* funcion para crear el estado*/
    const crearEstado = async () => {
        try {
            const response = await fetch(`http://localhost:8000/estado/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    estado: "pendiente"
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

    const crearEstudiante = async () => {
        try {
            const response = await fetch(`http://localhost:8000/estudiantes/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre: nombre,
                    apellido: apellido,
                    email: email
                }),
            });

            if (!response.ok) {
                throw new Error("Fallo al crear estudiante");
            }

            const data = await response.json();
            return data.id_estudiante;
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    };

    const sendRequest = async () => {
        try {
            const idEstudiante = await crearEstudiante();
            const idEstado = await crearEstado();
            if (!idEstudiante) {
                throw new Error("No se pudo obtener el ID del estudiante");
            }

            const response = await fetch(`http://localhost:8000/solicitudes/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id_estado: idEstado,
                    hora_inicio: horaInicio ? horaInicio.format('HH:mm') : null,
                    hora_fin: horaFin ? horaFin.format('HH:mm') : null,
                    fecha: fecha ? fecha.format('YYYY-MM-DD') : null,
                    id_estudiante: idEstudiante
                }),
            });

            if (!response.ok) {
                throw new Error("Fallo al enviar solicitud");
            }

            const data = await response.json();
            console.log("Solicitud creada:", data);
        } catch (error) {
            console.error("Error:", error);
        }
        setSolicitudAbierto(false);
    };


    const [value, setValue] = useState(null);
    // Función que maneja que el modal se cierre
    const handleClose = () => {
        setSolicitudAbierto(false);
    };

    // Función que maneja que al hacer click fuera del modal, este se cierre
    const handleOverlayClick = (ev) => {
        if (ev.target === ev.currentTarget) {
        handleClose();
        }
    };

  return (
    <div>
      {solicitudAbierto && (
        <div className="application-overlay" onClick={handleOverlayClick}>
          <div className="application-content">
            <header className="modal-header">
                <h1 className="headerApplication">
                    Por favor, ingrese los siguientes datos para completar su solicitud:
                </h1>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                    color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </header>

            <LocalizationProvider adapterLocale="es" dateAdapter={AdapterDayjs}>
            <List sx={{py: 0, width: '100%'}}>

                <Divider textAlign="left" component="li" className="divider-style">
                    Seleccione fecha y hora de la reserva
                </Divider>

                <ListItem>
                    <DatePicker className="datePicker" 
                                label="Ingrese la fecha" 
                                sx={{m:1, '& .MuiOutlinedInput-root': { borderRadius: '20px' }}}
                                value={fecha}
                                onChange={(newValue) => setFecha(newValue)}
                    />
                </ListItem>

                <Divider textAlign="left" component="li" className="divider-style">
                    Escoger horario
                </Divider>

                <ListItem>
                    <div className="timeInput">
                        <div>
                            <p>Ingrese la hora de inicio</p>
                            <TimePicker sx={timeStyle} 
                                        className="timePicker" 
                                        label="Ingrese horario de inicio"
                                        value={horaInicio}
                                        onChange={(newValue) => setHoraInicio(newValue)}/>     
                        </div>
                        <div>
                            <p>Ingrese la hora de fin</p>
                            <TimePicker sx={timeStyle} 
                                        className="timePicker" 
                                        label="Ingrese horario de fin"
                                        value={horaFin}
                                        onChange={(newValue) => setHoraFin(newValue)}/>
                        </div>
                    </div>
                </ListItem>

                <Divider textAlign="left" component="li" className="divider-style">
                    Ingrese sus datos
                </Divider>

                <ListItem>
                    <div>
                        <p>Nombre *</p>
                        <TextField 
                            required sx={textStyle} 
                            id="name" 
                            label="Ingrese su nombre" 
                            variant="outlined" 
                            className="textField"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>
                </ListItem>
                <ListItem>
                    <div>
                    <p>Apellido *</p>
                        <TextField 
                            required 
                            sx={textStyle} 
                            id="lastname" 
                            label="Ingrese su apellido" 
                            variant="outlined" 
                            className="textField"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                        />
                    </div>
                </ListItem>
                <ListItem>
                    <div>
                        <p>Email *</p>
                        <TextField 
                            required 
                            sx={textStyle} 
                            id="password" 
                            label="Ingrese su email" 
                            variant="outlined" 
                            className="textField"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </ListItem>
            </List>
            </LocalizationProvider>

            <footer>
                <button onClick={sendRequest} className="send">
                Enviar solicitud
                </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};


export default HacerSolicitud;