import { useCallback } from 'react';
import Button from '../components/Button';
import ResourceCard from '../components/ResourceCard';
import StatCard from '../components/StatCard';
import { EmptyState, ErrorState, SkeletonCard } from '../components/Feedback';
import {
  IconArrowRight,
  IconBook,
  IconChart,
  IconDocument,
  IconGrid,
  IconPlus,
  IconTag,
  IconUsers,
} from '../components/Icons';
import useFetch from '../hooks/useFetch';
import { getResources, getStatistics } from '../services/api';

const RECIENTES = 6;

export default function Home() {
  const cargarInicio = useCallback(
    (signal) =>
      Promise.all([
        getStatistics(signal),
        getResources({ limit: RECIENTES, sort: 'fecha', order: 'desc' }, signal),
      ]).then(([estadisticas, recientes]) => ({ estadisticas, recientes })),
    [],
  );

  const { datos, cargando, error, recargar } = useFetch(cargarInicio);

  const resumen = datos?.estadisticas?.resumen;
  const recientes = datos?.recientes?.data ?? [];

  return (
    <>
      {/* Portada */}
      <section className="relative overflow-hidden bg-plum-900 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(60% 80% at 15% 0%, rgba(120,51,166,0.55) 0%, transparent 60%), radial-gradient(50% 70% at 90% 20%, rgba(133,83,166,0.45) 0%, transparent 65%)',
          }}
          aria-hidden="true"
        />
        <div className="container-page relative py-16 sm:py-20 lg:py-24">
          <div className="flex flex-col items-center gap-10 animate-fade-up lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 py-2 pl-4 pr-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-plum-200">
                  Programa
                </span>
                <span className="h-4 w-px bg-white/25" aria-hidden="true" />
                <img
                  src="/logo/mujer-digital-blanco.png"
                  alt="Mujer Digital"
                  className="h-6 w-auto"
                  width="821"
                  height="384"
                />
              </span>

              <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Ludoteca Digital Colaborativa
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-plum-200 sm:text-lg">
                Queremos transmitir el apoyo que podemos darnos entre nosotras, como comunidad,
                compartiendo las herramientas que nos han funcionado individualmente con la
                esperanza de que también le sirvan a alguien más del grupo.
              </p>

              <p className="mt-3 max-w-2xl text-base leading-relaxed text-plum-200 sm:text-lg">
                Todo con el objetivo de{' '}
                <strong className="font-semibold text-white">
                  impulsar nuestro crecimiento personal y profesional
                </strong>
                , tanto ahora como al terminar el programa.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button to="/recursos" size="lg" variant="secondary">
                  <IconGrid className="h-5 w-5" />
                  Explorar recursos
                </Button>
                <Button to="/agregar" size="lg" className="bg-plum-600 hover:bg-plum-500">
                  <IconPlus className="h-5 w-5" />
                  Agregar recurso
                </Button>
                <Button
                  to="/estadisticas"
                  size="lg"
                  variant="ghost"
                  className="border border-white/25 text-white hover:bg-white/10"
                >
                  <IconChart className="h-5 w-5" />
                  Ver estadísticas
                </Button>
              </div>
            </div>

            <img
              src="/logo/logoDC.jpeg"
              alt="Digital Queens · Mujer Digital"
              className="h-44 w-44 shrink-0 rounded-2xl object-cover shadow-lg ring-1 ring-white/15 sm:h-52 sm:w-52 lg:h-60 lg:w-60"
              width="240"
              height="240"
            />
          </div>
        </div>
      </section>

      <div className="container-page py-10 sm:py-12">
        {error ? (
          <ErrorState mensaje={error.message} onRetry={recargar} />
        ) : (
          <>
            {/* Cifras generales */}
            <section aria-label="Resumen de la ludoteca">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cargando || !resumen ? (
                  Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="card h-28 animate-pulse bg-white" />
                  ))
                ) : (
                  <>
                    <StatCard
                      icon={IconBook}
                      etiqueta="Recursos registrados"
                      valor={resumen.totalRecursos}
                      detalle="Aportados por la comunidad"
                    />
                    <StatCard
                      icon={IconUsers}
                      etiqueta="Participantes"
                      valor={resumen.totalParticipantes}
                      detalle="Han compartido al menos un recurso"
                    />
                    <StatCard
                      icon={IconTag}
                      etiqueta="Categorías"
                      valor={resumen.totalCategorias}
                      detalle="Áreas de conocimiento cubiertas"
                    />
                    <StatCard
                      icon={IconDocument}
                      etiqueta="Recursos con PDF"
                      valor={resumen.totalConPdf}
                      detalle="Documentos descargables"
                    />
                  </>
                )}
              </div>
            </section>

            {/* Agregados recientemente */}
            <section className="mt-12" aria-label="Recursos agregados recientemente">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight text-plum-900 sm:text-2xl">
                    Agregados recientemente
                  </h2>
                  <p className="mt-1 text-sm text-muted">Lo último que la comunidad ha compartido.</p>
                </div>
                <Button to="/recursos" variant="secondary" size="sm">
                  Ver todos
                  <IconArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {cargando ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }, (_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : recientes.length === 0 ? (
                <EmptyState
                  icon={IconBook}
                  titulo="La ludoteca todavía está vacía"
                  mensaje="Sé la primera en compartir un recurso que te haya servido en tu aprendizaje."
                  accion={
                    <Button to="/agregar">
                      <IconPlus className="h-4 w-4" />
                      Agregar el primer recurso
                    </Button>
                  }
                />
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {recientes.map((recurso) => (
                    <ResourceCard key={recurso.id} recurso={recurso} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </>
  );
}
