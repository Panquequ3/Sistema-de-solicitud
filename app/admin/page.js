"use client"
import { useEffect, useContext } from "react";
import ListarSolicitud from "../componentes/resolverSolicitud/ListarSolicitud";
import { SolicitudesContext } from "@/app/context/SolicitudesContext";
import { useRouter } from "next/navigation";

// Page de administrador, renderiza componentes que solo el puede ver

export default function SignIn() {
  const router = useRouter();
  const { admin } = useContext(SolicitudesContext);
  
  useEffect(() => {
    // Si no se ha iniciado como administrador entonces se redirige a la página para iniciar sesión
    if (!admin) {
      router.push("/autenticacion");
    }
  }, [admin, router]);

  // Si no se ha iniciado como administrador entonces no se renderiza nada
  if (!admin) { 
    null;
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
