# GitFlow — Feature Implementation Workflow

| Field | Value |
|-------|-------|
| Doc | GitFlow feature workflow |
| Version | 1.0 |
| Applies to | Matrix LED Simulator |
| Cursor skill | `.cursor/skills/gitflow-feature` |

## 1. Why GitFlow here

Repo cần: (1) `main` ổn định để demo/release, (2) `develop` tích hợp milestone, (3) mỗi slice MVP (`15` M1…M6) trên **feature branch** sạch để review/PR.

## 2. Branch model

```text
main
  └── hotfix/*     (prod break only)
  └── merge ← release/*
develop
  └── feature/*    (default daily work)
  └── release/*    (optional harden before main)
```

| Branch | Protected intent | Merges from | Merges to |
|--------|------------------|-------------|-----------|
| `main` | Ship / tags | `release/*`, `hotfix/*` | — |
| `develop` | Integration | `feature/*`, `hotfix/*` (back-merge) | `release/*` |
| `feature/*` | One milestone or cohesive task set | `develop` (update) | `develop` via PR |
| `release/x.y.z` | Freeze + QC | `develop` | `main` + back-merge `develop` |
| `hotfix/x.y.z` | Emergency | `main` | `main` + `develop` |

## 3. Naming

```text
feature/<milestoneOrTask>-<short-slug>
```

Examples:

- `feature/M1-foundation`
- `feature/M2-vertical-slice`
- `feature/T-401-fullscreen`
- `feature/M5-typewriter`

Rules:

- Lowercase, hyphens, no spaces  
- One primary intent per branch  
- Do not mix M5 Should into M2 Must branch  

## 4. End-to-end: implement a feature (happy path)

### Step 0 — Preconditions

- [ ] Spec baseline known (`docs/specs` v1.4+)  
- [ ] Target tasks listed in `15`  
- [ ] Local `develop` exists (create from `main` if first setup)

#### First-time repo bootstrap (once)

```bash
git checkout -b main
# after initial commit of docs/toolkit:
git checkout -b develop
git push -u origin main
git push -u origin develop
```

### Step 1 — Start feature

```bash
git fetch origin
git checkout develop
git pull origin develop
git checkout -b feature/M2-vertical-slice
```

In Cursor:

```text
Use skill gitflow-feature and implement-milestone.
Execute milestone M2 only on current feature branch.
```

Or delegate:

```text
Use subagent milestone-implementer for milestone M2.
```

### Step 2 — Implement

1. Follow milestone tasks in `15`  
2. Obey `.cursor/rules` (core/engine/ui/tests)  
3. Run often:

```bash
npm test
npm run build
```

4. Keep commits small **when user asks to commit** (Conventional Commits recommended):

```text
feat(engine): add RTL marquee effect

test(state): cover persist validate clamp
fix(font): await fonts.ready before raster
```

### Step 3 — Sync with develop (if needed)

```bash
git fetch origin
git merge origin/develop
# resolve conflicts; re-run npm test && npm run build
```

Prefer merge over rebase unless team standard says rebase; never rebase shared `main`/`develop`.

### Step 4 — Self review before PR

- [ ] Milestone exit criteria in `15` Pass  
- [ ] No CDN font requests  
- [ ] Unit tests for touched pure logic  
- [ ] Run subagent `spec-compliance-reviewer` on diff  

### Step 5 — Open PR → develop

```bash
git push -u origin HEAD
gh pr create --base develop --title "feat(M2): vertical slice LED marquee" --body "$(cat <<'EOF'
## Summary
- Milestone: M2
- Tasks: T-201..T-210
- Specs: 02, 04, 05, 10

## Test plan
- [ ] npm test
- [ ] npm run build
- [ ] AC-01,02,03,04,20,30,52,53 manual
- [ ] Network: no Google Fonts

## Notes
- Threshold used: ___
EOF
)"
```

### Step 6 — After merge

```bash
git checkout develop
git pull origin develop
git branch -d feature/M2-vertical-slice
git push origin --delete feature/M2-vertical-slice
```

Start next milestone branch from updated `develop`.

## 5. Release flow (MVP R3 / M6)

```text
develop (M1–M4 done) 
  → branch release/0.1.0 
  → QC gate (skill qc-mvp-gate / subagent qc-gatekeeper)
  → PR release → main (tag v0.1.0)
  → back-merge main → develop
```

```bash
git checkout develop
git pull
git checkout -b release/0.1.0
# harden, version bump if any, QC
gh pr create --base main --title "release: 0.1.0"
# after merge:
git checkout main && git pull
git tag -a v0.1.0 -m "v0.1.0"
git push origin v0.1.0
git checkout develop && git merge main && git push
```

## 6. Hotfix flow

```bash
git checkout main && git pull
git checkout -b hotfix/0.1.1
# fix + test
# PR → main, tag v0.1.1
# merge back into develop
```

## 7. Mapping milestones → branches (recommended)

| Milestone | Branch | PR into |
|-----------|--------|---------|
| M1 | `feature/M1-foundation` | develop |
| M2 | `feature/M2-vertical-slice` | develop |
| M3 | `feature/M3-mvp-effects` | develop |
| M4 | `feature/M4-demo-ready` | develop |
| M5 | `feature/M5-plus` (optional) | develop |
| M6 | often on `release/0.1.0` or `feature/M6-qc-fixes` | develop then release |

## 8. Cursor prompt cheatsheet

**Start M1**

```text
Follow docs/workflows/gitflow-feature.md.
Create/switch to feature/M1-foundation from develop.
Use skill implement-milestone for M1 only.
```

**PR review**

```text
Use subagent spec-compliance-reviewer on the current feature branch diff.
```

**QC before release**

```text
Use skill qc-mvp-gate and subagent qc-gatekeeper.
We are on release/0.1.0.
```

## 9. Definition of Done (feature branch)

- [ ] Branched from latest `develop`  
- [ ] Scope = declared milestone/tasks only  
- [ ] `npm test` && `npm run build` Pass  
- [ ] PR targets **`develop`**  
- [ ] AC for slice listed in PR body  
- [ ] No direct commit to `main`/`develop`  

## 10. Anti-patterns

| Don't | Do instead |
|-------|------------|
| Work on `main` | `feature/*` from `develop` |
| One mega PR all M1–M6 | One PR per milestone |
| PR feature → `main` | PR → `develop`, release separately |
| Force-push develop | Normal merge commits / PR |
| Commit without user ask (agent) | Wait for explicit commit request |
