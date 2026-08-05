---
name: qc-mvp-gate
description: >-
  Runs Matrix LED QC release gate against docs/specs/06, 12, 13, 14 (npm test,
  build, manual AC checklist, CDN check, optional e2e/waive). Use when claiming
  MVP done, before release, or when user asks for QA sign-off preparation.
---

# QC MVP gate

## Execute

1. Read exit criteria: `docs/specs/12-test-plan.md` §6 and `06` DoD.
2. Run:

```bash
npm test
npm run build
# SHOULD:
npm run test:e2e
```

3. Manual: execute MUST rows in `06` using TCs in `13`; apply visual rubric `13` §10.
4. Network: confirm no `fonts.googleapis.com` / `fonts.gstatic.com`.
5. Severity: zero Blocker/Critical open (`12` §9).
6. If e2e skipped: fill waive form `12` §11.

## Report

```markdown
## QC Gate
| Check | Result |
|-------|--------|
| npm test | PASS/FAIL |
| npm run build | PASS/FAIL |
| e2e / waive | PASS/WAIVE/FAIL |
| AC MUST | x/y Pass |
| CDN font | PASS/FAIL |
| Sign-off ready | YES/NO |

### Failed AC / bugs
### Evidence notes
```

Do not mark ship-ready if any MUST AC fails.
