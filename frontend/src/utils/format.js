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

/** La API entrega la fecha en ISO 8601 ("2026-01-14T10:20:00+00:00"). */
function parseFecha(valor) {
  if (!valor) return null;

  const texto = String(valor).replace(' ', 'T');
  // Si el texto no trae zona horaria, se interpreta como UTC.
  const tieneZona = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(texto);

  const fecha = new Date(tieneZona ? texto : `${texto}Z`);
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

/** Los PDFs e imágenes viven en Supabase Storage con una URL pública absoluta. */
export function urlArchivo(ruta) {
  return ruta || null;
}

function slug(texto = '') {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/**
 * El atributo `download` de HTML se ignora entre orígenes distintos y Storage
 * está en otro dominio, así que la descarga se pide con `?download=<nombre>`:
 * Supabase responde con Content-Disposition: attachment y el nombre indicado.
 */
export function urlDescarga(ruta, nombre) {
  if (!ruta) return null;

  const archivo = `${slug(nombre) || 'recurso'}.pdf`;
  const separador = ruta.includes('?') ? '&' : '?';

  return `${ruta}${separador}download=${encodeURIComponent(archivo)}`;
}

export function pluralizar(cantidad, singular, plural) {
  return cantidad === 1 ? singular : plural;
}
