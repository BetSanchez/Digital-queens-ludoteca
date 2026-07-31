/**
 * Cliente HTTP de la API. Centraliza la URL base, el parseo de respuestas
 * y la conversión de errores para que las páginas solo manejen datos.
 */
const API_URL = import.meta.env.VITE_API_URL ?? '/api';

export class ApiError extends Error {
  constructor(message, { status = 0, errors = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

async function request(path, { method = 'GET', body, signal } = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, { method, body, signal });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError('No se pudo conectar con el servidor. Verifica que la API esté en ejecución.');
  }

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    throw new ApiError(payload?.message ?? 'Ocurrió un error al procesar la solicitud.', {
      status: response.status,
      errors: payload?.errors ?? null,
    });
  }

  return payload;
}

function toQueryString(params = {}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') query.set(key, value);
  }
  const string = query.toString();
  return string ? `?${string}` : '';
}

export const getResources = (params, signal) =>
  request(`/resources${toQueryString(params)}`, { signal });

export const getResource = (id, signal) => request(`/resources/${id}`, { signal });

export const createResource = (formData) => request('/resources', { method: 'POST', body: formData });

export const updateResource = (id, formData) =>
  request(`/resources/${id}`, { method: 'PUT', body: formData });

export const deleteResource = (id) => request(`/resources/${id}`, { method: 'DELETE' });

export const getStatistics = (signal) => request('/statistics', { signal });

export const getOptions = (signal) => request('/options', { signal });
