import ListarSolicitud from "../componentes/resolverSolicitud/ListarSolicitud";

export default function Home() {
  return (
    <main>
      <h3 className="page-title"> Solicitudes </h3>
      <div className='application-table'>
        <ListarSolicitud />
      </div>
    </main>
  );
}
