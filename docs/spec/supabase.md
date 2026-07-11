# Supabase Documentation

Reference patterns for the VolleyCircle backend. Supabase replaced Firebase per
[ADR-002](../adr/ADR-002-migrate-backend-firebase-to-supabase.md); see
[ADR-003](../adr/ADR-003-expo-and-repo-layout.md) for how it maps onto the repo layout.

> **Status: stub.** This file is a placeholder to be filled with Context7-sourced
> examples (same style as the other `docs/spec/` files) before backend implementation
> starts. `firebase.md` in this folder is kept for historical reference only.

## Service mapping (from ADR-002)

| Firebase (old) | Supabase (new) | Lives in repo at |
|---|---|---|
| Firebase Auth | Supabase Auth | app (`lib/supabase.ts`) |
| Firestore (NoSQL) | PostgreSQL | `supabase/migrations/**` |
| Firestore Listeners | Supabase Realtime | app feature code |
| Firebase Storage | Supabase Storage | app feature code |
| Cloud Functions | Edge Functions (Deno) | `supabase/functions/**` |
| Security Rules | Row Level Security (RLS) | `supabase/migrations/**` |

## Local development

```bash
supabase start        # start local Postgres + Auth + Storage + Studio
supabase db reset     # re-apply migrations + seed.sql from scratch
supabase functions serve <name>   # run an Edge Function locally
supabase db diff -f <name>        # generate a migration from schema changes
```

## To be documented before backend work
- Client setup with the Supabase JS SDK in Expo (`lib/supabase.ts`, env handling).
- RLS policy patterns (anonymity-preserving rating access; mutual-player checks).
- Edge Function pattern for rating aggregation (per-level windows, host weight).
- LINE OIDC integration (not a built-in provider — custom setup required per ADR-003).
