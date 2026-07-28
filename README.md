# VolleyCircle

A skill-level matching platform for volleyball. VolleyCircle solves the core problem of
finding games with players at your actual skill level through a **skill-level-relative peer
rating system** — players rate each other relative to a game's level (S, A+, A, B+, B, C,
under C), so everyone can find more enjoyable, competitive games.

The rating system is the primary value proposition and the priority during development.

## Status

**Early implementation.** The Expo app is scaffolded and its checks pass; the Supabase
project is initialized with no migrations yet. No features are built — see
[STATUS.md](STATUS.md) for what's in flight.

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

- **Domain vocabulary:** [CONTEXT.md](CONTEXT.md) — start here; defines skill levels, mutual rating, confidence, and the rest of the shared language
- **Product & roadmap:** [docs/design/volleyball_mvp_roadmap.md](docs/design/volleyball_mvp_roadmap.md)
- **System architecture:** [docs/design/system-architecture.md](docs/design/system-architecture.md)
- **Dev workflow (multi-agent, TDD, Kanban):** [docs/design/claude_code_sub_agents_template_volley_circle_i_os_android_kanban_tdd.md](docs/design/claude_code_sub_agents_template_volley_circle_i_os_android_kanban_tdd.md) — aspirational target, not current policy
- **Decisions:** [docs/adr/](docs/adr/)
- **Framework references:** [docs/spec/](docs/spec/)

For agent/Claude Code guidance, see [CLAUDE.md](CLAUDE.md).

## Development

### App (from `app/`)

```bash
npm install           # first time only
npm start             # Expo dev server (Expo Go / simulator)
npm test              # Jest + React Native Testing Library
npm run typecheck     # tsc --noEmit
npm run lint          # eslint
```

All three checks pass on a clean checkout. They are the same three the CI `checks` job
runs — see [system-architecture.md § CI/CD Pipeline](docs/design/system-architecture.md#cicd-pipeline).

> **Writing tests:** on React Native Testing Library v14 + React 19, `render` returns a
> Promise and **must be awaited**. Skipping the `await` produces a confusing
> `toJSON is not a function`.

### Backend (from repo root)

```bash
npm install           # first time only (installs the Supabase CLI)
npx supabase start    # local Postgres + Auth + Storage + Studio — requires Docker
npx supabase db reset # re-apply migrations + seed
```

`supabase/config.toml` is initialized; there are no migrations yet — the first one arrives
with the profiles slice. `supabase start` needs Docker running and access to Docker Hub,
so it does not run in restricted-egress environments.

### Builds

```bash
eas build             # cloud iOS/Android build (no local Xcode/Gradle — see ADR-003)
```
