import "@/app/globals.css";
import { useState } from "react";

// Componente: Botón que permite denegar una solicitud pendiente

const Denegar= () => { 


    // Función simulada para enviar la solicitud (TEMPORAL)
    const sendRequest = async () => {
        // Simula el envío de la solicitud sin hacer nada
        alert("Solicitud denegada");
    };
    

    // Función para manejar el envío del formulario (TEMPORAL)
    const handleSubmit = async (e) => {
        e.preventDefault();
        await sendRequest(); // Llama a la función simulada
    };

    return (
        <button className='deny-button' onClick={handleSubmit} >
        Denegar
        </button> 
      );

};

export default Denegar;