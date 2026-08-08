# Ludoteca Digital Colaborativa

Aplicación web para que las participantes de **Mujer Digital** registren, consulten y
compartan recursos de aprendizaje. No requiere inicio de sesión: los datos viven en
**Supabase** (PostgreSQL) y los PDFs e imágenes en **Supabase Storage**.

| Capa | Tecnologías |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Recharts, Fetch API |
| Backend | Node.js, Express, Supabase (PostgreSQL + Storage), Multer |

---

## Requisitos

- Node.js 20.12 o superior (usa `--env-file-if-exists`; probado con 24.18)
- npm 9 o superior
- Una cuenta gratuita en [supabase.com](https://supabase.com)

## 1. Instalación

```bash
npm run install:all
```

O bien, de forma manual:

```bash
cd backend  && npm install
cd ../frontend && npm install
```

## 2. Configurar Supabase

**a) Crea el proyecto.** Entra a [supabase.com](https://supabase.com) → *New project*.
Guarda la contraseña de la base de datos que te pida.

**b) Crea las tablas y los buckets.** En el menú lateral abre **SQL Editor → New query**,
pega el contenido de `supabase/schema.sql` y presiona **Run**. Eso crea:

- la tabla `resources` con sus índices y restricciones;
- las políticas RLS (la llave pública solo puede leer);
- los buckets de Storage `recursos-pdf` y `recursos-imagenes`;
- la función `get_statistics()` que alimenta el panel de estadísticas.

La base arranca vacía: los recursos se dan de alta desde la propia aplicación, en
`/agregar`.

**c) Conecta el backend.** Abre `backend/.env` (si no existe, cópialo de
`backend/.env.example`) y pega dos valores del panel de Supabase:

| Variable | Dónde se encuentra en el panel |
|---|---|
| `SUPABASE_URL` | Botón **Connect**, arriba en el panel → *Project URL*. Se ve así: `https://abcdefghijklm.supabase.co` |
| `SUPABASE_SECRET_KEY` | **Settings** (engrane) → **API Keys** → sección *Secret keys* → **Reveal**. Empieza con `sb_secret_` |

Si no encuentras el botón *Connect*, la URL siempre es `https://<ID>.supabase.co`,
donde `<ID>` es el código que aparece en la barra de direcciones del navegador:
`supabase.com/dashboard/project/<ID>`.

Pega los valores después del `=`, sin comillas ni espacios:

```env
SUPABASE_URL=https://abcdefghijklm.supabase.co
SUPABASE_SECRET_KEY=sb_secret_xxxxxxxxxxxxxxxxxxxxxx
```

> **Si tu proyecto usa las llaves antiguas:** en **Settings → API Keys** verás una
> pestaña *Legacy API Keys*; copia de ahí la llave `service_role`. Funciona igual —
> el backend acepta los dos formatos.

> **No confundas las llaves:** la *publishable* (o `anon`) sirve para leer, pero no
> para escribir. Si la usas, la app mostraría recursos pero fallaría al guardarlos.
> El backend detecta este caso al arrancar y te avisa.

> **Importante:** la llave secreta ignora las políticas RLS, es decir, tiene acceso
> total. Úsala solo en el servidor y nunca la subas a git ni la pegues en el frontend.
> `backend/.gitignore` ya excluye el archivo `.env`.

**d) Comprueba que todo quedó bien:**

```bash
npm run check
```

Verifica la conexión, la tabla, los buckets y la función de estadísticas, y te dice
exactamente qué falta si algo no cuadra.

## 3. Ejecución en desarrollo

Se necesitan **dos terminales**:

```bash
# Terminal 1 — API en http://localhost:4000
npm run dev:backend

# Terminal 2 — Interfaz en http://localhost:5173
npm run dev:frontend
```

Vite redirige `/api` al backend, así que no hay que configurar CORS para trabajar en
local. Los archivos se sirven directamente desde Supabase Storage.

## 4. Ejecución en producción (un solo proceso)

```bash
npm run build   # genera frontend/dist
npm start       # Express sirve la API y la interfaz en http://localhost:4000
```

El servidor detecta `frontend/dist` y lo sirve automáticamente, incluyendo el
enrutado del lado del cliente (recargar `/estadisticas` funciona).

Al desplegar en un servicio como Render, Railway o Fly.io, define `SUPABASE_URL` y
`SUPABASE_SECRET_KEY` como variables de entorno del servicio en lugar de subir el
archivo `.env`.

## 5. Despliegue en Vercel (dos proyectos)

Vercel no ejecuta servidores permanentes, así que el backend corre como función
serverless: `backend/api/index.js` exporta la app y `backend/vercel.json` manda
todas las rutas hacia ella. Nunca se llama a `app.listen()` ahí.

Crea **dos proyectos** en Vercel apuntando al mismo repositorio:

| Proyecto | Root Directory | Variables de entorno |
| --- | --- | --- |
| Backend | `backend` | `SUPABASE_URL`, `SUPABASE_SECRET_KEY` |
| Frontend | `frontend` | `VITE_API_URL=https://<backend>.vercel.app/api` |

Detalles que suelen fallar:

- El `.env` está en `.gitignore`, así que las variables hay que capturarlas en
  Settings > Environment Variables de cada proyecto. Si faltan las de Supabase,
  la función responde 500 y el navegador lo reporta como un error de CORS.
- `VITE_API_URL` se incrusta durante el build: después de cambiarla hay que
  volver a desplegar el frontend, no basta con recargar la página.
- Opcional: define `CORS_ORIGIN` en el backend con la URL del frontend para
  aceptar solo ese origen. Sin esa variable se acepta cualquiera.
- El límite de cuerpo de una función de Vercel es de 4.5 MB, menor que los 10 MB
  que acepta el formulario. Los PDF más grandes fallarán en producción.

---

## Estructura del proyecto

```text
ludoteca/
├── supabase/
│   └── schema.sql            Tabla, índices, RLS, buckets y get_statistics()
├── backend/
│   ├── api/                  index.js (entrada serverless para Vercel)
│   ├── controllers/          resources.controller.js · statistics.controller.js
│   ├── routes/               index.js · resources.routes.js · statistics.routes.js
│   ├── middleware/           upload.js (Multer) · errorHandler.js · asyncHandler.js
│   ├── utils/                validation.js · storage.js · catalogs.js · ApiError.js
│   ├── database/             supabase.js (cliente con la llave secreta)
│   ├── scripts/              check-supabase.js (diagnóstico de la conexión)
│   ├── .env.example
│   ├── app.js                Construye la app de Express (sin escuchar)
│   ├── server.js             Arranque local: app.js + listen
│   ├── vercel.json
│   └── package.json
└── frontend/
    ├── .env.example
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
| DELETE | `/resources/:id` | Elimina el recurso y sus archivos en Storage |
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

- Campos `archivo` y `archivo2`: solo PDF → bucket `recursos-pdf`
- Campo `imagen`: JPG, PNG, WEBP o GIF → bucket `recursos-imagenes`
- Tamaño máximo: **10 MB** por archivo (validado en Multer y en el bucket)
- Multer mantiene el archivo en memoria y solo lo sube cuando la validación pasa,
  así no queda basura si la petición falla
- La tabla guarda la **URL pública completa** de Supabase Storage
- Al eliminar o reemplazar un recurso, los archivos anteriores se borran del bucket

---

## Base de datos

Definida en `supabase/schema.sql`. Una sola tabla, `resources`:

| Campo | Tipo | Notas |
|---|---|---|
| `id` | bigint | Clave primaria (`generated always as identity`) |
| `nombre` | text | Obligatorio, máx. 150 |
| `participante` | text | Obligatorio, máx. 100 |
| `tipo` | text | Obligatorio, validado contra el catálogo |
| `categoria` | text | Obligatorio, validado contra el catálogo |
| `idioma` | text | Opcional |
| `enlace` | text | Opcional, debe ser `http(s)://` |
| `archivo` | text | URL del PDF en Storage, opcional |
| `archivo2` | text | URL del segundo PDF en Storage, opcional |
| `imagen` | text | URL de la portada en Storage, opcional |
| `descubrimiento` | text | Obligatorio — ¿cómo lo descubriste? |
| `contribucion` | text | Obligatorio — ¿cómo contribuyó a tu desarrollo? |
| `recomendacion` | text | Obligatorio — ¿por qué lo recomendarías? |
| `fecha` | timestamptz | `now()` al crear |

Si la base ya estaba creada, los cambios posteriores al esquema inicial están en
`supabase/migrations/`: ejecútalos en el SQL Editor en orden de nombre.

Hay índices sobre `categoria`, `tipo`, `participante` y `fecha` para que los filtros
y las estadísticas no recorran la tabla completa, más dos índices GIN (`pg_trgm`)
que aceleran la búsqueda por texto.

No hay datos precargados: la tabla empieza vacía y se llena desde el formulario de
la aplicación.

### Empezar de cero

Para vaciar la tabla y reiniciar los IDs desde 1, ejecuta esto en el **SQL Editor**:

```sql
truncate table public.resources restart identity;
```

Eso borra los registros pero **no** los PDFs ni las imágenes ya subidos. Para
limpiarlos también, ve a **Storage** y vacía los buckets `recursos-pdf` y
`recursos-imagenes`. (Borrar un recurso desde la aplicación sí elimina sus archivos;
el `truncate` es una operación directa en la base que se salta esa lógica.)

### Seguridad (RLS)

La tabla tiene *Row Level Security* activo con una única política: **lectura pública**.
No existen políticas de escritura, así que toda alta, edición o borrado tiene que pasar
por el backend, que usa la llave secreta. Si la llave pública quedara expuesta en el
navegador, no podría modificar nada.

### Estadísticas

Las seis métricas del panel se calculan en PostgreSQL con la función
`get_statistics()`, que devuelve un solo JSON. El backend hace una única llamada
(`supabase.rpc('get_statistics')`) en lugar de seis consultas.

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
  excepción llega a `middleware/errorHandler.js`. Los errores de Supabase se registran con
  su contexto en la consola y al usuario solo le llega un mensaje genérico.
- **Storage transaccional:** si la inserción en la base de datos falla después de haber
  subido un archivo, `utils/storage.js` lo borra para no dejar huérfanos en el bucket.
- **Carga diferida:** Recharts solo se descarga al entrar a `/estadisticas`, lo que
  mantiene el paquete inicial en ~217 kB en lugar de ~636 kB.
