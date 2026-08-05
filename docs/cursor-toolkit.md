# Cursor toolkit — Matrix LED

Hướng dẫn dùng Rules / Skills / Subagents trong repo này.

## Layout

```text
.cursor/
  rules/           # luôn hoặc theo glob
  skills/          # workflow skills (project)
  agents/          # custom subagents
docs/
  specs/           # product + QA + backlog SSOT
  workflows/       # GitFlow feature workflow
AGENTS.md          # entrypoint ngắn cho agent
```

## Rules

| File | Apply | Purpose |
|------|-------|---------|
| `matrix-led-core.mdc` | always | Spec SSOT, scope, git |
| `matrix-led-engine.mdc` | `src/engine/**` | Effect/font/buffer |
| `matrix-led-react-ui.mdc` | `src/ui/**` | RAF + UI |
| `matrix-led-tests.mdc` | `*.test/spec` | Vitest/Playwright |
| `matrix-led-specs.mdc` | `docs/specs/**` | Spec editing |

## Skills

| Skill | When |
|-------|------|
| `implement-milestone` | Làm M1–M6 / T-xxx |
| `gitflow-feature` | Branch/PR GitFlow |
| `add-led-effect` | Thêm effect mới |
| `qc-mvp-gate` | Gate release / sign-off |

Gọi skill bằng cách mention tên skill trong chat hoặc nhờ agent “use skill …”.

## Subagents

| Agent | When |
|-------|------|
| `milestone-implementer` | Implement 1 milestone |
| `spec-compliance-reviewer` | Review trước PR |
| `led-engine-specialist` | Bug/perf engine, font VI |
| `qc-gatekeeper` | QA release readiness |

Example:

```text
Use subagent milestone-implementer for M1.
```

## Recommended loop (mỗi feature)

1. GitFlow start branch (`docs/workflows/gitflow-feature.md`)  
2. `milestone-implementer` / skill `implement-milestone`  
3. `spec-compliance-reviewer`  
4. PR → `develop`  
5. Sau M4: `qc-gatekeeper` trên `release/*`  

## Do not

- Bỏ qua `15` mà implement “full app” một PR  
- Commit vào `main`/`develop` trực tiếp  
- Thêm CDN Google Fonts  
