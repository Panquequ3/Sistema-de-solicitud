import "@/app/globals.css";
import { useState } from "react";
import Justificacion from "./Justificacion";
// Componente: Botón que permite denegar una solicitud pendiente

const Denegar = () => { 
    const [modalAbierto, setModalAbierto] = useState(false);
    
    const handleModal= async (e) => {
        e.preventDefault();
        setModalAbierto(true);
    };


    return (
        <div>
            <button className='deny-button' onClick={handleModal} >
            Denegar
            </button> 
            {modalAbierto && 
            <Justificacion
            modalAbierto={modalAbierto}
            setModalAbierto={setModalAbierto}
            />}
        </div>
      );

};

export default Denegar;