# STATUS

Living snapshot of active work. Check this first when starting a new session; update it before ending one. See [CLAUDE.md](CLAUDE.md#session-handoff) for the full handoff convention.

## Active now
_Nothing in flight — repo is still docs-only. Once work starts, add one line per active session/role/worktree here, e.g. `- [rating] feature/rating-core (worktree ../volleycircle-rating) — schema + RLS draft`._

## Recently completed
- Reorganized `docs/` into `design/`, `spec/`, `adr/`; adopted Supabase per ADR-002 and Expo per ADR-003
- Set up global Claude Code tooling: `karpathy-guidelines` and `paper-search` skills, `superpowers`/`episodic-memory`/`codex` plugins
- Rewrote `docs/design/claude_code_sub_agents_template_volley_circle_i_os_android_kanban_tdd.md` to match ADR-002/ADR-003 (Supabase + EAS throughout, no more Firebase/xcodebuild/gradlew references)
- Rewrote `docs/design/system-architecture.md` (schema, RLS, Edge Functions, CI/CD, data flow) and fixed remaining Firebase mentions in `docs/design/volleyball_mvp_roadmap.md` — all design docs now consistently reflect Supabase/Expo (ADR-002/ADR-003), no more mismatches
- Removed `docs/spec/firebase.md` (superseded — no live Firebase code to be "history" of; ADR-002 already covers the migration reasoning) and its two remaining references in `CLAUDE.md`/`docs/spec/supabase.md`
- Split the monolithic roadmap into single-source docs: `docs/design/volleyball_mvp_roadmap.md` → `docs/roadmap.md` (plan only, `git mv` so history follows) + new `design/rating-system.md` (CORE), `design/screens.md`, `design/design-system.md`; trimmed the duplicate rating-logic/design-token/tech-stack sections out of `system-architecture.md` to pointers; added stable step-IDs (`P1-auth`…) and section anchors. See the docs map below.

## Next up
- Phase 1 (`P1`) per the roadmap: `P1-auth`, `P1-profile`, `P1-skill-levels`, `P1-supabase` — see Reference below (design docs are now Supabase/Expo-consistent and single-source, so scaffolding can start directly against them)

## Docs map + linking convention

**Docs map** (each concern has exactly one home — link, don't duplicate):

| File | Owns (single source) |
| ---- | -------------------- |
| [docs/roadmap.md](docs/roadmap.md) | Plan only: phases P1–P4, timeline, feature list, backlog |
| [docs/design/rating-system.md](docs/design/rating-system.md) | **CORE** — rating flows, aggregation, skill algorithm, privacy |
| [docs/design/screens.md](docs/design/screens.md) | Navigation, 14 screen specs, screen-flow map |
| [docs/design/design-system.md](docs/design/design-system.md) | Colors/fonts + `theme` config |
| [docs/design/system-architecture.md](docs/design/system-architecture.md) | Backend, schema, RLS, CI/CD, i18n, security |
| [docs/adr/](docs/adr/) | Tech-stack **decisions** (ADR-002 Supabase, ADR-003 Expo) |

**Dedup rule:** rating logic, design-system tokens, and the tech-stack decision each live in
exactly one file above; every other doc links to it. This is what keeps two parallel sessions
from editing two copies.

**Linking convention (durable links):**
- **Roadmap steps** have stable IDs — `P1`–`P4` for phases, `P<n>-<slug>` for items
  (`P2-rating-agg`), `D-<slug>` for deferred, `F-<slug>` for future opportunities. Reference the
  **ID**, never a heading or line number. IDs never change even if wording/order moves.
- **Design-doc sections** use explicit anchors: `<a id="slug"></a>` above the heading, so links
  like `design/rating-system.md#aggregation-logic` survive heading rewrites.

## Reference
- Roadmap (plan): [docs/roadmap.md](docs/roadmap.md)
- Rating system (CORE): [docs/design/rating-system.md](docs/design/rating-system.md)
- Screens & navigation: [docs/design/screens.md](docs/design/screens.md)
- Design system: [docs/design/design-system.md](docs/design/design-system.md)
- Architecture: [docs/design/system-architecture.md](docs/design/system-architecture.md)
- Decisions: [docs/adr/](docs/adr/)
- Multi-agent workflow: [docs/design/claude_code_sub_agents_template_volley_circle_i_os_android_kanban_tdd.md](docs/design/claude_code_sub_agents_template_volley_circle_i_os_android_kanban_tdd.md)
