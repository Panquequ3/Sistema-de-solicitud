"use client";

// Componente que renderiza los indicadores de colores de los eventos (solicitudes/reservas)
const spanStyle = {  fontWeight: "normal", fontSize: "15px"};
const divStyle = { display: "flex", alignItems: "center", gap: "10px" };

const IndicadorColores = () => {
  return (
    <div className='indicador' style={{marginTop:"40px", marginLeft: "300px"}}>

        <div style={divStyle}>
            <div style={{ width: 20, height: 20, backgroundColor: '#92db56', borderRadius: '5px', marginBottom:"5px" }}></div>
            <span style={spanStyle}>Solicitud aprobada</span>
        </div>

        <div style={divStyle}>
            <div style={{ width: 20, height: 20, backgroundColor: '#6ccaee', borderRadius: '5px' }}></div>
            <span style={spanStyle}>Solicitud pendiente</span>
        </div>
    
    </div>
  );
};

export default IndicadorColores;