# Project skills

Skills committed to the repo, so every session and worktree gets them.

## Written for this project

| Skill | Kind | Fires on |
|---|---|---|
| `rating-system` | invariants | rating submission, aggregation, skill profiles, confidence, badges |
| `supabase-backend` | invariants | migrations, RLS, schema, Edge Functions |

## Adapted from [mattpocock/skills](https://github.com/mattpocock/skills) (MIT)

Copyright (c) 2026 Matt Pocock. Rewritten against this repo's vocabulary and conventions
rather than vendored verbatim; each file carries its own attribution header.

| Skill | Kind | Why |
|---|---|---|
| `domain-modeling` | process | The rating domain is subtle and *is* the product. Keeps `CONTEXT.md` honest instead of letting it drift. |
| `tdd` | process | The repo mandates TDD but only as a step list. This adds seams, vertical slicing, and named anti-patterns. |
| `to-tickets` | process | The roadmap is 660 lines of prose; Phase 1 needs vertical slices with real blocking edges. |

### Deliberately not adopted

Recorded so future sessions don't re-litigate. Upstream has ~25 skills; adding all of them
would recreate the over-constrained context that
[Anthropic's Claude 5 guidance](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models)
warns about, and that this repo's context pass deliberately cut.

- **`code-review`** — Claude Code ships `/code-review` and `/security-review`. A third
  overlapping reviewer is the exact conflicting-instruction problem to avoid.
- **`diagnosing-bugs`, `codebase-design`, `improve-codebase-architecture`,
  `resolving-merge-conflicts`, `prototype`** — need code that doesn't exist yet. Worth
  revisiting once `app/` and `supabase/` are real.
- **`triage`, `wayfinder`, `to-spec`** — need a chosen issue tracker. `to-tickets` covers
  the immediate need.
- **`grill-me`, `grilling`, `handoff`, `teach`, `research`** — personal workflow
  preferences. Install locally if you want them; they don't belong to this repo.

### Known conflict risk

`tdd` is the most likely to collide with globally-installed skills or plugins (the
`superpowers` plugin in particular — see `STATUS.md`). If a local TDD skill also fires,
delete one. Two competing TDD disciplines are worse than either alone.
