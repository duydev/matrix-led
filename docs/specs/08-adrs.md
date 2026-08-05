# 08 — Architecture Decision Records (ADR)

| Field | Value |
|-------|-------|
| Doc | ADRs |
| Version | 1.3 |

Format mỗi ADR: Context → Decision → Consequences.

---

## ADR-001 — Vite + React + TypeScript + Canvas 2D

**Status:** Accepted

### Context

Cần SPA client-only render lưới LED + RAF, đồng thời form controls. Team/agent quen React; không cần SSR.

### Decision

- Build: **Vite**  
- UI: **React** + **TypeScript strict**  
- Pixel path: **Canvas 2D** (không WebGL MVP)

### Consequences

- (+) Scaffold nhanh, DX tốt với Cursor  
- (+) Canvas 2D đủ cho ≤ 96×16 cells  
- (−) Phải tuân React+RAF rules (`02` §4) để tránh perf/leak  
- (−) Đổi WebGL sau cần ADR mới khi NFR-01 fail có bằng chứng  

---

## ADR-002 — Self-hosted VT323 + offscreen raster

**Status:** Accepted (v1.2 refined)

### Context

AC yêu cầu tiếng Việt có dấu. Bitmap 5×7 thủ công phủ Unicode Việt tốn kém. CDN Google Fonts phá offline (NFR-07 / AC-52). Press Start 2P thiếu Vietnamese.

### Decision

1. Font LED mặc định: **VT323** (OFL, có subset Vietnamese).  
2. Packaging (chọn 1, cả hai đều “self-host” hợp lệ):  
   - **A (recommended):** `@fontsource/vt323` — import `latin` + `latin-ext` + `vietnamese`  
   - **B:** copy `woff2` vào `public/fonts` + `@font-face`  
3. Offscreen canvas raster → alpha threshold mặc định **`> 128`** (tune **100–160** nếu dấu Việt mỏng/đứt).  
4. Glyph fail → **`?`**.  
5. Cache `(text, rows, matrixSizeId, fontVersion)`.  
6. **MUST** `await document.fonts.ready` trước raster ổn định.  
7. **MUST NOT** runtime request tới `fonts.googleapis.com` / `fonts.gstatic.com`.

### Consequences

- (+) Tiếng Việt khả thi ngay; offline sau load bundle  
- (+) Agent không phải tự vẽ bitmap Việt  
- (−) Cần tinh threshold bằng mắt  
- (−) Thêm dependency npm (Option A) hoặc quản lý file font (Option B)  

Chi tiết thực chiến: `10-impl-notes.md`.

---

## ADR-003 — localStorage-only persistence

**Status:** Accepted

### Context

Giữ cấu hình giữa các lần mở; không backend; không share URL trong MVP.

### Decision

Persist toàn bộ `DisplayConfig` (`05`) vào `localStorage` key `matrix-led:config:v1`, debounce 300ms, validate khi load.

### Consequences

- (+) Đơn giản, private  
- (−) Không sync đa thiết bị  
- (−) Quota / private mode → degrade im lặng (vẫn chạy)  
- URL share = MAY + ADR riêng sau  

---

## ADR-004 — MVP effect set thu gọn

**Status:** Accepted

### Context

6+ effect MUST làm loãng chất lượng. Product cần marquee + fade + blink là đủ demo.

### Decision

MUST: `marquee`, `static`, `fade_in_out`, `blink`.  
SHOULD cùng milestone: `typewriter`, `shift_in`.  
Vertical = `marquee` + `direction`, không effect id riêng.

### Consequences

- (+) DoD rõ, agent focus  
- (−) Ít “wow” hơn catalog dài — chấp nhận cho v1  

---

## ADR-005 — “Zoom toàn màn hình” = Fullscreen

**Status:** Accepted

### Context

Yêu cầu gốc có thể hiểu là slider zoom hoặc fullscreen.

### Decision

MVP: Fullscreen API + CSS pseudo-fallback trên `DisplayStage`.  
Không làm pinch/% zoom (N-07 / FR-55 MAY).

### Consequences

- (+) Demo-ready đúng job chính  
- (−) User muốn phóng preview trong layout thường phải đợi phase 2  

---

## ADR-006 — Feasibility gate: GO for implement

**Status:** Accepted

### Context

SA review + senior fullstack feasibility (v1.1/v1.2): không blocker kỹ thuật cho MUST MVP.

### Decision

Cho phép implement theo `07`. Ước lượng tham chiếu: **2–3 ngày** senior cho MUST; SHOULD +0.5–1 ngày.  
Thứ tự rủi ro: xác nhận font VI (Phase D) sớm sau renderer.

### Consequences

- (+) Không chờ vòng spec thêm trước khi code  
- (−) Vẫn phải escalate R-01 nếu đổi threshold/font vẫn fail AC-04 (xem `09`)  

---

## ADR-007 — Test stack: Vitest MUST + Playwright smoke SHOULD

**Status:** Accepted

### Context

Cần automation chống regression engine/state mà không flake vì Canvas pixel. AC visual/LED honesty không tự động hóa ổn định bằng screenshot.

### Decision

1. **Vitest** = gate MUST (`npm test`) cho persist, flatten, effect math.  
2. **Playwright** = smoke SHOULD (load, no CDN, persist, viewport).  
3. **Manual** = MUST cho LED look, VI readability, fullscreen, fps cảm nhận (`13`).  
4. **MUST NOT** pixel-diff canvas làm CI gate MVP.  
5. Chi tiết: `11`–`14`.

### Consequences

- (+) CI/local nhanh, ít flake  
- (+) Vẫn bắt lỗi logic sớm  
- (−) Cảm giác LED phụ thuộc QC manual  
- (−) Playwright có thể waive lần đầu nếu chưa kịp — kèm form `12`  
  
