import { useEffect, useState } from 'react';
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import { FormHelperText } from '@mui/material';
import 'dayjs/locale/es';

const Buscador = ({setEventos}) => {
  const [filtro, setFiltro] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [cambio, setCambio] = useState(false) // Para cambiar el buscador por otro componente para fecha
  const [fechaIni, setFechaIni] = useState(null)
  const [fechaFin, setFechaFin] = useState(null)
  const [fechaError, setFechaError] = useState({
      error: false,
      msj: "",
  })

  const ordenar = (lista) => {
    const listaOrdenada = lista
      .map((solicitud) => {
        return {
          title: solicitud.nombre_estudiante,
          email: solicitud.email,
          start: solicitud.fecha,
          desc: solicitud.descripcion,
          startTime: solicitud.hora_inicio.slice(0,5), // Obtenemos el string que nos interesa
          endTime: solicitud.hora_fin.slice(0,5), // o sea, solo el HH:MM
          id_solicitud: solicitud.id_solicitud,
          status: solicitud.estado,
        }})
      .sort((a, b) => {

      // Si ambos son "pendiente" o ambos son "en revision", ordenamos por id de menor a mayor
        if ((a.status === "pendiente" && b.status === "pendiente") || 
            (a.status === "en revision" && b.status === "en revision")) {
          return a.id_solicitud - b.id_solicitud;
        }

        // Si el segundo elemento (b) ya fue resuelto, y el primero aun no, entonces el primero (a) debe ir antes
        if (b.status !== "pendiente" && b.status !== "en revision" && a.status === "pendiente" || a.status === "en revision") return -1; 
        if (b.status === "pendiente" || b.status === "en revision" && a.status !== "pendiente" && a.status !== "en revision") return 1; 

      
        if (b.status === "pendiente" && a.status === "en revision" ) return -1; 
        if (b.status === "en revision" && a.status === "pendiente" ) return 1; 

        // Si ya fueron resueltos, ordenamos por fecha
        if (b.status !== "pendiente" && b.status !== "en revision" && a.status !== "pendiente" && a.status !== "en revision") {
          const dateA = new Date(a.start);
          const dateB = new Date(b.start);
          return dateB - dateA;
        }

      });
      return listaOrdenada;
  }

  const solicitudPorNombre = async () => {

    try {
      const response = await fetch(`http://localhost:8000/solicitudesPorNombre/${busqueda}`);
      if (!response.ok) {
        throw new Error('Fallo al obtener solicitudes por nombre');
      }
      const data = await response.json();
  
        setEventos(ordenar(data));

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const solicitudPorEmail = async () => {

    try {
      const response = await fetch(`http://localhost:8000/solicitudesPorEmail/${busqueda}`);
      if (!response.ok) {
        throw new Error('Fallo al obtener solicitudes por email');
      }
      const data = await response.json();
  
        setEventos(ordenar(data));

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const solicitudPorFecha = async () => {
    const inicio = fechaIni.format('YYYY-MM-DD');
    const fin = fechaFin.format('YYYY-MM-DD');
    try {
      const response = await fetch(`http://localhost:8000/solicitudesPorFecha/${inicio}/${fin}`);
      if (!response.ok) {
        throw new Error('Fallo al obtener solicitudes por fecha');
      }
      const data = await response.json();
  
        setEventos(ordenar(data));

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const buscarSolicitud = () => {
    if (filtro !== null){

      if (busqueda !== "" && filtro === "nombre"){
        solicitudPorNombre();

      } else if (busqueda !== "" && filtro === "email"){
        solicitudPorEmail();

      } else if (filtro === "fecha" && !validaFecha()) {
          solicitudPorFecha();
      }
    }
  }

  const validaFecha = () => {

    if (!fechaIni || !fechaFin) {
      setFechaError({
          error: true,
          msj: "Ingrese una fecha válida.",
      })
      return true;
    } else if (fechaIni > fechaFin ) {
        setFechaError({
          error: true,
          msj: "La fecha de inicio no puede ser mayor a la de fin.",
      })
      return true;
    } else {
        setFechaError({
            error: false,
            msj: "",
        })   
      return false;
    }
  }

  const cambiaComponente = () => {
    if (filtro === "fecha") {
      setCambio(true);
    } else {
      setCambio(false);
    }
  }
  useEffect(() => {
    cambiaComponente();
  }, [filtro]);

  return (
    <div style={{display: "flex", alignItems: "left"}}>

      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <Select
          displayEmpty
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={filtro}
          label="Buscar por"
          input={<OutlinedInput />}
          onChange={(e) => setFiltro(e.target.value)}
          renderValue={(selected) => {
            if (selected === "") {
              return "Buscar por"; 
            }
            return selected;
          }}
        >
          <MenuItem disabled value="">
            <em>Buscar por: </em>
          </MenuItem>
          <MenuItem value="nombre">Nombre</MenuItem>
          <MenuItem value="email">Email</MenuItem>
          <MenuItem value="fecha">Fecha</MenuItem>
        </Select>
      </FormControl>

      {!cambio && (
      <TextField
        style={{marginTop: "8px"}}
        variant="outlined"
        placeholder="Buscar..."
        size="small"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value.toLowerCase())}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />)}
      {cambio && (
        <LocalizationProvider adapterLocale="es" dateAdapter={AdapterDayjs}>
          <FormControl error={fechaError.error}>
          <div style={{display: "flex", alignItems: "left"}}>
            <DesktopDatePicker 
              placeholder="Inicio" 
              value={fechaIni}
              onChange={(newValue) => setFechaIni(newValue)}
              className="input-date"
            />
            <DesktopDatePicker 
              placeholder="Fin" 
              value={fechaFin}
              onChange={(newValue) => setFechaFin(newValue)}
              className="input-date"
            />
            </div>
            <FormHelperText>{fechaError.msj}</FormHelperText>
          </FormControl>
        </LocalizationProvider>
      )}
      <button style={{height:"40px", marginTop: "8px"}} onClick={buscarSolicitud}>Buscar</button>
    </div>
    );

};

export default Buscador;