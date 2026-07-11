# ADR-003: Expo Managed Workflow and Repository Layout

## Status
Accepted

## Date
2026-07-11

## Context

VolleyCircle is a React Native + TypeScript iOS/Android app that is moving from
planning into implementation. Two structural questions were unresolved:

1. **App tooling** — bare React Native (committed `ios/`/`android/` native projects,
   `xcodebuild`/`gradlew` builds) vs. the Expo managed workflow (cloud builds via EAS).
2. **Repository layout** — where app code and backend code live now that
   [ADR-002](ADR-002-migrate-backend-firebase-to-supabase.md) moved the backend from
   Firebase to Supabase. The only existing layout is the one described in the sub-agents
   template (`docs/design/claude_code_sub_agents_template_...md`), which predates ADR-002
   and is still Firebase-shaped (`/functions`, `/firestore.rules`, xcodebuild/gradlew CI).

## Decision

### Tooling: Expo managed workflow
- **EAS Build** produces iOS/Android binaries in the cloud — no local Xcode/Gradle setup,
  which simplifies CI (the template's `build-ios`/`build-android` collapse into one EAS job).
- **Expo Notifications** is already the planned push solution (see ADR-002 Consequences).
- **Supabase JS SDK** needs no custom native modules for the MVP surface (Auth, DB,
  Realtime, Storage).
- **Escape hatch:** `npx expo prebuild` ejects to bare React Native with committed native
  folders if a native limitation is hit later. Managed → bare is straightforward; the
  reverse is not, so managed is the safer default now.

**Known caveat:** LINE login (part of the Google/LINE/Facebook OAuth scope) is **not** a
built-in Supabase Auth provider. Google and Facebook are native; LINE needs a custom OIDC
configuration or an Edge Function. Flag this early during Auth work.

### Layout: single app in `app/` + sibling `supabase/`, feature-first
Not a root-level Expo app, not a full monorepo. One app is in MVP scope, so
turborepo/pnpm-workspace overhead buys nothing yet. Placing the app under `app/` (rather
than repo root) keeps repo-level concerns (`docs/`, `.github/`, `supabase/`) separate from
app config and leaves a clean seam to add `packages/shared` or an admin web app later
without a migration. Feature-first folders map 1:1 onto the CODEOWNERS ownership model in
the sub-agents template.

```
VolleyCircle/
├── app/                    # Expo RN app (app.config.ts, package.json)
│   └── src/
│       ├── features/{rating,events,host,profile}/   # rating = CORE
│       ├── components/  lib/supabase.ts  navigation/  i18n/ (zh-Hant primary)
├── supabase/               # migrations/ (SQL + RLS), functions/ (Edge, Deno), config.toml, seed.sql
├── docs/                   # design/ adr/ spec/
├── scripts/  .github/workflows/  CLAUDE.md  README.md  .gitignore
```

### Structure mapping vs. the Firebase-era template
| Sub-agents template (Firebase) | This ADR (Supabase + Expo) |
|---|---|
| `/functions/**` | `supabase/functions/**` (Edge Functions, Deno/TS) |
| `/firestore.rules`, `/firestore.indexes.json` | `supabase/migrations/**` (RLS + indexes in SQL) |
| committed `app/ios/`, `app/android/` | EAS Build; no committed native folders |
| CI `build-ios` + `build-android` (xcodebuild/gradlew) | single EAS Build job |
| Firebase Secrets / Emulator | Supabase secrets + `supabase start` local stack |

## Consequences

### Positive
- Faster MVP iteration; no local native toolchain required to build or ship.
- CI is simpler and cheaper (one cloud build path).
- App/backend/docs boundaries are clean and grow-friendly.

### Negative
- EAS Build is a hosted dependency (build minutes, queue times).
- Any native module outside Expo's supported set requires a prebuild/eject.
- LINE OAuth needs custom work (noted above).

### Neutral
- The sub-agents template still needs a rewrite to adopt these paths/roles (tracked
  separately; see CLAUDE.md).

## Alternatives Considered
| Option | Reason Not Chosen |
|---|---|
| Bare React Native now | Native toolchain + heavier CI; not needed for MVP surface |
| Expo app at repo root | Mixes app config with repo-level docs/CI; loses the `app/` seam |
| Full monorepo (apps/ + packages/) | Overhead with only one app; can migrate into it later |

## References
- [ADR-002: Migrate Backend from Firebase to Supabase](ADR-002-migrate-backend-firebase-to-supabase.md)
- [Expo EAS Build](https://docs.expo.dev/build/introduction/)
- [Supabase Docs](https://supabase.com/docs)
