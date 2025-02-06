import "@/app/globals.css";
import { useState } from "react";
import Justificacion from "./Justificacion";

// Componente: Botón que permite denegar una solicitud pendiente

const Denegar = ({ id_solicitud, actualizar, destinatario }) => { 
    const [modalAbierto, setModalAbierto] = useState(false);
    

    const crearEstado = async () => {
        try {
            const response = await fetch(`http://localhost:8000/estado/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    estado: "denegado"
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

    const actualizaSolicitud = async (e) => {
        e.preventDefault();
        setModalAbierto(true);

        const id_estado = await crearEstado();
        if (!id_estado){
            alert("hubo un error! no se encontró el id");
            return;
        }
        console.log(id_solicitud);
        try {
            const response = await fetch(`http://localhost:8000/solicitudes/${id_solicitud}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id_estado: id_estado
                }),
            });

            if (!response.ok) {
                throw new Error("Fallo al actualizar el estado de la solicitud");
            }

            const data = await response.json();

            return data.id_estado;

        } catch (error) {
            console.error("Error:", error);
            return null;
        }

    }

    return (
        <div>
            <button className='deny-button' onClick={actualizaSolicitud} >
            Denegar
            </button> 
            {modalAbierto && 
            <Justificacion
            modalAbierto={modalAbierto}
            setModalAbierto={setModalAbierto}
            id_solicitud={id_solicitud}
            actualizar = {actualizar}
            destinatario={destinatario}
            />}
        </div>
      );

};

export default Denegar;