import supabase, { TABLE_RESOURCES } from '../database/supabase.js';
import ApiError from '../utils/ApiError.js';
import { eliminarArchivos, subirArchivosDeRecurso } from '../utils/storage.js';
import { parseId, validateResource } from '../utils/validation.js';

const SORTABLE = new Set(['fecha', 'nombre']);
const MAX_LIMIT = 100;
const CAMPOS = [
  'nombre',
  'participante',
  'tipo',
  'categoria',
  'idioma',
  'enlace',
  'archivo',
  'imagen',
  'descubrimiento',
  'contribucion',
  'recomendacion',
];

const tabla = () => supabase.from(TABLE_RESOURCES);

/** Convierte un error de Supabase en un 500 con mensaje claro en el log. */
function verificar(error, contexto) {
  if (!error) return;
  console.error(`[supabase] ${contexto}:`, error);
  throw new Error(`Error de base de datos al ${contexto}.`);
}

/** Los paréntesis, comas y comillas rompen la sintaxis del filtro `or`. */
function limpiarBusqueda(valor) {
  return String(valor).trim().replace(/[,()"\\]/g, ' ').trim();
}

async function buscarPorId(id) {
  const { data, error } = await tabla().select('*').eq('id', id).maybeSingle();
  verificar(error, 'consultar el recurso');
  return data;
}

/** GET /api/resources — listado con búsqueda, filtros, orden y paginación. */
export async function listResources(req, res) {
  const { search = '', categoria = '', tipo = '', sort = 'fecha', order = 'desc' } = req.query;

  const limitRaw = Number(req.query.limit);
  const offsetRaw = Number(req.query.offset);
  const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(Math.floor(limitRaw), MAX_LIMIT) : MAX_LIMIT;
  const offset = Number.isFinite(offsetRaw) && offsetRaw > 0 ? Math.floor(offsetRaw) : 0;

  const orderBy = SORTABLE.has(sort) ? sort : 'fecha';
  const ascending = String(order).toLowerCase() === 'asc';

  let consulta = tabla().select('*', { count: 'exact' });

  const term = limpiarBusqueda(search);
  if (term) {
    const patron = `%${term}%`;
    consulta = consulta.or(
      `nombre.ilike.${patron},participante.ilike.${patron},categoria.ilike.${patron}`,
    );
  }
  if (String(categoria).trim()) consulta = consulta.eq('categoria', String(categoria).trim());
  if (String(tipo).trim()) consulta = consulta.eq('tipo', String(tipo).trim());

  const { data, count, error } = await consulta
    .order(orderBy, { ascending })
    .order('id', { ascending: false })
    .range(offset, offset + limit - 1);

  verificar(error, 'listar los recursos');

  res.json({ data: data ?? [], total: count ?? 0, limit, offset });
}

/** GET /api/resources/:id */
export async function getResource(req, res) {
  const id = parseId(req.params.id);
  if (!id) throw ApiError.badRequest('Identificador no válido.');

  const resource = await buscarPorId(id);
  if (!resource) throw ApiError.notFound();

  res.json(resource);
}

/** POST /api/resources */
export async function createResource(req, res) {
  const { errors, data } = validateResource(req.body);

  if (Object.keys(errors).length) {
    throw ApiError.badRequest('Revisa los campos marcados.', errors);
  }

  const { archivo, imagen } = await subirArchivosDeRecurso(req.files);

  // `fecha` la pone Postgres con su valor por omisión (now()).
  const { data: creado, error } = await tabla()
    .insert({ ...data, archivo, imagen })
    .select()
    .single();

  if (error) {
    await eliminarArchivos(archivo, imagen);
    verificar(error, 'guardar el recurso');
  }

  res.status(201).json(creado);
}

/** PUT /api/resources/:id — reemplaza archivos solo si se envían nuevos. */
export async function updateResource(req, res) {
  const id = parseId(req.params.id);
  if (!id) throw ApiError.badRequest('Identificador no válido.');

  const current = await buscarPorId(id);
  if (!current) throw ApiError.notFound();

  const { errors, data } = validateResource(req.body, { partial: true });
  if (Object.keys(errors).length) {
    throw ApiError.badRequest('Revisa los campos marcados.', errors);
  }

  const { archivo: nuevoArchivo, imagen: nuevaImagen } = await subirArchivosDeRecurso(req.files);

  // Permite quitar un archivo existente enviando el campo con valor vacío.
  const quitarArchivo = req.body.archivo === '' && !nuevoArchivo;
  const quitarImagen = req.body.imagen === '' && !nuevaImagen;

  const merged = {
    ...current,
    ...data,
    archivo: nuevoArchivo ?? (quitarArchivo ? null : current.archivo),
    imagen: nuevaImagen ?? (quitarImagen ? null : current.imagen),
  };

  const payload = Object.fromEntries(CAMPOS.map((campo) => [campo, merged[campo]]));

  const { data: actualizado, error } = await tabla().update(payload).eq('id', id).select().single();

  if (error) {
    await eliminarArchivos(nuevoArchivo, nuevaImagen);
    verificar(error, 'actualizar el recurso');
  }

  // Los archivos reemplazados o quitados ya no le sirven a nadie.
  const huerfanos = [];
  if (current.archivo && current.archivo !== merged.archivo) huerfanos.push(current.archivo);
  if (current.imagen && current.imagen !== merged.imagen) huerfanos.push(current.imagen);
  await eliminarArchivos(...huerfanos);

  res.json(actualizado);
}

/** DELETE /api/resources/:id */
export async function deleteResource(req, res) {
  const id = parseId(req.params.id);
  if (!id) throw ApiError.badRequest('Identificador no válido.');

  const current = await buscarPorId(id);
  if (!current) throw ApiError.notFound();

  const { error } = await tabla().delete().eq('id', id);
  verificar(error, 'eliminar el recurso');

  await eliminarArchivos(current.archivo, current.imagen);

  res.json({ message: 'Recurso eliminado correctamente.', id });
}
