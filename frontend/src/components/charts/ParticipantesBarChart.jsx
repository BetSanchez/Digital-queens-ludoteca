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
import { COLOR_SERIE_ALT, EJE, acortar } from '../../utils/charts';

/** Barras horizontales: las etiquetas son nombres largos y se leen mejor así. */
export default function ParticipantesBarChart({ datos }) {
  const altura = Math.max(240, datos.length * 42 + 40);

  return (
    <ChartCard
      titulo="Participantes con más recursos compartidos"
      descripcion="Las diez participantes que más han aportado a la ludoteca."
    >
      {datos.length === 0 ? (
        <ChartEmpty />
      ) : (
        <div className="w-full" style={{ height: altura }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={datos}
              layout="vertical"
              margin={{ top: 4, right: 32, bottom: 4, left: 8 }}
              barCategoryGap="24%"
            >
              <CartesianGrid stroke={EJE.grid} horizontal={false} />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={EJE.tick}
                tickLine={false}
                axisLine={{ stroke: EJE.linea }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={EJE.tick}
                tickLine={false}
                axisLine={false}
                width={132}
                tickFormatter={(v) => acortar(v, 16)}
              />
              <Tooltip
                cursor={{ fill: 'rgba(100, 39, 140, 0.06)' }}
                content={<ChartTooltip color={COLOR_SERIE_ALT} />}
              />
              <Bar dataKey="total" fill={COLOR_SERIE_ALT} radius={[0, 4, 4, 0]} maxBarSize={26}>
                <LabelList
                  dataKey="total"
                  position="right"
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
