/**
 * Comprueba que la conexión con Supabase esté completa.
 * Uso: npm run check
 *
 * Revisa, en orden: variables de entorno, tabla `resources`, buckets de
 * Storage y la función get_statistics(). Cada fallo dice cómo arreglarlo.
 */
import ConfigError from '../utils/ConfigError.js';

// Import dinámico: el módulo valida las variables al cargarse y así se muestran
// las instrucciones en lugar de un stack trace.
let supabase;
let BUCKET_IMAGES;
let BUCKET_PDF;
let SUPABASE_URL;
let TABLE_RESOURCES;

try {
  ({
    default: supabase,
    BUCKET_IMAGES,
    BUCKET_PDF,
    SUPABASE_URL,
    TABLE_RESOURCES,
  } = await import('../database/supabase.js'));
} catch (error) {
  if (!(error instanceof ConfigError)) throw error;
  error.imprimir();
  process.exit(1);
}

const ok = (msg) => console.log(`  ✅ ${msg}`);
const fail = (msg, arregla) => {
  console.log(`  ❌ ${msg}`);
  if (arregla) console.log(`     → ${arregla}`);
  return false;
};

/** Un proyecto pausado o una URL con typo fallan aquí, no en la consulta. */
async function revisarConexion() {
  console.log('\n1. Conexión con el proyecto');

  const { error } = await supabase.from(TABLE_RESOURCES).select('id').limit(1);

  if (!error) {
    ok(`Conectado a ${SUPABASE_URL}`);
    return true;
  }

  // PGRST205: la API respondió, pero no encuentra la tabla -> la llave sirve.
  if (error.code === 'PGRST205' || /find the table/i.test(error.message ?? '')) {
    ok(`Conectado a ${SUPABASE_URL} (la llave es válida)`);
    return true;
  }

  if (/Invalid API key|JWT|401|apikey/i.test(error.message ?? '')) {
    return fail(
      `La llave fue rechazada: ${error.message}`,
      'Copia de nuevo SUPABASE_SECRET_KEY desde Settings > API Keys > Secret keys',
    );
  }

  if (/fetch failed|ENOTFOUND|EAI_AGAIN/i.test(`${error.message} ${error.details ?? ''}`)) {
    return fail(
      `No se pudo alcanzar ${SUPABASE_URL}`,
      'Revisa que SUPABASE_URL sea correcta y que el proyecto no esté pausado',
    );
  }

  return fail(`Error inesperado: ${error.message}`);
}

async function revisarTabla() {
  console.log('\n2. Tabla resources');

  const { count, error } = await supabase
    .from(TABLE_RESOURCES)
    .select('*', { count: 'exact', head: true });

  if (error) {
    return fail(
      `No se encontró la tabla "${TABLE_RESOURCES}": ${error.message}`,
      'Ejecuta supabase/schema.sql en el SQL Editor de Supabase',
    );
  }

  ok(`Existe y tiene ${count} ${count === 1 ? 'recurso' : 'recursos'}`);
  return true;
}

async function revisarBuckets() {
  console.log('\n3. Buckets de Storage');

  const { data, error } = await supabase.storage.listBuckets();

  if (error) {
    return fail(
      `No se pudieron listar los buckets: ${error.message}`,
      'Verifica que SUPABASE_SECRET_KEY sea la llave secreta (no la publishable)',
    );
  }

  const nombres = new Set((data ?? []).map((b) => b.name));
  let todo = true;

  for (const bucket of [BUCKET_PDF, BUCKET_IMAGES]) {
    if (nombres.has(bucket)) {
      ok(`"${bucket}" existe`);
    } else {
      todo = fail(
        `Falta el bucket "${bucket}"`,
        'Ejecuta la sección 5 de supabase/schema.sql',
      );
    }
  }

  return todo;
}

async function revisarEstadisticas() {
  console.log('\n4. Función get_statistics()');

  const { data, error } = await supabase.rpc('get_statistics');

  if (error) {
    return fail(
      `No se pudo llamar: ${error.message}`,
      'Ejecuta la sección 6 de supabase/schema.sql',
    );
  }

  if (!data?.resumen) {
    return fail('Respondió, pero sin el campo "resumen"');
  }

  ok(`Responde correctamente (${data.resumen.totalRecursos} recursos en total)`);
  return true;
}

console.log('Verificando la configuración de Supabase…');

const conectado = await revisarConexion();

const resultados = conectado
  ? [true, await revisarTabla(), await revisarBuckets(), await revisarEstadisticas()]
  : [false];

if (resultados.every(Boolean)) {
  console.log('\n🎉 Todo listo. Ya puedes ejecutar: npm run dev\n');
} else {
  console.log('\n⚠️  Corrige lo marcado con ❌ y vuelve a ejecutar: npm run check\n');
  process.exitCode = 1;
}
