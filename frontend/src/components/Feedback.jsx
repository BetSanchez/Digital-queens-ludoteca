import Button from './Button';
import { IconAlert, IconCheck, IconSearch } from './Icons';

export function Spinner({ className = 'h-6 w-6' }) {
  return (
    <svg className={`animate-spin text-plum-600 ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M12 2a10 10 0 0 1 10 10h-3a7 7 0 0 0-7-7Z"
      />
    </svg>
  );
}

export function Loading({ mensaje = 'Cargando…', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-16 text-muted ${className}`} role="status">
      <Spinner className="h-8 w-8" />
      <p className="text-sm font-medium">{mensaje}</p>
    </div>
  );
}

/** Esqueleto de tarjeta para evitar saltos de layout mientras carga. */
export function SkeletonCard() {
  return (
    <div className="card animate-pulse overflow-hidden">
      <div className="h-40 bg-plum-100" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-24 rounded bg-plum-100" />
        <div className="h-4 w-3/4 rounded bg-plum-100" />
        <div className="h-3 w-1/2 rounded bg-plum-100" />
        <div className="h-8 w-full rounded-lg bg-plum-50" />
      </div>
    </div>
  );
}

export function ErrorState({ mensaje, onRetry }) {
  return (
    <div className="card flex flex-col items-center gap-4 px-6 py-12 text-center" role="alert">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
        <IconAlert className="h-6 w-6" />
      </span>
      <div>
        <h2 className="text-lg font-bold text-plum-900">No fue posible cargar la información</h2>
        <p className="mt-1 max-w-md text-sm text-muted">{mensaje}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}

export function EmptyState({
  titulo = 'Aún no hay recursos',
  mensaje = 'Cuando se registre el primer recurso aparecerá aquí.',
  accion,
  icon: Icon = IconSearch,
}) {
  return (
    <div className="card flex flex-col items-center gap-4 px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-plum-100 text-plum-600">
        <Icon className="h-7 w-7" />
      </span>
      <div>
        <h2 className="text-lg font-bold text-plum-900">{titulo}</h2>
        <p className="mt-1 max-w-md text-sm text-muted">{mensaje}</p>
      </div>
      {accion}
    </div>
  );
}

export function Alert({ tipo = 'error', titulo, children, onClose }) {
  const estilos =
    tipo === 'exito'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
      : 'border-red-200 bg-red-50 text-red-900';
  const Icon = tipo === 'exito' ? IconCheck : IconAlert;

  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${estilos}`} role="alert">
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="min-w-0 flex-1 text-sm">
        {titulo && <p className="font-semibold">{titulo}</p>}
        {children && <div className={titulo ? 'mt-0.5' : ''}>{children}</div>}
      </div>
      {onClose && (
        <button type="button" onClick={onClose} className="text-current/60 hover:text-current" aria-label="Cerrar aviso">
          ×
        </button>
      )}
    </div>
  );
}
