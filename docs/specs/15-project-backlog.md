# 15 — Project Backlog & Work Breakdown

| Field | Value |
|-------|-------|
| Doc | Project backlog (PM) |
| Version | 1.0 |
| Spec baseline | v1.3 |
| Audience | PM · Implementer/Agent · QC |
| Status | **Ready to execute** |

## 1. PM assessment (đọc toàn bộ docs)

| Tiêu chí | Đánh giá | Ghi chú |
|----------|----------|---------|
| Problem / success clear? | **Đạt** | `00` success definition dùng được làm North Star |
| Scope control | **Đạt** | Non-goals + MUST/SHOULD/MAY rõ |
| Requirements traceable? | **Đạt** | FR → AC → TC đã nối |
| Technical ready? | **Đạt** | ADR + feasibility GO |
| QA ready? | **Đạt** | `11`–`14` đủ gate ship |
| Estimate risk | **Trung bình** | Font VI (M2) là điểm trượt lịch duy nhất đáng kể |
| Ready for sprint? | **GO** | Không còn open decision chặn start |

**Kết luận PM:** Đây là dự án **single-increment MVP** (1–2 tuần calendar / **2–4 ngày** focus 1 dev). Break task theo **milestone có demo được**, không theo “layer kỹ thuật mồ côi”.

### Nguyên tắc break task (áp dụng trong file này)

| Rule | Ý nghĩa |
|------|---------|
| **SMART** | Mỗi task có output cụ thể + cách PASS đo được |
| **Demo slice** | Càng sớm càng có thứ mở được trên browser |
| **AC-linked** | Done = map `06` / `13`, không “code xong là xong” |
| **≤ 4h / task** | Task lớn hơn phải tách |
| **Stop-the-line** | M2 font VI fail → không kéo effect mới |
| **No ghost work** | Phase 2 MAY **không** vào sprint MVP |

---

## 2. Delivery model

### 2.1 North Star metric

> Người dùng mở app → thấy chữ Việt chạy LED → đổi màu/effect → fullscreen demo — trong **< 2 phút** không cần hướng dẫn.

### 2.2 Release train

| Release | Tên | Mục tiêu business | Ship? |
|---------|-----|-------------------|-------|
| **R0** | Spec freeze | Docs v1.3 approved | Docs only (done) |
| **R1** | Vertical slice | Marquee VI + lưới LED chạy được | Internal demo |
| **R2** | MVP feature-complete | Đủ MUST effects + style + persist + FS | **Candidate** |
| **R3** | Release | QC gate `12` §6 + sign-off `06` | **Ship** |
| **R4** | Plus | SHOULD effects/dir | Optional cùng hoặc sau R3 |

### 2.3 Capacity giả định (để đo tiến độ)

| Role | Capacity tham chiếu |
|------|---------------------|
| 1 fullstack / agent | ~6 focus-hours / ngày |
| MVP MUST (M1–M4 + M6) | **16–22h** |
| + SHOULD (M5) | **+4–6h** |
| Calendar buffer rủi ro font | **+0.5 ngày** |

---

## 3. Epic map

| Epic | Outcome | Milestone | MoSCoW |
|------|---------|-----------|--------|
| E0 | Spec & QA docs sẵn sàng | R0 | Done |
| E1 | App scaffold + font package + test runner | M1 | Must |
| E2 | State + persist + text input | M1 | Must |
| E3 | LED renderer | M2 | Must |
| E4 | Font raster tiếng Việt | M2 | Must |
| E5 | RAF + marquee + colorize | M2 | Must |
| E6 | MUST effects còn lại + UI select | M3 | Must |
| E7 | Style / playback / direction / size | M3 | Must |
| E8 | Fullscreen + responsive | M4 | Must |
| E9 | Unit + E2E smoke | M1→M6 | Must/Should |
| E10 | SHOULD effects & polish | M5 | Should |
| E11 | QC sign-off & release | M6 | Must |

---

## 4. Milestones (measurable)

| ID | Milestone | Demo / Evidence | Exit criteria (đo được) | Est. |
|----|-----------|-----------------|-------------------------|------|
| **M1** | Foundation | `npm run dev` mở được shell UI | `build` OK; Vitest chạy; types `05`; textarea + persist stub | 3–4h |
| **M2** | Vertical slice ★ | Default *Chào mừng quý khách* marquee đỏ trên lưới LED | AC-01..04, AC-20, AC-52/53; visual rubric ≥4/5 | 5–7h |
| **M3** | MVP effects & controls | Đổi 4 effect + preset + pause/speed | AC-10..12, AC-21..25, AC-30..31, AC-50 | 4–5h |
| **M4** | Demo-ready shell | Fullscreen + mobile 375 usable | AC-40..44 | 2–3h |
| **M5** | Plus (optional) | typewriter/shift_in/ttb | AC-26..28,32,13 | 4–6h |
| **M6** | Release gate | Checklist ký | `12` §6 toàn bộ; `06` §7 signed | 2–3h |

★ **Critical path:** M2. Trượt M2 = trượt toàn bộ release.

```text
M1 → M2 → M3 → M4 → M6
              ↘ M5 (song song sau M3 hoặc sau M6)
```

---

## 5. Task backlog (executable)

**Status values:** `Todo` · `In Progress` · `Blocked` · `Done` · `Cut`  
**Estimate:** ideal focus hours.  
**Priority:** P0 = Must critical path · P1 = Must · P2 = Should · P3 = May  

### M1 — Foundation

| ID | Task | Epic | P | Est | Depends | Done when (measurable) |
|----|------|------|---|-----|---------|------------------------|
| T-101 | Scaffold Vite + React + TS strict | E1 | P0 | 0.5h | — | `npm run dev` + `npm run build` pass |
| T-102 | Global CSS tokens (nền tối, layout shell) | E1 | P1 | 0.5h | T-101 | Header + vùng display + panel theo wireframe `03` |
| T-103 | Cài `@fontsource/vt323` + import latin/latin-ext/vietnamese | E1 | P0 | 0.25h | T-101 | Network không gọi Google Fonts; CSS font có mặt |
| T-104 | Setup Vitest + script `npm test` | E9 | P0 | 0.5h | T-101 | `npm test` chạy (có thể 1 test smoke `expect(true)`) |
| T-105 | `state/types` + `defaults` khớp `05` | E2 | P0 | 0.5h | T-101 | Typecheck; default text = `Chào mừng quý khách` |
| T-106 | `persist` load/save/validate + unit | E2/E9 | P0 | 1h | T-104, T-105 | Unit TC-R02/C06 related xanh; reload giữ text thủ công |
| T-107 | `useDisplayConfig` + TextInput + counter 200 | E2 | P0 | 0.75h | T-105 | UI đổi text cập nhật state; clamp 200 hiện counter |
| T-108 | Gắn `data-testid` cơ bản | E9 | P1 | 0.25h | T-107 | Có `text-input`, `display-stage` tối thiểu |

**M1 exit check:** [ ] T-101…107 Done · [ ] `npm test` & `build` xanh  

---

### M2 — Vertical slice (STOP-THE-LINE nếu font fail)

| ID | Task | Epic | P | Est | Depends | Done when (measurable) |
|----|------|------|---|-----|---------|------------------------|
| T-201 | `framebuffer` + `renderer` vẽ grid cells + gap | E3 | P0 | 1.5h | T-102 | Test pattern on/off nhìn thấy lưới LED (AC-02) |
| T-202 | Resize canvas theo container + DPR clamp ≤2 | E3 | P0 | 0.75h | T-201 | Đổi bề rộng cửa sổ → matrix scale, không vỡ |
| T-203 | `flattenText` + unit | E4/E9 | P0 | 0.5h | T-104 | Unit AC-07: `\n` → space |
| T-204 | Offscreen raster VT323 + threshold + cache + `?` | E4 | P0 | 2h | T-103, T-203, T-201 | Sau `fonts.ready`, default VI **không** toàn `?` (AC-04/53) |
| T-205 | Tune threshold nếu cần (100–160) | E4 | P0 | 0.5h | T-204 | Visual: đọc được “Chào mừng quý khách” |
| T-206 | `engine/loop` RAF + configRef + cleanup StrictMode | E5 | P0 | 1h | T-201 | Pause chưa cần; loop chạy không `setState`/frame |
| T-207 | Effect registry + `marquee` RTL + unit offset | E5/E9 | P0 | 1.5h | T-204, T-206 | AC-03/20: text dài loop; unit offset đổi theo `t` |
| T-208 | `colorize` presets đỏ + brightness | E5 | P1 | 0.75h | T-207 | Default đỏ; đổi brightness thấy rõ (AC-12 một phần) |
| T-209 | Play/Pause/Speed wire vào loop | E5 | P0 | 0.75h | T-206 | AC-30/31 trên marquee |
| T-210 | Checkpoint manual M2 | E11 | P0 | 0.5h | T-205, T-207 | Rubric `13`§10 ≥4/5; AC-52 network check |

**M2 exit check:** [ ] Demo ghi nhận (screenshot optional) · [ ] AC-01,02,03,04,20,30,52,53 Pass · [ ] Không Blocker  

**Rollback rule:** Nếu T-204/205 fail sau escalation `09` → **Block M3+**, escalate human chọn font — không làm T-301.

---

### M3 — MVP feature-complete

| ID | Task | Epic | P | Est | Depends | Done when (measurable) |
|----|------|------|---|-----|---------|------------------------|
| T-301 | Effect `static` + unit center/clip | E6 | P0 | 0.75h | T-207 | AC-21 |
| T-302 | Effect `fade_in_out` + unit phase | E6 | P0 | 1h | T-207 | AC-22 (quan sát ≥1 chu kỳ) |
| T-303 | Effect `blink` + unit on/off | E6 | P0 | 0.75h | T-207 | AC-23 |
| T-304 | EffectSelect UI (4 MUST) + switch reinit | E6 | P0 | 0.5h | T-301..303 | AC-24 không crash |
| T-305 | Presets UI (≥4) + custom color → `custom` | E7 | P0 | 1h | T-208 | AC-10,11 |
| T-306 | Rainbow colorize (optional polish trong M3) | E7 | P2 | 0.5h | T-305 | AC-13 Should |
| T-307 | Direction LTR (+ UI select) cho marquee | E7 | P0 | 0.5h | T-207 | AC-25 |
| T-308 | Matrix size select 32×8 / 64×16 / 96×16 | E7 | P1 | 0.75h | T-202, T-204 | Đổi size rebuild bitmap+buffer không crash |
| T-309 | Glow toggle | E7 | P2 | 0.25h | T-201 | Bật/tắt thay đổi nhìn thấy |
| T-310 | Persist đầy đủ fields `05` + manual reload | E2 | P0 | 0.5h | T-106, T-304, T-305 | AC-50 |
| T-311 | Regression mini-suite `06`§5 bước 1–5,8 | E11 | P0 | 0.75h | T-310 | Không Critical mới |

**M3 exit check:** [ ] 4 effect MUST chọn được · [ ] Persist reload · [ ] `npm test` xanh  

---

### M4 — Demo-ready

| ID | Task | Epic | P | Est | Depends | Done when (measurable) |
|----|------|------|---|-----|---------|------------------------|
| T-401 | Fullscreen API + nút VI + Exit | E8 | P0 | 1h | T-102 | AC-40/42 (native hoặc vào được mode large) |
| T-402 | Pseudo-fullscreen fallback | E8 | P0 | 0.75h | T-401 | Khi API fail/ thiếu → fixed overlay; thoát được |
| T-403 | Responsive layout 375 & 1280 | E8 | P0 | 1h | T-102, T-304 | AC-43/44 |
| T-404 | Bezel/display chrome nhẹ | E8 | P2 | 0.5h | T-201 | Trông giống thiết bị hơn (không bắt AC) |
| T-405 | Copy UI labels audit tiếng Việt | E8 | P1 | 0.25h | T-304 | AC-61 |

**M4 exit check:** [ ] Fullscreen demo path · [ ] Mobile usable  

---

### M5 — Should / Plus (không chặn R3 nếu cắt)

| ID | Task | Epic | P | Est | Depends | Done when |
|----|------|------|---|-----|---------|-----------|
| T-501 | `typewriter` effect + UI | E10 | P2 | 1.5h | T-304 | AC-27 |
| T-502 | `shift_in` effect + UI | E10 | P2 | 1.5h | T-304 | AC-28 |
| T-503 | `ttb`/`btt` marquee | E10 | P2 | 1h | T-307 | AC-26 |
| T-504 | Reset playback | E10 | P2 | 0.25h | T-209 | AC-32 |
| T-505 | Visibility pause RAF | E10 | P2 | 0.5h | T-206 | AC-63 |
| T-506 | Rainbow nếu chưa làm ở T-306 | E10 | P2 | 0.5h | T-305 | AC-13 |

**M5 cut rule:** Đến deadline R3 mà M4 chưa xong → **Cut M5** không thương lượng.

---

### M6 — QC & Release

| ID | Task | Epic | P | Est | Depends | Done when (measurable) |
|----|------|------|---|-----|---------|------------------------|
| T-601 | Hoàn thiện unit suites theo `14` MUST map | E9 | P0 | 1h | M3 | `npm test` PASS; persist+flatten+≥1 effect |
| T-602 | Playwright smoke (load, CDN, persist, 375) | E9 | P1 | 1.5h | M4, T-108 | `npm run test:e2e` PASS **hoặc** waive `12`§11 |
| T-603 | Manual execute TC MUST (`13`) + tick `06` | E11 | P0 | 1.5h | M4 | 100% AC MUST = Pass |
| T-604 | Offline + Network CDN recheck | E11 | P0 | 0.25h | T-103 | AC-52; TC-R03 |
| T-605 | Bug triage: 0 Blocker/Critical open | E11 | P0 | 0.5h | T-603 | Severity rule `12`§9 |
| T-606 | Human sign-off `06`§7 | E11 | P0 | 0.25h | T-605 | Signed Approve |
| T-607 | (MAY) Tag release / deploy static | E11 | P3 | 0.5h | T-606 | URL hoặc artifact `dist/` |

**M6 exit = Project MVP Done.**

---

## 6. Definition of Done — theo cấp

### Task DoD

- [ ] Code đúng scope task (không lẩn SHOULD vào P0)  
- [ ] Khớp SSOT liên quan (`05`/`04`/`03`)  
- [ ] Unit nếu task thuộc E9 map  
- [ ] Kiểm tra nhanh AC liệt kê ở cột Done when  
- [ ] Không để console error block luồng chính  

### Milestone DoD

- [ ] Mọi task P0/P1 của milestone = Done  
- [ ] Exit criteria bảng §4 Pass  
- [ ] Mini regression liên quan chạy  

### Product MVP DoD

= `12` §6 Exit criteria + North Star §2.1 đạt.

---

## 7. Critical path & dependencies

```text
T-101 → T-103 → T-204 → T-207 → T-301..303 → T-304 → T-401 → T-603 → T-606
         └→ T-104 → T-106 ─┘              └→ T-310 ─┘
T-201 ─────────────────────┘
```

| Buffer | Dùng cho |
|--------|----------|
| +2h | Threshold/font tune (T-205) |
| +1h | Fullscreen iOS quirks (T-402) |
| +1h | Persist/validate edge (T-106/310) |

---

## 8. Progress tracking (PM dashboard)

### 8.1 % complete (weight by est hours)

| Milestone | Weight (h mid) | % of MVP |
|-----------|----------------|----------|
| M1 | 4 | 18% |
| M2 | 6 | 27% |
| M3 | 5 | 23% |
| M4 | 3 | 14% |
| M6 | 4 | 18% |
| **MVP total** | **~22** | **100%** |
| M5 (excl.) | 5 | tracked riêng |

Công thức: `MVP% = sum(Done hours in M1–4,M6) / 22`.

### 8.2 Daily standup questions (1 người / agent)

1. Task ID nào Done từ lần trước? Evidence?  
2. Task đang làm + ETA giờ?  
3. Có chạm stop-the-line M2 không?  

### 8.3 Status board (copy để track)

| Sprint | Focus | Start | End | MVP% | Notes |
|--------|-------|-------|-----|------|-------|
| S1 | M1+M2 | | | | Vertical slice |
| S2 | M3+M4 | | | | Feature + demo shell |
| S3 | M6 (+M5?) | | | | Gate |

---

## 9. RAID (PM-level, rút từ `09`)

| Type | ID | Item | Owner | Action |
|------|----|------|-------|--------|
| Risk | R-01/12 | Font VI | Dev | Làm T-204 sớm; buffer T-205 |
| Risk | R-06 | iOS FS | Dev | T-402 bắt buộc trước sign-off mobile |
| Risk | R-14 | Ship không test | QC/Dev | T-601 gate |
| Assumption | A1 | 1 dev fullstack đủ | PM | Không phụ thuộc designer riêng |
| Assumption | A2 | Chrome = browser sign-off chính | QC | Safari SHOULD |
| Issue | — | (điền khi phát sinh) | | |
| Dependency | D1 | Spec freeze v1.3 | PM | Không đổi MUST giữa chừng không ADR |

---

## 10. Out of backlog (cấm lách vào MVP sprint)

- Backend / auth / hardware  
- Zoom % slider  
- Pixel-diff CI  
- Effect rain/slot/wave  
- PWA hoàn chỉnh  
- Multi-language UI  

Muốn làm → tạo epic mới + ADR + AC mới **trước**.

---

## 11. Suggested execution order (checklist vận hành)

```text
[ ] T-101 Scaffold
[ ] T-103 Fontsource VI
[ ] T-104 Vitest
[ ] T-105–107 State + input
[ ] T-201–202 Renderer
[ ] T-203–205 Font raster ★
[ ] T-206–209 Marquee slice
[ ] T-210 M2 checkpoint — GO/NO-GO
[ ] T-301–304 Effects MUST
[ ] T-305–310 Style + persist
[ ] T-401–403 Fullscreen + responsive
[ ] T-601–606 QC gate
[ ] (opt) M5
```

---

## 12. Agent prompt (1 milestone / lần — khuyến nghị PM)

Tránh “implement all” một phát. Gọi theo milestone + GitFlow:

```text
Follow docs/workflows/gitflow-feature.md.
Create feature/M1-foundation from develop.
Use skill implement-milestone for M1 only.
```

```text
Use subagent milestone-implementer for milestone M2.
Stop-the-line if AC-04/53 fail.
```
---

## 13. Sign-off

| Role | Name | Date | Decision |
|------|------|------|----------|
| PM | | | ☐ Approve backlog · ☐ Rework |
| Tech lead | | | ☐ Estimate OK |
| QC | | | ☐ Gates OK |
