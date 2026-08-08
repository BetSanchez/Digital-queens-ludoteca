-- ============================================================================
-- Ludoteca Digital Colaborativa — Esquema para Supabase (PostgreSQL)
-- ----------------------------------------------------------------------------
-- Cómo ejecutarlo:
--   1. Entra a tu proyecto en https://supabase.com
--   2. Menú lateral -> SQL Editor -> New query
--   3. Pega todo este archivo y presiona "Run"
--
-- La tabla arranca vacía: los recursos se registran desde la aplicación.
-- El script es idempotente: puedes volver a ejecutarlo sin romper nada.
--
-- Para vaciar la tabla y reiniciar los IDs desde 1:
--   truncate table public.resources restart identity;
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. Tabla principal: resources
-- ----------------------------------------------------------------------------
create table if not exists public.resources (
  id             bigint generated always as identity primary key,
  nombre         text        not null,
  participante   text        not null,
  tipo           text        not null,
  categoria      text        not null,
  idioma         text,
  enlace         text,
  archivo        text,
  archivo2       text,
  imagen         text,
  descubrimiento text        not null,
  contribucion   text        not null,
  recomendacion  text        not null,
  fecha          timestamptz not null default now()
);

-- `create table if not exists` no toca las tablas ya creadas: las columnas
-- añadidas después de la primera instalación se agregan aquí.
alter table public.resources
  add column if not exists archivo2 text;

comment on table  public.resources                is 'Recursos de aprendizaje compartidos por las participantes.';
comment on column public.resources.participante   is 'Nombre de la participante que comparte el recurso.';
comment on column public.resources.enlace         is 'URL externa al recurso (opcional).';
comment on column public.resources.archivo        is 'URL pública del PDF en Supabase Storage (opcional).';
comment on column public.resources.archivo2       is 'URL pública del segundo PDF en Supabase Storage (opcional).';
comment on column public.resources.imagen         is 'URL pública de la imagen de portada en Supabase Storage (opcional).';
comment on column public.resources.descubrimiento is 'Cómo descubrió el recurso la participante.';
comment on column public.resources.contribucion   is 'Cómo contribuyó el recurso a su desarrollo.';
comment on column public.resources.recomendacion  is 'Por qué recomendaría el recurso.';


-- ----------------------------------------------------------------------------
-- 2. Restricciones de longitud (mismos límites que valida el backend)
-- ----------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'resources_longitudes_check'
  ) then
    alter table public.resources add constraint resources_longitudes_check check (
      char_length(nombre)         between 1 and 150
      and char_length(participante)  between 1 and 100
      and char_length(tipo)          between 1 and 60
      and char_length(categoria)     between 1 and 60
      and (idioma is null or char_length(idioma) <= 40)
      and (enlace is null or char_length(enlace) <= 500)
      and char_length(descubrimiento) between 1 and 2000
      and char_length(contribucion)   between 1 and 2000
      and char_length(recomendacion)  between 1 and 2000
    );
  end if;
end $$;


-- ----------------------------------------------------------------------------
-- 3. Índices usados por los filtros, el orden y las estadísticas
-- ----------------------------------------------------------------------------
create index if not exists idx_resources_categoria    on public.resources (categoria);
create index if not exists idx_resources_tipo         on public.resources (tipo);
create index if not exists idx_resources_participante on public.resources (participante);
create index if not exists idx_resources_fecha        on public.resources (fecha desc);

-- Acelera la búsqueda por texto (ILIKE '%termino%') en los dos campos de texto
-- libre. `categoria` no lo necesita: tiene pocos valores distintos.
create extension if not exists pg_trgm;

create index if not exists idx_resources_nombre_trgm
  on public.resources using gin (nombre gin_trgm_ops);
create index if not exists idx_resources_participante_trgm
  on public.resources using gin (participante gin_trgm_ops);


-- ----------------------------------------------------------------------------
-- 4. Seguridad a nivel de fila (RLS)
-- ----------------------------------------------------------------------------
-- El backend de Express usa la SERVICE ROLE KEY, que ignora RLS por diseño.
-- Aun así activamos RLS para que la ANON KEY (pública) solo pueda LEER:
-- si alguien tomara esa llave del navegador, no podría escribir ni borrar.
alter table public.resources enable row level security;

drop policy if exists "Lectura pública de recursos" on public.resources;
create policy "Lectura pública de recursos"
  on public.resources
  for select
  to anon, authenticated
  using (true);

-- No se crean políticas de insert/update/delete a propósito:
-- toda escritura debe pasar por el backend con la service role key.


-- ----------------------------------------------------------------------------
-- 5. Buckets de Storage para los PDFs y las imágenes
-- ----------------------------------------------------------------------------
-- Se crean públicos para poder mostrarlos con una URL directa (sin firmar).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('recursos-pdf', 'recursos-pdf', true, 10485760,
   array['application/pdf']),
  ('recursos-imagenes', 'recursos-imagenes', true, 10485760,
   array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- La subida y el borrado los hace el backend con la service role key,
-- por eso no hacen falta políticas de escritura sobre storage.objects.


-- ----------------------------------------------------------------------------
-- 6. Estadísticas en una sola llamada: select * from get_statistics()
-- ----------------------------------------------------------------------------
create or replace function public.get_statistics()
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  select jsonb_build_object(
    'resumen', (
      select jsonb_build_object(
        'totalRecursos',      count(*),
        'totalParticipantes', count(distinct lower(participante)),
        'totalCategorias',    count(distinct categoria),
        'totalConPdf',        count(*) filter (where archivo is not null and archivo <> ''),
        'totalConEnlace',     count(*) filter (where enlace  is not null and enlace  <> '')
      )
      from public.resources
    ),

    -- El `order by` va dentro de jsonb_agg para que el orden del arreglo
    -- quede garantizado y las gráficas no dependan del plan de ejecución.
    'porCategoria', coalesce((
      select jsonb_agg(fila order by fila.total desc, fila.name asc)
      from (
        select categoria as name, count(*)::int as total
        from public.resources
        group by categoria
      ) fila
    ), '[]'::jsonb),

    'porTipo', coalesce((
      select jsonb_agg(fila order by fila.total desc, fila.name asc)
      from (
        select tipo as name, count(*)::int as total
        from public.resources
        group by tipo
      ) fila
    ), '[]'::jsonb),

    'porMes', coalesce((
      select jsonb_agg(fila order by fila.mes asc)
      from (
        select to_char(fecha at time zone 'UTC', 'YYYY-MM') as mes, count(*)::int as total
        from public.resources
        group by mes
      ) fila
    ), '[]'::jsonb),

    'porIdioma', coalesce((
      select jsonb_agg(fila order by fila.total desc, fila.name asc)
      from (
        select coalesce(nullif(idioma, ''), 'Sin especificar') as name, count(*)::int as total
        from public.resources
        group by 1
      ) fila
    ), '[]'::jsonb),

    'topParticipantes', coalesce((
      select jsonb_agg(fila order by fila.total desc, fila.name asc)
      from (
        select min(participante) as name, count(*)::int as total
        from public.resources
        group by lower(participante)
        order by total desc, name asc
        limit 10
      ) fila
    ), '[]'::jsonb)
  );
$$;

comment on function public.get_statistics() is
  'Devuelve todas las métricas de la pantalla de estadísticas en un solo JSON.';

grant execute on function public.get_statistics() to anon, authenticated, service_role;
