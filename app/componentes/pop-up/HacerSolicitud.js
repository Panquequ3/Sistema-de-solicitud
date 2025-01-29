"use client";

// Componente modal (pop up) que despliega la interfaz de solicitar
// una reserva del estudio

import { useState } from 'react';

import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { FormLabel } from '@mui/material';
import { FormControl } from '@mui/material';
import { FormHelperText } from '@mui/material';

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import 'dayjs/locale/es';


const HacerSolicitud = ({
    solicitudAbierto,
    setSolicitudAbierto,
    actualizar,
}) => {
    // ESTADOS PARA MANEJAR LA INFO //
    const [nombre, setNombre] = useState('')
    const [apellido, setApellido] = useState('')
    const [email, setEmail] = useState('')
    const [fecha, setFecha] = useState(null)
    const [horaInicio, setHoraInicio] = useState(null)
    const [horaFin, setHoraFin] = useState(null)
    const [descripcion, setDescripcion] = useState('')
    // ESTADOS PARA MANEJAR ERROR //
    const [nombreError, setNombreError] = useState({
        error: false,
        msj: "",
    })
    const [apellidoError, setApellidoError] = useState({
        error: false,
        msj: "",
    })
    const [emailError, setEmailError] = useState({
        error: false,
        msj: "",
    })
    const [fechaError, setFechaError] = useState({
        error: false,
        msj: "",
    })
    const [horaIniError, setHoraIniError] = useState({
        error: false,
        msj: "",
    })
    const [horaFinError, setHoraFinError] = useState({
        error: false,
        msj: "",
    })
    const [descError, setDescError] = useState({
        error: false,
        msj: "",
    })
    
    
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

    /* funcion para crear al estudiante */
    const crearEstudiante = async () => {
        try {
            const response = await fetch(`http://localhost:8000/estudiante/`, {
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

    const validarCampos = () => {
        let valido = true;
        // Expresión regular para validar el email, deberia de aceptar solo emails que contengan
        // uach despues del @, y así aceptar correos desde @alumnos.uach.cl hasta @inf.uach.cl en caso de
        const re = /^[a-zA-Z0-9._]+@[a-zA-Z0-9._]*\uach\.[a-zA-Z]{2,5}$/i;

        if (!nombre) {
            valido = false;
            setNombreError({
                error: true,
                msj: "Ingrese su nombre",
            })
        } else {
            setNombreError({
                error: false,
                msj: "",
            })   
        } 
        
        if (!apellido) {
            valido = false;
            setApellidoError({
                error: true,
                msj: "Ingrese su apellido",
            })
        } else {
            setApellidoError({
                error: false,
                msj: "",
            })   
        }

        if (!email) {
            valido = false;
            setEmailError({
                error: true,
                msj: "Ingrese un email válido",
            })
        } else if(!email.match(re)) {
            valido = false;
            setEmailError({
                error: true,
                msj: "Ingrese un email válido",
            })
        } else {
            setEmailError({
                error: false,
                msj: "",
            })
        }
        
        if (!fecha) {
            valido = false;
            setFechaError({
                error: true,
                msj: "Ingrese una fecha válida",
            })
        } else {
            setFechaError({
                error: false,
                msj: "",
            })   
        }

        if (!horaInicio) {
            valido = false;
            setHoraIniError({
                error: true,
                msj: "Ingrese un horario válido",
            })
        } else {
            setHoraIniError({
                error: false,
                msj: "",
            })   
        }

        if (!horaFin) {
            valido = false;
            setHoraFinError({
                error: true,
                msj: "Ingrese un horario válido",
            })
        } else {
            setHoraFinError({
                error: false,
                msj: "",
            })   
        }

        if (!descripcion) {
            valido = false;
            setDescError({
                error: true,
                msj: "La descripción no puede estar vacía",
            })
        } else {
            setDescError({
                error: false,
                msj: "",
            })   
        }

        return valido;
    };

    const sendRequest = async () => {
        if (!validarCampos()) {
            alert("hubo un error");
            return;
        }

        try {
            const idEstudiante = await crearEstudiante();
            if (!idEstudiante) {
                throw new Error("No se pudo crear y obtener el ID del estudiante");
            }
            const idEstado = await crearEstado();
            if (!idEstado) {
                throw new Error("No se pudo crear y obtener el ID del estado");
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
                    id_estudiante: idEstudiante,
                    descripcion: descripcion
                }),
            });

            if (!response.ok) {
                throw new Error("Fallo al enviar solicitud");
            }

            const data = await response.json();

            actualizar();

            console.log("Solicitud creada:", data);
        } catch (error) {
            console.error("Error:", error);
        }
        setSolicitudAbierto(false);
    };

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
        <div className="modal-overlay" onClick={handleOverlayClick}>
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
            <Box component = "form" sx={{py: 0, width: '100%'}}>

                <Divider textAlign="left" component="li" className="divider-style">
                    Seleccione fecha y hora de la reserva
                </Divider>

                <ListItem>
                    <FormControl error={fechaError.error}>
                        <DatePicker 
                            className="input-field" 
                            placeholder="Ingrese la fecha" 
                            value={fecha}
                            onChange={(newValue) => setFecha(newValue)}
                        />
                        <FormHelperText>{fechaError.msj}</FormHelperText>
                    </FormControl>
                </ListItem>

                <Divider textAlign="left" component="li" className="divider-style">
                    Escoger horario
                </Divider>

                <ListItem>
                    <div className="form-input">
                        <FormControl error={horaIniError.error}>
                            <FormLabel> Ingrese la hora de inicio *</FormLabel>
                            <TimePicker  
                                        className="input-field"
                                        required
                                        value={horaInicio}
                                        onChange={(newValue) => setHoraInicio(newValue)}/>
                            <FormHelperText>{horaIniError.msj}</FormHelperText>
                        </FormControl>
                        <FormControl error={horaFinError.error}>
                            <FormLabel> Ingrese la hora de fin *</FormLabel>
                            <TimePicker 
                                        className="input-field" 
                                        required
                                        value={horaFin}
                                        onChange={(newValue) => setHoraFin(newValue)}/>
                            <FormHelperText>{horaFinError.msj}</FormHelperText>
                        </FormControl>
                    </div>
                </ListItem>

                <Divider textAlign="left" component="li" className="divider-style">
                    Ingrese sus datos
                </Divider>

                <ListItem>

                </ListItem>
                <ListItem>
                    <div className="form-input">
                        <FormControl error={nombreError.error}>
                            <FormLabel>Nombre *</FormLabel>
                            <TextField 
                                required 
                                className="input-field"
                                id="name"
                                type="name"
                                name="name"
                                placeholder="Ingrese su nombre" 
                                variant="outlined" 
                                error={nombreError.error}
                                helperText={nombreError.msj}
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </FormControl>
                        <FormControl error={apellidoError.error}>
                            <FormLabel>Apellido *</FormLabel>
                            <TextField 
                                className="input-field" 
                                id="lastname"
                                type="lastname"
                                name="lastname"
                                placeholder="Ingrese su apellido"
                                required
                                variant="outlined" 
                                error={apellidoError.error}
                                helperText={apellidoError.msj}
                                value={apellido}
                                onChange={(e) => setApellido(e.target.value)}
                            />
                        </FormControl>
                    </div>
                </ListItem>
                <ListItem>
                    <FormControl error={emailError.error}>
                        <FormLabel> Email *</FormLabel>
                        <TextField 
                            className="email-field"
                            id="email"
                            type="email"
                            name="email"
                            placeholder="tu@email.com"
                            required
                            variant="outlined"
                            error={emailError.error}
                            helperText={emailError.msj}
                            value={email}
                            onChange={(e) => setEmail(e.target.value.toLowerCase())}
                        />
                    </FormControl>
                </ListItem>

                <Divider textAlign="left" component="li" className="divider-style">
                    Descripción
                </Divider>

                <ListItem>
                    <FormControl error={descError.error} fullWidth>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            className="text-area"
                            placeholder="Inserte aquí la descripción"
                            style={{ width: "460px", borderColor: descError.error ? '#d32f2f' : 'gray' }}
                        />
                        <FormHelperText>{descError.msj}</FormHelperText>
                    </FormControl>
                </ListItem>
            </Box>
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