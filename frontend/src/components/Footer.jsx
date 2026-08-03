import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-plum-100 bg-plum-900 text-plum-200">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <Logo invertido />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-plum-200/80">
            Un espacio compartido donde las participantes de Mujer Digital registran y descubren
            recursos de aprendizaje.
          </p>
        </div>

        <nav aria-label="Enlaces del pie de página">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Navegación</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-white" to="/">Inicio</Link></li>
            <li><Link className="hover:text-white" to="/recursos">Explorar recursos</Link></li>
            <li><Link className="hover:text-white" to="/agregar">Agregar recurso</Link></li>
            <li><Link className="hover:text-white" to="/estadisticas">Estadísticas</Link></li>
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Sobre la ludoteca</h3>
          <p className="mt-3 text-sm leading-relaxed text-plum-200/80">
            Todo el contenido es aportado por la comunidad. Los archivos se almacenan localmente y
            no se requiere iniciar sesión para consultar o compartir.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center gap-6 py-7 sm:flex-row sm:justify-center sm:gap-10">
          <div className="flex flex-col items-center gap-2.5 sm:flex-row sm:gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-plum-200/60">
              Un proyecto del programa
            </span>
            <img
              src="/logo/mujer-digital-blanco.png"
              alt="Mujer Digital"
              className="h-7 w-auto"
              width="821"
              height="384"
            />
          </div>

          <span className="hidden h-9 w-px bg-white/15 sm:block" aria-hidden="true" />

          <div className="flex flex-col items-center gap-2.5 sm:flex-row sm:gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-plum-200/60">
              Desarrollado por
            </span>
            <span className="flex items-center gap-2">
              <img
                src="/logo/logoDC.jpeg"
                alt=""
                className="h-8 w-8 rounded-lg object-cover ring-1 ring-white/15"
                width="32"
                height="32"
              />
              <span className="text-sm font-bold tracking-tight text-white">Digital Queens</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
