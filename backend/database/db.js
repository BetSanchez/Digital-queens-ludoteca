import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DB_PATH = path.join(__dirname, 'database.db');

if (!fs.existsSync(__dirname)) {
  fs.mkdirSync(__dirname, { recursive: true });
}

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

/**
 * Crea la tabla `resources` y los índices utilizados por los filtros
 * y por el cálculo de estadísticas.
 */
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS resources (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre         TEXT NOT NULL,
      participante   TEXT NOT NULL,
      tipo           TEXT NOT NULL,
      categoria      TEXT NOT NULL,
      idioma         TEXT,
      enlace         TEXT,
      archivo        TEXT,
      imagen         TEXT,
      descubrimiento TEXT NOT NULL,
      contribucion   TEXT NOT NULL,
      recomendacion  TEXT NOT NULL,
      fecha          TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_resources_categoria    ON resources (categoria);
    CREATE INDEX IF NOT EXISTS idx_resources_tipo         ON resources (tipo);
    CREATE INDEX IF NOT EXISTS idx_resources_participante ON resources (participante);
    CREATE INDEX IF NOT EXISTS idx_resources_fecha        ON resources (fecha DESC);
  `);

  return db;
}

// Se inicializa al importar para que los controladores puedan preparar
// sus consultas sin depender del orden de arranque.
initDatabase();

export default db;
