# Logo de la Ludoteca Digital

Esta carpeta contiene la identidad visual del sitio.

| Archivo | Uso |
|---|---|
| `logo.svg` | Logo principal, mostrado en la barra de navegación y en el pie de página. |
| `favicon.svg` | Ícono de la pestaña del navegador (referenciado en `index.html`). |
| `logoDC.jpeg` | Logo del equipo Digital Queens: portada, hero de la Home y créditos del pie. |
| `mujer-digital.png` | Logo del programa Mujer Digital en turquesa, para fondos claros (barra de navegación). |
| `mujer-digital-blanco.png` | Misma marca en blanco, para los fondos morados (portada, hero y pie). |

Ambos archivos `mujer-digital*` se derivaron del original del programa, que venía
sobre un rectángulo negro sólido: se les quitó el fondo y se recortaron los márgenes
para poder colocarlos sobre cualquier color.

## Cómo reemplazar el logo

1. Sustituye `logo.svg` por tu archivo, **conservando el mismo nombre**.
   También puedes usar PNG o JPG; en ese caso actualiza la ruta en
   `src/components/Logo.jsx` (constante `LOGO_SRC`).
2. Se recomienda un archivo cuadrado (1:1) de al menos 256 × 256 px,
   con fondo transparente.
3. Para el favicon, reemplaza `favicon.svg` con el mismo criterio.

No es necesario reconstruir la aplicación en desarrollo: Vite sirve esta
carpeta como contenido estático y basta con recargar el navegador.
