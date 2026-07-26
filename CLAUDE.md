# CLAUDE.md

VolleyCircle is a volleyball skill-level matching platform. Players rate each other
*relative to the game's skill level*, which is how the app helps people find games at
their actual level. That rating system is the product's core value and the development
priority.

**Read [CONTEXT.md](CONTEXT.md) first** — it defines the domain vocabulary (skill levels,
mutual rating, host weight, confidence, aggregation windows) used throughout the code and
docs.

## Where things live

| | |
|---|---|
| Domain vocabulary | [CONTEXT.md](CONTEXT.md) |
| Product spec & roadmap | [docs/design/volleyball_mvp_roadmap.md](docs/design/volleyball_mvp_roadmap.md) |
| Architecture, schema, RLS, algorithms | [docs/design/system-architecture.md](docs/design/system-architecture.md) |
| Decisions (Supabase, Expo) | [docs/adr/](docs/adr/) |
| Stack, layout, commands | [README.md](README.md) |
| Target multi-agent workflow | [docs/design/claude_code_sub_agents_template_volley_circle_i_os_android_kanban_tdd.md](docs/design/claude_code_sub_agents_template_volley_circle_i_os_android_kanban_tdd.md) (aspirational, not current policy) |

`docs/spec/` holds framework reference dumps. They are optional background, not required
reading.

## Project rules

- **RLS is the authorization boundary.** Client-side checks are UX only. Every table gets
  policies plus an allow/deny test matrix.
- **Rating anonymity is structural** — the `ratings` table has no rater-identity column.
  Don't add one, and don't add a read path that lets a rater be inferred.
- **UI strings are localized**, `zh-Hant` primary. No hard-coded user-facing text.
- **Never log PII.** No plaintext secrets — use `.env` templates and Supabase secrets.
- **Local Supabase stack only.** Never point migrations or tooling at prod.

## Session handoff

Multiple sessions may work this repo in parallel, typically one per worktree/branch.

- **Starting:** read [STATUS.md](STATUS.md), then check `git worktree list` and open
  PRs/issues (`gh` locally, or the GitHub MCP tools in web/remote sessions).
- **Ending:** update STATUS.md and any docs your changes affected.
