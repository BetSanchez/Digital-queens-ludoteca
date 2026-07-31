/** Contenedor común de las gráficas: título, descripción y área de trazado. */
export default function ChartCard({ titulo, descripcion, children, footer, className = '' }) {
  return (
    <section className={`card p-5 sm:p-6 ${className}`}>
      <header className="mb-4">
        <h2 className="text-base font-bold text-plum-900 sm:text-lg">{titulo}</h2>
        {descripcion && <p className="mt-0.5 text-sm text-muted">{descripcion}</p>}
      </header>
      {children}
      {footer && <div className="mt-4 border-t border-plum-100 pt-3">{footer}</div>}
    </section>
  );
}

/** Tooltip compartido: la etiqueta identifica la barra y el valor va en negrita. */
export function ChartTooltip({ active, payload, label, sufijo = 'recursos', color }) {
  if (!active || !payload?.length) return null;

  const punto = payload[0];
  const nombre = label ?? punto.name;
  const valor = punto.value;
  const tono = color ?? punto.payload?.fill ?? punto.color;

  return (
    <div className="rounded-xl border border-plum-200 bg-white px-3 py-2 shadow-card">
      <p className="flex items-center gap-2 text-xs font-semibold text-plum-900">
        {tono && <span className="h-2.5 w-2.5 rounded-sm" style={{ background: tono }} aria-hidden="true" />}
        {nombre}
      </p>
      <p className="mt-0.5 text-sm text-muted">
        <span className="font-bold text-plum-700">{valor}</span> {valor === 1 ? sufijo.replace(/s$/, '') : sufijo}
      </p>
    </div>
  );
}

export function ChartEmpty({ mensaje = 'Todavía no hay datos suficientes para esta gráfica.' }) {
  return (
    <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-plum-200 bg-plum-50/50 px-6 text-center text-sm text-muted">
      {mensaje}
    </div>
  );
}
