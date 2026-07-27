---
name: to-tickets
description: Break a plan or roadmap phase into tracer-bullet tickets with blocking declarations. Use when turning a spec, design doc, or roadmap section into actionable work items for VolleyCircle.
---

<!--
Adapted for VolleyCircle from mattpocock/skills (MIT).
Copyright (c) 2026 Matt Pocock — https://github.com/mattpocock/skills
Rewritten against this repo's vocabulary and conventions; upstream is not vendored verbatim.
-->

# To tickets

Turn a plan into vertical slices that can each be finished, demoed, and reviewed alone.

## 1. Gather context

Read the source — a roadmap phase, a design doc section, or the conversation so far.
Fetch referenced docs rather than working from memory of them.

## 2. Read the domain first

Check [CONTEXT.md](../../../CONTEXT.md) so tickets use the project's actual vocabulary,
and [docs/adr/](../../../docs/adr/) so they respect decisions already made. A ticket that
invents its own terms costs a translation step every time someone reads it.

## 3. Draft tracer-bullet slices

Each ticket:

- **cuts vertically through every layer** — for this repo usually migration → RLS policy →
  Edge Function (only if the logic can't be a plain client query) → app screen/hook →
  tests
- is **independently demoable** when done
- **fits in one context window**
- declares **blocking edges** only where work genuinely gates other work

Wide refactors are the exception: sequence them expand → migrate → contract (add the new
form, move callers in batches, delete the old form) rather than as one slice.

## 4. Quiz before publishing

Present a numbered breakdown — title, blockers, deliverables — and confirm the granularity
and the dependency graph with the user. Wrong blocking edges are more expensive than wrong
sizing, because they serialize work that could have run in parallel.

## 5. Publish

- **Local (default today):** one markdown file per ticket under
  `.scratch/<feature-slug>/issues/`, each with a `Blocked by:` line.
- **GitHub issues (once a tracker is settled):** create in dependency order so blocking
  references resolve, using native blocking relationships.

Work the frontier — tickets whose blockers are all closed.

## VolleyCircle notes

- The rating system is the core value; slices touching it need the anonymity and
  mutual-rating invariants stated in their acceptance criteria, not assumed. See the
  `rating-system` skill.
- Every slice that adds a table includes its RLS policies and allow/deny matrix in the
  same ticket — never as a follow-up.
- The roadmap's phases (`docs/design/volleyball_mvp_roadmap.md`) are the usual input;
  they are prose, not tickets, and need real decomposition.
