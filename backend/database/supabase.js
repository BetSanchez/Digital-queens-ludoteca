import { createClient } from '@supabase/supabase-js';
import ConfigError from '../utils/ConfigError.js';

const AYUDA =
  '   Abre backend/.env (cópialo de backend/.env.example) y completa:\n' +
  '     SUPABASE_URL         -> botón "Connect" del panel > Project URL\n' +
  '     SUPABASE_SECRET_KEY  -> Settings > API Keys > Secret keys\n' +
  '                             (o la llave "service_role" si tu proyecto usa las antiguas)\n' +
  '   En un hosting (Vercel, Render…) el .env no se sube: define esas dos\n' +
  '   variables en la configuración del proyecto y vuelve a desplegar.\n';

function abortar(mensaje, detalle = AYUDA) {
  throw new ConfigError(mensaje, detalle);
}

/**
 * El diálogo "Connect" de Supabase entrega los nombres de variable del
 * framework que elijas (NEXT_PUBLIC_…, VITE_…). Si detectamos uno de esos,
 * decimos cuál renombrar en lugar de un genérico "falta la variable".
 */
function pistaDeVariableMalNombrada() {
  const alias = Object.keys(process.env).filter(
    (nombre) => /SUPABASE/.test(nombre) && !nombre.startsWith('SUPABASE_'),
  );

  if (!alias.length) return AYUDA;

  return (
    `   Encontré ${alias.length === 1 ? 'esta variable' : 'estas variables'} en backend/.env:\n` +
    alias.map((nombre) => `     ${nombre}\n`).join('') +
    '\n   Este backend no usa los prefijos de Next.js ni de Vite. Renómbrala:\n' +
    '     ...SUPABASE_URL          ->  SUPABASE_URL\n' +
    '     ...SUPABASE_ANON_KEY     ->  no se usa (es la llave pública, bórrala)\n' +
    '     SUPABASE_SECRET_KEY      ->  Settings > API Keys > Secret keys\n'
  );
}

/** Tolera el error más común: pegar la URL sin "https://" o con "/" al final. */
function normalizarUrl(valor) {
  const limpio = valor.trim().replace(/\/+$/, '');

  if (/^postgres(ql)?:\/\//i.test(limpio)) {
    abortar(
      'SUPABASE_URL tiene la cadena de conexión de Postgres, no la URL del API.',
      '   Necesitas la que aparece como "Project URL" en el botón "Connect",\n' +
        '   con esta forma: https://<id-del-proyecto>.supabase.co\n',
    );
  }

  if (!/^https?:\/\//i.test(limpio)) {
    console.warn(`⚠️  SUPABASE_URL no traía "https://"; se usará https://${limpio}`);
    return `https://${limpio}`;
  }

  return limpio;
}

/**
 * Avisa si la llave es de las públicas. Con esa llave las lecturas
 * funcionarían pero cualquier alta o borrado fallaría por las políticas RLS,
 * y el error sería difícil de rastrear.
 */
function verificarEsSecreta(llave) {
  if (llave.startsWith('sb_publishable_')) {
    abortar(
      'La llave configurada es la "publishable" (pública), no la secreta.',
      '   Ve a Settings > API Keys > sección "Secret keys" y copia la que\n' +
        '   empieza con sb_secret_. Con la pública no se puede escribir.\n',
    );
  }

  // Las llaves antiguas son JWT y llevan el rol dentro del payload.
  const partes = llave.split('.');
  if (partes.length !== 3) return;

  try {
    const { role } = JSON.parse(Buffer.from(partes[1], 'base64url').toString('utf8'));
    if (role && role !== 'service_role') {
      abortar(
        `La llave configurada es la de rol "${role}", no la de service_role.`,
        '   Ve a Settings > API Keys > pestaña "Legacy API Keys" y copia la\n' +
          '   llave "service_role". Con la anon no se puede escribir.\n',
      );
    }
  } catch {
    // Si no se puede leer el payload, dejamos que Supabase valide la llave.
  }
}

const urlCruda = process.env.SUPABASE_URL?.trim();

// Supabase está renombrando sus llaves: la nueva "secret key" (sb_secret_...)
// sustituye a la antigua "service_role". Aceptamos las dos para que funcione
// sin importar cuál te muestre el panel.
const llaveCruda = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)?.trim();

if (!urlCruda || !llaveCruda) {
  abortar('Faltan variables de entorno de Supabase.', pistaDeVariableMalNombrada());
}

export const SUPABASE_URL = normalizarUrl(urlCruda);
export const SUPABASE_SECRET_KEY = llaveCruda;

verificarEsSecreta(SUPABASE_SECRET_KEY);

export const BUCKET_PDF = process.env.SUPABASE_BUCKET_PDF || 'recursos-pdf';
export const BUCKET_IMAGES = process.env.SUPABASE_BUCKET_IMAGES || 'recursos-imagenes';

export const TABLE_RESOURCES = 'resources';

/**
 * Cliente con la llave secreta: ignora RLS, así que solo debe vivir
 * en el servidor. Nunca expongas esta llave al navegador.
 */
const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export default supabase;
