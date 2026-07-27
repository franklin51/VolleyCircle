# STATUS

Living snapshot of active work. Check this first when starting a new session; update it before ending one. See [CLAUDE.md](CLAUDE.md#session-handoff) for the full handoff convention.

## Active now
_Nothing in flight — repo is still docs-only. Once work starts, add one line per active session/role/worktree here, e.g. `- [rating] feature/rating-core (worktree ../volleycircle-rating) — schema + RLS draft`._

## Recently completed
- **Vendored three process skills** adapted from [mattpocock/skills](https://github.com/mattpocock/skills) (MIT): `domain-modeling`, `tdd`, `to-tickets`. Rationale and the ~22 deliberately-skipped skills are recorded in `.claude/skills/README.md`. Note `tdd` is the likeliest collision with the local `superpowers` plugin — check on your machine and delete one if both fire
- **Rightsized agent context for Claude 5** (per Anthropic's "thin prompts, thick artifacts, thin skills" guidance): `CLAUDE.md` cut 106 → ~44 lines and turned into a pointer file; new root `CONTEXT.md` holds the domain vocabulary; added `.claude/skills/rating-system` and `.claude/skills/supabase-backend` so those rules load on demand instead of every turn. Also resolved the Redux contradiction (state management now explicitly **deferred**, `docs/spec/redux-toolkit.md` parked under `docs/spec/unused/`), marked the sub-agent template as aspirational rather than active policy, and replaced the `gh`-only handoff instructions with tool-agnostic ones
- Reorganized `docs/` into `design/`, `spec/`, `adr/`; adopted Supabase per ADR-002 and Expo per ADR-003
- Set up global Claude Code tooling: `karpathy-guidelines` and `paper-search` skills, `superpowers`/`episodic-memory`/`codex` plugins
- Rewrote `docs/design/claude_code_sub_agents_template_volley_circle_i_os_android_kanban_tdd.md` to match ADR-002/ADR-003 (Supabase + EAS throughout, no more Firebase/xcodebuild/gradlew references)
- Rewrote `docs/design/system-architecture.md` (schema, RLS, Edge Functions, CI/CD, data flow) and fixed remaining Firebase mentions in `docs/design/volleyball_mvp_roadmap.md` — all design docs now consistently reflect Supabase/Expo (ADR-002/ADR-003), no more mismatches
- Removed `docs/spec/firebase.md` (superseded — no live Firebase code to be "history" of; ADR-002 already covers the migration reasoning) and its two remaining references in `CLAUDE.md`/`docs/spec/supabase.md`

## Roadmap decisions taken (2026-07-27)
- **Check-in moved to Phase 2** (minimal `attended` only) — rating is gated on it, so Phase 2 couldn't ship without it. Late/No-Show + host dashboard stay in Phase 4
- **Skill level visibility settled** — earned governs matching, private to the player, with a host-approval exception. Recorded as [ADR-004](docs/adr/ADR-004-skill-level-visibility.md); several screen specs contradict it and need revising (listed in the ADR)
- **Phase 1 auth sequenced** — Google first, LINE as its own slice, Facebook deferred
- **Still open:** Sign in with Apple (App Store guideline 4.8 applies once social login ships — settle before building auth, not at submission); the 12-week timeline; Home screen spec lists two Deferred features as content blocks

## Needs your input (not blocking)
- **[docs/design/rating-open-questions.md](docs/design/rating-open-questions.md)** — 12 conflicts/gaps in the rating spec, each with quoted sources, a forcing scenario, and a recommended answer. Items 6 (self-rating is undetectable by design), 7 (anonymity is weak in small games), and 11 (unrated players default to `C`) are correctness/privacy issues — cheap to settle now, expensive after the schema ships. Answers then flow into `CONTEXT.md`, the design docs, and any ADR that earns one.

## Next up
- Phase 1 per the roadmap: user auth, profiles, skill level system setup — see Reference below (design docs are now Supabase/Expo-consistent, so scaffolding can start directly against them)

## Reference
- Roadmap / TODO: [docs/design/volleyball_mvp_roadmap.md](docs/design/volleyball_mvp_roadmap.md)
- Architecture: [docs/design/system-architecture.md](docs/design/system-architecture.md)
- Decisions: [docs/adr/](docs/adr/)
- Multi-agent workflow: [docs/design/claude_code_sub_agents_template_volley_circle_i_os_android_kanban_tdd.md](docs/design/claude_code_sub_agents_template_volley_circle_i_os_android_kanban_tdd.md)
