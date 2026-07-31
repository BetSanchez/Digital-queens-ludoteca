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

  const claseEnlace = ({ isActive }) =>
    [
      'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition',
      isActive ? 'bg-plum-100 text-plum-700' : 'text-plum-900/70 hover:bg-plum-50 hover:text-plum-700',
    ].join(' ');

  return (
    <header className="sticky top-0 z-40 border-b border-plum-100 bg-white/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <NavLink to="/" className="rounded-xl" aria-label="Ir al inicio">
          <Logo />
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navegación principal">
          {ENLACES.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={claseEnlace}>
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-plum-200 text-plum-700 md:hidden"
          aria-expanded={abierto}
          aria-controls="menu-movil"
          aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
        >
          {abierto ? <IconClose /> : <IconMenu />}
        </button>
      </div>

      {abierto && (
        <nav id="menu-movil" className="border-t border-plum-100 bg-white md:hidden" aria-label="Navegación móvil">
          <div className="container-page flex flex-col gap-1 py-3">
            {ENLACES.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={claseEnlace}>
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
