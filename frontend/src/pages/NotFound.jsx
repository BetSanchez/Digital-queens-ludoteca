import Button from '../components/Button';
import { IconArrowLeft, IconSearch } from '../components/Icons';

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-plum-100 text-plum-700">
        <IconSearch className="h-8 w-8" />
      </span>
      <p className="mt-6 text-sm font-bold uppercase tracking-[0.16em] text-plum-600">Error 404</p>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-plum-900 sm:text-3xl">
        No encontramos esta página
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        Es posible que el enlace haya cambiado o que el recurso ya no esté disponible.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button to="/">
          <IconArrowLeft className="h-4 w-4" />
          Ir al inicio
        </Button>
        <Button to="/recursos" variant="secondary">
          Explorar recursos
        </Button>
      </div>
    </div>
  );
}
