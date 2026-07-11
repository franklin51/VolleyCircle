# 🤖 Claude Code Sub‑Agents — Project Template

> **Project:** VolleyCircle (React Native + Expo + Supabase) **Methodology:** Kanban + TDD, tiny PRs, trunk‑based with protected `main` **Goal:** Safely coordinate multiple Claude Code sub‑agents as a virtual dev team

---

## 0) Global Guardrails (apply to all agents)

- **Never push to **``**.** Only create branches and open PRs.
- **Max patch size:** ≤ 250 lines changed per PR (enforced by CI).
- **CODEOWNERS enforced**; agents can only touch directories they own.
- **TDD rhythm:** *add failing tests → make green → refactor*.
- **Output policy:** Prefer **unified diffs** + **structured JSON summaries**.
- **Secrets:** No plaintext keys. Use `.env` templates and Supabase secrets.
- **i18n:** Keep strings in localization files; no hard‑coded UI text.
- **Privacy:** Never log PII; use redaction helpers.

```
/.github/workflows/      (owner: @you ReleaseOps)
/eas.json, app.json      (owner: @you ReleaseOps)      # EAS Build config; no committed native ios/android folders
/app/src/                (owner: Feature Owners below)
/app/src/rating/         (owner: Rating System Dev)
/app/src/events/         (owner: Events & Discovery Dev)
/app/src/host/           (owner: Host Tools Dev)
/app/src/profile/        (owner: Auth & Profile Dev)
/supabase/functions/     (owner: Backend/Supabase Dev)
/supabase/migrations/    (owner: Backend/Supabase Dev)
/scripts/                (owner: Repo Guardian)
/docs/                   (owner: Docs/Comms)
```

**Required status checks:** `lint`, `unit-tests`, `ui-tests`, `eas-build`, `policy`, `typecheck`.

---

## 1) Agent Directory (roles, scopes, prompts)

### 1. Planner/PM Agent

- **Mission:** Convert feature docs into Kanban cards with acceptance criteria and a TDD test list.
- **Scope:** Create/Update `/docs/specs/*.md`, label GitHub issues, no code changes.
- **Inputs:** Feature doc link, roadmap phase, UI flows.
- **Outputs:** Issue(s) with AC, Risks, and **Test‑First Checklist**.
- **Trigger:** New feature enters **Ready**.
- **Prompt Snippet:**
  - *“Produce user stories, AC, and a checklist of failing tests to add first (files + test names). Do not propose implementation yet.”*

### 2. Architect (RN + Supabase)

- **Mission:** Define module boundaries, data contracts (Typescript models), and ADRs.
- **Scope:** `/docs/adr/*`, `/app/src/**/*.types.ts`, `/supabase/functions/**/types.ts`.
- **Outputs:** ADR markdown, interface stubs, migration plan.
- **Constraints:** No UI. No business logic.

### 3. Auth & Profile Dev

- **Mission:** OAuth (Google/LINE via custom OIDC — not a built-in Supabase Auth provider, see ADR-002/ADR-003), profile setup, availability.
- **Scope:** `/app/src/profile/**`, `/supabase/functions/profile/**`.
- **Tests First:** Sign‑in success/failure, profile creation, RLS policies.

### 4. Rating System Dev (CORE)

- **Mission:** Implement **skill‑level‑relative rating** flows and aggregation.
- **Scope:** `/app/src/rating/**`, `/supabase/functions/rating/**`, `/supabase/migrations/**` (rating tables + RLS).
- **Tests First:**
  - Can rate mutual players only; anonymity preserved.
  - Per‑level aggregation windows; host weight > peer.
  - Confidence score thresholds gate display.
- **Notes:** Provide simulation fixtures for 7 levels (S…under C).

### 5. Events & Discovery Dev

- **Mission:** Event creation, discovery, filters, recommendations.
- **Scope:** `/app/src/events/**`, map/list UI, search state.
- **Tests First:** filter composability, slot availability, skill‑match ranking.

### 6. Host Tools Dev

- **Mission:** Host dashboard, attendance, calendar view.
- **Scope:** `/app/src/host/**`, `/supabase/functions/host/**`.
- **Tests First:** check‑in states, late/no‑show scoring, calendar integrity.

### 7. Backend/Supabase Dev

- **Mission:** Postgres schemas (migrations), Row Level Security policies, Edge Functions, push notifications (Expo Notifications/OneSignal).
- **Scope:** `/supabase/functions/**`, `/supabase/migrations/**`, `/supabase/config.toml`.
- **Tests First:** RLS allow/deny matrices; migration/index coverage.
- **Tools:** `supabase start` local stack; never touch prod from CI.

### 8. Test Engineer (Unit/E2E)

- **Mission:** Owns Jest/React Native Testing Library & Detox specs; flaky test triage.
- **Scope:** `/__tests__/**`, `/e2e/**`.
- **Outputs:** failing tests first; coverage report artifacts.

### 9. Repo Guardian (Policy & Hygiene)

- **Mission:** Lint/format/typecheck/secret scan; suggest fixes.
- **Scope:** Read‑only on app code; may submit **separate PRs** for hygiene.
- **Outputs:** Review comments + patch fixing only style/build issues.

### 10. Security/Privacy Reviewer

- **Mission:** STRIDE‑lite review, rules audit, PII redaction checks.
- **Scope:** `/docs/threat/*.md`, annotations on PRs.
- **Outputs:** Risk list + required mitigations checklist per feature.

### 11. Release/StoreOps

- **Mission:** Versioning, changelog, screenshots, store metadata; tracks App Store/Play Console checklists.
- **Scope:** `/docs/release/**`, `.github/workflows/release.yml`.
- **Outputs:** Release PR + notes.

### 12. Docs/Comms

- **Mission:** PR descriptions, user‑facing help, in‑app copy.
- **Scope:** `/docs/**`, `/app/src/i18n/**`.
- **Outputs:** Updated docs, localized strings, screenshots.

---

## 2) Kanban Labels & Routing

- `type:feature` → Planner → Architect → Feature Dev (4/5/6) → Test Engineer → Repo Guardian → Security → Review → Release.
- `type:infra` → Architect/Backend → Repo Guardian.
- `type:docs` → Docs/Comms only.
- `risk:privacy` auto‑adds Security/Privacy Reviewer.

---

## 3) TDD Contract (per card)

1. **Add failing tests** (list from Planner). CI expected **red**.
2. **Minimal implementation** to green.
3. **Refactor** (duplication, boundaries). Keep green.
4. **Guardian pass** (lint/format/typecheck) → separate hygiene PR if needed.
5. **Security checklist** satisfied.
6. **Small PR** (≤ 250 LOC), **1 CODEOWNER** approval required.

**Test Naming Template**

```
<feature>/<component>.<behavior>.<state>.spec.ts
example: rating/submitRating.blocksNonMutualPlayers.spec.ts
```

---

## 4) MCP/Tool Permissions Matrix

| Agent                  | FS Access                              | Git              | Network   | Supabase Local Stack | Other                  |
| ---------------------- | -------------------------------------- | ---------------- | --------- | --------------------- | ---------------------- |
| Planner                | read `/docs`                           | PR comments only | none      | none                  | GitHub Issues API      |
| Architect              | read/write `/docs`, `/types`           | branch+PR        | none      | none                  | Diagram export         |
| Auth & Profile Dev     | `/app/src/profile`, tests              | branch+PR        | allow NPM | ✓                      | OAuth config templates |
| Rating System Dev      | `/app/src/rating`, `/supabase/functions/rating`, `/supabase/migrations` | branch+PR | allow NPM | ✓          | Stats fixtures         |
| Events & Discovery Dev | `/app/src/events`                      | branch+PR        | allow NPM | ✓                      | Maps mock              |
| Host Tools Dev         | `/app/src/host`                        | branch+PR        | allow NPM | ✓                      | Calendar mock          |
| Backend/Supabase Dev   | `/supabase/functions`, `/supabase/migrations` | branch+PR | allow NPM | ✓                | Supabase CLI (local stack) |
| Test Engineer          | `/__tests__`, `/e2e`                   | branch+PR        | none      | ✓                      | Detox/Simulators       |
| Repo Guardian          | read‑only app; write `/scripts`        | PR only          | none      | none                  | Linters/scanners       |
| Security Reviewer      | read‑only                              | PR comments      | none      | none                  | Threat model templates |
| Release/StoreOps       | `/docs/release`                        | PR               | none      | none                  | Store metadata stubs   |
| Docs/Comms             | `/docs`, `/app/src/i18n`               | PR               | none      | none                  | Screenshot tooling     |

> **All agents use scoped GitHub tokens:** branch + PR create/update only; cannot merge.

---

## 5) PR Template (auto‑injected by Docs/Comms)

```
### Context
Linked issue: #

### Scope
- Components touched
- Screenshots (iOS/Android)

### Tests
- New tests added (list)
- Coverage summary

### Docs
- [ ] STATUS.md updated
- [ ] Related docs updated (which, or N/A)

### Risks & Rollback
- Known risks
- Rollback plan

### Notes for Reviewers
- Suggested reviewers (CODEOWNERS)
```

---

## 6) CI Entry Points (GitHub Actions names)

- `impl.yml` — Implementation agent run (tests‑first, then green).
- `guardian.yml` — Lint/format/typecheck/secret scan; comments only.
- `eas-build.yml` — single cloud EAS Build job (iOS + Android), no local `xcodebuild`/`gradlew`.
- `e2e.yml` — Detox matrix (iOS/Android emulators).
- `release.yml` — Version bump + changelog draft.

---

## 7) Ready‑to‑Use Prompt Snippets

**Role Header (prepend for all sub‑agents)**

> You are the **{{ROLE}}**. Stay within **Scope**. If a request falls outside, add a **handoff note** for the correct role. Output a **unified diff** for code changes and a **JSON summary** of decisions. Never push to `main`.

**Tests‑First (feature devs)**

> Given the story and AC, output only: (1) a checklist of **failing tests** you will add, (2) a patch with those tests. Wait for CI red; then produce the minimal patch to pass.

**Repo Guardian**

> Run lint/format/typecheck/secret scan. If violations: (a) PR review comments; (b) a separate hygiene patch that does **not** change business logic.

**Security Reviewer**

> Provide a STRIDE‑lite review. Output risks, affected files, and minimal mitigations as a checklist.

---

## 8) Definition of Done (per phase)

- **Phase 1 (Foundation):** Auth flows covered by unit + Supabase local-stack tests; profile created with RLS policies; EAS build passes.
- **Phase 2 (Rating CORE):** End‑to‑end rating happy path + edge cases; per‑level aggregation, anonymity checks, confidence threshold gating.
- **Phase 3 (Game Management):** Filterable discovery, real‑time slots, basic notifications; recommendations reproducible.
- **Phase 4 (Host Tools):** Dashboard actions, attendance scoring, calendar integrity; release PR prepared.

---

## 9) Metrics the Repo Guardian Tracks (dashboard comment)

- PR size, time‑to‑green, flaky tests, bundle size deltas, coverage %, rules violations, secret scan.

---

### Appendix: Labels

`type:feature`, `type:infra`, `type:docs`, `area:rating`, `area:events`, `area:host`, `area:profile`, `risk:privacy`, `needs:design`, `needs:qa`.

