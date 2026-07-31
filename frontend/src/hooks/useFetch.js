import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Ejecuta una función de servicio y expone {datos, cargando, error, recargar}.
 * Cancela la petición anterior cuando cambian las dependencias.
 *
 * @param {(signal: AbortSignal) => Promise<any>} peticion
 * @param {any[]} deps
 */
export default function useFetch(peticion, deps = []) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [intento, setIntento] = useState(0);

  const peticionRef = useRef(peticion);
  peticionRef.current = peticion;

  useEffect(() => {
    const controlador = new AbortController();
    let activo = true;

    setCargando(true);
    setError(null);

    peticionRef
      .current(controlador.signal)
      .then((resultado) => {
        if (activo) setDatos(resultado);
      })
      .catch((err) => {
        if (activo && err.name !== 'AbortError') setError(err);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
      controlador.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, intento]);

  const recargar = useCallback(() => setIntento((n) => n + 1), []);

  return { datos, cargando, error, recargar };
}
