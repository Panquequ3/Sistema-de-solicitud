import ListarSolicitud from "../componentes/resolverSolicitud/ListarSolicitud";

export default function Home() {
  return (
    <main style={{ backgroundColor:"#f1f9ff" }} >
      <div className='titulo'> ¡Bienvenido!</div>
      <div className='application-table'>
        <ListarSolicitud />
      </div>
    </main>
  );
}
