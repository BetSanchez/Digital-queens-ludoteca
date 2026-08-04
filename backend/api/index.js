/**
 * Entrada para Vercel. Los archivos de esta carpeta se publican como funciones
 * serverless, así que aquí solo se exporta la app: nunca se llama a listen().
 */
import cors from 'cors';
import express from 'express';
import ConfigError from '../utils/ConfigError.js';

/**
 * Si falta la configuración, la función moriría antes de responder y Vercel
 * devolvería su página de error, sin cabeceras CORS: el navegador culparía a
 * CORS y no se vería la causa real. Esta app mínima responde el motivo en JSON.
 */
function appDeError(error) {
  const app = express();
  app.use(cors());
  app.use((req, res) =>
    res.status(500).json({
      message: 'El servidor no está configurado correctamente.',
      detail: `${error.message}\n${error.detalle ?? ''}`.trim(),
    }),
  );
  return app;
}

let app;

try {
  ({ default: app } = await import('../app.js'));
} catch (error) {
  if (!(error instanceof ConfigError)) throw error;
  error.imprimir();
  app = appDeError(error);
}

export default app;
