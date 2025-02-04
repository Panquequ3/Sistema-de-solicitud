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
import { useState } from 'react';
import '../globals.css';

const InicioSesion = () => {
    const router = useRouter();
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

    const sendRequest = async () => {

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
                alert("ERROR!");
                
                  setInicioError({
                      error: true,
                      msj: "Los datos ingresados son incorrectos.",
                  })

                throw new Error("Fallo al iniciar sesion");   
            }

            const data = await response.json();
            router.push("/admin"); 
            console.log("Ingreso exitoso");
            alert("Ingreso exitoso!!!!");
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