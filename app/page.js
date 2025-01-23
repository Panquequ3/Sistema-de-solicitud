import Calendario from './componentes/Calendario';

export default function Home() {
  return (
    <main>
      <div className='header'>
        <img src="/assets/acustica.png" alt="Acustica" className='icon' />
        <h3>Calendario</h3>
      </div>
      <div className='calendario'>
        <Calendario />
      </div>
    </main>
  );
}
