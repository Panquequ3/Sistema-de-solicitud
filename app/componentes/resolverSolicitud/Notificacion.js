import { useEffect, useState, useRef } from 'react';

const Notificacion = ({ destinatario, cuerpo }) => { 
    const enviandoRef = useRef(false); // UseRef, para no provocar otra renderización 

    const envia = async () => {
        if (enviandoRef.current) return;

        enviandoRef.current = true;
        console.log("Entre a notificar");
        try {
            const response = await fetch('http://localhost:8000/email/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: destinatario, cuerpo }),
            });

            if (!response.ok) {
                throw new Error('Error enviando el correo');
            }

            const data = await response.json();
            console.log("Correo enviado:", data.message);
            
        } catch (error) {
            console.error("Error enviando el correo:", error);
            enviandoRef.current = false; // Reseteamos en caso de error
        }
    }

    useEffect(() => {
        envia();
    }, []);

    return null; // No retorna nada visualmente
};

export default Notificacion;