import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express from 'express';
import apiRoutes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import './database/supabase.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Sin CORS_ORIGIN se acepta cualquier origen. Defínela (una o varias URLs
// separadas por comas) para limitar quién puede llamar al API.
const origenes = process.env.CORS_ORIGIN?.split(',')
  .map((valor) => valor.trim().replace(/\/+$/, ''))
  .filter(Boolean);

app.use(cors(origenes?.length ? { origin: origenes } : undefined));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

// Sirve el build del frontend cuando existe (despliegue en un solo proceso).
const frontendDist = path.resolve(__dirname, '..', 'frontend', 'dist');
const indexHtml = path.join(frontendDist, 'index.html');

app.use(express.static(frontendDist));
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api')) return next();
  if (!fs.existsSync(indexHtml)) return next();
  return res.sendFile(indexHtml);
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
