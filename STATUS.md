# STATUS

Living snapshot of active work. Check this first when starting a new session; update it before ending one. See [CLAUDE.md](CLAUDE.md#session-handoff) for the full handoff convention.

## Active now
_Nothing in flight — repo is still docs-only. Once work starts, add one line per active session/role/worktree here, e.g. `- [rating] feature/rating-core (worktree ../volleycircle-rating) — schema + RLS draft`._

## Recently completed
- **Rightsized agent context for Claude 5** (per Anthropic's "thin prompts, thick artifacts, thin skills" guidance): `CLAUDE.md` cut 106 → ~44 lines and turned into a pointer file; new root `CONTEXT.md` holds the domain vocabulary; added `.claude/skills/rating-system` and `.claude/skills/supabase-backend` so those rules load on demand instead of every turn. Also resolved the Redux contradiction (state management now explicitly **deferred**, `docs/spec/redux-toolkit.md` parked under `docs/spec/unused/`), marked the sub-agent template as aspirational rather than active policy, and replaced the `gh`-only handoff instructions with tool-agnostic ones
- Reorganized `docs/` into `design/`, `spec/`, `adr/`; adopted Supabase per ADR-002 and Expo per ADR-003
- Set up global Claude Code tooling: `karpathy-guidelines` and `paper-search` skills, `superpowers`/`episodic-memory`/`codex` plugins
- Rewrote `docs/design/claude_code_sub_agents_template_volley_circle_i_os_android_kanban_tdd.md` to match ADR-002/ADR-003 (Supabase + EAS throughout, no more Firebase/xcodebuild/gradlew references)
- Rewrote `docs/design/system-architecture.md` (schema, RLS, Edge Functions, CI/CD, data flow) and fixed remaining Firebase mentions in `docs/design/volleyball_mvp_roadmap.md` — all design docs now consistently reflect Supabase/Expo (ADR-002/ADR-003), no more mismatches
- Removed `docs/spec/firebase.md` (superseded — no live Firebase code to be "history" of; ADR-002 already covers the migration reasoning) and its two remaining references in `CLAUDE.md`/`docs/spec/supabase.md`

## Next up
- Phase 1 per the roadmap: user auth, profiles, skill level system setup — see Reference below (design docs are now Supabase/Expo-consistent, so scaffolding can start directly against them)

## Reference
- Roadmap / TODO: [docs/design/volleyball_mvp_roadmap.md](docs/design/volleyball_mvp_roadmap.md)
- Architecture: [docs/design/system-architecture.md](docs/design/system-architecture.md)
- Decisions: [docs/adr/](docs/adr/)
- Multi-agent workflow: [docs/design/claude_code_sub_agents_template_volley_circle_i_os_android_kanban_tdd.md](docs/design/claude_code_sub_agents_template_volley_circle_i_os_android_kanban_tdd.md)
