import "./globals.css";
import { SolicitudesProvider } from './context/SolicitudesContext';

export const metadata = {
  title: "Sistema de solicitud",
  description: "Sistema para solicitar reservar el estudio de grabación",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <body>
          <SolicitudesProvider>
            {children}
          </SolicitudesProvider>
        </body>
    </html>
  );
}