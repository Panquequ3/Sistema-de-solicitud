import Calendario from './componentes/Calendario';

export default function Home() {
  return (
    <main>
      <div className='titulo'> ¡Bienvenido!</div>
      <div className='calendario'>
        <Calendario />
      </div>
    </main>
  );
}
