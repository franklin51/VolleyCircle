---
name: tdd
description: Red-green-refactor discipline for VolleyCircle. Use when writing tests, building a feature test-first, or when asked to add coverage for rating logic, RLS policies, or Edge Functions.
---

<!--
Adapted for VolleyCircle from mattpocock/skills (MIT).
Copyright (c) 2026 Matt Pocock — https://github.com/mattpocock/skills
Rewritten against this repo's vocabulary and conventions; upstream is not vendored verbatim.
-->

# TDD

1. **Red** — write a failing test.
2. **Green** — minimum code to pass it.
3. **Refactor** — a separate review stage, *not* part of the loop.

## Seams

A seam is the public boundary where behavior is observable. **Identify and confirm the
seams before writing tests** — this is what keeps effort on critical paths instead of
exhaustive edge cases. Don't test at a seam nobody has agreed to.

VolleyCircle's real seams:

- the `submit-rating` Edge Function's request/response — not its internals
- RLS policy outcomes: does role X get a row back, yes or no
- the aggregation output on `player_skill_profiles` — not intermediate arithmetic
- rendered screen behavior — not component state

## Work vertically

One test → one implementation → repeat. Do **not** write all the tests up front; that
tests imagined behavior rather than real behavior and bakes in a brittle structure before
you know the shape of the code.

For this repo a vertical slice usually cuts migration → RLS policy → Edge Function → app
call → test, thin enough to demo.

## Anti-patterns

**Tautological tests.** The live risk here. Asserting an aggregate by recomputing it the
same way the implementation does proves nothing:

```ts
// useless — recomputes the code's own logic
expect(profile.overall_punctuality).toBe((a * 2 + b + c) / 4);
```

Expected values come from an independent source of truth: a hand-worked fixture, a table
of known inputs and outputs, a figure agreed in the spec.

**Implementation-coupled tests.** Mocking internals or reaching for private functions.
These break on refactor even when behavior is unchanged. Code should be able to change
entirely while the tests stand.

**Horizontal slicing.** All tests first, implementation later. See above.

## Conventions

- Name tests `<feature>/<component>.<behavior>.<state>.spec.ts` —
  e.g. `rating/submitRating.blocksNonMutualPlayers.spec.ts`.
- RLS work ships an allow/deny matrix: for each role, assert both what is permitted and
  what is refused. Deny cases catch the regressions.
- Rating fixtures cover all seven skill levels; logic that passes only at `B` proves
  little.
