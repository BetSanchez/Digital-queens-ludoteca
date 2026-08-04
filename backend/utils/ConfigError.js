/**
 * Falta o está mal una variable de entorno. Se lanza al cargar los módulos,
 * antes de que exista un servidor: quien arranca la app decide si imprimir la
 * ayuda y salir (local) o responder el error por HTTP (serverless).
 */
export default class ConfigError extends Error {
  constructor(message, detalle = '') {
    super(message);
    this.name = 'ConfigError';
    this.detalle = detalle;
  }

  imprimir() {
    console.error(`\n❌ ${this.message}\n${this.detalle}`);
  }
}
