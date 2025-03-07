"use client"
import { useContext } from "react";
import ListarSolicitud from "../componentes/resolverSolicitud/ListarSolicitud";
import { SolicitudesContext } from "@/app/context/SolicitudesContext";

export default function SignIn() {
  const { admin } = useContext(SolicitudesContext);
  
  if (!admin) {
    return null;
  }
  return (
    <main className="list-page">
      <h3 className="page-title"> Solicitudes </h3>
      <div className='application-table'>
        <ListarSolicitud />
      </div>
    </main>
  );
}
