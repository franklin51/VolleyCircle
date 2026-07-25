**🏐 VolleyCircle: A Volleyball Community Platform — Product Overview**

VolleyCircle is a skill-level matching platform that solves the fundamental problem of finding volleyball games with players at your actual skill level. The core innovation is a sophisticated rating system where players rate each other relative to the game's skill level (S, A+, A, B+, B, C, under C), helping everyone understand their true abilities and find more enjoyable, competitive games.

**The Problem**: It's difficult for volleyball players to accurately assess their skill level and find games with similarly skilled players, leading to mismatched games that are less fun for everyone.

**The Solution**: A skill-level-relative rating system that provides accurate skill assessment through peer feedback after games, enabling better game matching and more enjoyable volleyball experiences.

> **This file is the plan only** — phases, timeline, feature list, backlog. Design content lives
> in the [design docs](design/): [rating-system.md](design/rating-system.md) (CORE),
> [screens.md](design/screens.md), [design-system.md](design/design-system.md), and
> [system-architecture.md](design/system-architecture.md). See [STATUS.md](../STATUS.md) for the
> docs map + linking convention (stable step-IDs like `P2-rating-agg`, section anchors like
> `#aggregation-logic`).

---

### 📖 Table of Contents

1. Product Overview
2. Feature List
3. MVP Roadmap (Phases P1–P4) & Deferred Features
4. Future Opportunities

Design & architecture (separate files): [Design System](design/design-system.md) ·
[Screens & Navigation](design/screens.md) · [Rating System (CORE)](design/rating-system.md) ·
[System Architecture](design/system-architecture.md)

Tech stack decision: [ADR-002](adr/ADR-002-migrate-backend-firebase-to-supabase.md) ·
[ADR-003](adr/ADR-003-expo-and-repo-layout.md) · [CLAUDE.md](../CLAUDE.md)

---

### Feature List

A quick reference to all major platform features:

- User Registration & Login (OAuth)
- Profile Setup & Skill Tags
- Home Feed (Upcoming Events, Recommendations, Rejoin Suggestions)
- Event Creation & Discovery (with filter/sort)
- Join/Leave Events
- External Chatroom Links
- **Skill-Level-Relative Rating System** (core feature - multi-dimension, skill-context-aware, anonymous)
- Admin Dashboard (event management, attendance, calendar view)
- Social Profiles & Player Discovery (deferred)
- Club & League Management (deferred)
- QR Check-in & Metrics Panel (deferred)

---

### 🗺️ MVP Roadmap (Trimmed for Initial Release)

> Each item has a **stable step-ID** (`P1-auth`, `P2-rating-agg`, `D-league`, …). Reference the
> ID from PRs, tasks, and other docs — never a heading or line number. See
> [STATUS.md](../STATUS.md#docs-map--linking-convention) for the convention.

#### **Phase 1: Foundation (Weeks 1–4)** — `P1`

- **P1-auth** — User Registration & Login (OAuth via Google/LINE/Facebook)
- **P1-profile** — Profile Setup (Name, Skill Level, Preferred Position, Availability)
- **P1-skill-levels** — Skill Level System (S, A+, A, B+, B, C, under C)
- **P1-supabase** — Supabase project setup, PostgreSQL schema, and Row Level Security policies

#### **Phase 2: Core Rating System (Weeks 5–7)** — `P2`

- **P2-rating-flow** — Post-game rating interface with skill-level context + anonymous collection
  (friendliness, punctuality, skill assessment). See
  [rating flow](design/rating-system.md#rating-flow).
- **P2-rating-agg** — Skill-level assessment relative to game level (S, A+, A, B+, B, C, under C)
  and player skill-profile aggregation across game levels. See
  [aggregation logic](design/rating-system.md#aggregation-logic).
- **P2-events** — Basic event creation and discovery (simplified for MVP)
- **P2-join** — Join/Leave Events + Confirmation

#### **Phase 3: Game Management (Weeks 8–10)** — `P3`

- **P3-event-create** — Enhanced Event Creation Module (detailed fields and validation)
- **P3-discovery** — Event Discovery Module
  - **Skill-based filtering and recommendations** (using rating system data)
  - Filter by date, location, and skill level
  - Show real-time slot availability
- **P3-chat-link** — Add External Chatroom Link (LINE, Messenger)
- **P3-notifications** — Basic push notifications
- **P3-matching** — **Game matching recommendations** based on player skill profiles

#### **Phase 4: Host Tools (Weeks 11–12)** — `P4`

- **P4-host-dashboard** — Host Dashboard (My Events management)
- **P4-attendance** — Manual Attendance Tracking (Check-in / Late / No Show)
- **P4-calendar** — Calendar View for Gym Owners
- **P4-appstore** — App Store submission and review process

> **Note**: Timeline extended to 12 weeks to accommodate technical complexity and app store approval process.

#### **Deferred Features for Future Releases**

- **D-qr-checkin** — QR Code Check-in
- **D-follow** — Follow Organizer
- **D-rejoin** — Rejoin History
- **D-host-metrics** — Host Metrics Panel
- **D-league** — League & Club System
- **D-chat** — In-app Chat
- **D-tournament** — Tournament & Team Registration
- **D-heatmap** — Location Heatmap for Popular Games
- **D-skill-history** — Player Skill Tracking with Visual History

---

### 💡 Future Opportunities & Discussion Topics

#### `F-community` — 1. Community Engagement

- Player leveling system or badges
- Weekly MVP or attendance streak rewards
- Referral program to grow user base

#### `F-clubs` — 2. Club & League Features

- Organize clubs or player groups
- Enable league creation and management
  - Schedule games between teams
  - Display standings, win/loss records, and rankings

#### `F-gym` — 3. Gym & Host Expansion

- Host subscription model (e.g., pro features or analytics)
- Gym rental booking with payments
- API integration with gym scheduling software

#### `F-social` — 4. Social Profiles & Player Discovery

- Add Friends and build a trusted playing circle
- Search and view public player profiles
  - Includes rating summaries, event history, attendance, and tags
- Player tags are highlighted as badges on their profile
- Optional privacy settings for profile visibility
