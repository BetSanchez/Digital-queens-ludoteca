import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ChartCard, { ChartEmpty, ChartTooltip } from './ChartCard';
import useMediaQuery from '../../hooks/useMediaQuery';
import { COLOR_SERIE, CONSULTA_MOVIL, EJE, acortar } from '../../utils/charts';

/**
 * Una sola serie (número de recursos), por lo que todas las barras comparten
 * color: el color no codifica información y variarlo sería ruido.
 */
export default function CategoriasBarChart({ datos }) {
  const compacto = useMediaQuery(CONSULTA_MOVIL);

  return (
    <ChartCard
      titulo="Recursos por categoría"
      descripcion="Cuántos recursos se han compartido en cada área de conocimiento."
    >
      {datos.length === 0 ? (
        <ChartEmpty />
      ) : (
        <div className="h-72 w-full sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={datos}
              margin={{ top: 16, right: 8, bottom: 8, left: compacto ? -26 : -18 }}
              barCategoryGap="22%"
            >
              <CartesianGrid stroke={EJE.grid} vertical={false} />
              <XAxis
                dataKey="name"
                tickFormatter={(v) => acortar(v, compacto ? 8 : 12)}
                tick={compacto ? EJE.tickCompacto : EJE.tick}
                tickLine={false}
                axisLine={{ stroke: EJE.linea }}
                interval={0}
                angle={compacto ? -45 : -28}
                textAnchor="end"
                height={compacto ? 76 : 68}
              />
              <YAxis
                allowDecimals={false}
                tick={compacto ? EJE.tickCompacto : EJE.tick}
                tickLine={false}
                axisLine={false}
                width={compacto ? 34 : 44}
              />
              <Tooltip
                cursor={{ fill: 'rgba(120, 51, 166, 0.06)' }}
                content={<ChartTooltip color={COLOR_SERIE} />}
              />
              <Bar dataKey="total" fill={COLOR_SERIE} radius={[4, 4, 0, 0]} maxBarSize={48}>
                <LabelList
                  dataKey="total"
                  position="top"
                  className="fill-plum-900"
                  style={{ fontSize: 12, fontWeight: 700 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}
