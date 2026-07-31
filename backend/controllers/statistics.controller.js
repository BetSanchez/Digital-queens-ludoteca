import db from '../database/db.js';

const queries = {
  resumen: db.prepare(`
    SELECT
      COUNT(*)                                        AS totalRecursos,
      COUNT(DISTINCT participante COLLATE NOCASE)     AS totalParticipantes,
      COUNT(DISTINCT categoria)                       AS totalCategorias,
      SUM(CASE WHEN archivo IS NOT NULL AND archivo <> '' THEN 1 ELSE 0 END) AS totalConPdf,
      SUM(CASE WHEN enlace  IS NOT NULL AND enlace  <> '' THEN 1 ELSE 0 END) AS totalConEnlace
    FROM resources
  `),

  porCategoria: db.prepare(`
    SELECT categoria AS name, COUNT(*) AS total
    FROM resources
    GROUP BY categoria
    ORDER BY total DESC, name ASC
  `),

  porTipo: db.prepare(`
    SELECT tipo AS name, COUNT(*) AS total
    FROM resources
    GROUP BY tipo
    ORDER BY total DESC, name ASC
  `),

  porMes: db.prepare(`
    SELECT strftime('%Y-%m', fecha) AS mes, COUNT(*) AS total
    FROM resources
    GROUP BY mes
    ORDER BY mes ASC
  `),

  porIdioma: db.prepare(`
    SELECT COALESCE(NULLIF(idioma, ''), 'Sin especificar') AS name, COUNT(*) AS total
    FROM resources
    GROUP BY name
    ORDER BY total DESC, name ASC
  `),

  topParticipantes: db.prepare(`
    SELECT participante AS name, COUNT(*) AS total
    FROM resources
    GROUP BY participante COLLATE NOCASE
    ORDER BY total DESC, name ASC
    LIMIT ?
  `),
};

const MESES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

/** Rellena los meses sin registros para que la línea no tenga huecos. */
function completarMeses(filas) {
  if (!filas.length) return [];

  const totales = new Map(filas.map((f) => [f.mes, f.total]));
  const [inicioAnio, inicioMes] = filas[0].mes.split('-').map(Number);
  const [finAnio, finMes] = filas[filas.length - 1].mes.split('-').map(Number);

  const serie = [];
  let anio = inicioAnio;
  let mes = inicioMes;

  while (anio < finAnio || (anio === finAnio && mes <= finMes)) {
    const clave = `${anio}-${String(mes).padStart(2, '0')}`;
    serie.push({
      mes: clave,
      etiqueta: `${MESES[mes - 1]} ${String(anio).slice(2)}`,
      total: totales.get(clave) ?? 0,
    });
    mes += 1;
    if (mes > 12) {
      mes = 1;
      anio += 1;
    }
  }

  return serie;
}

/** GET /api/statistics */
export function getStatistics(req, res) {
  const resumen = queries.resumen.get();

  res.json({
    resumen: {
      totalRecursos: resumen.totalRecursos ?? 0,
      totalParticipantes: resumen.totalParticipantes ?? 0,
      totalCategorias: resumen.totalCategorias ?? 0,
      totalConPdf: resumen.totalConPdf ?? 0,
      totalConEnlace: resumen.totalConEnlace ?? 0,
    },
    porCategoria: queries.porCategoria.all(),
    porTipo: queries.porTipo.all(),
    porMes: completarMeses(queries.porMes.all()),
    porIdioma: queries.porIdioma.all(),
    topParticipantes: queries.topParticipantes.all(10),
  });
}
