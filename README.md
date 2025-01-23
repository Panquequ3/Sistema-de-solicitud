# Sistema-de-solicitud
Sistema de solicitud del Estudio de Grabación UACh 

## ¿Cómo se creó el proyecto?
Para crear el proyecto desde cero se siguieron los siguientes pasos:
```bash
npx create-next-app@latest

√ Would you like to use TypeScript?  No 
√ Would you like to use ESLint?  No 
√ Would you like to use Tailwind CSS?  No 
√ Would you like your code inside a `src/` directory?  No 
√ Would you like to use App Router? (recommended)  Yes
√ Would you like to use Turbopack for `next dev`?  No 
√ Would you like to customize the import alias (`@/*` by default)?  No 
```
## Librerias 
Para el proyecto se utilizaron las siguientes librerias.
* [Full calendar](https://fullcalendar.io)

Para el calendario principal que se muestra en la interfaz de inicio.
```bash 
npm install fullcalendar
npm install fullcalendar @fullcalendar/core @fullcalendar/daygrid
```
* [MUI](https://mui.com/material-ui/getting-started/installation/)
```bash
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
```
* [Date picker de MUI x (versión gratuita)](https://mui.com/x/react-date-pickers/getting-started/)

Para la sección de escoger fecha y hora en hacer solicitud.
```bash
npm install @mui/x-date-pickers
npm install dayjs
```