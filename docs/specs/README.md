# Matrix LED Simulator — Technical Spec Index

> **Audience:** Cursor Agent (primary) · Human reviewer (secondary)  
> **Status:** v1.4 · Spec + QA + backlog + Cursor toolkit  
> **Product:** Web app giả lập màn hình Matrix LED (scrolling text + effects)

## How to use (Agent)

Đọc **theo thứ tự bắt buộc** trước khi code:

1. `AGENTS.md` + `docs/cursor-toolkit.md`  
2. `00` → `01` → `02` → `05` → `06` → skim `10`  
3. `15` (milestone) + `07`  
4. `docs/workflows/gitflow-feature.md` khi bắt đầu code  
5. `11`–`14` trước claim done / viết test  

Thực thi **một milestone** (`15`) trên `feature/*` → PR vào `develop`.

| Order | Doc | Purpose | When to re-read |
|------:|-----|---------|-----------------|
| 0 | [00-product-overview.md](./00-product-overview.md) | Vision, scope, non-goals, decided tech | Mọi task mới |
| 1 | [01-srs.md](./01-srs.md) | Functional / non-functional requirements | Trước khi code feature |
| 2 | [02-architecture.md](./02-architecture.md) | Modules, pipeline, React+RAF rules | Trước khi tạo/sửa cấu trúc |
| 3 | [05-data-model.md](./05-data-model.md) | **SSOT** config schema & persistence | Khi bind form ↔ display |
| 4 | [06-acceptance-criteria.md](./06-acceptance-criteria.md) | Pass/fail oracle (DoD) | Trước khi claim “done” |
| 5 | [03-ui-ux.md](./03-ui-ux.md) | Layout, controls, responsive, fullscreen | Khi làm UI |
| 6 | [04-effects-engine.md](./04-effects-engine.md) | Effect catalog & algorithms | Khi làm engine / effect |
| 7 | [07-agent-implementation.md](./07-agent-implementation.md) | Build phases, constraints | Khi bắt đầu implement |
| 8 | [15-project-backlog.md](./15-project-backlog.md) | **Milestones + tasks đo được** | Mỗi đầu ngày / mỗi milestone |
| 9 | [08-adrs.md](./08-adrs.md) | Architecture Decision Records | Khi nghi ngờ “vì sao chọn X” |
| 10 | [09-risks.md](./09-risks.md) | Risk register | Khi gặp font/fullscreen/perf |
| 11 | [10-impl-notes.md](./10-impl-notes.md) | Font/package/RAF tips | Trước Phase A/D/E |
| 12 | [11-test-strategy.md](./11-test-strategy.md) | Chiến lược QA / pyramid | Trước viết test |
| 13 | [12-test-plan.md](./12-test-plan.md) | Plan, exit criteria, severity | Trước vòng QC |
| 14 | [13-test-cases.md](./13-test-cases.md) | TC chi tiết map AC | Khi execute / automate |
| 15 | [14-test-automation.md](./14-test-automation.md) | Vitest + Playwright spec | Khi setup `npm test` |

### Cursor & Git workflow (ngoài specs/)

| Doc | Purpose |
|-----|---------|
| [../cursor-toolkit.md](../cursor-toolkit.md) | Rules / skills / subagents map |
| [../workflows/gitflow-feature.md](../workflows/gitflow-feature.md) | GitFlow feature → develop → release |
| [../../AGENTS.md](../../AGENTS.md) | Agent entrypoint |

## Priority conventions

| Keyword | Meaning |
|---------|---------|
| **MUST** | Bắt buộc cho MVP. Không ship thiếu. |
| **SHOULD** | Cùng milestone nếu không bị block; không chặn DoD MVP. |
| **MAY** | Phase 2. Không làm trừ khi user yêu cầu. |
| **MUST NOT** | Cấm tuyệt đối. |

## Single sources of truth

| Concern | SSOT file |
|---------|-----------|
| Product scope / non-goals | `00` |
| Requirements (FR/NFR) | `01` |
| `DisplayConfig` & persistence | **`05` only** |
| Effect behavior | `04` |
| Pass/fail for ship | `06` |
| Delivery tasks / milestones | **`15`** |
| Test strategy / cases / automation | `11`–`14` |
| Why stack/font/canvas/test | `08` |

`02` **MUST NOT** định nghĩa schema lệch `05`. Chỉ reference type từ `05`.

## Human review checklist

- [x] Scope & non-goals khớp ý sản phẩm (v1.1)
- [x] Font strategy Decided (self-host raster; VT323 recommended)
- [x] Schema SSOT = `05`
- [x] “Zoom toàn màn hình” = Fullscreen (MVP)
- [x] MVP effect set thu gọn
- [x] Feasibility: GO (xem `10`)
- [x] QA docs: strategy/plan/cases/automation (`11`–`14`)
- [x] Project backlog break tasks (`15`)
- [x] Cursor rules / skills / subagents + GitFlow workflow
- [ ] Human spot-check AC trước release
- [ ] QC sign-off `06` §7 after implement

## Change control

1. Sửa file spec liên quan  
2. Nếu đổi hành vi: cập nhật `06` **và** TC liên quan trong `13`  
3. Bump version ở đầu file + dòng Status ở README nếu đổi contract  
4. Nếu đổi cách test/tooling: cập nhật `11`/`14` + ADR-007  
5. Nếu đổi phạm vi/thứ tự giao hàng: cập nhật `15`  

Khi implement lệch spec: **cập nhật spec trước hoặc cùng lúc**.
