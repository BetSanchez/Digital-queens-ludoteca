const FORMATO_LARGO = new Intl.DateTimeFormat('es-MX', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const FORMATO_CORTO = new Intl.DateTimeFormat('es-MX', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

/** La API entrega "YYYY-MM-DD HH:MM:SS" en UTC. */
function parseFecha(valor) {
  if (!valor) return null;
  const fecha = new Date(valor.replace(' ', 'T') + (valor.includes('Z') ? '' : 'Z'));
  return Number.isNaN(fecha.getTime()) ? null : fecha;
}

export function formatFecha(valor) {
  const fecha = parseFecha(valor);
  return fecha ? FORMATO_LARGO.format(fecha) : '—';
}

export function formatFechaCorta(valor) {
  const fecha = parseFecha(valor);
  return fecha ? FORMATO_CORTO.format(fecha) : '—';
}

export function iniciales(nombre = '') {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? '')
    .join('');
}

/** Devuelve la URL absoluta de un archivo servido por el backend. */
export function urlArchivo(ruta) {
  if (!ruta) return null;
  if (/^https?:\/\//i.test(ruta)) return ruta;
  const base = import.meta.env.VITE_FILES_URL ?? '';
  return `${base}${ruta}`;
}

export function pluralizar(cantidad, singular, plural) {
  return cantidad === 1 ? singular : plural;
}
