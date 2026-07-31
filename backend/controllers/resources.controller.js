import db from '../database/db.js';
import ApiError from '../utils/ApiError.js';
import { publicPathFor, removeUpload, removeUploadedFiles } from '../utils/files.js';
import { parseId, validateResource } from '../utils/validation.js';

const SORTABLE = { fecha: 'fecha', nombre: 'nombre COLLATE NOCASE' };
const MAX_LIMIT = 100;

const selectById = db.prepare('SELECT * FROM resources WHERE id = ?');

/** GET /api/resources — listado con búsqueda, filtros, orden y paginación. */
export function listResources(req, res) {
  const { search = '', categoria = '', tipo = '', sort = 'fecha', order = 'desc' } = req.query;

  const limitRaw = Number(req.query.limit);
  const offsetRaw = Number(req.query.offset);
  const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, MAX_LIMIT) : MAX_LIMIT;
  const offset = Number.isFinite(offsetRaw) && offsetRaw > 0 ? Math.floor(offsetRaw) : 0;

  const orderBy = SORTABLE[sort] ?? SORTABLE.fecha;
  const direction = String(order).toLowerCase() === 'asc' ? 'ASC' : 'DESC';

  const where = [];
  const params = {};

  const term = String(search).trim();
  if (term) {
    where.push('(nombre LIKE :term OR participante LIKE :term OR categoria LIKE :term)');
    params.term = `%${term}%`;
  }
  if (String(categoria).trim()) {
    where.push('categoria = :categoria');
    params.categoria = String(categoria).trim();
  }
  if (String(tipo).trim()) {
    where.push('tipo = :tipo');
    params.tipo = String(tipo).trim();
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const { total } = db.prepare(`SELECT COUNT(*) AS total FROM resources ${whereSql}`).get(params);
  const data = db
    .prepare(
      `SELECT * FROM resources ${whereSql} ORDER BY ${orderBy} ${direction}, id DESC LIMIT :limit OFFSET :offset`,
    )
    .all({ ...params, limit, offset });

  res.json({ data, total, limit, offset });
}

/** GET /api/resources/:id */
export function getResource(req, res) {
  const id = parseId(req.params.id);
  if (!id) throw ApiError.badRequest('Identificador no válido.');

  const resource = selectById.get(id);
  if (!resource) throw ApiError.notFound();

  res.json(resource);
}

/** POST /api/resources */
export function createResource(req, res) {
  const { errors, data } = validateResource(req.body);

  if (Object.keys(errors).length) {
    removeUploadedFiles(req.files);
    throw ApiError.badRequest('Revisa los campos marcados.', errors);
  }

  const archivo = req.files?.archivo?.[0] ? publicPathFor(req.files.archivo[0]) : null;
  const imagen = req.files?.imagen?.[0] ? publicPathFor(req.files.imagen[0]) : null;

  const info = db
    .prepare(
      `INSERT INTO resources
         (nombre, participante, tipo, categoria, idioma, enlace, archivo, imagen,
          descubrimiento, contribucion, recomendacion, fecha)
       VALUES
         (@nombre, @participante, @tipo, @categoria, @idioma, @enlace, @archivo, @imagen,
          @descubrimiento, @contribucion, @recomendacion, datetime('now'))`,
    )
    .run({ ...data, archivo, imagen });

  res.status(201).json(selectById.get(info.lastInsertRowid));
}

/** PUT /api/resources/:id — reemplaza archivos solo si se envían nuevos. */
export function updateResource(req, res) {
  const id = parseId(req.params.id);
  if (!id) {
    removeUploadedFiles(req.files);
    throw ApiError.badRequest('Identificador no válido.');
  }

  const current = selectById.get(id);
  if (!current) {
    removeUploadedFiles(req.files);
    throw ApiError.notFound();
  }

  const { errors, data } = validateResource(req.body, { partial: true });
  if (Object.keys(errors).length) {
    removeUploadedFiles(req.files);
    throw ApiError.badRequest('Revisa los campos marcados.', errors);
  }

  const nuevoArchivo = req.files?.archivo?.[0] ? publicPathFor(req.files.archivo[0]) : null;
  const nuevaImagen = req.files?.imagen?.[0] ? publicPathFor(req.files.imagen[0]) : null;

  // Permite quitar un archivo existente enviando el campo con valor vacío.
  const quitarArchivo = req.body.archivo === '' && !nuevoArchivo;
  const quitarImagen = req.body.imagen === '' && !nuevaImagen;

  const merged = {
    ...current,
    ...data,
    archivo: nuevoArchivo ?? (quitarArchivo ? null : current.archivo),
    imagen: nuevaImagen ?? (quitarImagen ? null : current.imagen),
  };

  db.prepare(
    `UPDATE resources SET
       nombre = @nombre, participante = @participante, tipo = @tipo, categoria = @categoria,
       idioma = @idioma, enlace = @enlace, archivo = @archivo, imagen = @imagen,
       descubrimiento = @descubrimiento, contribucion = @contribucion, recomendacion = @recomendacion
     WHERE id = @id`,
  ).run({
    id,
    nombre: merged.nombre,
    participante: merged.participante,
    tipo: merged.tipo,
    categoria: merged.categoria,
    idioma: merged.idioma,
    enlace: merged.enlace,
    archivo: merged.archivo,
    imagen: merged.imagen,
    descubrimiento: merged.descubrimiento,
    contribucion: merged.contribucion,
    recomendacion: merged.recomendacion,
  });

  if (current.archivo && current.archivo !== merged.archivo) removeUpload(current.archivo);
  if (current.imagen && current.imagen !== merged.imagen) removeUpload(current.imagen);

  res.json(selectById.get(id));
}

/** DELETE /api/resources/:id */
export function deleteResource(req, res) {
  const id = parseId(req.params.id);
  if (!id) throw ApiError.badRequest('Identificador no válido.');

  const current = selectById.get(id);
  if (!current) throw ApiError.notFound();

  db.prepare('DELETE FROM resources WHERE id = ?').run(id);

  removeUpload(current.archivo);
  removeUpload(current.imagen);

  res.json({ message: 'Recurso eliminado correctamente.', id });
}
