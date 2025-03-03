"use client";

import { createContext, useState, useEffect  } from "react";


export const SolicitudesContext = createContext();


export const SolicitudesProvider = ({ children }) => {
    const [solicitudes, setSolicitudes] = useState([]);


  const obtenerSolicitudes = async () => {

    try {
      const response = await fetch(`http://localhost:8000/solicitudesInfo/`);
      if (!response.ok) {
        throw new Error('Fallo al obtener solicitudes');
      }
      const data = await response.json();
      setSolicitudes(data);

    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  useEffect(() => {
    obtenerSolicitudes();
  }, []);

  return (
    <SolicitudesContext.Provider value={{ solicitudes, obtenerSolicitudes }}>
      {children}
    </SolicitudesContext.Provider>
  );
};