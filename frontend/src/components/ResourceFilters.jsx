import { IconClose, IconSearch } from './Icons';

const ORDENES = [
  { valor: 'fecha-desc', etiqueta: 'Más recientes primero' },
  { valor: 'fecha-asc', etiqueta: 'Más antiguos primero' },
  { valor: 'nombre-asc', etiqueta: 'Nombre (A–Z)' },
  { valor: 'nombre-desc', etiqueta: 'Nombre (Z–A)' },
];

const claseSelect =
  'field-control appearance-none bg-[length:16px] bg-[right_0.85rem_center] bg-no-repeat pr-10';

const flecha = {
  backgroundImage:
    "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b6472' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
};

/** Barra de búsqueda + filtros. Componente controlado por la página. */
export default function ResourceFilters({ filtros, onChange, onLimpiar, categorias, tipos, resultados }) {
  const hayFiltros = Boolean(filtros.search || filtros.categoria || filtros.tipo);

  const actualizar = (campo) => (evento) => onChange({ [campo]: evento.target.value });

  return (
    <section className="card p-4 sm:p-5" aria-label="Buscar y filtrar recursos">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
        <div className="relative">
          <label htmlFor="buscar" className="sr-only">
            Buscar por nombre, participante o categoría
          </label>
          <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            id="buscar"
            type="search"
            value={filtros.search}
            onChange={actualizar('search')}
            placeholder="Buscar por nombre, participante o categoría…"
            className="field-control pl-10"
          />
        </div>

        <div>
          <label htmlFor="filtro-categoria" className="sr-only">Filtrar por categoría</label>
          <select
            id="filtro-categoria"
            value={filtros.categoria}
            onChange={actualizar('categoria')}
            className={claseSelect}
            style={flecha}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filtro-tipo" className="sr-only">Filtrar por tipo</label>
          <select
            id="filtro-tipo"
            value={filtros.tipo}
            onChange={actualizar('tipo')}
            className={claseSelect}
            style={flecha}
          >
            <option value="">Todos los tipos</option>
            {tipos.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filtro-orden" className="sr-only">Ordenar resultados</label>
          <select
            id="filtro-orden"
            value={`${filtros.sort}-${filtros.order}`}
            onChange={(e) => {
              const [sort, order] = e.target.value.split('-');
              onChange({ sort, order });
            }}
            className={claseSelect}
            style={flecha}
          >
            {ORDENES.map(({ valor, etiqueta }) => (
              <option key={valor} value={valor}>{etiqueta}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted" aria-live="polite">
          {resultados === null
            ? 'Buscando…'
            : `${resultados} ${resultados === 1 ? 'recurso encontrado' : 'recursos encontrados'}`}
        </p>
        {hayFiltros && (
          <button
            type="button"
            onClick={onLimpiar}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-plum-700 hover:bg-plum-100"
          >
            <IconClose className="h-4 w-4" />
            Limpiar filtros
          </button>
        )}
      </div>
    </section>
  );
}
