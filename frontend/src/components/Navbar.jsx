import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { IconChart, IconClose, IconGrid, IconHome, IconMenu, IconPlus } from './Icons';

const ENLACES = [
  { to: '/', label: 'Inicio', icon: IconHome, end: true },
  { to: '/recursos', label: 'Explorar', icon: IconGrid },
  { to: '/agregar', label: 'Agregar', icon: IconPlus },
  { to: '/estadisticas', label: 'Estadísticas', icon: IconChart },
];

export default function Navbar() {
  const [abierto, setAbierto] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setAbierto(false), [pathname]);

  // En el menú desplegable los enlaces son más altos para dedos; en la barra
  // de escritorio se compactan para caber también en tablet.
  const claseEnlace =
    (movil = false) =>
    ({ isActive }) =>
      [
        'flex items-center gap-2 whitespace-nowrap rounded-xl font-semibold transition',
        movil ? 'px-3 py-3 text-base' : 'px-2.5 py-2 text-sm lg:px-3',
        isActive ? 'bg-plum-100 text-plum-700' : 'text-plum-900/70 hover:bg-plum-50 hover:text-plum-700',
      ].join(' ');

  return (
    <header className="sticky top-0 z-40 border-b border-plum-100 bg-white/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <NavLink to="/" className="shrink-0 rounded-xl" aria-label="Ir al inicio">
          <Logo />
        </NavLink>

        <nav className="hidden items-center gap-0.5 md:flex lg:gap-1" aria-label="Navegación principal">
          {ENLACES.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={claseEnlace()}>
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Se oculta entre 768 y 1024 px: ahí el espacio lo necesita la
              navegación completa. */}
          <img
            src="/logo/mujer-digital.png"
            alt="Mujer Digital"
            className="hidden h-6 w-auto sm:block md:hidden lg:block"
            width="821"
            height="384"
          />

          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-plum-200 text-plum-700 md:hidden"
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
          >
            {abierto ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {abierto && (
        <nav
          id="menu-movil"
          className="max-h-[70vh] overflow-y-auto border-t border-plum-100 bg-white md:hidden"
          aria-label="Navegación móvil"
        >
          <div className="container-page flex flex-col gap-1 py-3">
            {ENLACES.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={claseEnlace(true)}>
                <Icon className="h-5 w-5 shrink-0" />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
