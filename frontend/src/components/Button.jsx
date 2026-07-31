import { Link } from 'react-router-dom';

const VARIANTES = {
  primary:
    'bg-plum-600 text-white shadow-sm hover:bg-plum-700 active:bg-plum-800 disabled:bg-plum-300',
  secondary:
    'bg-white text-plum-700 border border-plum-200 hover:border-plum-400 hover:bg-plum-50 disabled:text-plum-300',
  ghost: 'text-plum-700 hover:bg-plum-100 disabled:text-plum-300',
  dark: 'bg-plum-900 text-white hover:bg-plum-800 disabled:bg-plum-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
};

const TAMANOS = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-5 py-3 text-base gap-2',
};

/** Botón reutilizable. Renderiza <Link>, <a> o <button> según las props. */
export default function Button({
  as,
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  full = false,
  children,
  ...props
}) {
  const clases = [
    'inline-flex items-center justify-center rounded-xl font-semibold transition',
    'focus-visible:ring-2 focus-visible:ring-plum-600 focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed',
    VARIANTES[variant] ?? VARIANTES.primary,
    TAMANOS[size] ?? TAMANOS.md,
    full ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (to) {
    return (
      <Link to={to} className={clases} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={clases} {...props}>
        {children}
      </a>
    );
  }

  const Componente = as ?? 'button';
  return (
    <Componente className={clases} {...props}>
      {children}
    </Componente>
  );
}
