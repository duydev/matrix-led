# 07 — Agent Implementation Guide

| Field | Value |
|-------|-------|
| Doc | Agent Implementation Guide |
| Version | 1.3 |
| Audience | Cursor Agent |

## 1. Mission

Implement Matrix LED Simulator đúng `docs/specs` **v1.3**.  
Ưu tiên: LED grid → font VI (VT323) → 4 effect MUST → fullscreen/responsive → persist → **unit tests (`14`)** → SHOULD nếu còn thời gian.

## 2. Preflight (bắt buộc)

1. Đọc: `00` → `01` → `02` → `05` → `06`  
2. Skim `08`, `09`, `10`, và **`11`–`14` trước Phase I / khi viết test**  
3. Không mở rộng backend / CDN font / phase-2 trừ khi user yêu cầu  
4. Schema **chỉ** theo `05`

## 3. Build sequence

### Phase A — Scaffold

- [ ] Vite + React + TypeScript strict  
- [ ] `global.css` CSS variables nền tối  
- [ ] Scripts `dev` / `build` / `preview`  
- [ ] Font Option A (recommended): `npm i @fontsource/vt323` + import latin / latin-ext / vietnamese trong `main.tsx`  
- [ ] **Hoặc** Option B: `public/fonts` + `@font-face`  
- [ ] **MUST NOT** link Google Fonts CDN  

### Phase B — Data + state

- [ ] Types khớp `05`  
- [ ] `defaults`, `persist`, `useDisplayConfig`  
- [ ] TextInput + counter 200  
- [ ] localStorage round-trip validated  
- [ ] Unit Vitest: `persist` / clamp (`14`) — thêm sớm  

### Phase C — Renderer

- [ ] Framebuffer reuse + renderer cells (circle, gap)  
- [ ] Brightness + color  
- [ ] Resize + DPR clamp ≤ 2  
- [ ] Test pattern trước khi có text  
- [ ] `data-testid` theo `14` §7 (display-stage, text-input, …)  

### Phase D — Font raster (làm sớm — rủi ro cao nhất)

- [ ] `await document.fonts.ready` trước raster ổn định  
- [ ] Flatten newlines + **unit** flatten (`14`)  
- [ ] Offscreen + `ctx.font = '... "VT323"'` + threshold default 128  
- [ ] Cache; fallback `?`  
- [ ] Verify `"Chào mừng quý khách"` không toàn `?` (AC-04/AC-53)  
- [ ] Nếu dấu đứt: tune threshold 100–160 trước khi đổi font  

### Phase E — Loop + marquee + colorize

- [ ] RAF theo `02` §4 + tips `10` (cleanup, no setState/frame, configRef)  
- [ ] `marquee` + registry  
- [ ] **Unit:** marquee offset fixtures (`14`)  
- [ ] Play/pause/speed  
- [ ] Presets + rainbow trong `colorize`  

### Phase F — Remaining MUST effects

- [ ] `static`, `fade_in_out`, `blink`  
- [ ] **Unit:** fade phase + blink on/off (`14`)  
- [ ] EffectSelect UI  

### Phase G — Controls polish

- [ ] Direction, matrix size, glow  
- [ ] Fullscreen + **pseudo-fallback** (iOS)  
- [ ] Responsive AC-43/44  

### Phase H — SHOULD (nếu không bị block)

- [ ] `typewriter`, `shift_in`  
- [ ] Reset; visibility pause; `ttb`/`btt`  

### Phase I — Verify / QC gate

- [ ] `npm test` PASS (`14`)  
- [ ] `npm run build` PASS  
- [ ] Manual `06` MUST + visual rubric `13` §10  
- [ ] Smoke E2E (`npm run test:e2e`) PASS **hoặc** waive `12` §11  
- [ ] Network: không CDN font  
- [ ] Không commit trừ khi user yêu cầu  

## 4. Coding constraints

| Rule | Detail |
|------|--------|
| SSOT | `DisplayConfig` = `05` |
| Separation | UI ≠ scroll math; engine ≠ React components |
| Font | Self-host A hoặc B; VT323 recommended |
| Labels | Tiếng Việt (`03`) |
| Comments | threshold, ttb convention, fonts.ready |
| No drive-by | Không scope creep |

## 5. Locked defaults (không hỏi lại)

| Topic | Decision |
|-------|----------|
| Stack | Vite + React + TS + Canvas 2D |
| Font | VT323 via `@fontsource/vt323` (preferred) |
| Threshold | `> 128` start; tune 100–160 |
| MVP effects | `marquee`, `static`, `fade_in_out`, `blink` |
| Zoom | Fullscreen only |
| Max text | 200 |
| Package manager | npm |
| Scroll offset | Integer cells MVP |

## 6. Forbidden shortcuts

- `fillText` trên canvas chính như cách hiển thị cuối  
- CSS marquee `<div>` thay engine  
- Google Fonts / CDN runtime  
- Press Start 2P làm font LED chính  
- Effect switch khổng lồ không registry  
- Persist không validate  
- `setState` mỗi RAF frame  

## 7. Done report format

1. Phases completed (A–I)  
2. Font option dùng (A/B) + path/package  
3. Threshold cuối cùng  
4. `npm test` / E2E kết quả  
5. MUST AC còn FAIL (nếu có)  
6. SHOULD đã làm / chưa  
7. Run: `npm install` → `npm run dev`  

## 8. Human re-invoke prompts

**MVP:**

```text
Implement Matrix LED Simulator per docs/specs v1.3.
Follow 07 phases A→G (MUST). Do H only if unblocked.
Read 10 + 14. Use @fontsource/vt323 with vietnamese subset.
Add Vitest for persist/flatten/effects. Schema SSOT = 05.
No CDN fonts. No scope creep.
```
