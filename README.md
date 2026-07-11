# VolleyCircle

A skill-level matching platform for volleyball. VolleyCircle solves the core problem of
finding games with players at your actual skill level through a **skill-level-relative peer
rating system** — players rate each other relative to a game's level (S, A+, A, B+, B, C,
under C), so everyone can find more enjoyable, competitive games.

The rating system is the primary value proposition and the priority during development.

## Status

**Planning → early implementation.** The repository currently holds design and
architecture documentation; app and backend code are being scaffolded next.

## Tech Stack

- **Frontend:** React Native via **Expo** (managed workflow) — see [ADR-003](docs/adr/ADR-003-expo-and-repo-layout.md)
- **Backend:** **Supabase** (PostgreSQL + Auth + Realtime + Storage + Edge Functions) — see [ADR-002](docs/adr/ADR-002-migrate-backend-firebase-to-supabase.md)
- **Notifications:** Expo Notifications (or OneSignal)
- **Builds/CI:** EAS Build

## Repository Layout

```
app/         Expo React Native app (features/, components/, lib/, navigation/, i18n/)
supabase/    migrations/ (schema + RLS), functions/ (Edge Functions), config.toml, seed.sql
docs/        design/ (product + architecture + workflow), adr/ (decisions), spec/ (framework refs)
scripts/     repo tooling
.github/     CI workflows
```

`app/` and `supabase/` are scaffolded as implementation begins; `docs/` exists today.

## Documentation

- **Product & roadmap:** [docs/design/volleyball_mvp_roadmap.md](docs/design/volleyball_mvp_roadmap.md)
- **System architecture:** [docs/design/system-architecture.md](docs/design/system-architecture.md)
- **Dev workflow (multi-agent, TDD, Kanban):** [docs/design/claude_code_sub_agents_template_volley_circle_i_os_android_kanban_tdd.md](docs/design/claude_code_sub_agents_template_volley_circle_i_os_android_kanban_tdd.md)
- **Decisions:** [docs/adr/](docs/adr/)
- **Framework references:** [docs/spec/](docs/spec/)

For agent/Claude Code guidance, see [CLAUDE.md](CLAUDE.md).

## Development

No build/test commands exist yet — this section will be filled in as `app/` and
`supabase/` are scaffolded. Expected commands:

```bash
# App (from app/)
npx expo start        # run the app in Expo Go / simulator
npm test              # Jest + React Native Testing Library

# Backend (from repo root)
supabase start        # local Postgres + Auth + Storage
supabase db reset     # re-apply migrations + seed

# Builds
eas build             # cloud iOS/Android build
```
