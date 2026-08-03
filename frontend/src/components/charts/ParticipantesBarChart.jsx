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
import { COLOR_SERIE_ALT, CONSULTA_MOVIL, EJE, acortar } from '../../utils/charts';

/** Barras horizontales: las etiquetas son nombres largos y se leen mejor así. */
export default function ParticipantesBarChart({ datos }) {
  const compacto = useMediaQuery(CONSULTA_MOVIL);
  const altura = Math.max(240, datos.length * (compacto ? 36 : 42) + 40);

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
              margin={{ top: 4, right: compacto ? 20 : 32, bottom: 4, left: compacto ? 0 : 8 }}
              barCategoryGap="24%"
            >
              <CartesianGrid stroke={EJE.grid} horizontal={false} />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={compacto ? EJE.tickCompacto : EJE.tick}
                tickLine={false}
                axisLine={{ stroke: EJE.linea }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={compacto ? EJE.tickCompacto : EJE.tick}
                tickLine={false}
                axisLine={false}
                width={compacto ? 84 : 132}
                tickFormatter={(v) => acortar(v, compacto ? 11 : 16)}
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
