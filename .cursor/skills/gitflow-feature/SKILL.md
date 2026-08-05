---
name: gitflow-feature
description: >-
  Runs GitFlow feature-branch workflow for Matrix LED (feature/* from develop,
  PR into develop, no direct commits to main/develop). Use when starting a
  feature, finishing a feature, opening a PR, or when the user mentions GitFlow,
  feature branch, or release branching.
---

# GitFlow feature workflow

Follow project doc: `docs/workflows/gitflow-feature.md`.

## Branch model

| Branch | Role |
|--------|------|
| `main` | Production releases only |
| `develop` | Integration |
| `feature/<id>-<slug>` | One milestone or one cohesive feature |
| `release/x.y.z` | Release hardening (optional) |
| `hotfix/x.y.z` | Prod fixes from `main` |

## Start feature

```bash
git checkout develop
git pull origin develop
git checkout -b feature/M2-vertical-slice
```

Naming: `feature/<taskOrMilestone>-<short-slug>`  
Examples: `feature/M1-foundation`, `feature/T-207-marquee`, `feature/M4-fullscreen`

## During feature

- Commit on `feature/*` only (when user asks to commit).
- Keep scope = one milestone or listed tasks from `15`.
- Rebase/merge develop periodically if long-lived:

```bash
git fetch origin
git merge origin/develop
# or: git rebase origin/develop  (only if team allows rebase)
```

## Finish feature

1. `npm test && npm run build` (and e2e if present)
2. Push branch; open PR **into `develop`** (not `main`)
3. After merge: delete local/remote feature branch
4. Never merge feature → `main` directly

```bash
git push -u origin HEAD
gh pr create --base develop --title "..." --body "..."
```

## PR body template

```markdown
## Summary
- Milestone / tasks: Mx / T-xxx
- Spec refs: 05 / 04 / 06

## Test plan
- [ ] npm test
- [ ] npm run build
- [ ] Manual AC for this slice (list IDs)
- [ ] No Google Fonts network requests
```

## Forbidden

- Commit straight to `main` or `develop`
- Force-push `main` / `develop`
- Mixing M5 Should work into a Must milestone PR without PM note
