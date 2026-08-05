---
name: implement-milestone
description: >-
  Implements one Matrix LED milestone (M1–M6) from docs/specs/15-project-backlog.md
  with AC/evidence checks. Use when the user asks to implement a milestone, continue
  the backlog, execute T-xxx tasks, or build the next MVP slice.
---

# Implement milestone

## Preconditions

1. Read `docs/specs/15-project-backlog.md` for the target milestone.
2. Skim linked specs (`05`, `04`, `10`, `14` as needed).
3. Confirm previous milestone exit check passed (M2 blocked ⇒ do not start M3).

## Workflow

Copy and track:

```text
Milestone: M?
- [ ] List P0/P1 tasks for milestone
- [ ] Implement in ID order respecting Depends
- [ ] Unit tests required by those tasks
- [ ] Run npm test && npm run build
- [ ] Manual checks in task "Done when"
- [ ] Report status table
```

### Rules

- **One milestone only** unless user explicitly expands.
- Stop-the-line on M2 if AC-04/53 fail after threshold tune (`09` escalation).
- No CDN fonts. No scope from M5 while doing M1–M4.
- Commit only if user asks.

## Report format

```markdown
## Milestone Mx
| Task | Status | Evidence |
|------|--------|----------|
| T-xxx | Done/Blocked | command / AC |

### Blockers
### Next recommended milestone
```
