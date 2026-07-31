const VARIANTES = {
  categoria: 'bg-plum-100 text-plum-700 border-plum-200',
  tipo: 'bg-white text-plum-600 border-plum-200',
  neutro: 'bg-plum-50 text-muted border-plum-100',
  solido: 'bg-plum-600 text-white border-plum-600',
};

export default function Badge({ variant = 'neutro', icon: Icon, children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${
        VARIANTES[variant] ?? VARIANTES.neutro
      } ${className}`}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </span>
  );
}
