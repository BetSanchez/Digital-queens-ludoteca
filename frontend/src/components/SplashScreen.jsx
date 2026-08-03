import { useEffect, useState } from 'react';

const LOGO_SRC = '/logo/logoDC.jpeg';
const LOGO_PROGRAMA = '/logo/mujer-digital-blanco.png';
const DURACION_SALIDA = 620;

/** Coronas decorativas repartidas por toda la pantalla de bienvenida. */
const CORONAS = [
  { top: '4%', left: '3%', size: 32, delay: '0s', duration: '4.2s', opacity: 0.44 },
  { top: '5%', left: '22%', size: 18, delay: '0.4s', duration: '5s', opacity: 0.28 },
  { top: '7%', left: '48%', size: 24, delay: '0.8s', duration: '4.6s', opacity: 0.34 },
  { top: '6%', left: '72%', size: 28, delay: '0.2s', duration: '5.4s', opacity: 0.38 },
  { top: '9%', left: '90%', size: 20, delay: '1s', duration: '4s', opacity: 0.3 },
  { top: '16%', left: '10%', size: 22, delay: '0.6s', duration: '5.8s', opacity: 0.32 },
  { top: '18%', left: '34%', size: 16, delay: '1.3s', duration: '4.4s', opacity: 0.24 },
  { top: '14%', left: '58%', size: 30, delay: '0.1s', duration: '5.1s', opacity: 0.4 },
  { top: '20%', left: '82%', size: 26, delay: '0.9s', duration: '4.8s', opacity: 0.36 },
  { top: '26%', left: '2%', size: 20, delay: '1.5s', duration: '5.6s', opacity: 0.28 },
  { top: '28%', left: '26%', size: 34, delay: '0.3s', duration: '4.3s', opacity: 0.42 },
  { top: '24%', left: '50%', size: 18, delay: '1.1s', duration: '6s', opacity: 0.26 },
  { top: '30%', left: '68%', size: 24, delay: '0.5s', duration: '4.7s', opacity: 0.34 },
  { top: '27%', left: '94%', size: 22, delay: '1.7s', duration: '5.2s', opacity: 0.3 },
  { top: '38%', left: '8%', size: 28, delay: '0.7s', duration: '4.1s', opacity: 0.38 },
  { top: '40%', left: '40%', size: 16, delay: '1.4s', duration: '5.5s', opacity: 0.22 },
  { top: '36%', left: '62%', size: 20, delay: '0.2s', duration: '4.9s', opacity: 0.3 },
  { top: '42%', left: '86%', size: 30, delay: '1s', duration: '4.5s', opacity: 0.4 },
  { top: '48%', left: '4%', size: 18, delay: '1.6s', duration: '5.3s', opacity: 0.26 },
  { top: '50%', left: '20%', size: 26, delay: '0.4s', duration: '4.2s', opacity: 0.36 },
  { top: '46%', left: '46%', size: 22, delay: '1.2s', duration: '5.7s', opacity: 0.28 },
  { top: '52%', left: '74%', size: 32, delay: '0.8s', duration: '4.6s', opacity: 0.4 },
  { top: '54%', left: '96%', size: 16, delay: '0.1s', duration: '5s', opacity: 0.24 },
  { top: '60%', left: '12%', size: 24, delay: '1.3s', duration: '4.4s', opacity: 0.32 },
  { top: '58%', left: '36%', size: 20, delay: '0.6s', duration: '5.4s', opacity: 0.3 },
  { top: '64%', left: '54%', size: 28, delay: '0.9s', duration: '4.1s', opacity: 0.38 },
  { top: '62%', left: '80%', size: 18, delay: '1.5s', duration: '4.8s', opacity: 0.26 },
  { top: '70%', left: '6%', size: 22, delay: '0.3s', duration: '5.1s', opacity: 0.3 },
  { top: '72%', left: '28%', size: 30, delay: '1.1s', duration: '4.3s', opacity: 0.4 },
  { top: '68%', left: '48%', size: 16, delay: '0.5s', duration: '5.6s', opacity: 0.22 },
  { top: '74%', left: '66%', size: 26, delay: '1.4s', duration: '4.7s', opacity: 0.34 },
  { top: '70%', left: '90%', size: 20, delay: '0.2s', duration: '5.2s', opacity: 0.28 },
  { top: '80%', left: '16%', size: 24, delay: '0.8s', duration: '4.5s', opacity: 0.32 },
  { top: '82%', left: '42%', size: 32, delay: '0.4s', duration: '4s', opacity: 0.4 },
  { top: '78%', left: '70%', size: 18, delay: '1.2s', duration: '5.5s', opacity: 0.26 },
  { top: '84%', left: '88%', size: 28, delay: '0.7s', duration: '4.9s', opacity: 0.36 },
  { top: '90%', left: '8%', size: 20, delay: '1s', duration: '4.2s', opacity: 0.28 },
  { top: '92%', left: '34%', size: 22, delay: '0.3s', duration: '5.3s', opacity: 0.3 },
  { top: '88%', left: '58%', size: 26, delay: '1.6s', duration: '4.6s', opacity: 0.34 },
  { top: '94%', left: '78%', size: 16, delay: '0.5s', duration: '5s', opacity: 0.24 },
];

function CoronaFlotante({ top, left, size, delay, duration, opacity }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="splash__corona"
      style={{
        top,
        left,
        width: size,
        height: size,
        '--retraso': delay,
        '--duracion': duration,
        '--opacidad': opacity,
      }}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M3.2 16.2 2 6.8l5.1 3.8L12 3.5l4.9 7.1L22 6.8l-1.2 9.4H3.2Zm.8 1.3h16v2.2H4v-2.2Z"
      />
    </svg>
  );
}

/**
 * Portada de bienvenida a pantalla completa. Se cierra con un clic, un toque
 * o cualquier tecla; el elemento raíz es un <button> para que el cierre
 * funcione también con teclado y lectores de pantalla.
 */
export default function SplashScreen({ onFinish, onExitStart }) {
  const [saliendo, setSaliendo] = useState(false);

  const cerrar = () => {
    if (saliendo) return;
    setSaliendo(true);
    onExitStart?.();
    setTimeout(onFinish, DURACION_SALIDA);
  };

  useEffect(() => {
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const alPresionarTecla = (evento) => {
      // El <button> ya responde a Enter y Espacio; aquí cubrimos el resto.
      if (evento.key !== 'Enter' && evento.key !== ' ') cerrar();
    };

    window.addEventListener('keydown', alPresionarTecla);
    return () => {
      document.body.style.overflow = overflowPrevio;
      window.removeEventListener('keydown', alPresionarTecla);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saliendo]);

  return (
    <button
      type="button"
      onClick={cerrar}
      autoFocus
      aria-label="Entrar a la Ludoteca Digital Colaborativa"
      className={`splash ${saliendo ? 'splash--saliendo' : ''}`}
    >
      {/* Ambiente: resplandores y retícula, puramente decorativos */}
      <span className="splash__ambiente" aria-hidden="true">
        <span className="splash__orbe splash__orbe--1" />
        <span className="splash__orbe splash__orbe--2" />
        <span className="splash__orbe splash__orbe--3" />
        <span className="splash__reticula" />
      </span>

      <span className="splash__coronas" aria-hidden="true">
        {CORONAS.map((corona, i) => (
          <CoronaFlotante key={i} {...corona} />
        ))}
      </span>

      <span className="splash__contenido">
        <span className="splash__logo-wrap" style={{ '--retraso': '0ms' }}>
          <span className="splash__marco">
            <img src={LOGO_SRC} alt="" className="splash__logo" width="256" height="256" />
          </span>
        </span>

        <span className="splash__programa" style={{ '--retraso': '160ms' }}>
          <span className="splash__programa-etiqueta">Programa</span>
          <img
            src={LOGO_PROGRAMA}
            alt="Mujer Digital"
            className="splash__programa-logo"
            width="821"
            height="384"
          />
        </span>

        <span className="splash__frase">
          <span className="splash__linea splash__linea--titulo" style={{ '--retraso': '280ms' }}>
            ¡Digital Queens:
          </span>
          <span className="splash__linea splash__linea--lema" style={{ '--retraso': '420ms' }}>
            Perseveramos para <em className="splash__destacado">hackear</em> nuestros límites!
          </span>
        </span>

        <span className="splash__regla" style={{ '--retraso': '560ms' }} aria-hidden="true" />

        <span className="splash__pie" style={{ '--retraso': '680ms' }}>
          Ludoteca Digital Colaborativa
        </span>

        <span className="splash__pista" style={{ '--retraso': '900ms' }}>
          <span className="splash__pista-texto">Toca en cualquier lugar para entrar</span>
          <svg viewBox="0 0 24 24" className="splash__chevron" aria-hidden="true">
            <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </span>
    </button>
  );
}
