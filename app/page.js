import Calendario from './componentes/Calendario';
import IndicadorColores from './componentes/IndicadorColores';

export default function Home() {
  return (
    <main>
      <div className='header'>
        <img src="/assets/acustica.png" alt="Acustica" className='icon' />
        <div>
          <h1>Calendario</h1>
          <h2>¡Bienvenido! Seleccione una fecha para visualizar o solicitar el estudio de grabación.</h2> 
        </div>
        <IndicadorColores/>
      </div>
      <div className='calendario'>
        <Calendario />
      </div>
    </main>
  );
}
