"use client";

import { useState } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import 'dayjs/locale/es';

// Componente modal (pop up) que despliega la interfaz de solicitar
// una reserva del estudio

const textStyle = { m: 1, width:'40ch', '& .MuiOutlinedInput-root': { borderRadius: '20px' }}
const timeStyle = {m:1, width:'25ch', '& .MuiOutlinedInput-root': { borderRadius: '20px' }}

const HacerSolicitud = ({
    solicitudAbierto,
    setSolicitudAbierto,
}) => {

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
            <header>
                <h1 className="headerApplication">
                    Por favor, ingrese los siguientes datos para completar su solicitud:
                </h1>
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
                    />
                </ListItem>

                <Divider textAlign="left" component="li" className="divider-style">
                    Escoger horario
                </Divider>

                <ListItem>
                    <div >
                        <p>Ingrese la hora de inicio</p>
                        <TimePicker sx={timeStyle} 
                                    className="timePicker" 
                                    label="Ingrese horario de inicio"/>
                    </div>
                </ListItem>
                <ListItem>
                    <div>
                        <p>Ingrese la hora de fin...</p>
                        <TimePicker sx={timeStyle} 
                                    className="timePicker" 
                                    label="Ingrese horario de fin"/>
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
                        />
                    </div>
                </ListItem>
            </List>
            </LocalizationProvider>

            <footer>
                <button onClick={handleClose} className="send">
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