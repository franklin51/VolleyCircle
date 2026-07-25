# VolleyCircle — Player & Host Rating System (CORE)

> **This is the main feature that solves the core problem of skill-level matching in volleyball
> communities.**

**Single source of truth** for the rating system: the before/after-game rating flows, the
aggregation strategy, the skill-assessment algorithm, and the privacy/anonymity model. The
architecture doc references this file for rating logic and keeps only schema/RLS/Edge-Function
concerns. See [roadmap](../roadmap.md) (item `P2-rating-flow` / `P2-rating-agg`),
[system-architecture.md](system-architecture.md) for how it is stored, and
[STATUS.md](../../STATUS.md) for the docs map + linking convention.

---

<a id="rating-flow"></a>

## Rating Flow (Before & After Game)

### Player Perspective

- **Before Game:**
  - Players can see a list of confirmed participants.
  - Tap to view basic info: name, role tags, average friendliness/punctuality badges, and attendance history.
- **After Game:**
  - Can rate only mutual participants (those who also checked in).
  - Horizontal scroll view: avatar + first name, quick 1–5 star rating (skip if desired).
  - “More” button for detailed dimensions: Friendliness, Punctuality, Skill, Optional Comment.
  - Can add public tags (“Team Player”, “Powerful Spiker”) to others.
  - Ratings and tags are anonymous.

### Host Perspective

- **Before Game:**
  - Can preview average rating badges and attendance history for each registrant.
  - Can manually approve or reject join requests based on this info (not auto-filtered).
- **After Game:**
  - Can rate players like any participant, but host’s ratings on punctuality/attendance have extra weight.
  - Can add private notes and public tags to each player.
  - Does not see individual feedback from others; uses rating summaries as reference only.

### Guiding Principles

- **Skill-relative ratings** help players understand their true skill level across different game contexts.
- **Game matching improvement**: Better skill assessment leads to more balanced, enjoyable games.
- Friendliness and punctuality scores encourage positive community behavior.
- **Anonymous and safe**: All ratings are anonymous to prevent conflicts while enabling honest feedback.
- **Cross-level insights**: Players can see how they perform at different skill levels to find their optimal game level.

---

<a id="aggregation-logic"></a>

## Rating Aggregation Logic

### 1. Score Calculation Strategy

- **General Ratings (Friendliness, Punctuality):**
  - Rolling average of last 20 events, with a decay function to weight recent more heavily.
  - Host's punctuality/attendance ratings are double weight compared to peers.
- **Skill Level Ratings (CORE FEATURE):**
  - Separate scores per event level (S, A+, A, B+, B, C, under C).
  - Each level keeps rolling window of last 30 ratings for that level only.
  - **Relative Assessment**: Players rate others based on performance relative to the game's designated skill level.
  - **Confidence Scoring**: System calculates confidence in skill assessment based on number of games and rating consistency.
  - Example: If you played 5 A+ games, 10 A games, and 15 B+ games, you'll have skill ratings for A+ and A levels, helping you find the right game level.

### 2. Display Format

- **Profile View:** Show rounded average score (two decimal places) for each dimension and each event level.
- **Badges:** Most common positive tags from player ratings appear as badges (e.g., “Team Player”, “Powerful Spiker”).
- **Threshold:** Only display score or badge after minimum 5 ratings in a category.

---

<a id="skill-algorithm"></a>

## Skill Assessment Algorithm

The rating system is the cornerstone of VolleyCircle, solving the fundamental problem of skill-level mismatch in volleyball communities.

### How It Works

1. **Game Context**: Every game has a designated skill level (S, A+, A, B+, B, C, under C)
2. **Relative Rating**: Players rate others based on performance *relative to that game's skill level*
3. **Cross-Level Analysis**: System aggregates ratings across different game levels to determine true skill
4. **Dynamic Profiling**: Player skill profiles update after each rated game

### Rating Calculation

```typescript
// Skill level confidence calculation
function calculateSkillConfidence(level: SkillLevel, ratings: Rating[]): number {
  const levelRatings = ratings.filter(r => r.gameSkillLevel === level);
  const avgRating = levelRatings.reduce((sum, r) => sum + r.dimensions.skillLevelRating, 0) / levelRatings.length;
  const confidence = Math.min(levelRatings.length / 5, 1); // Max confidence after 5 games
  return avgRating * confidence;
}

// Primary skill level determination
function determinePrimarySkillLevel(profile: PlayerSkillProfile, ratings: Rating[]): SkillLevel {
  const levels = Object.entries(profile.skillLevels)
    .filter(([_, data]) => data.ratingsReceived >= 3) // Minimum threshold
    .sort(([levelA], [levelB]) => {
      const confidenceA = calculateSkillConfidence(levelA as SkillLevel, ratings);
      const confidenceB = calculateSkillConfidence(levelB as SkillLevel, ratings);
      return confidenceB - confidenceA;
    });

  return (levels[0]?.[0] as SkillLevel) || 'C'; // Default to C if no ratings
}
```

This aggregation runs inside an Edge Function (or a scheduled `pg_cron` job) after ratings are inserted — never on the client, since it needs to read across all ratings for a player.

### Game Matching Logic

- **Exact Match**: Recommend games at player's primary skill level
- **Challenge Mode**: Suggest games 1 level above (if confidence is high)
- **Comfort Zone**: Suggest games 1 level below (for practice or fun)
- **Avoid Mismatch**: Prevent >2 level differences to maintain game quality

---

<a id="privacy-anonymity"></a>

## Privacy & Anonymity

- **Structural anonymity**: The `ratings` table has no rater-identity column at all — not "stored then hidden by a rule," but never captured in the first place. See [Database Schema Design](system-architecture.md#database-schema-design).
- **Validation without identity**: Mutual-participation checks ("can this caller rate this player?") happen inside the `submit-rating` Edge Function against `event_participants`, using the caller's JWT to identify *them*, before the function switches to the service-role key to perform the actual insert — so the validation step and the storage step use different credentials, and only the validation step ever sees who's rating whom.
- **Aggregated Display**: Only show statistical summaries (`player_skill_profiles`), never individual ratings — enforced by RLS denying all direct `SELECT`s on `ratings`.
- **Retroactive Protection**: Since no rater identity is ever persisted, there's nothing for a data breach or admin query to expose — this is stronger than Firebase's original design, which kept a separate `RatingAudit` collection with `raterId` for abuse prevention. If abuse prevention needs a paper trail later, it should be a short-retention log outside the `ratings` table, not a permanent link.
