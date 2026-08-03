import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../components/Button';
import PageHeader from '../components/PageHeader';
import ResourceCard from '../components/ResourceCard';
import ResourceFilters from '../components/ResourceFilters';
import { EmptyState, ErrorState, SkeletonCard } from '../components/Feedback';
import { IconPlus, IconSearch } from '../components/Icons';
import useDebounce from '../hooks/useDebounce';
import useFetch from '../hooks/useFetch';
import useOptions from '../hooks/useOptions';
import { getResources } from '../services/api';

const POR_PAGINA = 12;

const FILTROS_INICIALES = { search: '', categoria: '', tipo: '', sort: 'fecha', order: 'desc' };

export default function Explore() {
  const [params, setParams] = useSearchParams();
  const { tipos, categorias } = useOptions();

  const filtros = useMemo(
    () => ({
      search: params.get('search') ?? '',
      categoria: params.get('categoria') ?? '',
      tipo: params.get('tipo') ?? '',
      sort: params.get('sort') ?? 'fecha',
      order: params.get('order') ?? 'desc',
    }),
    [params],
  );

  const [pagina, setPagina] = useState(0);
  const busqueda = useDebounce(filtros.search, 350);

  const actualizarFiltros = (cambios) => {
    const siguientes = { ...filtros, ...cambios };
    const nuevos = new URLSearchParams();
    for (const [clave, valor] of Object.entries(siguientes)) {
      if (valor && !(clave === 'sort' && valor === 'fecha') && !(clave === 'order' && valor === 'desc')) {
        nuevos.set(clave, valor);
      }
    }
    setParams(nuevos, { replace: true });
    setPagina(0);
  };

  const limpiar = () => {
    setParams(new URLSearchParams(), { replace: true });
    setPagina(0);
  };

  const consulta = useCallback(
    (signal) =>
      getResources(
        {
          search: busqueda,
          categoria: filtros.categoria,
          tipo: filtros.tipo,
          sort: filtros.sort,
          order: filtros.order,
          limit: POR_PAGINA,
          offset: pagina * POR_PAGINA,
        },
        signal,
      ),
    [busqueda, filtros.categoria, filtros.tipo, filtros.sort, filtros.order, pagina],
  );

  const { datos, cargando, error, recargar } = useFetch(consulta, [consulta]);

  const recursos = datos?.data ?? [];
  const total = datos?.total ?? 0;
  const paginas = Math.ceil(total / POR_PAGINA);
  const hayFiltros = Boolean(filtros.search || filtros.categoria || filtros.tipo);

  return (
    <>
      <PageHeader
        eyebrow="Catálogo"
        titulo="Explorar recursos"
        descripcion="Busca por nombre, participante o categoría, y filtra hasta encontrar lo que necesitas."
        acciones={
          <Button to="/agregar">
            <IconPlus className="h-4 w-4" />
            Agregar recurso
          </Button>
        }
      />

      <div className="container-page py-8">
        <ResourceFilters
          filtros={filtros}
          onChange={actualizarFiltros}
          onLimpiar={limpiar}
          categorias={categorias}
          tipos={tipos}
          resultados={cargando ? null : total}
        />

        <div className="mt-6">
          {error ? (
            <ErrorState mensaje={error.message} onRetry={recargar} />
          ) : cargando ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }, (_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : recursos.length === 0 ? (
            <EmptyState
              icon={IconSearch}
              titulo={hayFiltros ? 'Sin coincidencias' : 'La ludoteca todavía está vacía'}
              mensaje={
                hayFiltros
                  ? 'Prueba con otras palabras o quita algunos filtros para ampliar la búsqueda.'
                  : 'Sé la primera en compartir un recurso con la comunidad.'
              }
              accion={
                hayFiltros ? (
                  <Button variant="secondary" onClick={limpiar}>
                    Limpiar filtros
                  </Button>
                ) : (
                  <Button to="/agregar">
                    <IconPlus className="h-4 w-4" />
                    Agregar recurso
                  </Button>
                )
              }
            />
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {recursos.map((recurso) => (
                  <ResourceCard key={recurso.id} recurso={recurso} />
                ))}
              </div>

              {paginas > 1 && (
                <nav
                  className="mt-8 flex flex-wrap items-center justify-center gap-2"
                  aria-label="Paginación"
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={pagina === 0}
                    onClick={() => setPagina((p) => Math.max(0, p - 1))}
                  >
                    Anterior
                  </Button>
                  {/* En pantallas estrechas el indicador ocupa su propia línea
                      para que los dos botones quepan uno junto al otro. */}
                  <span className="order-first w-full text-center text-sm font-medium text-muted sm:order-none sm:w-auto sm:px-3">
                    Página {pagina + 1} de {paginas}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={pagina + 1 >= paginas}
                    onClick={() => setPagina((p) => p + 1)}
                  >
                    Siguiente
                  </Button>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
