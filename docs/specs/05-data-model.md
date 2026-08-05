# 05 — Data Model & Persistence (SSOT)

| Field | Value |
|-------|-------|
| Doc | Data Model |
| Version | 1.2 |
| Authority | **Single source of truth** cho `DisplayConfig` và persistence |

> Mọi file khác (`02`, code `state/types.ts`) **MUST** khớp schema này. Có lệch → sửa về đây trước.

## 1. Types

```ts
/** MVP MUST + same-milestone SHOULD. MAY ids không thêm vào union cho tới khi implement. */
export type EffectId =
  | 'marquee'
  | 'static'
  | 'fade_in_out'
  | 'blink'
  | 'typewriter' // SHOULD
  | 'shift_in';   // SHOULD

export type PresetId =
  | 'classic_red'
  | 'amber'
  | 'cyan'
  | 'lime'
  | 'rainbow'
  | 'custom';

export type Direction = 'rtl' | 'ltr' | 'ttb' | 'btt';

export type MatrixSizeId = '32x8' | '64x16' | '96x16';

export interface DisplayConfig {
  version: 1;
  text: string;
  effectId: EffectId;
  presetId: PresetId;
  color: string;           // #RRGGBB
  backgroundColor: string; // #RRGGBB
  brightness: number;      // 0.1 .. 1
  speed: number;           // 0.25 .. 3
  direction: Direction;
  matrixSizeId: MatrixSizeId;
  cellShape: 'circle' | 'square';
  glow: boolean;
  playing: boolean;
}
```

### Derived (không bắt buộc persist)

```ts
export const MATRIX_SIZES: Record<MatrixSizeId, { cols: number; rows: number }> = {
  '32x8': { cols: 32, rows: 8 },
  '64x16': { cols: 64, rows: 16 },
  '96x16': { cols: 96, rows: 16 },
};

// cols/rows = MATRIX_SIZES[config.matrixSizeId]
```

## 2. Defaults

```ts
export const DEFAULT_CONFIG: DisplayConfig = {
  version: 1,
  text: 'Chào mừng quý khách',
  effectId: 'marquee',
  presetId: 'classic_red',
  color: '#ff1e00',
  backgroundColor: '#050505',
  brightness: 0.85,
  speed: 1,
  direction: 'rtl',
  matrixSizeId: '64x16',
  cellShape: 'circle',
  glow: true,
  playing: true,
};

export const MAX_TEXT_LENGTH = 200;
```

Default text **có dấu** để chứng minh AC tiếng Việt ngay từ lần mở đầu.

## 3. Presets

| presetId | color | Notes |
|----------|-------|-------|
| `classic_red` | `#ff1e00` | Default |
| `amber` | `#ffb000` | |
| `cyan` | `#00e5ff` | |
| `lime` | `#b6ff00` | |
| `rainbow` | (ignored) | Hue theo `x` và/hoặc `t` trong `colorize` |
| `custom` | user | Color picker |

- Chọn preset ∉ {`custom`,`rainbow`} → ghi đè `color`.  
- User sửa color → `presetId = 'custom'`.

## 4. Persistence

| Key | Value |
|-----|-------|
| Storage key | `matrix-led:config:v1` |
| Format | JSON `DisplayConfig` |
| Save | Debounce 300ms sau mọi thay đổi |
| Load | Mount → parse → validate → merge defaults |
| Migration | `version !== 1` hoặc corrupt → defaults |

### Validation on load

| Field | Rule |
|-------|------|
| `effectId` | Unknown / SHOULD chưa register → `marquee` |
| `presetId` | Unknown → `classic_red` |
| `color` / `backgroundColor` | Invalid hex → default |
| `brightness` | clamp `[0.1, 1]` |
| `speed` | clamp `[0.25, 3]` |
| `text` | string; slice `0..MAX_TEXT_LENGTH`; flatten sẽ làm ở pipeline font |
| `direction` | invalid → `rtl` |
| `matrixSizeId` | invalid → `64x16` |
| `playing` | coerce boolean |
| `glow` / `cellShape` | invalid → defaults |

## 5. Runtime-only: TextBitmap

```ts
export interface TextBitmap {
  width: number;
  height: number;
  /** column-major: index = x * height + y */
  dots: Uint8Array; // 0 | 1
}
```

## 6. UI → engine reactions

| UI action | Patch | Engine |
|-----------|-------|--------|
| type text | `{ text }` | rebuild bitmap + effect reinit |
| select effect | `{ effectId }` | reinit |
| select preset | `{ presetId, color? }` | redraw / colorize only |
| color | `{ color, presetId: 'custom' }` | redraw |
| speed | `{ speed }` | continue |
| play/pause | `{ playing }` | loop gate |
| size | `{ matrixSizeId }` | resize + rebuild + reinit |
| direction | `{ direction }` | reinit scroll effects |
| glow / cellShape | patch | redraw options |

## 7. Export JSON (MAY)

Cùng shape `DisplayConfig` (xem defaults + fields §1).
