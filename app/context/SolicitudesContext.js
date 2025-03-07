"use client";

import { createContext, useState, useRef } from "react";


export const SolicitudesContext = createContext();


export const SolicitudesProvider = ({ children }) => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [admin, setAdmin] = useState(null);
    const accionEnProgreso = useRef(false);

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

  return (
    <SolicitudesContext.Provider value={{ solicitudes, obtenerSolicitudes, accionEnProgreso, admin, setAdmin }}>
      {children}
    </SolicitudesContext.Provider>
  );
};