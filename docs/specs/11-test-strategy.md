# 11 — Test Strategy

| Field | Value |
|-------|-------|
| Doc | Test Strategy |
| Version | 1.0 |
| Owner | QC / Automation |
| Relates to | `06` (AC SSOT for pass/fail), `01`, `04`, `05` |

## 1. Đánh giá hiện trạng (QC audit)

| Nguồn hiện có | Đủ? | Gap |
|---------------|-----|-----|
| `06` Acceptance Criteria | Một phần | Là DoD, **không** phải test case chi tiết (thiếu bước, data, expected measurable) |
| `02` §11 Testing | Mỏng | Chỉ gợi ý unit; chưa tool, chưa CI gate, E2E bỏ ngỏ |
| `07` Phase I | Mỏng | “Điền checklist” — chưa lệnh test / artifact |
| Visual LED feel | Thủ công | Đúng — nhưng thiếu rubric quan sát |

**Kết luận audit:** Tài liệu product đủ để *nghiệm thu*; **chưa đủ để chạy QC/automation có kiểm soát**. Bộ `11–14` bổ sung lớp test.

## 2. Mục tiêu test

1. Ngăn regression trên **logic thuần** (config, font flatten, effect math).  
2. Đảm bảo **luồng demo chính** mở được và chạy marquee mặc định.  
3. Giữ **cảm giác LED + tiếng Việt** qua manual/visual (không ép pixel-diff flaky).  
4. Gate ship: AC MUST (`06`) + automation gate tối thiểu (`14`).

## 3. Nguyên tắc (senior QC)

| Principle | Áp dụng |
|-----------|---------|
| Test pyramid | Nhiều unit (engine/state) · ít E2E smoke · manual cho visual |
| Automate deterministic | Offset wrap, clamp, flatten `\n`, persist validate |
| Manual for subjective | “Giống LED”, gap cells, readability dấu Việt, 30fps cảm nhận |
| No flaky canvas asserts | **MUST NOT** so sánh screenshot full-canvas từng pixel cho MVP |
| AC is oracle | Mọi TC map về `ACxx`; TC mới không có AC → cập nhật `06` trước |
| Shift-left | Unit viết cùng Phase B/D/E (`07`); không để dồn cuối |

## 4. Phạm vi

### In scope

- Unit: `state/persist`, flatten text, effect update math, color parse, matrix size derive  
- Component/integration nhẹ (MAY): persist round-trip trong jsdom  
- E2E smoke (SHOULD): load app → default text visible in UI → đổi text → pause  
- Manual QC: full `06` MUST + visual rubric  
- Build gate: `tsc` / `vite build` + `vitest`

### Out of scope (MVP)

- Visual regression AI / Percy  
- Performance lab (Lighthouse CI bắt buộc)  
- Cross-device farm đầy đủ (chỉ desktop Chrome + 1 mobile viewport)  
- Accessibility audit tool bắt buộc (manual a11y smoke đủ)  
- Hardware LED  

## 5. Test levels

```text
        /  Manual visual + AC  \     ← cảm giác LED, fullscreen, responsive mắt
       /    E2E smoke (Playwright) \ ← happy path, persist reload
      /      Integration (optional)  \
     /_________ Unit (Vitest) _________\  ← phần lớn automation
```

| Level | Tool | Priority |
|-------|------|----------|
| Unit | Vitest | **MUST** |
| E2E smoke | Playwright | **SHOULD** (cùng milestone nếu không block) |
| Manual | Checklist `12`/`13` | **MUST** trước ship |
| Visual pixel diff | — | **MUST NOT** MVP |

## 6. Quyết định stack test (ADR-007)

| Concern | Choice | Why |
|---------|--------|-----|
| Unit runner | Vitest | Khớp Vite; nhanh; TS native |
| E2E | Playwright | Stable; viewport API; network assert CDN |
| Assertion canvas | Sample buffer / DOM controls / network | Tránh flake |
| Coverage gate | Lines engine/state ≥ 60% SHOULD | Không cứng 90% UI |

## 7. Risk-based priority

| Risk (`09`) | Test focus |
|-------------|------------|
| R-01 / R-12 VI font | Manual AC-04/53 + unit flatten; E2E không assert pixel chữ |
| R-03 CDN | Playwright route/network assert không gọi gstatic |
| R-04 / R-05 RAF | Manual/devtools; unit không cover React loop sâu |
| R-06 iOS FS | Manual trên thiết bị/thật hoặc Safari; pseudo-fullscreen |
| Effect math | Unit deterministic `t` fixtures |

## 8. Entry / Exit (tóm tắt — chi tiết `12`)

| Gate | Điều kiện |
|------|-----------|
| Entry QA | `npm run build` OK; app `dev`/`preview` chạy được |
| Exit MVP | Mọi AC MUST PASS + `npm test` PASS + smoke E2E PASS **hoặc** waived có lý do ghi `12` |
| Exit regression | Mini-suite `06` §5 + unit xanh |

## 9. Artifacts

| Artifact | Location |
|----------|----------|
| Strategy | this file |
| Plan | `12-test-plan.md` |
| Cases | `13-test-cases.md` |
| Automation spec | `14-test-automation.md` |
| AC oracle | `06-acceptance-criteria.md` |
| Bug report | template trong `12` |

## 10. What “done” means for QC

QC ký `06` §7 **chỉ khi**:

1. Unit gate xanh  
2. Manual MUST AC xanh (kèm note môi trường)  
3. Smoke E2E xanh **hoặc** Explicit waive (lý do + approver)  
4. Không mở bug **Blocker/Critical** mở  
