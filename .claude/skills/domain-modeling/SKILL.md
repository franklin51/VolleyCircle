---
name: domain-modeling
description: Build and sharpen VolleyCircle's domain model. Use when pinning down terminology, when a term in discussion conflicts with CONTEXT.md, when deciding whether something warrants an ADR, or when another skill needs the domain model kept honest.
---

<!--
Adapted for VolleyCircle from mattpocock/skills (MIT).
Copyright (c) 2026 Matt Pocock — https://github.com/mattpocock/skills
Rewritten against this repo's vocabulary and conventions; upstream is not vendored verbatim.
-->

# Domain modeling

Build the model actively — don't passively read the docs back. Challenge terminology as it
comes up and record decisions the moment they resolve.

The glossary is [CONTEXT.md](../../../CONTEXT.md) at the repo root. Decisions live in
[docs/adr/](../../../docs/adr/). VolleyCircle is a single-context codebase; if it ever
splits, move to `CONTEXT-MAP.md` pointing at per-context glossaries.

## Discipline during a session

**Enforce the vocabulary.** When someone's wording conflicts with a definition already in
`CONTEXT.md`, surface it immediately rather than quietly picking one:
> "CONTEXT.md defines *confidence score* as the system's derived trust in an aggregate,
> but you're describing the rater's 1–5 self-report — which do you mean?"

**Sharpen vague terms.** Propose a canonical name when language is loose:
> "When you say 'rating', do you mean a single `ratings` row, or the aggregate on
> `player_skill_profiles`? Those are different objects with different visibility rules."

**Stress-test with edge cases.** Probe boundaries with concrete scenarios, not abstractions.
This domain's productive edges: a level a player has never played, exactly-at-threshold
rating counts, a four-person event, a host who isn't an `event_participants` row, a rating
window that rolls over mid-aggregation.

**Check code against the model.** Flag drift in both directions — code that contradicts a
definition, and definitions that no longer describe the code.

**Write it down immediately.** Update `CONTEXT.md` when a term resolves, in the same
session. The glossary stays conceptual and implementation-agnostic: it defines what a term
*means*, not which function computes it.

## When something deserves an ADR

Propose one only when **all three** hold:

1. Reversing it later carries meaningful cost.
2. A future reader would ask "why did they do it this way?" without the context.
3. Genuine alternatives existed at the time.

Two out of three is a glossary entry, not an ADR. This is why the deferred
state-management call in `system-architecture.md` is a note rather than ADR-004 —
recording a non-decision as a decision is its own failure mode.

## Files

- Create `CONTEXT.md` entries when the first version of a term solidifies — not
  speculatively.
- Number ADRs sequentially, following the existing format in
  [ADR-002](../../../docs/adr/ADR-002-migrate-backend-firebase-to-supabase.md).
