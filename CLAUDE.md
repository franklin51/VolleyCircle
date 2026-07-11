# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VolleyCircle is a skill-level matching platform that solves the fundamental problem of finding volleyball games with players at your actual skill level. **The core feature is a sophisticated rating system** where players rate each other relative to the game's skill level (S, A+, A, B+, B, C, under C), helping everyone understand their true abilities and find more enjoyable, competitive games.

## Current State

This repository contains planning documentation - no actual code implementation exists yet. Docs are organized under `docs/`:

- `docs/design/volleyball_mvp_roadmap.md` and `docs/design/system-architecture.md` - product spec and architecture
- `docs/design/claude_code_sub_agents_template_volley_circle_i_os_android_kanban_tdd.md` - multi-agent dev workflow (roles, CODEOWNERS, CI gates, TDD contract) for when implementation starts. **Note:** this doc predates ADR-002/ADR-003 — its Firebase paths and xcodebuild/gradlew CI are superseded by `supabase/` + EAS; see the reconciliation callout at the top of that file. It needs a full rewrite before agents rely on it.
- `docs/adr/` - architecture decision records (ADR-002: Firebase → Supabase; ADR-003: Expo + repo layout)
- `docs/spec/` - framework reference docs (see Framework Documentation)

Documentation details:
- **Core rating system design** (main feature that solves skill-level matching)
- Complete product specification and feature requirements  
- 12-week MVP development timeline (4 phases)
- Comprehensive UI/UX screen specifications
- Skill level system: S, A+, A, B+, B, C, under C

## Tech Stack

- **Frontend**: React Native via **Expo** (managed workflow), TypeScript
- **Backend**: Supabase (PostgreSQL + Auth + Realtime + Storage + Edge Functions)
- **Builds/CI**: EAS Build (cloud iOS/Android builds)
- **Notifications**: Expo Notifications or OneSignal (Supabase has no built-in push service)
- **Hosting**: TBD (Supabase does not include app/web hosting the way Firebase Hosting did)

Per [ADR-002](docs/adr/ADR-002-migrate-backend-firebase-to-supabase.md), the backend moved from the original Firebase plan to Supabase for relational data fit (players/matches/ratings), predictable cost, and no vendor lock-in. Service mapping: Firebase Auth → Supabase Auth, Firestore → PostgreSQL, Firestore Listeners → Supabase Realtime, Firebase Storage → Supabase Storage, Cloud Functions → Edge Functions, Security Rules → Row Level Security.

Per [ADR-003](docs/adr/ADR-003-expo-and-repo-layout.md), the app uses the Expo managed workflow (EAS Build, `expo prebuild` as the escape hatch to bare RN) with a single-app repo layout (see Repository Layout below). Note: LINE login is not a built-in Supabase Auth provider and needs custom OIDC / an Edge Function.

## Repository Layout

```
app/         Expo React Native app
             src/features/{rating,events,host,profile}/  (rating = CORE)
             src/{components, lib/supabase.ts, navigation, i18n}  (i18n: zh-Hant primary)
supabase/    migrations/ (SQL schema + RLS), functions/ (Edge Functions, Deno), config.toml, seed.sql
docs/        design/ (product + architecture + workflow), adr/ (decisions), spec/ (framework refs)
scripts/     repo tooling      .github/workflows/   CI
```

`app/` and `supabase/` are scaffolded as implementation begins; today only `docs/` exists.

## Key Features (MVP Scope)

**Phase 1 (Weeks 1-4)**: User auth, profiles, skill level system setup
**Phase 2 (Weeks 5-7)**: **Core Rating System** (main feature) - skill-level-relative rating collection and aggregation
**Phase 3 (Weeks 8-10)**: Enhanced event management with skill-based recommendations  
**Phase 4 (Weeks 11-12)**: Host dashboard, attendance tracking, app store submission

## Development Commands

No code is scaffolded yet, so these commands do not run today — they are the expected
workflow once `app/` and `supabase/` exist, and this section should be verified/updated at
scaffold time:

```bash
# App (from app/)
npx expo start        # run in Expo Go / simulator
npm test              # Jest + React Native Testing Library

# Backend (from repo root)
supabase start        # local Postgres + Auth + Storage + Studio
supabase db reset     # re-apply migrations + seed.sql

# Builds
eas build             # cloud iOS/Android build
```

## Architecture Notes

The system defines a **rating-centric mobile-first architecture** with:
- Cross-platform React Native app as primary interface
- **Skill-level-relative rating system** as the core feature solving skill-level matching
- Supabase backend (PostgreSQL + Edge Functions), see [ADR-002](docs/adr/ADR-002-migrate-backend-firebase-to-supabase.md)
- **Skill levels**: S (pro), A+, A, B+, B, C, under C (beginner)
- **Anonymous rating system** with privacy-compliant design
- Multi-dimensional ratings: Friendliness, Punctuality, Skill Assessment (relative to game level)
- Event-based social features with external chat integration (LINE/Messenger)

**Key Implementation Priority**: The rating system is the main value proposition - prioritize this over other features during development.

When implementing, follow the detailed screen specifications and user flows outlined in the roadmap document.

## Framework Documentation

The `docs/spec/` folder contains comprehensive documentation and examples for the tech stack frameworks:

- **`docs/spec/react-native.md`** - React Native patterns, components, hooks, navigation setup, and performance optimization
- **`docs/spec/supabase.md`** - Supabase reference (client setup, RLS, Edge Functions, local dev). Currently a **stub** — flesh out before backend implementation starts.
- **`docs/spec/firebase.md`** - Firebase Authentication, Firestore, Cloud Functions, and Cloud Messaging integration examples. Kept for reference/history only; the backend moved to Supabase per ADR-002, so treat this as background, not the current plan.
- **`docs/spec/redux-toolkit.md`** - RTK Query for API state management, store configuration, and data fetching patterns
- **`docs/spec/react-navigation.md`** - Navigation setup, screen management, parameter passing, and deep linking

**Refer to these documentation files when implementing related features** to follow established patterns and best practices for the VolleyCircle tech stack.