-- =====================================================================
-- RUMBO SUR VIAJES — Base de datos (Supabase / PostgreSQL)
--
-- CÓMO USARLO:
--   Supabase → menú izquierdo "SQL Editor" → "New query" →
--   pegar TODO este archivo → botón "Run".
--
-- Es seguro ejecutarlo más de una vez (no borra datos ya guardados).
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. TABLA: solicitudes  (formulario "Pedí tu presupuesto")
-- ---------------------------------------------------------------------
create table if not exists public.solicitudes (
  id          uuid primary key default gen_random_uuid(),
  creado      timestamptz not null default now(),
  nombre      text not null check (char_length(nombre)   between 1 and 120),
  telefono    text not null check (char_length(telefono) between 8 and 20),
  email       text          check (char_length(email)    <= 200),
  destino     text not null check (char_length(destino)  between 1 and 120),
  fecha       text,                                   -- mes aproximado, ej. "2026-12"
  viajeros    int           check (viajeros between 1 and 100),
  comentarios text          check (char_length(comentarios) <= 2000)
);


-- ---------------------------------------------------------------------
-- 2. TABLA: reservas  (botón "Reservar" de vuelos y paquetes)
-- ---------------------------------------------------------------------
create table if not exists public.reservas (
  id        uuid primary key default gen_random_uuid(),
  creado    timestamptz not null default now(),
  producto  text not null check (char_length(producto) <= 300),
  total     numeric       check (total >= 0),
  pasajeros int           check (pasajeros between 1 and 100),
  ida       date,
  vuelta    date,
  nombre    text not null check (char_length(nombre)   between 1 and 120),
  telefono  text not null check (char_length(telefono) between 8 and 20),

  -- La vuelta no puede ser anterior a la ida (misma regla que el sitio web)
  constraint reservas_vuelta_posterior check (vuelta is null or ida is null or vuelta >= ida)
);


-- ---------------------------------------------------------------------
-- 3. SEGURIDAD (Row Level Security)
--    El público (visitantes de la web) SOLO puede AGREGAR filas.
--    Nadie desde la web puede leer, modificar ni borrar datos.
--    Vos ves los datos desde el panel de Supabase (Table Editor).
-- ---------------------------------------------------------------------
alter table public.solicitudes enable row level security;
alter table public.reservas    enable row level security;

drop policy if exists "publico_inserta" on public.solicitudes;
drop policy if exists "publico_inserta" on public.reservas;

create policy "publico_inserta" on public.solicitudes
  for insert to anon with check (true);

create policy "publico_inserta" on public.reservas
  for insert to anon with check (true);

grant insert on public.solicitudes to anon;
grant insert on public.reservas    to anon;
