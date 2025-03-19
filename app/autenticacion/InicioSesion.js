"use client"

import {
    Box,
    TextField,
    FormLabel,
    FormControl,
    FormHelperText,
    Card,
    CardActions,
    CardContent,
    Button,
    Typography,
    CardHeader,
    Avatar
  } from '@mui/material';
import { useRouter } from "next/navigation"; 
import { useState, useContext } from 'react';
import '../globals.css';
import { SolicitudesContext } from "@/app/context/SolicitudesContext";

// Componente que renderiza los espacios para ingresar las credenciales para iniciar sesión


const InicioSesion = () => {
    const router = useRouter();
    const { admin, setAdmin } = useContext(SolicitudesContext);
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState({
        error: false,
        msj: "",
    })
    const [contrasena, setContrasena] = useState('')
    const [contrasenaError, setContrasenaError] = useState({
        error: false,
        msj: "",
    })
    const [inicioError, setInicioError] = useState({
      error: false,
      msj: "",
  })

    // Función para validar las credenciales ingresadas en los respectivos campos
    const validarCampos = () => {
        let valido = true;

        if (!email) {
            valido = false;
            setEmailError({
                error: true,
                msj: "Ingrese su correo electrónico",
            })
        } else {
            setEmailError({
                error: false,
                msj: "",
            })
        }
        
        if (!contrasena) {
          valido = false;
          setContrasenaError({
              error: true,
              msj: "Ingrese la contraseña",
          })
        } else {
            setContrasenaError({
                error: false,
                msj: "",
            })
        }

      return valido;
    };

    // Función para comprobar que las credenciales ingresadas son correctas, de serlo se permite ingresar
    // a la interfaz de administrador
    const sendRequest = async () => {

        // Si algun campo no es valido, no se permite el ingreso
        if (!validarCampos()) {
            alert("hubo un error");
            return;
        }
        try {

            const response = await fetch(`http://localhost:8000/login/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    contrasena: contrasena
                }),
            });

            if (!response.ok) {           
                  setInicioError({
                      error: true,
                      msj: "Los datos ingresados son incorrectos.",
                  })

                return;   
            }

            const data = await response.json();
            setAdmin(true);
            router.push("/admin"); // Se redirige a la interfaz de administrador
            console.log("Ingreso exitoso");
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
        }
    };

    return (
        <div className="sign_in_container"> {/* Contenedor para centrar */}

        <Card className="sign_in">
          <CardHeader
            avatar={
                <Avatar src="/assets/acustica.png" 
                alt="Acustica" 
                sx={{ width: "100px", height: "100px" }}
                />
            }
            />
          <Typography gutterBottom sx={{ fontSize: 20 }}>¡Bienvenido!</Typography>
          <CardContent>
            <Box component = "form" sx={{py: 0, width: '100%'}}>
              <FormControl>
                <FormLabel> Email *</FormLabel>
                <TextField 
                    className="signIn-field"
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

              <FormControl>
                <FormLabel> Contraseña *</FormLabel>
                <TextField 
                    className="signIn-field"
                    id="password"
                    type="password"
                    name="password"
                    placeholder="*********"
                    required
                    variant="outlined"
                    error={contrasenaError.error}
                    helperText={contrasenaError.msj}
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                />
              </FormControl>
              {inicioError.error && 
              <Typography gutterBottom sx={{ fontSize: 15, color:"#d32f2f"}}>
                {inicioError.msj}
              </Typography>
              }
              <FormControl>
                <Button className='application-button' onClick={sendRequest}> Ingresar </Button>
              </FormControl>
              
            </Box>
          </CardContent>

        </Card>
      </div>
    );
  }

export default InicioSesion;