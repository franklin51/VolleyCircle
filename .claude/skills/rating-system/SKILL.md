---
name: rating-system
description: Invariants for VolleyCircle's core skill-level-relative rating system. Use when writing, changing, or reviewing rating submission, rating aggregation, skill profiles, confidence scores, badges/tags, or anything touching the ratings or player_skill_profiles tables.
---

# Rating system invariants

Domain terms are defined in [CONTEXT.md](../../../CONTEXT.md); schema and algorithms live
in [system-architecture.md](../../../docs/design/system-architecture.md). This skill
carries only the rules that are expensive to get wrong.

## Non-negotiable

1. **Mutual participants only.** A rater may rate someone only if *both* checked in to
   the same event (`event_participants.attended`). Verified server-side in the
   `submit-rating` Edge Function — never trusted from the client.

2. **Anonymity is structural.** `ratings` has no rater-identity column and must never gain
   one. Don't add `rater_id`, don't add a "just for auditing" reference, and don't add a
   read path (view, join, aggregate over a small group, `count(*)` on a narrow filter)
   from which a rater can be inferred. Raw rows stay unreadable by clients
   (`FOR SELECT USING (false)`); all writes go through the Edge Function's service-role
   key.

3. **Ratings are relative to the game's level.** Store `game_skill_level` on every rating
   and keep skill scores **separate per level**. Never collapse per-level scores into one
   lifetime average — the per-level split is the product.

4. **Host ratings weigh double** on punctuality/attendance, keyed off
   `ratings.is_host_rating`.

5. **Display is gated by the threshold.** Show a score or badge only after **5 ratings**
   in that category. Below it, withhold — don't render 0, "N/A as a number", or a
   provisional value that looks real.

6. **Aggregation never runs on the client.** It reads across all of a player's ratings,
   which clients cannot see by design. Edge Function or scheduled `pg_cron` only;
   `player_skill_profiles` is derived and never client-written.

## Easy things to get wrong

- **Two different "confidence" values.** `ratings.confidence` (1–5) is the *rater's*
  self-reported certainty on that one row. The *confidence score* is the system's
  derived trust in a player's aggregate score at a level. They are not interchangeable
  and should not share a variable name.
- **Windows are rolling, not lifetime.** Friendliness/punctuality: last 20 events with
  recency decay. Skill: last 30 ratings *for that level only*.
- **`under C` has a space** and is a literal `CHECK` constraint value, like the other six
  levels. Don't normalize, slugify, or lowercase it in queries.

## Testing

- Name tests `<feature>/<component>.<behavior>.<state>.spec.ts` —
  e.g. `rating/submitRating.blocksNonMutualPlayers.spec.ts`.
- Fixtures must cover **all seven levels**; logic that passes only at `B` proves little.
- Every rating change needs cases for: non-mutual rejection, anonymity of the stored row,
  per-level separation, host double-weight, threshold gating above and below 5, and
  window rolloff.
