import { useEffect, useMemo, useRef, useState } from 'react';
import Button from './Button';
import { Alert } from './Feedback';
import { FileField, SelectField, TextAreaField, TextField } from './FormFields';
import { IconCheck, IconDocument, IconUpload } from './Icons';
import useOptions from '../hooks/useOptions';
import { urlArchivo } from '../utils/format';

const MAX_MB = 10;
const MAX_BYTES = MAX_MB * 1024 * 1024;
const IMAGENES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const VACIO = {
  nombre: '',
  enlace: '',
  tipo: '',
  categoria: '',
  idioma: '',
  participante: '',
  descubrimiento: '',
  contribucion: '',
  recomendacion: '',
};

const CAMPOS_TEXTO = Object.keys(VACIO);

const LARGOS = {
  nombre: 150,
  participante: 100,
  enlace: 500,
  descubrimiento: 2000,
  contribucion: 2000,
  recomendacion: 2000,
};

/** Validación en cliente; el backend vuelve a validar todo. */
function validar(valores, archivos) {
  const errores = {};
  const requeridos = {
    nombre: 'Escribe el nombre oficial del recurso.',
    participante: 'Escribe tu nombre.',
    tipo: 'Selecciona el tipo de recurso.',
    categoria: 'Selecciona una categoría.',
    descubrimiento: 'Cuéntanos cómo lo descubriste.',
    contribucion: 'Cuéntanos cómo contribuyó a tu desarrollo.',
    recomendacion: 'Explica por qué lo recomendarías.',
  };

  for (const [campo, mensaje] of Object.entries(requeridos)) {
    if (!valores[campo]?.trim()) errores[campo] = mensaje;
    else if (LARGOS[campo] && valores[campo].trim().length > LARGOS[campo]) {
      errores[campo] = `Máximo ${LARGOS[campo]} caracteres.`;
    }
  }

  const enlace = valores.enlace?.trim() ?? '';
  if (enlace) {
    try {
      const url = new URL(enlace);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error('protocolo');
    } catch {
      errores.enlace = 'El enlace debe iniciar con http:// o https://';
    }
  }

  if (archivos.archivo) {
    if (archivos.archivo.type !== 'application/pdf') errores.archivo = 'Solo se permiten archivos PDF.';
    else if (archivos.archivo.size > MAX_BYTES) errores.archivo = `El PDF supera los ${MAX_MB} MB.`;
  }

  if (archivos.imagen) {
    if (!IMAGENES.includes(archivos.imagen.type)) errores.imagen = 'Formatos permitidos: JPG, PNG, WEBP o GIF.';
    else if (archivos.imagen.size > MAX_BYTES) errores.imagen = `La imagen supera los ${MAX_MB} MB.`;
  }

  return errores;
}

function Seccion({ numero, titulo, descripcion, children }) {
  return (
    <section className="card p-5 sm:p-6">
      <header className="mb-5 flex items-start gap-3">
        {numero && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-plum-100 text-sm font-extrabold text-plum-700">
            {numero}
          </span>
        )}
        <div>
          <h2 className="text-base font-bold text-plum-900">{titulo}</h2>
          {descripcion && <p className="mt-0.5 text-sm text-muted">{descripcion}</p>}
        </div>
      </header>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export default function ResourceForm({ inicial, onSubmit, enviando, errorServidor, textoEnvio = 'Publicar recurso' }) {
  const { tipos, categorias, idiomas } = useOptions();

  const [valores, setValores] = useState(() => ({ ...VACIO, ...inicial }));
  const [archivos, setArchivos] = useState({ archivo: null, imagen: null });
  const [quitar, setQuitar] = useState({ archivo: false, imagen: false });
  const [errores, setErrores] = useState({});
  const [intentado, setIntentado] = useState(false);
  const contenedorRef = useRef(null);

  useEffect(() => {
    if (inicial) setValores((previos) => ({ ...previos, ...inicial }));
  }, [inicial]);

  useEffect(() => {
    if (errorServidor?.errors) setErrores(errorServidor.errors);
  }, [errorServidor]);

  const previewImagen = useMemo(
    () => (archivos.imagen ? URL.createObjectURL(archivos.imagen) : null),
    [archivos.imagen],
  );

  useEffect(() => () => previewImagen && URL.revokeObjectURL(previewImagen), [previewImagen]);

  const cambiar = (campo) => (evento) => {
    const { value } = evento.target;
    setValores((previos) => ({ ...previos, [campo]: value }));
    if (intentado) {
      setErrores((previos) => {
        const siguiente = { ...previos };
        delete siguiente[campo];
        return siguiente;
      });
    }
  };

  const cambiarArchivo = (campo) => (evento) => {
    const archivo = evento.target.files?.[0] ?? null;
    setArchivos((previos) => ({ ...previos, [campo]: archivo }));
    setQuitar((previos) => ({ ...previos, [campo]: false }));
    setErrores((previos) => {
      const siguiente = { ...previos };
      delete siguiente[campo];
      return siguiente;
    });
  };

  const limpiarArchivo = (campo) => () => {
    setArchivos((previos) => ({ ...previos, [campo]: null }));
    setQuitar((previos) => ({ ...previos, [campo]: true }));
  };

  const enviar = (evento) => {
    evento.preventDefault();
    setIntentado(true);

    const encontrados = validar(valores, archivos);
    setErrores(encontrados);

    if (Object.keys(encontrados).length) {
      contenedorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    // Solo los campos de texto: `archivo` e `imagen` viajan como File (o como
    // cadena vacía si se quitan) en las líneas de abajo, nunca como su URL actual.
    const datos = new FormData();
    for (const campo of CAMPOS_TEXTO) {
      datos.set(campo, (valores[campo] ?? '').trim());
    }
    if (archivos.archivo) datos.set('archivo', archivos.archivo);
    else if (quitar.archivo) datos.set('archivo', '');
    if (archivos.imagen) datos.set('imagen', archivos.imagen);
    else if (quitar.imagen) datos.set('imagen', '');

    onSubmit(datos);
  };

  const archivoActual = !quitar.archivo && !archivos.archivo ? inicial?.archivo : null;
  const imagenActual = !quitar.imagen && !archivos.imagen ? inicial?.imagen : null;
  const hayErrores = intentado && Object.keys(errores).length > 0;

  return (
    <form ref={contenedorRef} onSubmit={enviar} noValidate className="space-y-6">
      {(errorServidor || hayErrores) && (
        <Alert titulo={errorServidor?.message ?? 'Revisa los campos marcados'}>
          {hayErrores && !errorServidor
            ? 'Faltan datos obligatorios o hay valores no válidos en el formulario.'
            : null}
        </Alert>
      )}

      <Seccion
        numero="1"
        titulo="¿Qué recurso deseas compartir?"
        descripcion="Escribe el nombre oficial y, si aplica, el enlace directo."
      >
        <TextField
          label="Nombre del recurso"
          requerido
          value={valores.nombre}
          onChange={cambiar('nombre')}
          error={errores.nombre}
          placeholder="Ej. Curso de Introducción a la Programación"
          maxLength={LARGOS.nombre}
          autoComplete="off"
        />

        <TextField
          label="Enlace web"
          type="url"
          value={valores.enlace}
          onChange={cambiar('enlace')}
          error={errores.enlace}
          placeholder="https://ejemplo.com/recurso"
          ayuda="Enlace directo al recurso, si está disponible en línea."
          maxLength={LARGOS.enlace}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField
            label="Tipo de recurso"
            requerido
            value={valores.tipo}
            onChange={cambiar('tipo')}
            error={errores.tipo}
            opciones={tipos}
            placeholder="Selecciona un tipo"
          />
          <SelectField
            label="Categoría"
            requerido
            value={valores.categoria}
            onChange={cambiar('categoria')}
            error={errores.categoria}
            opciones={categorias}
            placeholder="Selecciona una categoría"
          />
        </div>

        <SelectField
          label="Idioma"
          value={valores.idioma}
          onChange={cambiar('idioma')}
          error={errores.idioma}
          opciones={idiomas}
          placeholder="Selecciona un idioma"
        />
      </Seccion>

      <Seccion numero="2" titulo="¿Quién comparte el recurso?" descripcion="Así la comunidad sabe a quién agradecer.">
        <TextField
          label="Nombre de la participante"
          requerido
          value={valores.participante}
          onChange={cambiar('participante')}
          error={errores.participante}
          placeholder="Ej. Ana Martínez"
          maxLength={LARGOS.participante}
          autoComplete="name"
        />
      </Seccion>

      <Seccion
        numero="3"
        titulo="Tu experiencia con el recurso"
        descripcion="Estas respuestas son lo que hace útil a la ludoteca para las demás."
      >
        <TextAreaField
          label="¿Cómo lo descubriste?"
          requerido
          value={valores.descubrimiento}
          onChange={cambiar('descubrimiento')}
          error={errores.descubrimiento}
          placeholder="Cuéntanos cómo llegaste a este recurso."
          maxLength={LARGOS.descubrimiento}
        />
        <TextAreaField
          label="¿Cómo contribuyó (o habría contribuido) a tu desarrollo personal o profesional?"
          requerido
          value={valores.contribucion}
          onChange={cambiar('contribucion')}
          error={errores.contribucion}
          placeholder="Describe qué aprendiste o en qué te ayudó."
          maxLength={LARGOS.contribucion}
        />
        <TextAreaField
          label="¿Por qué lo recomendarías a otra participante de Mujer Digital?"
          requerido
          value={valores.recomendacion}
          onChange={cambiar('recomendacion')}
          error={errores.recomendacion}
          placeholder="Explica por qué vale la pena dedicarle tiempo."
          maxLength={LARGOS.recomendacion}
        />
      </Seccion>

      <Seccion
        numero="4"
        titulo="Material complementario"
        descripcion={`Opcional. Tamaño máximo por archivo: ${MAX_MB} MB.`}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <FileField
              label="Archivo PDF"
              accept="application/pdf,.pdf"
              archivo={archivos.archivo}
              onChange={cambiarArchivo('archivo')}
              onClear={limpiarArchivo('archivo')}
              error={errores.archivo}
              ayuda="Guía, resumen o material descargable."
            />
            {archivoActual && (
              <div className="mt-2 flex items-center justify-between gap-3 rounded-lg bg-plum-50 px-3 py-2 text-xs">
                <span className="flex min-w-0 items-center gap-1.5 text-muted">
                  <IconDocument className="h-3.5 w-3.5 shrink-0" />
                  <a
                    href={urlArchivo(archivoActual)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate font-medium text-plum-700 hover:underline"
                  >
                    PDF actual
                  </a>
                </span>
                <button
                  type="button"
                  onClick={limpiarArchivo('archivo')}
                  className="shrink-0 font-semibold text-red-700 hover:underline"
                >
                  Quitar
                </button>
              </div>
            )}
          </div>

          <div>
            <FileField
              label="Imagen de portada"
              accept="image/jpeg,image/png,image/webp,image/gif"
              archivo={archivos.imagen}
              previewUrl={previewImagen}
              onChange={cambiarArchivo('imagen')}
              onClear={limpiarArchivo('imagen')}
              error={errores.imagen}
              ayuda="JPG, PNG, WEBP o GIF. Se recomienda 16:9."
            />
            {imagenActual && (
              <div className="mt-2 flex items-center justify-between gap-3 rounded-lg bg-plum-50 px-3 py-2 text-xs">
                <span className="flex min-w-0 items-center gap-2 text-muted">
                  <img src={urlArchivo(imagenActual)} alt="" className="h-8 w-8 rounded object-cover" />
                  <span className="truncate font-medium text-plum-700">Imagen actual</span>
                </span>
                <button
                  type="button"
                  onClick={limpiarArchivo('imagen')}
                  className="shrink-0 font-semibold text-red-700 hover:underline"
                >
                  Quitar
                </button>
              </div>
            )}
          </div>
        </div>
      </Seccion>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">
          Los campos marcados con <span className="font-bold text-plum-600">*</span> son obligatorios.
        </p>
        <Button type="submit" size="lg" disabled={enviando}>
          {enviando ? (
            <>
              <IconUpload className="h-5 w-5 animate-pulse" />
              Guardando…
            </>
          ) : (
            <>
              <IconCheck className="h-5 w-5" />
              {textoEnvio}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
