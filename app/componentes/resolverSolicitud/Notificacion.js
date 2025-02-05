import { useEffect, useState } from 'react';

const Notificacion = ({ destinatario, cuerpo }) => { 
    const [enviado, setEnviado] = useState(false);

    const envia = async () => {
        if (enviado) return; 
        
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
            setEnviado(true); // Marcar como enviado
        } catch (error) {
            console.error("Error enviando el correo:", error);
        }
    }

    useEffect(() => {
        envia();
    }, []);

    return null; // No retorna nada visualmente
};

export default Notificacion;