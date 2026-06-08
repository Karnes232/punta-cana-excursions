-- punta-cana-excursions — Supabase schema
-- Run this in the Supabase SQL Editor for THIS site's project (not the diving project).
--
-- RLS is enabled on both tables with NO policies. The app writes exclusively
-- via the service-role key (server-side, in API routes), which bypasses RLS.
-- With no public policies, the anon/publishable key cannot read or write these
-- tables — the data is private by default.

-- ─────────────────────────────────────────────────────────────────────────────
-- bookings — one row per captured PayPal deposit
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.bookings (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  paypal_order_id   text not null unique,
  excursion_id      text,
  excursion_title   text,
  locale            text,
  customer_name     text,
  email             text,
  phone             text,
  hotel             text,
  tour_date         text,
  time_slot         text,
  adults            integer,
  children          integer,
  deposit_paid      numeric,
  currency          text,
  total_price       numeric,
  remaining_balance numeric,
  status            text not null default 'confirmed'
);

create index if not exists bookings_created_at_idx on public.bookings (created_at desc);
create index if not exists bookings_email_idx on public.bookings (email);

alter table public.bookings enable row level security;

-- ─────────────────────────────────────────────────────────────────────────────
-- form_submissions — contact-form + excursion-inquiry messages
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.form_submissions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  type        text not null check (type in ('contact', 'inquiry')),
  locale      text,
  name        text,
  email       text,
  phone       text,
  hotel       text,
  excursion   text,
  message     text
);

create index if not exists form_submissions_created_at_idx on public.form_submissions (created_at desc);
create index if not exists form_submissions_type_idx on public.form_submissions (type);

alter table public.form_submissions enable row level security;
