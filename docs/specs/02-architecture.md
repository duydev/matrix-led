# 02 — Architecture

| Field | Value |
|-------|-------|
| Doc | Architecture |
| Version | 1.3 |
| Schema SSOT | **`05-data-model.md`** — không nhân đôi type tại file này |

## 1. System context

```text
┌──────────────────────────────────────────┐
│                 Browser                   │
│  ┌────────────┐   ┌────────────────────┐ │
│  │ Controls UI│──▶│ App State (React)  │ │
│  └────────────┘   └─────────┬──────────┘ │
│                             │            │
│                             ▼            │
│                   ┌──────────────────┐   │
│                   │ Display Engine   │   │
│                   │ Font→Bitmap      │   │
│                   │ Effect→Buffer    │   │
│                   └────────┬─────────┘   │
│                            │ RAF         │
│                            ▼             │
│                   ┌──────────────────┐   │
│                   │ Canvas Renderer  │   │
│                   └──────────────────┘   │
│  Font assets   ◀── @fontsource bundle và/hoặc public/fonts │
│  localStorage  ◀── persist (05)                            │
└──────────────────────────────────────────┘
```

Không có backend MVP.

## 2. Logical modules

| Module | Responsibility | MUST NOT |
|--------|----------------|----------|
| `ui/` | Controls, layout, fullscreen chrome | Vẽ pixel LED / công thức effect |
| `state/` | `DisplayConfig`, persist, hooks | Biết Canvas API |
| `engine/font` | Text → `TextBitmap` (offscreen raster) | Animate / DOM UI |
| `engine/effects` | Strategy `update(t)` → intensity buffer | DOM / React |
| `engine/framebuffer` | Allocate/reuse cell buffer | UI |
| `engine/renderer` | Buffer + colorMode → Canvas | Business form |
| `engine/loop` | RAF, play/pause, speed, visibility | Hardcode 1 effect |
| `engine/color` | Preset / rainbow / brightness apply | Effect logic |

## 3. Rendering pipeline

```text
1. loop.tick(now) → { deltaMs, t }   // t không tăng khi paused
2. effect.update({ t, deltaMs, config, textBitmap }) → FrameBuffer (intensity)
3. colorize(buffer, config) → RGB per lit cell (preset/custom/rainbow)
4. renderer.draw(coloredOrIntensity, renderOptions)
```

### Rules

- **Single writer:** chỉ effect ghi intensity (reuse `Float32Array`).  
- **No DOM in effects.**  
- **Resize CSS/DPR:** chỉ ảnh hưởng `renderer`; đổi `matrixSizeId` → recreate buffer + rebuild bitmap + effect reinit.  
- **Color/brightness/glow:** không reset `t`.

## 4. React + RAF integration (footgun guard)

| Rule | Detail |
|------|--------|
| R1 | RAF chạy trong `useEffect` trên `DisplayStage` (hoặc hook `useEngineLoop`) — **không** `setState` mỗi frame. |
| R2 | Config thay đổi qua refs (`configRef.current`) để loop đọc giá trị mới không restart RAF trừ khi cần. |
| R3 | Cleanup: `cancelAnimationFrame` + `effect.dispose?()` + remove listeners. |
| R4 | React Strict Mode: init/dispose phải idempotent (double-mount safe). |
| R5 | Đổi text/effect/size → reinit effect **ngoài** draw path (trong reaction/effect), không tạo effect mới mỗi frame. |

## 5. Project structure

```text
matrix-led/
├── docs/specs/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
│   ├── favicon.svg
│   └── fonts/                 # optional nếu dùng @fontsource
│       └── vt323-*.woff2
├── src/
│   ├── main.tsx               # import font CSS ở đây nếu dùng @fontsource
│   ├── App.tsx
│   ├── styles/global.css
│   ├── ui/
│   │   ├── DisplayStage.tsx
│   │   ├── ControlPanel.tsx
│   │   ├── TextInput.tsx
│   │   ├── EffectSelect.tsx
│   │   ├── StyleControls.tsx
│   │   └── PlaybackControls.tsx
│   ├── state/
│   │   ├── types.ts              # re-export / mirror of 05
│   │   ├── defaults.ts
│   │   ├── persist.ts
│   │   └── useDisplayConfig.ts
│   ├── engine/
│   │   ├── loop.ts
│   │   ├── framebuffer.ts
│   │   ├── renderer.ts
│   │   ├── colorize.ts           # presets + rainbow (NOT an effect)
│   │   ├── font/
│   │   │   ├── rasterizeText.ts
│   │   │   └── textLayout.ts
│   │   └── effects/
│   │       ├── types.ts
│   │       ├── registry.ts
│   │       ├── marquee.ts
│   │       ├── static.ts
│   │       ├── fade.ts
│   │       ├── blink.ts
│   │       ├── typewriter.ts     # SHOULD
│   │       └── shiftIn.ts        # SHOULD
│   └── utils/
│       ├── color.ts
│       └── fullscreen.ts
```

**Font packaging (chọn 1):**

| Option | Cách | Ghi chú |
|--------|------|---------|
| A (Recommended) | `npm i @fontsource/vt323` + import CSS subset trong `main.tsx` | Self-host qua bundle; không network Google |
| B | Copy `woff2` vào `public/fonts` + `@font-face` trong CSS | Không thêm dependency font |

Agent MAY gom file nhỏ hơn; **MUST NOT** gộp engine vào component UI; **MUST NOT** đặt rainbow như effect file.

## 6. Contracts (reference only)

Import hình dạng từ SSOT `05`. Runtime engine types:

```ts
// Conceptual — keep fields aligned with 05 DisplayConfig
import type { DisplayConfig } from '../state/types';

export type FrameBuffer = {
  cols: number;
  rows: number;
  cells: Float32Array; // length = cols * rows; intensity 0..1
};

export type TextBitmap = {
  width: number;
  height: number;
  /** column-major: index = x * height + y */
  dots: Uint8Array; // 0 | 1
};

export type EffectContext = {
  t: number;
  deltaMs: number;
  config: DisplayConfig;
  textBitmap: TextBitmap;
};

export interface Effect {
  id: string;
  label: string; // VI
  init(ctx: Omit<EffectContext, 'deltaMs'>): void;
  update(ctx: EffectContext): FrameBuffer;
  dispose?(): void;
}
```

## 7. Font pipeline (ADR-002)

**Recommended face:** `VT323` (OFL, có Vietnamese).  
**CSS family name:** `"VT323", monospace`.

```text
await document.fonts.ready
text (flatten newlines)
  → offscreen canvas: ctx.font = `${px}px "VT323"`
  → fillText → getImageData alpha
  → threshold (default > 128; tune 100–160) → TextBitmap
  → cache
```

### Subset imports (Option A)

```ts
// main.tsx — đảm bảo có vietnamese
import '@fontsource/vt323/latin.css';
import '@fontsource/vt323/latin-ext.css';
import '@fontsource/vt323/vietnamese.css';
```

### Rules

- **MUST NOT** dùng Press Start 2P làm font LED chính (thiếu tiếng Việt).  
- Font chưa ready → idle / skip cache; raster lại sau `fonts.ready`.  
- Load fail → monospace system + threshold; log cảnh báo.  
- Chi tiết thực chiến: `10-impl-notes.md`.

## 8. Fullscreen

- Target: `DisplayStage` root.  
- Native Fullscreen API; `fullscreenchange` → resize canvas.  
- Fallback: `position: fixed; inset: 0; z-index: high` (pseudo-fullscreen).  
- iOS Safari: ưu tiên fallback sớm nếu API thiếu/unstable.

## 9. Performance checklist

| Technique | Usage |
|-----------|-------|
| DPR clamp ≤ 2 | Luôn |
| Reuse `Float32Array` | Luôn |
| Precompute `TextBitmap` | Không layout mỗi frame |
| Dirty draw when paused | Skip RAF work hoặc chỉ draw khi config đổi |
| Visibility API | Pause khi tab ẩn (SHOULD) |
| Glow | Tắt mặc định trên máy yếu nếu cần; `shadowBlur` theo cell có chi phí |

## 10. Security / privacy

- Không `eval` user text.  
- Text vào DOM qua React text children / `value` — không `dangerouslySetInnerHTML`.  
- Không analytics bắt buộc.

## 11. Testing

Chi tiết SSOT test: **`11`–`14`**. Tóm tắt:

| Layer | Approach | Priority |
|-------|----------|----------|
| Unit | Vitest — persist, flatten, effect math (`14`) | MUST |
| E2E smoke | Playwright — load, no CDN, persist (`14`) | SHOULD |
| Manual | AC `06` + cases `13` + visual rubric | MUST |
| Visual pixel-diff CI | — | MUST NOT MVP |

Implementer **SHOULD** thêm `data-testid` theo `14` §7.
