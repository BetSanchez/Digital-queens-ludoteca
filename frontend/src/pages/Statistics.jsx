import { useCallback } from 'react';
import Button from '../components/Button';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { ErrorState, Loading } from '../components/Feedback';
import CategoriasBarChart from '../components/charts/CategoriasBarChart';
import ParticipantesBarChart from '../components/charts/ParticipantesBarChart';
import TiposPieChart from '../components/charts/TiposPieChart';
import { IconBook, IconDocument, IconGrid, IconTag, IconUsers } from '../components/Icons';
import useFetch from '../hooks/useFetch';
import { getStatistics } from '../services/api';

export default function Statistics() {
  const consulta = useCallback((signal) => getStatistics(signal), []);
  const { datos, cargando, error, recargar } = useFetch(consulta);

  return (
    <>
      <PageHeader
        eyebrow="Panel"
        titulo="Estadísticas de la ludoteca"
        descripcion="Una lectura rápida de cómo crece el acervo y qué comparte la comunidad."
        acciones={
          <Button to="/recursos" variant="secondary">
            <IconGrid className="h-4 w-4" />
            Ver catálogo
          </Button>
        }
      />

      <div className="container-page py-8">
        {cargando ? (
          <Loading mensaje="Calculando estadísticas…" />
        ) : error ? (
          <ErrorState mensaje={error.message} onRetry={recargar} />
        ) : (
          <div className="space-y-6">
            <section aria-label="Cifras generales">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  icon={IconBook}
                  etiqueta="Total de recursos"
                  valor={datos.resumen.totalRecursos}
                  detalle={`${datos.resumen.totalConEnlace} incluyen enlace web`}
                />
                <StatCard
                  icon={IconUsers}
                  etiqueta="Total de participantes"
                  valor={datos.resumen.totalParticipantes}
                  detalle="Con al menos un aporte"
                />
                <StatCard
                  icon={IconTag}
                  etiqueta="Total de categorías"
                  valor={datos.resumen.totalCategorias}
                  detalle="Áreas representadas"
                />
                <StatCard
                  icon={IconDocument}
                  etiqueta="Recursos con PDF"
                  valor={datos.resumen.totalConPdf}
                  detalle="Archivos almacenados localmente"
                />
              </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-2">
              <CategoriasBarChart datos={datos.porCategoria} />
              <TiposPieChart datos={datos.porTipo} />
            </div>

            <ParticipantesBarChart datos={datos.topParticipantes} />

            <TablaResumen porCategoria={datos.porCategoria} porTipo={datos.porTipo} porIdioma={datos.porIdioma} />
          </div>
        )}
      </div>
    </>
  );
}

/** Vista tabular: alternativa accesible a las gráficas y detalle exacto. */
function TablaResumen({ porCategoria, porTipo, porIdioma }) {
  const bloques = [
    { titulo: 'Por categoría', filas: porCategoria },
    { titulo: 'Por tipo', filas: porTipo },
    { titulo: 'Por idioma', filas: porIdioma },
  ];

  return (
    <section className="card p-5 sm:p-6">
      <h2 className="text-base font-bold text-plum-900 sm:text-lg">Detalle en tabla</h2>
      <p className="mt-0.5 text-sm text-muted">Los mismos datos de las gráficas, en cifras exactas.</p>

      <div className="mt-4 grid gap-6 md:grid-cols-3">
        {bloques.map(({ titulo, filas }) => (
          <div key={titulo} className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="mb-2 text-left text-xs font-bold uppercase tracking-wider text-plum-700">
                {titulo}
              </caption>
              <thead>
                <tr className="border-b border-plum-100 text-left text-xs text-muted">
                  <th scope="col" className="py-1.5 font-semibold">Nombre</th>
                  <th scope="col" className="py-1.5 text-right font-semibold">Recursos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-plum-50">
                {filas.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-3 text-center text-muted">Sin datos</td>
                  </tr>
                ) : (
                  filas.map((fila) => (
                    <tr key={fila.name}>
                      <td className="py-2 pr-2 text-plum-900">{fila.name}</td>
                      <td className="py-2 text-right font-bold tabular-nums text-plum-900">{fila.total}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </section>
  );
}
