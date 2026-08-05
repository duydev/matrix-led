# 14 — Test Automation Specification

| Field | Value |
|-------|-------|
| Doc | Test Automation |
| Version | 1.0 |
| Stack | Vitest (MUST) · Playwright (SHOULD) |
| ADR | ADR-007 trong `08` |

## 1. Goals

| Priority | Goal |
|----------|------|
| MUST | Vitest cover logic deterministic của `state` + `engine` |
| SHOULD | Playwright smoke: load, no CDN font, đổi text, persist reload |
| MUST NOT | Pixel-diff toàn canvas làm gate CI MVP |

## 2. Package scripts (khóa tên)

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "build": "tsc -b && vite build"
  }
}
```

Gate ship local tối thiểu:

```bash
npm test && npm run build
# SHOULD thêm:
npm run test:e2e
```

## 3. Suggested tree

```text
src/
  state/
    persist.ts
    persist.test.ts          # cạnh file hoặc __tests__
  engine/
    font/
      textLayout.ts
      textLayout.test.ts
    effects/
      marquee.ts
      marquee.test.ts
      fade.ts
      fade.test.ts
      blink.ts
      blink.test.ts
e2e/
  smoke.spec.ts
  helpers.ts
vitest.config.ts
playwright.config.ts         # khi thêm E2E
```

Agent MAY dùng `src/**/*.test.ts` co-locate — **ưu tiên**.

## 4. Unit — bắt buộc (MUST map)

| Suite | Covers TC/AC | Assertions tối thiểu |
|-------|--------------|----------------------|
| `persist.validate` | TC-R02, AC-51 | JSON hỏng → defaults; unknown effect → `marquee`; clamp brightness/speed; slice text 200 |
| `flattenNewlines` | TC-C07, AC-07 | `\n`/`\r\n` → space; không để `\n` trong output |
| `clampText` | TC-C06, AC-06 | length ≤ 200 |
| `MATRIX_SIZES` | — | `64x16` → 64,16 |
| `marquee` offset | TC-E01/E06 | cùng bitmap, `t` lớn hơn → dịch khác; wrap không NaN |
| `fade_in_out` phases | TC-E03 | hold peak ≥ fade-out max intensity |
| `blink` windows | TC-E04 | off ≈ all-zero; on có lit cell |
| `color.parseHex` | — | `#ff1e00` ok; invalid → fallback |

### Canvas / font unit

| Approach | MVP |
|----------|-----|
| Mock `OffscreenCanvas` / stub `rasterize` | Prefer cho CI không cần font thật |
| Integration raster với font | SHOULD local; không bắt CI nếu flake |

Nếu stub raster: vẫn unit `flatten` + threshold helper thuần:

```ts
expect(alphaToBit(200, 128)).toBe(1)
expect(alphaToBit(50, 128)).toBe(0)
```

## 5. Unit — style example

```ts
import { describe, it, expect } from 'vitest';
import { validateConfig } from './persist';
import { DEFAULT_CONFIG } from './defaults';

describe('validateConfig', () => {
  it('falls back on corrupt json shape', () => {
    const cfg = validateConfig(null);
    expect(cfg.effectId).toBe('marquee');
    expect(cfg.matrixSizeId).toBe(DEFAULT_CONFIG.matrixSizeId);
  });

  it('clamps brightness', () => {
    const cfg = validateConfig({ ...DEFAULT_CONFIG, brightness: 99 });
    expect(cfg.brightness).toBeLessThanOrEqual(1);
  });
});
```

## 6. E2E smoke (SHOULD)

### Config tối thiểu

- `baseURL`: `http://127.0.0.1:4173` (preview) hoặc dev port  
- Browser: Chromium  
- `webServer`: `npm run preview` sau build **hoặc** `vite preview --port 4173`

### Cases

| Spec name | Steps | Expect | AC |
|-----------|-------|--------|-----|
| `loads default copy` | goto `/` | textarea value match / chứa `Chào mừng` | AC-01,04 |
| `no google fonts` | listen requests → goto | không URL match `/fonts\.googleapis\|fonts\.gstatic/` | AC-52 |
| `edit text` | fill textarea `TEST QC` | value = `TEST QC` | AC-01 |
| `persist reload` | set text → reload → value giữ | AC-50 |
| `mobile layout` | setViewport 375×667 | textarea + button play visible | AC-43 |

### Fullscreen E2E

**Không** bắt buộc native fullscreen (permission/flake). Manual TC-F01..03.

Pseudo-fullscreen: MAY assert class/`position:fixed` nếu implement có `data-testid="display-stage"`.

## 7. Testability requirements (cho implementer)

Để automation được, UI **SHOULD** có:

| Element | `data-testid` (khuyến nghị) |
|---------|-----------------------------|
| Textarea nội dung | `text-input` |
| Effect select | `effect-select` |
| Play/Pause | `play-pause` |
| Fullscreen btn | `fullscreen-btn` |
| Display root | `display-stage` |
| Speed | `speed-slider` |

Thiếu testid → E2E dùng role/label VI (`getByLabel('Nội dung')`) vẫn được — **ưu tiên label a11y**.

Engine: export pure functions testable (`validateConfig`, `flattenText`, `createEffect`).

## 8. CI recommendation (MAY)

```yaml
# ý tưởng GitHub Actions
- npm ci
- npm test
- npm run build
# SHOULD:
- npx playwright install --with-deps chromium
- npm run test:e2e
```

## 9. Flaky policy

| Symptom | Action |
|---------|--------|
| Font timing E2E | `await expect(input).toHaveValue(...)` + timeout; không assert canvas pixels |
| Animation timing | Không sleep chờ “đúng frame”; chỉ assert DOM/state |
| Fullscreen fail CI | Đưa về manual; không fail gate |
| Random order unit | Fixtures thuần; không phụ thuộc Date thật (inject `t`) |

Fail 2 lần liên tiếp cùng test → mở BUG, không nhồi `retries: 10` che lỗi.

## 10. Coverage guidance

| Area | Target MVP |
|------|------------|
| `src/state/**` | ≥ 70% lines SHOULD |
| `src/engine/effects/**` | ≥ 60% SHOULD |
| `src/ui/**` | không gate |
| Overall | không bắt 100% |

## 11. Definition of Automation Done

- [ ] `vitest` chạy được qua `npm test`  
- [ ] Có suite persist + flatten + ≥1 effect math  
- [ ] Documented trong PR/report: lệnh + kết quả  
- [ ] (SHOULD) `e2e/smoke.spec.ts` xanh local  
- [ ] Không có snapshot canvas bắt buộc  

## 12. Mapping automation ↔ TC

| Automation | TC |
|------------|-----|
| persist tests | TC-R02, TC-C06 |
| flatten tests | TC-C07 |
| marquee/fade/blink tests | TC-E01..04 |
| playwright smoke | TC-S01, TC-S02, TC-R01, TC-F04 |
| manual still required | TC-C02, TC-C04, TC-F01..03, TC-N01, visual rubric |
