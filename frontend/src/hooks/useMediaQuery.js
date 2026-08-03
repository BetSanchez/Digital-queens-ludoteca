import { useEffect, useState } from 'react';

/**
 * Sigue una media query de CSS desde JavaScript. Se usa donde el ajuste no
 * puede hacerse solo con clases (por ejemplo, las medidas que Recharts
 * recibe como props numéricas).
 */
export default function useMediaQuery(consulta) {
  const [coincide, setCoincide] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(consulta).matches,
  );

  useEffect(() => {
    const lista = window.matchMedia(consulta);
    const alCambiar = (evento) => setCoincide(evento.matches);

    setCoincide(lista.matches);
    lista.addEventListener('change', alCambiar);
    return () => lista.removeEventListener('change', alCambiar);
  }, [consulta]);

  return coincide;
}
