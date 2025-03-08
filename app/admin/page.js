"use client"
import { useEffect, useContext } from "react";
import ListarSolicitud from "../componentes/resolverSolicitud/ListarSolicitud";
import { SolicitudesContext } from "@/app/context/SolicitudesContext";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();
  const { admin } = useContext(SolicitudesContext);
  
  useEffect(() => {
    if (!admin) {
      router.push("/autenticacion");
    }
  }, [admin, router]);

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
