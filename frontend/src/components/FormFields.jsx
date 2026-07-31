import { useId } from 'react';
import { IconDocument, IconUpload } from './Icons';

function Wrapper({ id, label, requerido, ayuda, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
        {requerido && <span className="ml-0.5 text-plum-600" aria-hidden="true">*</span>}
        {!requerido && <span className="ml-1.5 text-xs font-normal text-muted">(opcional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : (
        ayuda && <p className="mt-1.5 text-xs text-muted">{ayuda}</p>
      )}
    </div>
  );
}

export function TextField({ label, requerido, ayuda, error, className = '', ...props }) {
  const autoId = useId();
  const id = props.id ?? autoId;

  return (
    <Wrapper id={id} label={label} requerido={requerido} ayuda={ayuda} error={error}>
      <input
        {...props}
        id={id}
        className={`field-control ${error ? 'field-control-error' : ''} ${className}`}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
    </Wrapper>
  );
}

export function TextAreaField({ label, requerido, ayuda, error, rows = 4, className = '', ...props }) {
  const autoId = useId();
  const id = props.id ?? autoId;

  return (
    <Wrapper id={id} label={label} requerido={requerido} ayuda={ayuda} error={error}>
      <textarea
        {...props}
        id={id}
        rows={rows}
        className={`field-control resize-y ${error ? 'field-control-error' : ''} ${className}`}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
    </Wrapper>
  );
}

export function SelectField({
  label,
  requerido,
  ayuda,
  error,
  opciones = [],
  placeholder = 'Selecciona una opción',
  className = '',
  ...props
}) {
  const autoId = useId();
  const id = props.id ?? autoId;

  return (
    <Wrapper id={id} label={label} requerido={requerido} ayuda={ayuda} error={error}>
      <select
        {...props}
        id={id}
        className={`field-control appearance-none bg-[length:16px] bg-[right_0.85rem_center] bg-no-repeat pr-10 ${
          error ? 'field-control-error' : ''
        } ${className}`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b6472' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        }}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <option value="">{placeholder}</option>
        {opciones.map((opcion) => (
          <option key={opcion} value={opcion}>
            {opcion}
          </option>
        ))}
      </select>
    </Wrapper>
  );
}

/** Campo de archivo con vista previa del nombre y del tamaño seleccionado. */
export function FileField({
  label,
  ayuda,
  error,
  accept,
  archivo,
  onChange,
  onClear,
  previewUrl,
  ...props
}) {
  const autoId = useId();
  const id = props.id ?? autoId;

  return (
    <Wrapper id={id} label={label} ayuda={ayuda} error={error}>
      <div
        className={`relative rounded-xl border border-dashed p-4 transition ${
          error ? 'border-red-400 bg-red-50/40' : 'border-plum-300 bg-plum-50/60 hover:border-plum-500'
        }`}
      >
        {archivo ? (
          <div className="flex items-center gap-3">
            {previewUrl ? (
              <img src={previewUrl} alt="Vista previa" className="h-14 w-14 rounded-lg object-cover" />
            ) : (
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-plum-700">
                <IconDocument className="h-5 w-5" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-plum-900">{archivo.name}</p>
              <p className="text-xs text-muted">{(archivo.size / 1024).toFixed(0)} KB</p>
            </div>
            <button
              type="button"
              onClick={onClear}
              className="relative z-10 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-plum-700 hover:bg-plum-100"
            >
              Quitar
            </button>
          </div>
        ) : (
          <div className="pointer-events-none flex flex-col items-center gap-1.5 py-2 text-center text-sm text-muted">
            <IconUpload className="h-6 w-6 text-plum-500" />
            <span className="font-semibold text-plum-700">Selecciona un archivo</span>
            <span className="text-xs">o arrástralo hasta aquí</span>
          </div>
        )}

        {/* El input cubre la zona para permitir clic y arrastrar-soltar nativo. */}
        <input
          {...props}
          id={id}
          type="file"
          accept={accept}
          onChange={onChange}
          className={
            archivo ? 'hidden' : 'absolute inset-0 h-full w-full cursor-pointer opacity-0'
          }
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>
    </Wrapper>
  );
}
