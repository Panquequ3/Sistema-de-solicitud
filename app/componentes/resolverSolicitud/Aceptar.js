import "@/app/globals.css";

// Componente: Botón que permite aceptar una solicitud pendiente

const Aceptar = ({ id_solicitud, actualizar }) => { 

    const crearEstado = async () => {
        try {
            const response = await fetch(`http://localhost:8000/estado/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    estado: "aceptado"
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

            actualizar(); // ACtualizamos la lista de solicitudes

            return data.id_estado;

        } catch (error) {
            console.error("Error:", error);
            return null;
        }

    }

    return (
        <button className='accept-button' onClick={actualizaSolicitud} >
        Aceptar
        </button> 
      );

};

export default Aceptar;