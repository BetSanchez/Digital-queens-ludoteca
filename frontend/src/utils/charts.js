/**
 * Parámetros compartidos por todas las gráficas.
 *
 * La paleta categórica se usa únicamente donde el color identifica una
 * entidad distinta (gráfica de pastel). Las gráficas de una sola serie
 * (barras, línea) usan un solo color de marca: el color no aporta
 * información adicional y repetir tonos por barra sería ruido visual.
 */

export const COLOR_SERIE = '#7833a6';
export const COLOR_SERIE_ALT = '#64278c';

/** Paleta categórica validada (ΔE CVD ≥ 8 entre pares adyacentes, sobre fondo blanco). */
export const PALETA_CATEGORICA = [
  '#7833a6',
  '#eb6834',
  '#1baf7a',
  '#eda100',
  '#e87ba4',
  '#008300',
  '#2a78d6',
  '#e34948',
];

export const MAX_CATEGORIAS_PASTEL = PALETA_CATEGORICA.length;

export const EJE = {
  tick: { fill: '#6b6472', fontSize: 12 },
  tickCompacto: { fill: '#6b6472', fontSize: 10 },
  linea: '#e3d3ee',
  grid: '#f2eaf7',
};

/** Ancho a partir del cual las gráficas caben con sus medidas completas. */
export const CONSULTA_MOVIL = '(max-width: 639px)';

/** Agrupa la cola de una distribución en "Otros" para no exceder la paleta. */
export function agruparCola(datos, maximo = MAX_CATEGORIAS_PASTEL) {
  if (datos.length <= maximo) return datos;

  const principales = datos.slice(0, maximo - 1);
  const resto = datos.slice(maximo - 1);
  const total = resto.reduce((suma, item) => suma + item.total, 0);

  return [...principales, { name: `Otros (${resto.length})`, total }];
}

/** Recorta etiquetas largas en los ejes sin perder el dato completo del tooltip. */
export function acortar(texto, maximo = 18) {
  const valor = String(texto ?? '');
  return valor.length > maximo ? `${valor.slice(0, maximo - 1)}…` : valor;
}
