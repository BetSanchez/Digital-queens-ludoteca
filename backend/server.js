/**
 * Arranque para ejecución local o en un servidor propio (Render, Railway…).
 * En Vercel no se usa este archivo: la entrada es api/index.js.
 */
import ConfigError from './utils/ConfigError.js';

const PORT = process.env.PORT || 4000;

// Import dinámico: app.js valida las variables de Supabase al cargarse y un
// import estático mostraría un stack trace en vez de las instrucciones.
let app;

try {
  ({ default: app } = await import('./app.js'));
} catch (error) {
  if (!(error instanceof ConfigError)) throw error;
  error.imprimir();
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`✅ API de la Ludoteca Digital en http://localhost:${PORT}/api`);
  console.log('   Base de datos y archivos: Supabase');
});

export default app;
