---
name: supabase-backend
description: Conventions for VolleyCircle's Supabase backend. Use when writing or changing SQL migrations, Row Level Security policies, database schema, or Deno Edge Functions under supabase/.
---

# Supabase backend conventions

Schema and policy design live in
[system-architecture.md](../../../docs/design/system-architecture.md); the backend choice
is recorded in [ADR-002](../../../docs/adr/ADR-002-migrate-backend-firebase-to-supabase.md).

## Architecture shape

There is **no function tier in front of every read/write**. The Supabase client talks to
Postgres directly through PostgREST, gated by RLS. Edge Functions are reserved for logic
that cannot run on the client:

- `submit-rating` — verifies mutual attendance, inserts anonymously with the service-role key
- rating aggregation into `player_skill_profiles`
- LINE OIDC (not a built-in Supabase Auth provider)
- notification fan-out

Adding an Edge Function for plain CRUD is the wrong call — write RLS instead.

## RLS

- **RLS is the authorization boundary.** Client-side checks are UX only.
- Every new table gets `ENABLE ROW LEVEL SECURITY` **and** policies in the same migration.
  A table shipped without policies is a security bug, not a follow-up.
- Every policy set needs an **allow/deny test matrix**: for each role (anon, authenticated
  owner, authenticated non-owner, host, service-role), assert both what is permitted and
  what is refused. Deny cases are the ones that catch regressions.
- Prefer making an invariant structural over enforcing it in a policy. Rating anonymity is
  the model: the column doesn't exist, so no policy can leak it.

## Migrations

- Migrations are append-only and forward-only. Never edit an applied migration — add a new one.
- One logical change per migration; include indexes for the columns you filter/join on.
- Update `seed.sql` when new tables need fixture data. Seeds cover all seven skill levels
  (`S`, `A+`, `A`, `B+`, `B`, `C`, `under C`) where rating data is involved.

## Local loop

```bash
supabase start      # local Postgres + Auth + Storage + Studio
supabase db reset   # re-apply all migrations + seed.sql
```

`db reset` is the check that migrations actually apply from scratch — run it after
writing one, not just the incremental apply.

**Never point migrations, resets, or tooling at a remote/prod project.** Local stack only,
including from CI.

## Edge Functions

- Deno + TypeScript under `supabase/functions/<name>/`.
- Service-role key is used *only* inside functions that need to bypass RLS deliberately
  (e.g. anonymous rating insert). It must never reach the client or a committed file.
- Validate the caller's JWT and re-verify authorization inside the function — bypassing
  RLS means you own the check.
- No PII in logs.
