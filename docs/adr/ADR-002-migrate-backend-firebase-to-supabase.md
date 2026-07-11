# ADR-002: Migrate Backend Stack from Firebase to Supabase

## Status
Accepted

## Date
2026-07-11

## Context

VolleyCircle is a volleyball community iOS/Android app built with React Native + TypeScript. The original stack used Firebase (Auth, Firestore, Security Rules) as the backend.

During infrastructure evaluation, the team identified several limitations with Firebase that become significant as VolleyCircle scales:

- **Firestore's NoSQL model** is a poor fit for VolleyCircle's core data — players, matches, and skill ratings are inherently relational (a match references two players; a rating belongs to one player)
- **Complex queries are limited** in Firestore — features like "top 10 rated players in my city" require workarounds or data duplication
- **Cost unpredictability** — Firebase charges per read/write operation, making costs hard to forecast as the user base grows
- **Vendor lock-in** — Firestore data is in Google's proprietary format; migrating later would require rewriting the entire data layer
- **No open-source option** — Firebase cannot be self-hosted

## Decision

Migrate the backend from Firebase to **Supabase**, using the following service mapping:

| Firebase (current) | Supabase (new) |
|---|---|
| Firebase Auth | Supabase Auth |
| Firestore (NoSQL) | PostgreSQL |
| Firestore Listeners | Supabase Realtime |
| Firebase Storage | Supabase Storage |
| Cloud Functions | Edge Functions |
| Security Rules | Row Level Security (RLS) |

## Database Schema

```sql
-- Players
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  city        TEXT,
  created_at  TIMESTAMP DEFAULT now()
);

-- Matches between two players
CREATE TABLE matches (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player1_id  UUID REFERENCES users(id),
  player2_id  UUID REFERENCES users(id),
  winner_id   UUID REFERENCES users(id),
  score       TEXT,
  location    TEXT,
  played_at   TIMESTAMP DEFAULT now()
);

-- Skill ratings (Elo-style)
CREATE TABLE ratings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  rating      INTEGER DEFAULT 1000,
  updated_at  TIMESTAMP DEFAULT now()
);
```

## Architecture Overview

```
┌─────────────────────────────────┐
│     React Native App            │
│     (TypeScript)                │
│                                 │
│  Supabase JS SDK                │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│         Supabase                │
│                                 │
│  ┌──────────┐  ┌─────────────┐  │
│  │   Auth   │  │  PostgreSQL │  │
│  └──────────┘  └─────────────┘  │
│  ┌──────────┐  ┌─────────────┐  │
│  │ Realtime │  │   Storage   │  │
│  └──────────┘  └─────────────┘  │
│  ┌──────────────────────────┐   │
│  │     Edge Functions       │   │
│  └──────────────────────────┘   │
└─────────────────────────────────┘
```

## Migration Plan

Migration is done incrementally — each step is a separate PR:

1. **Auth** — Swap Firebase Auth SDK for Supabase Auth in React Native
2. **Schema** — Design and create PostgreSQL tables
3. **Data layer** — Replace Firestore queries with Supabase queries
4. **Realtime** — Replace Firestore listeners with Supabase Realtime subscriptions
5. **Security** — Rewrite Firebase Security Rules as Row Level Security policies
6. **Storage** — Migrate Firebase Storage to Supabase Storage
7. **Functions** — Migrate Cloud Functions to Edge Functions (e.g. Elo rating recalculation)

## Consequences

### Positive
- Full SQL power for complex queries (leaderboards, analytics, skill ratings)
- Predictable cost model — billed by compute and storage, not per read/write
- Open-source PostgreSQL standard — portable between providers, no vendor lock-in
- Row Level Security lives in the database itself — simpler to reason about than Firebase Security Rules
- pgvector extension available for future AI-powered matchmaking features

### Negative
- Real-time requires explicit setup vs. Firebase's built-in listeners (mitigated by Supabase Realtime)
- Push notifications need separate integration (Expo Notifications or OneSignal)
- Initial migration effort across Auth, data layer, and security rules
- Team needs to learn SQL and PostgreSQL if not already familiar

### Neutral
- React Native app layer (TypeScript) remains unchanged
- TDD methodology and GitHub workflow remain unchanged
- Supabase JS SDK follows a similar client pattern to Firebase SDK

## Alternatives Considered

| Option | Reason Not Chosen |
|---|---|
| Stay on Firebase | Poor fit for relational data; unpredictable cost; vendor lock-in |
| Raw PostgreSQL on Zeabur | More ops burden; no built-in auth/realtime/storage |
| AWS/Azure managed DB | Higher complexity; overkill for current stage |
| MySQL | Fewer advanced features than PostgreSQL; less ecosystem support |

## References
- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL vs Firebase Comparison](https://www.weweb.io/blog/postgres-vs-firebase-comparison-guide)
- ADR-001: Initial Firebase Stack Selection