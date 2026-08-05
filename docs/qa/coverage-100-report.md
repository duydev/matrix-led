# QC Coverage Report — Matrix LED Simulator

**Date:** 2026-08-05  
**Gate:** Unit/integration coverage thresholds (Vitest + v8)  
**Command:** `npm run test:coverage`  
**Result:** **PASS**

## Metrics

| Metric       | Threshold | Actual |
|-------------|-----------|--------|
| Statements  | 100%      | 100%   |
| Branches    | 100%      | 100%   |
| Functions   | 100%      | 100%   |
| Lines       | 100%      | 100%   |

- Test files: 22 passed  
- Tests: 67 passed  

## Scope

- Included: `src/**/*.{ts,tsx}`
- Excluded: `*.test.*`, `src/test/**`, `vite-env.d.ts`, `assets/**`, type-only `types.ts`

## Intentional `v8 ignore`

Defensive / UI-lifecycle branches not reachable under React Testing Library without racing the framework:

- `DisplayStage.tsx`: null `rootRef` / null `canvasRef` / post-cleanup RAF tick
- `rasterizeText.ts`: decorative placeholder-glyph loop (visual fallback art)

## Residual (non-coverage)

- Human visual AC (Vietnamese LED readability, fullscreen eyes-on) still requires sign-off in `docs/specs/06` §7 — not automatable as coverage.
- Playwright smoke remains separate (`npm run test:e2e`); coverage gate above is Vitest-only.
