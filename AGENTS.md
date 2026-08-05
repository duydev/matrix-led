# AGENTS.md — Matrix LED Simulator

## Mission

Build the Matrix LED Simulator **per `docs/specs/`**, delivering **one backlog milestone at a time** (`docs/specs/15-project-backlog.md`).

## Read first

1. `docs/specs/README.md`  
2. `docs/specs/15-project-backlog.md`  
3. `docs/cursor-toolkit.md`  
4. `docs/workflows/gitflow-feature.md`  

## Cursor assets

- Rules: `.cursor/rules/`  
- Skills: `.cursor/skills/` (`implement-milestone`, `gitflow-feature`, `add-led-effect`, `qc-mvp-gate`)  
- Subagents: `.cursor/agents/` (`milestone-implementer`, `spec-compliance-reviewer`, `led-engine-specialist`, `qc-gatekeeper`)  

## Non-negotiables

- Schema SSOT = `docs/specs/05-data-model.md`  
- No Google Fonts CDN; VT323 self-host with Vietnamese subset  
- Canvas LED grid (not CSS marquee / raw `fillText` as the product)  
- No `setState` every RAF frame  
- Feature branches via GitFlow; PR into `develop`  
- Commit only when the user asks  
- Gate: `npm test` && `npm run build` + AC for the slice  

## Default start command

```text
Follow GitFlow (docs/workflows/gitflow-feature.md).
Use skill implement-milestone for M1 only.
```
