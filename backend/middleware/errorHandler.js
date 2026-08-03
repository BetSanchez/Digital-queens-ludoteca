import multer from 'multer';
import ApiError from '../utils/ApiError.js';
import { MAX_FILE_SIZE } from './upload.js';

export function notFoundHandler(req, res) {
  res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars -- Express identifica el handler por sus 4 argumentos.
export function errorHandler(err, req, res, next) {
  // Los archivos viven en memoria hasta que se suben a Supabase, así que
  // cuando la petición falla no hay nada que limpiar en el disco.
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, errors: err.errors ?? undefined });
  }

  if (err instanceof multer.MulterError) {
    const mensajes = {
      LIMIT_FILE_SIZE: `El archivo supera el máximo permitido de ${MAX_FILE_SIZE / (1024 * 1024)} MB.`,
      LIMIT_FILE_COUNT: 'Se enviaron demasiados archivos.',
      LIMIT_UNEXPECTED_FILE: 'Campo de archivo no permitido.',
    };
    const message = mensajes[err.code] ?? 'No fue posible procesar el archivo.';
    return res.status(400).json({
      message,
      errors: err.field ? { [err.field]: message } : undefined,
    });
  }

  console.error('[error]', err);
  return res.status(500).json({ message: 'Ocurrió un error inesperado en el servidor.' });
}
