import { Fragment, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { ErrorState, Loading } from '../components/Feedback';
import {
  IconArrowLeft,
  IconCalendar,
  IconDocument,
  IconDownload,
  IconGlobe,
  IconLink,
  IconPencil,
  IconTag,
  IconUser,
} from '../components/Icons';
import useFetch from '../hooks/useFetch';
import { getResource } from '../services/api';
import { formatFecha, iniciales, urlArchivo, urlDescarga } from '../utils/format';

const PREGUNTAS = [
  {
    campo: 'descubrimiento',
    titulo: '¿Cómo lo descubriste?',
  },
  {
    campo: 'contribucion',
    titulo: '¿Cómo contribuyó a tu desarrollo personal o profesional?',
  },
  {
    campo: 'recomendacion',
    titulo: '¿Por qué lo recomendarías a otra participante de Mujer Digital?',
  },
];

export default function ResourceDetail() {
  const { id } = useParams();

  const consulta = useCallback((signal) => getResource(id, signal), [id]);
  const { datos: recurso, cargando, error, recargar } = useFetch(consulta, [id]);

  if (cargando) return <Loading mensaje="Cargando recurso…" />;

  if (error) {
    return (
      <div className="container-page py-12">
        <ErrorState
          mensaje={error.status === 404 ? 'Este recurso no existe o fue eliminado.' : error.message}
          onRetry={error.status === 404 ? undefined : recargar}
        />
        <div className="mt-6 text-center">
          <Button to="/recursos" variant="secondary">
            <IconArrowLeft className="h-4 w-4" />
            Volver al catálogo
          </Button>
        </div>
      </div>
    );
  }

  const portada = urlArchivo(recurso.imagen);

  // Con un solo documento sobra numerarlo.
  const urlsPdf = [recurso.archivo, recurso.archivo2].map(urlArchivo).filter(Boolean);
  const pdfs = urlsPdf.map((url, indice) => {
    const numero = urlsPdf.length > 1 ? `-${indice + 1}` : '';
    return {
      url,
      descarga: urlDescarga(url, `${recurso.nombre}${numero}`),
      etiqueta: urlsPdf.length > 1 ? `PDF ${indice + 1}` : 'PDF',
    };
  });

  return (
    <article className="container-page py-8">
      <Link
        to="/recursos"
        className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-plum-700 hover:text-plum-600"
      >
        <IconArrowLeft className="h-4 w-4" />
        Volver al catálogo
      </Link>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Contenido principal */}
        <div className="space-y-6">
          <header className="card overflow-hidden">
            <div className="aspect-[16/9] w-full bg-plum-100 sm:aspect-[21/9]">
              {portada ? (
                <img src={portada} alt={`Portada de ${recurso.nombre}`} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-plum-700 to-plum-900">
                  <span className="text-5xl font-extrabold text-white/90">
                    {iniciales(recurso.nombre) || 'LD'}
                  </span>
                </div>
              )}
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant="categoria" icon={IconTag}>{recurso.categoria}</Badge>
                <Badge variant="tipo">{recurso.tipo}</Badge>
                {recurso.idioma && <Badge variant="neutro" icon={IconGlobe}>{recurso.idioma}</Badge>}
              </div>

              <h1 className="mt-3 break-words text-2xl font-extrabold leading-tight tracking-tight text-plum-900 sm:text-3xl">
                {recurso.nombre}
              </h1>

              <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
                <div className="flex items-center gap-2">
                  <dt className="sr-only">Participante</dt>
                  <IconUser className="h-4 w-4 text-plum-500" />
                  <dd className="font-medium text-plum-900">{recurso.participante}</dd>
                </div>
                <div className="flex items-center gap-2">
                  <dt className="sr-only">Fecha de publicación</dt>
                  <IconCalendar className="h-4 w-4 text-plum-500" />
                  <dd>Publicado el {formatFecha(recurso.fecha)}</dd>
                </div>
              </dl>
            </div>
          </header>

          <section className="card p-5 sm:p-6" aria-labelledby="titulo-respuestas">
            <h2 id="titulo-respuestas" className="text-lg font-bold text-plum-900">
              La experiencia de {recurso.participante.split(' ')[0]}
            </h2>
            <p className="mt-1 text-sm text-muted">
              Respuestas registradas al compartir este recurso.
            </p>

            <dl className="mt-5 space-y-5">
              {PREGUNTAS.map(({ campo, titulo }) => (
                <div key={campo} className="rounded-xl border border-plum-100 bg-plum-50/60 p-4">
                  <dt className="text-sm font-bold text-plum-700">{titulo}</dt>
                  <dd className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-ink">
                    {recurso[campo]}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        {/* Barra lateral */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-plum-900">Acceder al recurso</h2>

            <div className="mt-4 space-y-2.5">
              {recurso.enlace ? (
                <Button href={recurso.enlace} target="_blank" rel="noopener noreferrer" full>
                  <IconLink className="h-4 w-4" />
                  Abrir enlace web
                </Button>
              ) : (
                <p className="rounded-xl bg-plum-50 px-3.5 py-3 text-sm text-muted">
                  Este recurso no incluye un enlace web.
                </p>
              )}

              {pdfs.length ? (
                pdfs.map(({ url, descarga, etiqueta }) => (
                  <Fragment key={url}>
                    <Button href={url} target="_blank" rel="noopener noreferrer" variant="secondary" full>
                      <IconDocument className="h-4 w-4" />
                      Visualizar {etiqueta}
                    </Button>
                    <Button href={descarga} variant="ghost" full>
                      <IconDownload className="h-4 w-4" />
                      Descargar {etiqueta}
                    </Button>
                  </Fragment>
                ))
              ) : (
                <p className="rounded-xl bg-plum-50 px-3.5 py-3 text-sm text-muted">
                  Este recurso no incluye un archivo PDF.
                </p>
              )}
            </div>

            {recurso.enlace && (
              <p className="mt-3 break-all text-xs text-muted">{recurso.enlace}</p>
            )}
          </div>

          <div className="card p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-plum-900">Ficha</h2>
            <dl className="mt-3 divide-y divide-plum-100 text-sm">
              {[
                ['Tipo', recurso.tipo],
                ['Categoría', recurso.categoria],
                ['Idioma', recurso.idioma || 'No especificado'],
                ['Participante', recurso.participante],
                ['Publicación', formatFecha(recurso.fecha)],
              ].map(([etiqueta, valor]) => (
                <div key={etiqueta} className="flex items-start justify-between gap-4 py-2.5">
                  <dt className="shrink-0 text-muted">{etiqueta}</dt>
                  <dd className="min-w-0 break-words text-right font-medium text-plum-900">{valor}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="card p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-plum-900">Administrar</h2>
            <p className="mt-1 text-xs text-muted">
              Corrige la información del recurso.
            </p>

            <div className="mt-3.5 space-y-2.5">
              <Button to={`/recursos/${recurso.id}/editar`} variant="secondary" full>
                <IconPencil className="h-4 w-4" />
                Editar recurso
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
