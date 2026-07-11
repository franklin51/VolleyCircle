# STATUS

Living snapshot of active work. Check this first when starting a new session; update it before ending one. See [CLAUDE.md](CLAUDE.md#session-handoff) for the full handoff convention.

## Active now
_Nothing in flight — repo is still docs-only. Once work starts, add one line per active session/role/worktree here, e.g. `- [rating] feature/rating-core (worktree ../volleycircle-rating) — schema + RLS draft`._

## Recently completed
- Reorganized `docs/` into `design/`, `spec/`, `adr/`; adopted Supabase per ADR-002 and Expo per ADR-003
- Set up global Claude Code tooling: `karpathy-guidelines` and `paper-search` skills, `superpowers`/`episodic-memory`/`codex` plugins
- Rewrote `docs/design/claude_code_sub_agents_template_volley_circle_i_os_android_kanban_tdd.md` to match ADR-002/ADR-003 (Supabase + EAS throughout, no more Firebase/xcodebuild/gradlew references)

## Next up
- Phase 1 per the roadmap: user auth, profiles, skill level system setup — see Reference below

## Reference
- Roadmap / TODO: [docs/design/volleyball_mvp_roadmap.md](docs/design/volleyball_mvp_roadmap.md)
- Architecture: [docs/design/system-architecture.md](docs/design/system-architecture.md)
- Decisions: [docs/adr/](docs/adr/)
- Multi-agent workflow: [docs/design/claude_code_sub_agents_template_volley_circle_i_os_android_kanban_tdd.md](docs/design/claude_code_sub_agents_template_volley_circle_i_os_android_kanban_tdd.md)
