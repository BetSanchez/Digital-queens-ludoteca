# Ludoteca Digital Colaborativa

Aplicación web para que las participantes de **Mujer Digital** registren, consulten y
compartan recursos de aprendizaje. No requiere inicio de sesión ni servicios externos:
los datos viven en un archivo SQLite local y los archivos en la carpeta `uploads/`.

| Capa | Tecnologías |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Recharts, Fetch API |
| Backend | Node.js, Express, SQLite (better-sqlite3), Multer |

---

## Requisitos

- Node.js 18 o superior (probado con 20.9)
- npm 9 o superior

## Instalación

```bash
npm run install:all
```

O bien, de forma manual:

```bash
cd backend  && npm install
cd ../frontend && npm install
```

## Datos de ejemplo (opcional)

Inserta 12 recursos de muestra para ver la aplicación con contenido:

```bash
npm run seed
# Para reiniciar la base de datos desde cero:
cd backend && npm run seed -- --force
```

## Ejecución en desarrollo

Se necesitan **dos terminales**:

```bash
# Terminal 1 — API en http://localhost:4000
npm run dev:backend

# Terminal 2 — Interfaz en http://localhost:5173
npm run dev:frontend
```

Vite redirige `/api` y `/uploads` al backend, así que no hay que configurar CORS ni
variables de entorno para trabajar en local.

## Ejecución en producción (un solo proceso)

```bash
npm run build   # genera frontend/dist
npm start       # Express sirve la API y la interfaz en http://localhost:4000
```

El servidor detecta `frontend/dist` y lo sirve automáticamente, incluyendo el
enrutado del lado del cliente (recargar `/estadisticas` funciona).

---

## Estructura del proyecto

```text
ludoteca/
├── backend/
│   ├── controllers/          resources.controller.js · statistics.controller.js
│   ├── routes/               index.js · resources.routes.js · statistics.routes.js
│   ├── middleware/           upload.js (Multer) · errorHandler.js · asyncHandler.js
│   ├── utils/                validation.js · files.js · catalogs.js · ApiError.js
│   ├── database/             db.js · seed.js · database.db
│   ├── uploads/
│   │   ├── pdf/
│   │   └── images/
│   ├── server.js
│   └── package.json
└── frontend/
    ├── public/logo/          logo.svg · favicon.svg · README.md
    ├── src/
    │   ├── components/       Navbar, Footer, ResourceCard, ResourceForm, …
    │   │   └── charts/       CategoriasBarChart, TiposPieChart, MesesLineChart, ParticipantesBarChart
    │   ├── pages/            Home, Explore, ResourceDetail, AddResource, EditResource, Statistics, NotFound
    │   ├── services/         api.js (cliente Fetch)
    │   ├── hooks/            useFetch, useDebounce, useOptions
    │   ├── utils/            format.js · charts.js
    │   ├── assets/
    │   ├── App.jsx
    │   └── main.jsx
    ├── tailwind.config.js
    └── vite.config.js
```

---

## API REST

Base: `http://localhost:4000/api`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/resources` | Lista con búsqueda, filtros, orden y paginación |
| GET | `/resources/:id` | Detalle de un recurso |
| POST | `/resources` | Crea un recurso (`multipart/form-data`) |
| PUT | `/resources/:id` | Actualiza un recurso (acepta cambios parciales) |
| DELETE | `/resources/:id` | Elimina el recurso y sus archivos físicos |
| GET | `/statistics` | Cifras y series para el panel de estadísticas |
| GET | `/options` | Catálogos de tipos, categorías e idiomas |
| GET | `/health` | Comprobación de estado |

### Parámetros de `GET /resources`

| Parámetro | Valores | Predeterminado |
|---|---|---|
| `search` | Texto libre; busca en nombre, participante y categoría | — |
| `categoria` | Nombre exacto de la categoría | — |
| `tipo` | Nombre exacto del tipo | — |
| `sort` | `fecha` \| `nombre` | `fecha` |
| `order` | `asc` \| `desc` | `desc` |
| `limit` | 1–100 | 100 |
| `offset` | Entero ≥ 0 | 0 |

Respuesta: `{ "data": [...], "total": 12, "limit": 12, "offset": 0 }`

### Errores

Todos los errores devuelven JSON. Las validaciones incluyen el detalle por campo:

```json
{
  "message": "Revisa los campos marcados.",
  "errors": { "nombre": "El nombre del recurso es obligatorio." }
}
```

### Carga de archivos

- Campo `archivo`: solo PDF → se guarda en `backend/uploads/pdf/`
- Campo `imagen`: JPG, PNG, WEBP o GIF → se guarda en `backend/uploads/images/`
- Tamaño máximo: **10 MB** por archivo
- SQLite guarda únicamente la ruta pública (por ejemplo `/uploads/pdf/guia-123.pdf`)
- Al eliminar o reemplazar un recurso, los archivos anteriores se borran del disco

---

## Base de datos

Una sola tabla, `resources`:

| Campo | Tipo | Notas |
|---|---|---|
| `id` | INTEGER | Clave primaria autoincremental |
| `nombre` | TEXT | Obligatorio |
| `participante` | TEXT | Obligatorio |
| `tipo` | TEXT | Obligatorio, validado contra el catálogo |
| `categoria` | TEXT | Obligatorio, validado contra el catálogo |
| `idioma` | TEXT | Opcional |
| `enlace` | TEXT | Opcional, debe ser `http(s)://` |
| `archivo` | TEXT | Ruta del PDF, opcional |
| `imagen` | TEXT | Ruta de la portada, opcional |
| `descubrimiento` | TEXT | Obligatorio — ¿cómo lo descubriste? |
| `contribucion` | TEXT | Obligatorio — ¿cómo contribuyó a tu desarrollo? |
| `recomendacion` | TEXT | Obligatorio — ¿por qué lo recomendarías? |
| `fecha` | TEXT | `datetime('now')` al crear |

Hay índices sobre `categoria`, `tipo`, `participante` y `fecha` para que los filtros
y las estadísticas no recorran la tabla completa.

Los catálogos de tipos, categorías e idiomas se definen en
`backend/utils/catalogs.js` y se exponen en `GET /api/options`; el frontend los
consume desde ahí, de modo que **agregar una categoría nueva solo requiere editar
ese archivo**.

---

## Diseño

Paleta institucional (`frontend/tailwind.config.js`, escala `plum`):

| Token | Hex | Uso |
|---|---|---|
| `plum-900` | `#210D26` | Portada, pie de página, títulos |
| `plum-700` | `#64278C` | Acentos, barras horizontales |
| `plum-600` | `#7833A6` | Color principal de acción y de las gráficas |
| `plum-500` | `#8553A6` | Iconos y detalles secundarios |
| `ink` | `#0D0D0D` | Texto base |

Los tonos `plum-50` a `plum-400` son tintes derivados de la marca para fondos,
bordes y estados hover.

**Criterio de color en las gráficas.** Las gráficas de una sola serie (barras por
categoría, línea por mes, barras por participante) usan un solo color: el color no
codifica información y variarlo por barra sería ruido visual. Solo la gráfica de
pastel usa una paleta categórica —ahí cada color sí identifica un tipo distinto—
validada para mantener separación suficiente en visión con deficiencia cromática;
además, la leyenda muestra el nombre, el valor y el porcentaje, de modo que la
identidad nunca depende únicamente del color. La página incluye una tabla con las
mismas cifras como alternativa accesible a las gráficas.

El logo vive en `frontend/public/logo/`; consulta el README de esa carpeta para
reemplazarlo.

---

## Notas de mantenimiento

- **Validación doble:** el formulario valida en el navegador y `backend/utils/validation.js`
  vuelve a validar todo antes de tocar la base de datos. Nunca confíes solo en el cliente.
- **Errores centralizados:** todos los controladores usan `asyncHandler`, así que cualquier
  excepción llega a `middleware/errorHandler.js`, que también limpia los archivos que se
  hubieran subido en una petición fallida.
- **Rutas de archivo seguras:** `utils/files.js` normaliza las rutas antes de borrar,
  de modo que nada pueda escribir ni eliminar fuera de `uploads/`.
- **Carga diferida:** Recharts solo se descarga al entrar a `/estadisticas`, lo que
  mantiene el paquete inicial en ~217 kB en lugar de ~636 kB.
