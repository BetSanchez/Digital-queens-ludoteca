import { TIPOS, CATEGORIAS, IDIOMAS } from './catalogs.js';

const LIMITS = {
  nombre: 150,
  participante: 100,
  tipo: 60,
  categoria: 60,
  idioma: 40,
  enlace: 500,
  descubrimiento: 2000,
  contribucion: 2000,
  recomendacion: 2000,
};

const clean = (value) => (typeof value === 'string' ? value.trim() : '');

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Valida y normaliza el cuerpo de una petición de recurso.
 * `partial` permite omitir campos en actualizaciones (PUT parcial).
 *
 * @returns {{ errors: Record<string,string>, data: Record<string, string|null> }}
 */
export function validateResource(body = {}, { partial = false } = {}) {
  const errors = {};
  const data = {};

  const required = [
    ['nombre', 'El nombre del recurso es obligatorio.'],
    ['participante', 'El nombre de la participante es obligatorio.'],
    ['tipo', 'El tipo de recurso es obligatorio.'],
    ['categoria', 'La categoría es obligatoria.'],
    ['descubrimiento', 'Indica cómo descubriste el recurso.'],
    ['contribucion', 'Indica cómo contribuyó a tu desarrollo.'],
    ['recomendacion', 'Indica por qué lo recomendarías.'],
  ];

  for (const [field, message] of required) {
    const provided = Object.prototype.hasOwnProperty.call(body, field);
    if (partial && !provided) continue;

    const value = clean(body[field]);
    if (!value) {
      errors[field] = message;
      continue;
    }
    if (value.length > LIMITS[field]) {
      errors[field] = `Máximo ${LIMITS[field]} caracteres.`;
      continue;
    }
    data[field] = value;
  }

  if (data.tipo && !TIPOS.includes(data.tipo)) {
    errors.tipo = 'El tipo seleccionado no es válido.';
  }
  if (data.categoria && !CATEGORIAS.includes(data.categoria)) {
    errors.categoria = 'La categoría seleccionada no es válida.';
  }

  if (Object.prototype.hasOwnProperty.call(body, 'idioma')) {
    const idioma = clean(body.idioma);
    if (!idioma) {
      data.idioma = null;
    } else if (!IDIOMAS.includes(idioma)) {
      errors.idioma = 'El idioma seleccionado no es válido.';
    } else {
      data.idioma = idioma;
    }
  } else if (!partial) {
    data.idioma = null;
  }

  if (Object.prototype.hasOwnProperty.call(body, 'enlace')) {
    const enlace = clean(body.enlace);
    if (!enlace) {
      data.enlace = null;
    } else if (enlace.length > LIMITS.enlace) {
      errors.enlace = `Máximo ${LIMITS.enlace} caracteres.`;
    } else if (!isValidUrl(enlace)) {
      errors.enlace = 'El enlace debe iniciar con http:// o https://';
    } else {
      data.enlace = enlace;
    }
  } else if (!partial) {
    data.enlace = null;
  }

  return { errors, data };
}

export function parseId(raw) {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}
