import crypto from 'node:crypto';
import path from 'node:path';
import supabase, { BUCKET_IMAGES, BUCKET_PDF } from '../database/supabase.js';
import ApiError from './ApiError.js';

/** El campo del formulario define en qué bucket termina el archivo. */
const BUCKET_POR_CAMPO = {
  archivo: BUCKET_PDF,
  archivo2: BUCKET_PDF,
  imagen: BUCKET_IMAGES,
};

/** Campos de archivo que acepta un recurso, en el orden en que se suben. */
export const CAMPOS_ARCHIVO = ['archivo', 'archivo2', 'imagen'];

const PUBLIC_URL_MARKER = '/storage/v1/object/public/';

/** "Mi Guía Práctica.pdf" -> "mi-guia-practica-1717171717-a1b2c3d4.pdf" */
function nombreUnico(originalname) {
  const ext = path.extname(originalname).toLowerCase();
  const slug =
    path
      .basename(originalname, ext)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'archivo';

  return `${slug}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
}

/** Sube un archivo en memoria y devuelve su URL pública. */
async function subirArchivo(file) {
  const bucket = BUCKET_POR_CAMPO[file.fieldname];
  if (!bucket) throw ApiError.badRequest(`Campo de archivo no permitido: ${file.fieldname}.`);

  const ruta = nombreUnico(file.originalname);

  const { error } = await supabase.storage.from(bucket).upload(ruta, file.buffer, {
    contentType: file.mimetype,
    cacheControl: '604800', // 7 días, igual que el static de antes
    upsert: false,
  });

  if (error) {
    console.error('[storage] Error al subir a Supabase:', error);
    throw new Error(`No fue posible guardar el archivo "${file.originalname}".`);
  }

  return supabase.storage.from(bucket).getPublicUrl(ruta).data.publicUrl;
}

/**
 * Sube los archivos de una petición y devuelve sus URLs públicas.
 * Si alguno falla, borra los ya subidos para no dejar basura.
 *
 * @returns {Promise<{ archivo: string|null, archivo2: string|null, imagen: string|null }>}
 */
export async function subirArchivosDeRecurso(files) {
  const subidos = Object.fromEntries(CAMPOS_ARCHIVO.map((campo) => [campo, null]));

  try {
    for (const campo of CAMPOS_ARCHIVO) {
      const file = files?.[campo]?.[0];
      if (file) subidos[campo] = await subirArchivo(file);
    }
  } catch (error) {
    await eliminarArchivos(...Object.values(subidos));
    throw error;
  }

  return subidos;
}

/** Extrae bucket y ruta de una URL pública de Supabase Storage. */
function ubicacionDesdeUrl(url) {
  if (!url || typeof url !== 'string') return null;

  const indice = url.indexOf(PUBLIC_URL_MARKER);
  if (indice === -1) return null;

  const resto = url.slice(indice + PUBLIC_URL_MARKER.length);
  const separador = resto.indexOf('/');
  if (separador <= 0) return null;

  const bucket = resto.slice(0, separador);
  const ruta = decodeURIComponent(resto.slice(separador + 1).split('?')[0]);

  return ruta ? { bucket, ruta } : null;
}

/** Borra un archivo del Storage. Nunca lanza: el borrado es best-effort. */
export async function eliminarArchivo(url) {
  const ubicacion = ubicacionDesdeUrl(url);
  if (!ubicacion) return;

  const { error } = await supabase.storage.from(ubicacion.bucket).remove([ubicacion.ruta]);
  if (error) console.error('[storage] No se pudo borrar el archivo:', ubicacion.ruta, error.message);
}

/** Borra varios archivos ignorando los valores nulos. */
export async function eliminarArchivos(...urls) {
  await Promise.all(urls.map((url) => eliminarArchivo(url)));
}
