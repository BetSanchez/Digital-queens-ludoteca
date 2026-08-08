import { Link } from 'react-router-dom';
import Badge from './Badge';
import { IconArrowRight, IconCalendar, IconDocument, IconLink, IconUser } from './Icons';
import { formatFechaCorta, iniciales, urlArchivo } from '../utils/format';

export default function ResourceCard({ recurso }) {
  const { id, nombre, participante, tipo, categoria, imagen, archivo, archivo2, enlace, fecha } = recurso;
  const portada = urlArchivo(imagen);
  const tienePdf = Boolean(archivo || archivo2);

  return (
    <article className="card group flex h-full flex-col overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="relative aspect-[16/9] overflow-hidden bg-plum-100">
        {portada ? (
          <img
            src={portada}
            alt={`Portada de ${nombre}`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-plum-700 to-plum-900">
            <span className="text-3xl font-extrabold text-white/90">{iniciales(nombre) || 'LD'}</span>
          </div>
        )}

        {/* Deja libre la esquina derecha, donde van los indicadores de PDF y enlace. */}
        <div className="absolute left-3 top-3 flex max-w-[calc(100%-5.5rem)] flex-wrap gap-1.5">
          <Badge variant="solido" className="max-w-full">
            <span className="truncate">{categoria}</span>
          </Badge>
        </div>

        {(tienePdf || enlace) && (
          <div className="absolute right-3 top-3 flex gap-1.5">
            {tienePdf && (
              <span
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/95 text-plum-700 shadow-sm"
                title="Incluye PDF"
              >
                <IconDocument className="h-4 w-4" />
                <span className="sr-only">Incluye PDF</span>
              </span>
            )}
            {enlace && (
              <span
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/95 text-plum-700 shadow-sm"
                title="Incluye enlace web"
              >
                <IconLink className="h-4 w-4" />
                <span className="sr-only">Incluye enlace web</span>
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <Badge variant="tipo" className="max-w-full self-start">
          <span className="truncate">{tipo}</span>
        </Badge>

        <h3 className="mt-2.5 line-clamp-2 break-words text-base font-bold leading-snug text-plum-900">
          <Link to={`/recursos/${id}`} className="hover:text-plum-600">
            {nombre}
          </Link>
        </h3>

        <dl className="mt-3 space-y-1.5 text-sm text-muted">
          <div className="flex items-center gap-2">
            <dt className="sr-only">Participante</dt>
            <IconUser className="h-4 w-4 shrink-0 text-plum-500" />
            <dd className="truncate">{participante}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="sr-only">Fecha de registro</dt>
            <IconCalendar className="h-4 w-4 shrink-0 text-plum-500" />
            <dd>{formatFechaCorta(fecha)}</dd>
          </div>
        </dl>

        <div className="mt-auto pt-4">
          <Link
            to={`/recursos/${id}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-plum-200 px-4 py-2.5 text-sm font-semibold text-plum-700 transition hover:border-plum-600 hover:bg-plum-600 hover:text-white"
          >
            Ver más
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
