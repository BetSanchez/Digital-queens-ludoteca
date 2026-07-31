# Logo de la Ludoteca Digital

Esta carpeta contiene la identidad visual del sitio.

| Archivo | Uso |
|---|---|
| `logo.svg` | Logo principal, mostrado en la barra de navegación y en el pie de página. |
| `favicon.svg` | Ícono de la pestaña del navegador (referenciado en `index.html`). |

## Cómo reemplazar el logo

1. Sustituye `logo.svg` por tu archivo, **conservando el mismo nombre**.
   También puedes usar PNG o JPG; en ese caso actualiza la ruta en
   `src/components/Logo.jsx` (constante `LOGO_SRC`).
2. Se recomienda un archivo cuadrado (1:1) de al menos 256 × 256 px,
   con fondo transparente.
3. Para el favicon, reemplaza `favicon.svg` con el mismo criterio.

No es necesario reconstruir la aplicación en desarrollo: Vite sirve esta
carpeta como contenido estático y basta con recargar el navegador.
