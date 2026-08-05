# 04 — Effects Engine Specification

| Field | Value |
|-------|-------|
| Doc | Effects Engine |
| Version | 1.2 |

## 1. Purpose

Hợp đồng hành vi từng effect — agent implement thống nhất; human nghiệm thu theo `06`.

## 2. Common semantics

### 2.1 Coordinates

- `(0,0)` = top-left viewport cell  
- `x` → phải, `y` → dưới  
- `TextBitmap` column-major: `index = x * height + y`

### 2.2 Timing

- `t` = ms since effect init/restart  
- `effectiveRate = base * config.speed`  
- Pause: không tăng `t`, giữ buffer  

### 2.3 Loop (scroll)

Khi bitmap + gap đã chạy hết khỏi viewport theo `direction` → wrap offset.  
Gap mặc định = `config` derived `cols`.

### 2.4 Intensity vs color

1. Effect chỉ ghi **intensity 0..1**  
2. `colorize` (preset / custom / rainbow) × brightness ở bước render  
3. **Glow** là option renderer — **không** phải effect  

### 2.5 Direction (áp dụng `marquee`)

| direction | Hành vi (convention cố định) |
|-----------|------------------------------|
| `rtl` | Nội dung dịch chuyển sang trái (vào từ phải) — default |
| `ltr` | Nội dung dịch chuyển sang phải (vào từ trái) |
| `ttb` | Nội dung dịch chuyển xuống dưới (vào từ trên) |
| `btt` | Nội dung dịch chuyển lên trên (vào từ dưới) |

Giữ đúng bảng trên; ghi comment 2 dòng cạnh offset code.

> Không có effect id `vertical_marquee` riêng.

## 3. MVP effect catalog — MUST (DoD)

| EffectId | Label (VI) | Summary |
|----------|------------|---------|
| `marquee` | Chạy chữ (Marquee) | Scroll liên tục theo `direction` |
| `static` | Tĩnh | Căn giữa; clip nếu dài; không scroll |
| `fade_in_out` | Fade in / Fade out | In → hold → out → blank → loop; center |
| `blink` | Nhấp nháy | On/off toàn text theo chu kỳ |

## 4. Same-milestone SHOULD

| EffectId | Label (VI) | Summary |
|----------|------------|---------|
| `typewriter` | Gõ từng chữ | Hiện dần theo cột/glyph; hold; clear; loop |
| `shift_in` | Trượt vào | Vào center → hold → ra → loop |

## 5. Phase 2 MAY

| EffectId | Notes |
|----------|-------|
| `wave` | Marquee + `sin` y-shift / intensity pulse |
| `neon_pulse` | Global breathing intensity (khác `glow`) |
| `slot` | Random settle từng glyph |
| `mirror` / `rain` / playlist | Ngoài scope MVP |

## 6. Detailed specs

### 6.1 `marquee` — MUST

```text
offsetCells = floor((t/1000) * baseSpeed * speed)
// sample textBitmap into viewport with gap wrap along scroll axis
baseSpeed default = 8 cells/sec
```

Cảm giác: bảng cửa hàng — chữ vào từ mép, chạy, loop.

### 6.2 `static` — MUST

- Center horizontal (và vertical nếu `rows > bitmap.height`)  
- Quá dài: **clip** (không auto-fallback marquee)  

### 6.3 `fade_in_out` — MUST

Chu kỳ `T = 3000ms / speed`:

| Phase | % chu kỳ | Multiplier |
|-------|----------|------------|
| Fade in | 0–25% | 0 → 1 |
| Hold | 25–60% | 1 |
| Fade out | 60–90% | 1 → 0 |
| Blank | 90–100% | 0 |

Compose text center rồi nhân multiplier.

### 6.4 `blink` — MUST

- `onMs = 500 / speed`, `offMs = 300 / speed` (clamp min 50ms)  
- On = static centered; Off = zeros  

### 6.5 `typewriter` — SHOULD

- Tăng cột/glyph visible theo thời gian  
- Cursor blink SHOULD ở cuối  
- Đủ chữ → hold ~1s → clear → loop  

### 6.6 `shift_in` — SHOULD

1. Ngoài viewport (ngược hướng `direction` hoặc từ phải nếu static-center motion)  
2. Animate vào center  
3. Hold  
4. Animate ra  
5. Loop  

## 7. Not effects

| Feature | Where |
|---------|-------|
| Rainbow | `colorize` / preset `rainbow` |
| Glow | `renderer` option |
| Brightness | `colorize` / renderer |

## 8. Registry

```ts
export function createEffect(id: EffectId): Effect {
  const factory = effectRegistry[id];
  if (!factory) throw new Error(`Unknown effect: ${id}`);
  return factory();
}
```

- UI chỉ list effect đã register.  
- MUST ids luôn có trong registry.  
- SHOULD ids: register khi implement.  
- Persist gặp unknown id → `marquee` (`05` validation).

## 9. Switching rules

| Change | Action |
|--------|--------|
| `effectId` / `text` / `matrixSizeId` | dispose → rebuild bitmap nếu cần → init → `t=0` |
| `direction` | reinit scroll effects (`marquee`, `shift_in` nếu có); `t=0` |
| `color` / `brightness` / `glow` / `presetId` | không reset `t` |
| `speed` | không reset `t` |
| `playing` toggle | không init lại |

## 10. Quality bar

| Do | Don't |
|----|-------|
| Cell grid + gap | `fillText` trực tiếp canvas chính như sản phẩm cuối |
| Delta-time / `t` based | `setInterval` bỏ qua thời gian thật |
| Reuse buffer | New array mỗi frame |
| Integer cell offset MVP | Bắt buộc subpixel (SHOULD nếu còn thời gian) |
