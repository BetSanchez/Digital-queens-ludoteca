import { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import ChartCard, { ChartEmpty, ChartTooltip } from './ChartCard';
import { PALETA_CATEGORICA, agruparCola } from '../../utils/charts';

/**
 * Aquí el color sí identifica una entidad (cada tipo de recurso), por lo que
 * usa la paleta categórica. La cola se agrupa en "Otros" para no exceder los
 * 8 tonos validados.
 */
export default function TiposPieChart({ datos }) {
  const series = useMemo(() => agruparCola(datos), [datos]);
  const total = useMemo(() => series.reduce((suma, d) => suma + d.total, 0), [series]);

  return (
    <ChartCard
      titulo="Distribución por tipo de recurso"
      descripcion="Qué formatos comparte con más frecuencia la comunidad."
    >
      {series.length === 0 ? (
        <ChartEmpty />
      ) : (
        <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-center">
          <div className="h-64 w-full lg:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={series}
                  dataKey="total"
                  nameKey="name"
                  innerRadius="52%"
                  outerRadius="86%"
                  paddingAngle={2}
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {series.map((item, indice) => (
                    <Cell key={item.name} fill={PALETA_CATEGORICA[indice % PALETA_CATEGORICA.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* La leyenda lleva el valor y el porcentaje: la identidad nunca
              depende solo del color. */}
          <ul className="w-full space-y-1.5 lg:w-1/2">
            {series.map((item, indice) => (
              <li key={item.name} className="flex items-center gap-2.5 text-sm">
                <span
                  className="h-3 w-3 shrink-0 rounded-sm"
                  style={{ background: PALETA_CATEGORICA[indice % PALETA_CATEGORICA.length] }}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1 truncate text-plum-900">{item.name}</span>
                <span className="font-bold tabular-nums text-plum-900">{item.total}</span>
                <span className="w-12 text-right tabular-nums text-muted">
                  {total ? `${Math.round((item.total / total) * 100)}%` : '0%'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ChartCard>
  );
}
