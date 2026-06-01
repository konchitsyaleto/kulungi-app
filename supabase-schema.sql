create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text unique not null,
  college text,
  department text,
  photo text,
  updated_at timestamptz not null default now()
);

create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  lounge_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, lounge_id)
);

create table if not exists public.presets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.favorites enable row level security;
alter table public.presets enable row level security;
alter table public.admins enable row level security;

create policy "Users can read own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "Users can insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can read own favorites"
on public.favorites for select
using (auth.uid() = user_id);

create policy "Users can insert own favorites"
on public.favorites for insert
with check (auth.uid() = user_id);

create policy "Users can delete own favorites"
on public.favorites for delete
using (auth.uid() = user_id);

create policy "Users can read own presets"
on public.presets for select
using (auth.uid() = user_id);

create policy "Users can insert own presets"
on public.presets for insert
with check (auth.uid() = user_id);

create policy "Users can delete own presets"
on public.presets for delete
using (auth.uid() = user_id);

create policy "Users can read own admin status"
on public.admins for select
using (auth.uid() = user_id);
