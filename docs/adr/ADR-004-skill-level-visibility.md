# ADR-004: Skill Level Visibility — Declared vs Earned

## Status
Accepted

## Date
2026-07-27

## Context

After the rating system ships (Phase 2), every player has **two** skill levels:

- **Declared** — chosen by the player at signup, stored on `profiles`. Available
  immediately, but unreliable: the product exists precisely because *"it's difficult for
  volleyball players to accurately assess their skill level"*
  ([roadmap](../design/volleyball_mvp_roadmap.md)).
- **Earned** — derived from peer ratings, stored as
  `player_skill_profiles.primary_skill_level`. Trustworthy once enough ratings exist, but
  absent for new players and thin early on.

Three parts of the app need to read *one* level: Explore filtering, game
recommendations, and what other players see on a profile. The roadmap did not say which,
and the two answers diverge as soon as ratings disagree with self-assessment — which is
the normal case, not the edge case.

The tension is not technical. Using the earned level is what makes the product work; it is
also how you tell someone they are worse than they thought. Volleyball players have real
ego investment in level, and a public demotion is the most likely moment for a user to
delete the app.

## Decision

**The earned level governs matching, and is private to the player.**

1. Once past the display threshold, **earned level drives** Explore filtering, game
   recommendations, and matching. Declared level is the provisional value used only until
   enough ratings exist.
2. **Only the player sees their own earned level.** It is not shown on public profiles or
   in player lists to other users.
3. **Exception — host approval.** A host evaluating a join request *for their own event*
   sees the requesting player's exact earned level. Hosts manually approve requests
   (roadmap §8), and matching the right players to the right game is the problem this
   product solves; the decision happens at the door, so the host needs the number.
4. **Players must be told** that hosts see it. Disclosure to hosts is acceptable;
   *undisclosed* disclosure is not, and would be worse for trust than showing the level
   publicly from the start.

## Consequences

### Positive
- The rating system is load-bearing rather than decorative — it changes which games people
  end up in, which is the entire product thesis.
- Players get better-matched games without a public marker they did not choose.
- Hosts keep enough information to run a coherent game.

### Negative
- **Hosts are peers, not administrators.** In a local volleyball scene hosts know the
  players and talk to each other, so earned levels will leak socially regardless of what
  the app displays. This was raised and accepted; the alternative (a coarse fit signal
  instead of the number) was considered and not chosen.
- Two levels must be maintained, with a defined handover point between them.
- Any UI showing "skill level" now has to be explicit about *which* one, and about
  audience.

### Requires follow-up
Several existing screen specs contradict this decision and need revising:

- **Profile screen** lists *"Skill level ratings by level"* and *"Cross-level skill
  assessment"* as profile content — must be self-only.
- **Event Detail** lists *"Player list: joined/remaining slots (avatars), skill badges"* —
  skill badges here would expose earned levels to every participant.
- **Host approval preview** currently says *"average rating badges"* — needs to state
  precisely what a host sees and when.

Open and unresolved: whether the friendliness and punctuality dimensions are also private.
This ADR covers **skill level only**. Those two are reputational rather than
ability-based and may warrant different treatment.

## Alternatives Considered

| Option | Reason Not Chosen |
|---|---|
| Earned level fully public | Most accurate and simplest to build, but publicly demotes players — highest churn risk, and effectively irreversible once shipped |
| Declared governs, earned advisory | Socially safest, but the rating system stops affecting outcomes and becomes decoration |
| Earned applies only on player consent | Preserves agency, but players rarely self-demote, so it converges on the advisory option in practice |
| Host sees a fit signal, not the number | Answers the host's real question with less leakage; rejected in favour of giving hosts the exact value |

## References
- [Roadmap — Player & Host Rating System](../design/volleyball_mvp_roadmap.md)
- [System architecture — Skill Assessment Algorithm](../design/system-architecture.md)
- [CONTEXT.md](../../CONTEXT.md) — declared vs earned vocabulary
- [Open questions in the rating spec](../design/rating-open-questions.md) — item 11 covers
  the `'C'` default, which interacts with the handover point defined here
