const LOGO_SRC = '/logo/logoDC.jpeg';

/** Logo + nombre del sitio. Cambia LOGO_SRC si reemplazas el archivo por PNG/JPG. */
export default function Logo({ compacto = false, invertido = false }) {
  return (
    <span className="flex items-center gap-2.5">
      <img
        src={LOGO_SRC}
        alt="Ludoteca Digital Colaborativa"
        className="h-9 w-9 shrink-0 rounded-xl shadow-sm sm:h-10 sm:w-10"
        width="40"
        height="40"
      />
      {!compacto && (
        <span className="leading-tight">
          <span
            className={`block text-[15px] font-extrabold tracking-tight sm:text-base ${
              invertido ? 'text-white' : 'text-plum-900'
            }`}
          >
            Ludoteca Digital
          </span>
          <span
            className={`block text-[11px] font-medium uppercase tracking-[0.14em] ${
              invertido ? 'text-plum-200' : 'text-plum-600'
            }`}
          >
            Colaborativa
          </span>
        </span>
      )}
    </span>
  );
}
