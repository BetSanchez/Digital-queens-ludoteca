import { useEffect, useState } from 'react';
import { getOptions } from '../services/api';

/** Catálogos de tipos, categorías e idiomas. Se piden una sola vez por sesión. */
const RESPALDO = { tipos: [], categorias: [], idiomas: [] };

let cache = null;

export default function useOptions() {
  const [opciones, setOpciones] = useState(cache ?? RESPALDO);
  const [cargando, setCargando] = useState(!cache);

  useEffect(() => {
    if (cache) return undefined;

    const controlador = new AbortController();

    getOptions(controlador.signal)
      .then((datos) => {
        cache = datos;
        setOpciones(datos);
      })
      .catch(() => setOpciones(RESPALDO))
      .finally(() => setCargando(false));

    return () => controlador.abort();
  }, []);

  return { ...opciones, cargando };
}
