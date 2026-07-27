# Rating system — open questions

Ambiguities and conflicts in the current rating spec, found while writing
[CONTEXT.md](../../CONTEXT.md). Each has the conflicting sources quoted, a scenario that
forces the issue, and a recommended answer.

**Nothing here blocks other work.** Answer at your own pace. But items 6, 7, and 11 are
correctness/privacy issues rather than modelling preferences, and all three are cheap now
and expensive after the schema ships.

Once answered: apply to `CONTEXT.md`, correct the source docs, and open an ADR for any
answer that meets the three-condition test in the `domain-modeling` skill.

---

## 1. What does "5 ratings in a category" gate?

**Sources.** Roadmap: *"Only display score or badge after minimum 5 ratings in a
category."* Architecture: `Math.min(levelRatings.length / 5, 1)`.

"Category" is doing unexamined work. Skill scores are per-level; friendliness and
punctuality are global rolling averages with no level dimension. The same word can't mean
the same thing for both.

**Scenario.** A player has 4 A-level ratings and 20 B-level ratings. What shows?

**Recommended.** Per-dimension: skill gated per level (so A stays hidden, B shows);
friendliness/punctuality gated globally at 5 total, since they were never level-relative.

---

## 2. Three different thresholds are in play

**Sources.** Roadmap says display at **5**. `calculateSkillConfidence` saturates at **5**.
`determinePrimarySkillLevel` filters at `data.ratingsReceived >= 3`.

The 3 and the 5 sit ten lines apart in the same code block and are never reconciled.

**Scenario.** A player has 3 A-level ratings. They're eligible to have A chosen as their
*primary* level, but not eligible to *see* their A score. The app would show a primary
level with no visible evidence behind it.

**Recommended.** One number: 5. Use it for display, confidence saturation, and primary-level
eligibility. If a lower bar for primary level is genuinely wanted, it needs its own
justification — right now the 3 reads like a leftover.

---

## 3. `calculateSkillConfidence` doesn't return a confidence

**Source.** `return avgRating * confidence;`

The function multiplies *how good* by *how sure* and returns one number. Those are
different quantities and the product is ambiguous.

**Scenario.** Player X: average 5.0 from 1 rating → `5.0 × 0.2 = 1.0`. Player Y:
average 1.0 from 5 ratings → `1.0 × 1.0 = 1.0`. Identical output; opposite meanings —
one is possibly excellent, the other is reliably weak.

Worse, `determinePrimarySkillLevel` **sorts by this value**, so it systematically biases
toward well-observed levels: a player averaging 5.0 at A over 3 ratings (`3.0`) loses to
averaging 3.2 at B over 5 ratings (`3.2`), and gets labelled B despite being demonstrably
stronger at A.

**Recommended.** Return the two separately — `{ score, confidence }` — and decide
explicitly how primary level trades them off. Also: `levelRatings.length` of 0 makes
`avgRating` `NaN`; guard it.

---

## 4. `assessed_level` is stored but never read

**Sources.** Schema: `assessed_level TEXT CHECK (... seven levels ...)`. But
`calculateSkillConfidence` filters on `r.gameSkillLevel === level` and averages
`skillLevelRating` only.

Every rating captures a rater's categorical guess at the player's true level, and nothing
consumes it. Meanwhile `primary_skill_level` — the thing `assessed_level` is the obvious
input for — is derived purely from 1–5 scores.

**Scenario.** Twelve people rate a player at a B game, all marking `assessed_level = 'A'`.
The system has twelve direct opinions that this player is an A, and ignores every one of
them.

**Recommended.** Make `assessed_level` the primary input to `primary_skill_level` (it is
literally the question being asked), with `skill_level_rating` as the within-level
performance signal. Alternative: drop the column. Storing an unread field invites someone
to "fix" it later by inventing semantics.

---

## 5. Do the rolling windows count events or ratings?

**Sources.** Roadmap: friendliness/punctuality use *"last 20 events"*; skill uses
*"last 30 ratings for that level only."*

One event yields many ratings for a player, so these units aren't comparable.

**Scenario.** A player attends one 16-person game and gets 15 ratings. Is that 1/20th of
their friendliness window, or 15/20ths of it?

**Recommended.** Ratings for both, since that's what actually lands in the table — 20
ratings and 30 ratings respectively. If "events" was deliberate (one aggregated
impression per event, so a big game can't swamp the average), say so explicitly, because
it needs a per-event pre-aggregation step nothing currently describes.

---

## 6. Nothing prevents self-rating

**Source.** `submit-rating` *"verifies mutual attendance via `event_participants`"*.

Mutual attendance doesn't exclude the rater themselves — they attended. And because
`ratings` has no rater identity by design, a self-rating is **undetectable after the
fact**. There's no query that finds them and no way to clean them up retroactively.

**Scenario.** A player submits ten 5-star skill ratings on themselves for one event. The
rows are indistinguishable from genuine ones, forever.

**Recommended.** Explicit `rated_user_id != caller` check in the Edge Function, plus a
uniqueness guard so one rater can't rate the same person twice per event. The second part
is the harder half: with no `rater_id`, a per-event dedup key has to live somewhere the
`ratings` table can't see it — e.g. a separate `rating_submissions(event_id, rater_id,
rated_user_id)` table holding *only* the fact that a submission happened, never the
content. That keeps ratings anonymous while making double-submission detectable. Worth an
ADR.

---

## 7. Anonymity is weak in small games

**Source.** *"Structural anonymity: the `ratings` table has no rater-identity column."*

Structural anonymity protects against reading the database. It does not protect against
inference from aggregates plus a known attendee list — and attendee lists are visible to
participants by design.

**Scenario.** A 4-person game. Three players rate the fourth. That player knows exactly
who the three raters are; if their average moves and only three ratings exist, the space
of possibilities is tiny. With two raters it's near-total exposure.

The cross-event 5-rating display threshold helps but doesn't solve it — it delays display
without bounding inference, and a determined observer can difference their aggregate
before and after a known small event.

**Recommended.** Add a minimum-raters-per-event gate (suggest 3, i.e. don't let a single
event's ratings move a visible aggregate unless at least 3 people rated that player at it),
and don't expose per-event rating breakdowns. Worth an ADR — it constrains the product
(small games contribute nothing) and reversing it later means retroactively re-exposing
data.

---

## 8. Does host weight apply to skill ratings?

**Sources.** Roadmap: *"Host's punctuality/attendance ratings are double weight compared
to peers."* Schema: `is_host_rating BOOLEAN ... -- host ratings get extra weight in
aggregation`.

The roadmap scopes it to punctuality/attendance. The schema comment says "host ratings"
without qualification. One flat boolean can't express a per-dimension rule on its own —
the weighting has to be applied dimension-by-dimension in the aggregation code.

**Scenario.** A host rates a player 5 for skill. Does that count once or twice?

**Recommended.** Punctuality and attendance only, as the roadmap says. A host has
privileged knowledge of who showed up on time; they have no privileged knowledge of how
well someone plays. Correct the schema comment to match.

---

## 9. Is the host a ratable participant?

**Source.** *"Can rate only mutual participants (those who also checked in)."*

Hosts may not have an `event_participants` row at all — they're on `events.host_id`. If
mutual-participant status is defined by that table, the host is unratable, and the "host
rating" flow the roadmap describes is one-directional.

**Scenario.** A host runs a game and plays in it. Can attendees rate them? Does the host
have a skill profile?

**Recommended.** Hosts who play get an `event_participants` row like anyone else and are
fully ratable; `is_host_rating` marks ratings they *give*, not their participation.
Hosts who only organize and don't play are not ratable for skill — but arguably still
need reputation for reliability, which is a separate mechanism nothing currently covers.

---

## 10. Can a player be assessed at a level they've never played?

**Source.** `assessed_level` accepts all seven values regardless of `game_skill_level`.

**Scenario.** A player is rated `assessed_level = 'S'` at a `B` game. Do they now have an
S-level data point, despite never having played an S game?

**Recommended.** No. `assessed_level` is *evidence about* the player, not a data point
*at* that level; per-level scores stay keyed on `game_skill_level` (where they actually
played). Depends on the answer to item 4.

---

## 11. `determinePrimarySkillLevel` defaults to `'C'`

**Source.** `return (levels[0]?.[0] as SkillLevel) || 'C'; // Default to C if no ratings`

`C` is a real, meaningful level — sixth of seven. A brand-new player with zero ratings is
silently asserted to be a C player, and nothing downstream can distinguish "we assessed
them as C" from "we know nothing."

**Scenario.** A new user signs up and immediately gets matched to C-level games, and shows
other players a C badge, on the basis of no evidence at all.

**Recommended.** `primary_skill_level` stays `NULL` until the threshold is met — the column
is already nullable. Handle "unrated" explicitly in matching and UI. Related: the
self-declared skill level from onboarding may be the right provisional value, but that's a
different field with different trust, and shouldn't be silently merged into this one.

---

## 12. The decay function is unspecified

**Source.** *"Rolling average of last 20 events, with a decay function to weight recent
more heavily."*

No form, no half-life, no parameters.

**Recommended.** Simplest defensible choice: linear decay across the window (most recent
rating weight 1.0, oldest 1/N). Exponential with a tunable half-life is more expressive
but adds a parameter nobody has a basis to set yet. Pick one and write the formula down —
"a decay function" is not implementable.
