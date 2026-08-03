import supabase from '../database/supabase.js';

const MESES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

const RESUMEN_VACIO = {
  totalRecursos: 0,
  totalParticipantes: 0,
  totalCategorias: 0,
  totalConPdf: 0,
  totalConEnlace: 0,
};

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

/**
 * GET /api/statistics
 * Todas las métricas llegan en una sola llamada a la función SQL
 * `get_statistics()` definida en supabase/schema.sql.
 */
export async function getStatistics(req, res) {
  const { data, error } = await supabase.rpc('get_statistics');

  if (error) {
    console.error('[supabase] Error al calcular estadísticas:', error);
    throw new Error('Error de base de datos al calcular las estadísticas.');
  }

  res.json({
    resumen: { ...RESUMEN_VACIO, ...(data?.resumen ?? {}) },
    porCategoria: data?.porCategoria ?? [],
    porTipo: data?.porTipo ?? [],
    porMes: completarMeses(data?.porMes ?? []),
    porIdioma: data?.porIdioma ?? [],
    topParticipantes: data?.topParticipantes ?? [],
  });
}
