import crypto from 'node:crypto';
import path from 'node:path';
import multer from 'multer';
import ApiError from '../utils/ApiError.js';
import { UPLOADS_ROOT, ensureUploadDirs } from '../utils/files.js';

ensureUploadDirs();

const IMAGE_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const folder = file.fieldname === 'archivo' ? 'pdf' : 'images';
    cb(null, path.join(UPLOADS_ROOT, folder));
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const slug =
      path
        .basename(file.originalname, ext)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40) || 'archivo';
    cb(null, `${slug}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();

  if (file.fieldname === 'archivo') {
    if (file.mimetype === 'application/pdf' && ext === '.pdf') return cb(null, true);
    return cb(ApiError.badRequest('Archivo no válido.', { archivo: 'Solo se permiten archivos PDF.' }));
  }

  if (file.fieldname === 'imagen') {
    if (IMAGE_MIMES.has(file.mimetype) && IMAGE_EXTS.has(ext)) return cb(null, true);
    return cb(
      ApiError.badRequest('Imagen no válida.', {
        imagen: 'Solo se permiten imágenes JPG, PNG, WEBP o GIF.',
      }),
    );
  }

  return cb(ApiError.badRequest(`Campo de archivo no permitido: ${file.fieldname}.`));
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE, files: 2, fields: 25 },
});

export const uploadResourceFiles = upload.fields([
  { name: 'archivo', maxCount: 1 },
  { name: 'imagen', maxCount: 1 },
]);
