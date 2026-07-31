import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const UPLOADS_ROOT = path.resolve(__dirname, '..', 'uploads');

export function ensureUploadDirs() {
  for (const sub of ['pdf', 'images']) {
    fs.mkdirSync(path.join(UPLOADS_ROOT, sub), { recursive: true });
  }
}

/** Convierte una ruta pública (/uploads/pdf/x.pdf) en ruta absoluta segura. */
function toAbsolute(publicPath) {
  if (!publicPath || typeof publicPath !== 'string') return null;
  const relative = publicPath.replace(/^\/?uploads\//, '');
  const absolute = path.resolve(UPLOADS_ROOT, relative);
  // Evita salir de la carpeta uploads mediante rutas manipuladas.
  return absolute.startsWith(UPLOADS_ROOT) ? absolute : null;
}

/** Elimina un archivo subido. Nunca lanza: el borrado es best-effort. */
export function removeUpload(publicPath) {
  const absolute = toAbsolute(publicPath);
  if (!absolute) return;
  fs.promises.unlink(absolute).catch(() => {});
}

/** Limpia los archivos recién subidos cuando la petición termina en error. */
export function removeUploadedFiles(files) {
  if (!files) return;
  for (const list of Object.values(files)) {
    for (const file of list) {
      fs.promises.unlink(file.path).catch(() => {});
    }
  }
}

export function publicPathFor(file) {
  const folder = path.basename(path.dirname(file.path));
  return `/uploads/${folder}/${file.filename}`;
}
