/** Error de aplicación con código HTTP y errores de validación por campo. */
export default class ApiError extends Error {
  constructor(status, message, errors = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }

  static badRequest(message, errors = null) {
    return new ApiError(400, message, errors);
  }

  static notFound(message = 'Recurso no encontrado.') {
    return new ApiError(404, message);
  }
}
