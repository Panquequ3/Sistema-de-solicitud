import "@/app/globals.css";
import { useState } from "react";

// Componente: Botón que permite aceptar una solicitud pendiente

const Aceptar = () => { 


    // Función simulada para enviar la solicitud (TEMPORAL)
    const sendRequest = async () => {
        // Simula el envío de la solicitud sin hacer nada
        alert("Solicitud aceptada!");
    };
    

    // Función para manejar el envío del formulario (TEMPORAL)
    const handleSubmit = async (e) => {
        e.preventDefault();
        await sendRequest(); // Llama a la función simulada
    };

    return (
        <button className='accept-button' onClick={handleSubmit} >
        Aceptar
        </button> 
      );

};

export default Aceptar;