export default function PageHeader({ eyebrow, titulo, descripcion, acciones }) {
  return (
    <div className="border-b border-plum-100 bg-white">
      <div className="container-page flex flex-col gap-5 py-8 sm:py-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-plum-600">{eyebrow}</p>
          )}
          <h1 className="text-2xl font-extrabold tracking-tight text-plum-900 sm:text-3xl">{titulo}</h1>
          {descripcion && <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{descripcion}</p>}
        </div>
        {acciones && <div className="flex flex-wrap items-center gap-3">{acciones}</div>}
      </div>
    </div>
  );
}
