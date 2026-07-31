/**
 * Tarjeta de resumen. La cifra es el elemento dominante; el icono es
 * decorativo y nunca sustituye a la etiqueta de texto.
 */
export default function StatCard({ icon: Icon, etiqueta, valor, detalle }) {
  return (
    <div className="card flex items-start gap-4 p-5 transition hover:shadow-card-hover">
      {Icon && (
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-plum-100 text-plum-700">
          <Icon className="h-5 w-5" />
        </span>
      )}
      <div className="min-w-0">
        <p className="text-sm font-medium text-muted">{etiqueta}</p>
        <p className="mt-0.5 text-3xl font-extrabold leading-none tracking-tight text-plum-900">{valor}</p>
        {detalle && <p className="mt-1.5 text-xs text-muted">{detalle}</p>}
      </div>
    </div>
  );
}
