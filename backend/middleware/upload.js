import path from 'node:path';
import multer from 'multer';
import ApiError from '../utils/ApiError.js';

const IMAGE_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();

  if (file.fieldname === 'archivo' || file.fieldname === 'archivo2') {
    if (file.mimetype === 'application/pdf' && ext === '.pdf') return cb(null, true);
    return cb(
      ApiError.badRequest('Archivo no válido.', {
        [file.fieldname]: 'Solo se permiten archivos PDF.',
      }),
    );
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

// Los archivos se mantienen en memoria y se envían a Supabase Storage solo
// cuando la validación del recurso pasa, así no queda basura en el disco.
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE, files: 3, fields: 25 },
});

export const uploadResourceFiles = upload.fields([
  { name: 'archivo', maxCount: 1 },
  { name: 'archivo2', maxCount: 1 },
  { name: 'imagen', maxCount: 1 },
]);
