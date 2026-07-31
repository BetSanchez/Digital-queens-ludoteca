import { useEffect, useState } from 'react';

/** Retrasa la propagación de un valor para no consultar la API en cada tecla. */
export default function useDebounce(valor, retraso = 350) {
  const [diferido, setDiferido] = useState(valor);

  useEffect(() => {
    const temporizador = setTimeout(() => setDiferido(valor), retraso);
    return () => clearTimeout(temporizador);
  }, [valor, retraso]);

  return diferido;
}
