# CONTEXT — VolleyCircle domain language

Shared vocabulary for this project. Read this before writing code, tests, or schema so
names in the codebase match names in the design docs. Each term links to the doc that owns
the full detail — this file defines terms, it does not supersede specs.

Sources of truth: [system-architecture.md](docs/design/system-architecture.md) (schema,
algorithms) and [volleyball_mvp_roadmap.md](docs/design/volleyball_mvp_roadmap.md)
(product rules, flows).

> **These definitions transcribe the current design docs — they are not all settled.**
> Twelve conflicts and gaps in the rating spec are catalogued in
> [rating-open-questions.md](docs/design/rating-open-questions.md), including three
> thresholds that disagree (3 vs 5), a stored-but-unread `assessed_level`, and an
> undetectable self-rating path. Terms below marked **(open)** are among them — check
> there before implementing against them.

## Skill levels

Seven ordered levels, highest to lowest:

```
S  →  A+  →  A  →  B+  →  B  →  C  →  under C
```

`S` is pro, `under C` is beginner. This exact set is a DB `CHECK` constraint on
`ratings.game_skill_level`, `ratings.assessed_level`, and
`player_skill_profiles.primary_skill_level` — use these literal strings, including the
space in `under C`.

Every **event** has a designated skill level. That level is the frame of reference for
every rating collected at that event.

## The core idea: skill-level-relative rating

Ratings are **relative to the game's level, not absolute**. A player rated 5/5 at a `B`
game and a player rated 5/5 at an `S` game have not been told the same thing. Skill scores
are therefore kept **separately per level** — a player accumulates a distinct score for
each level they've played at, which is what lets them find the level where they actually
belong.

This is the product's primary value proposition. When a design question is ambiguous,
preserving relative-to-level meaning wins.

## Rating vocabulary

**Rating dimensions** — three, each `1–5`:
- **Friendliness** (`ratings.friendliness`)
- **Punctuality** (`ratings.punctuality`)
- **Skill Assessment** (`ratings.skill_level_rating`) — relative to the game's level

Plus `assessed_level` (which level the rater thinks the player actually belongs at),
optional `tags`, and an optional free-text `comment`.

**Mutual rating** — a player may rate only *mutual participants*: people who also checked
in to the same event. Enforced server-side against `event_participants.attended`, never
on the client. Test name for the rule: `blocksNonMutualPlayers`.

**Anonymity (structural)** — the `ratings` table has **no rater-identity column at all**.
Anonymity is not an RLS policy hiding a column; the identity is never captured. Writes go
through the `submit-rating` Edge Function with the service-role key after it verifies
mutual attendance. Raw `ratings` rows are never client-readable
(`FOR SELECT USING (false)`). Any change that would let a rater be inferred is a
correctness bug, not a preference.

**Host weight** — hosts rate like any participant, but a host's punctuality/attendance
ratings carry **double weight** versus peers. Flagged by `ratings.is_host_rating`.
**(open** — whether the doubling also applies to skill ratings is unresolved; the roadmap
and the schema comment disagree.**)**

**Rolling windows** — aggregation is windowed, not lifetime:
- Friendliness / Punctuality: last **20 events**, with a decay favoring recent ratings.
- Skill: last **30 ratings for that level only**, kept per level.

**(open** — "events" vs "ratings" are different units and one event yields many ratings;
the decay function is unspecified.**)**

**Two different "confidence" values — do not conflate them:**
- `ratings.confidence` (1–5): the **rater's self-reported** certainty about their
  assessment, stored per rating row.
- **Confidence score** (derived): the *system's* confidence in a player's aggregate skill
  score at a level, from rating count and consistency. Reaches max at ~5 ratings for that
  level (`calculateSkillConfidence`).

**Display threshold** — a score or badge is shown only after a minimum of **5 ratings** in
that category. Below the threshold it is withheld, not shown as zero or provisional.
**(open** — what "category" means per dimension, and why `determinePrimarySkillLevel`
uses 3 instead.**)**

**Declared level** vs **earned level** — two different things, and the distinction matters
in almost every conversation about skill:
- **Declared** is what the player picked at signup (`profiles`). Provisional.
- **Earned** is what their ratings produced (`player_skill_profiles.primary_skill_level`).

Earned governs matching once it exists, and is **private to the player** — except that a
host evaluating a join request for their own event sees it. See
[ADR-004](docs/adr/ADR-004-skill-level-visibility.md). When someone says "skill level",
ask which.

**Primary skill level** — the level a player is most credibly placed at, derived across
their per-level scores weighted by confidence; stored on `player_skill_profiles`. This is
the *earned* level.
**(open** — the current derivation multiplies score by confidence into one number, which
conflates "good" with "well-observed", and defaults to `C` when there is no evidence.**)**

**Badges** — the most frequent positive tags a player has received (e.g. "Team Player",
"Powerful Spiker"), surfaced on their profile. Same 5-rating threshold applies.

## Entities

| Term | Meaning |
|---|---|
| **Profile** | A player's account record (`profiles`), 1:1 with a Supabase Auth user. `is_public_profile` gates visibility. |
| **Event** | A scheduled game with a host, venue, time, capacity, and a designated skill level. Also called a "game". |
| **Host** | The player who created and runs an event; approves join requests manually, runs check-in, and gets weighted ratings. |
| **Participant** | A player joined to an event (`event_participants`), `status` of `confirmed` or `waitlisted`. |
| **Check-in** | The host marking `attended` at the event. Gates rating eligibility — no check-in, no rating rights. |
| **No-show** | A confirmed participant who never checked in; feeds attendance/punctuality reputation. |
| **Player skill profile** | Derived aggregate (`player_skill_profiles`), recomputed by an Edge Function after rating batches — never written by the client. |

## Conventions that follow from the above

- **RLS is the authorization boundary.** Client-side checks are UX, never enforcement.
  Every table ships with policies; anything relying on the client to be well-behaved is
  a bug.
- **Aggregation never runs on the client** — it reads across all of a player's ratings,
  which the client cannot see by design.
- **Test naming:** `<feature>/<component>.<behavior>.<state>.spec.ts`, e.g.
  `rating/submitRating.blocksNonMutualPlayers.spec.ts`.
- **Fixtures cover all seven levels.** Rating logic that passes only at `B` proves little.
- **UI strings are localized**, `zh-Hant` primary (`app/src/i18n/locales/zh-TW.json`,
  `en.json`). No hard-coded user-facing text.
