# 10 — Implementation Notes (Feasibility)

| Field | Value |
|-------|-------|
| Doc | Impl notes |
| Version | 1.3 |
| Audience | Cursor Agent + developer |
| Status | Feasibility **GO** — bổ sung thực chiến cho v1.1/v1.2 |

## 1. Feasibility summary

| Hạng mục | Kết luận |
|----------|----------|
| MUST MVP | Khả thi cao |
| SHOULD cùng lượt | Khả thi; không chặn DoD |
| Blocker kỹ thuật | Không |
| Effort tham chiếu | 2–3 ngày senior (MUST); +0.5–1 ngày SHOULD |

Không cần vòng spec thêm trước khi code.

## 2. Font — làm đúng một lần

### Recommended

```bash
npm i @fontsource/vt323
```

```ts
// src/main.tsx
import '@fontsource/vt323/latin.css';
import '@fontsource/vt323/latin-ext.css';
import '@fontsource/vt323/vietnamese.css';
```

```ts
// rasterizeText.ts (sketch)
await document.fonts.ready;
ctx.font = `${fontPx}px "VT323", monospace`;
// ... fillText → getImageData → alpha > THRESHOLD
```

### Equivalent Option B

Copy `woff2` (latin + vietnamese) vào `public/fonts`, khai báo `@font-face { font-family: 'VT323'; ... }`.

### Checklist nhanh

- [ ] Không có `<link href="https://fonts.googleapis.com/...">`  
- [ ] Có subset Vietnamese  
- [ ] `document.fonts.ready` trước cache bitmap ổn định  
- [ ] Default `"Chào mừng quý khách"` đọc được trên LED  
- [ ] Threshold bắt đầu 128; nếu dấu mỏng → hạ dần (không nhảy font ngay)  

### Tránh

| Avoid | Why |
|-------|-----|
| Press Start 2P làm font LED chính | Thiếu Vietnamese |
| Chỉ `import '@fontsource/vt323'` nếu không chắc có VI | Có thể thiếu subset — import rõ `vietnamese.css` |
| Raster sync ngay mount | Font chưa load → dấu thành `?` / hộp |

## 3. React + RAF (copy-paste rules)

```ts
// Pattern khuyến nghị (ý tưởng — không bắt buộc đúng từng tên API)
useEffect(() => {
  let raf = 0;
  let running = true;
  const tick = (now: number) => {
    if (!running) return;
    if (configRef.current.playing) {
      engine.frame(now, configRef.current);
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => {
    running = false;
    cancelAnimationFrame(raf);
    engine.dispose();
  };
}, []); // không phụ thuộc toàn bộ config object
```

- Đọc `configRef.current` mỗi frame.  
- Reinit effect khi `text` / `effectId` / `matrixSizeId` / `direction` đổi — trong `useEffect` riêng, không trong `tick`.  
- **Không** `setState` từ trong `tick`.

## 4. Fullscreen iOS

1. Thử `element.requestFullscreen?.()`  
2. Nếu throw / undefined / không vào được trong ~300ms → bật class pseudo-fullscreen (`position: fixed; inset: 0; z-index: high; background: #000`)  
3. Nút Thoát phải clear cả hai mode  

## 5. Perf tips đủ dùng

| Tip | Khi nào |
|-----|---------|
| Reuse `Float32Array` | Luôn |
| DPR `Math.min(devicePixelRatio, 2)` | Luôn |
| Precompute `TextBitmap` | Luôn |
| Integer cell scroll | MVP |
| Glow off | Nếu máy yếu / 96×16 + shadow nặng |
| Pause visibility | SHOULD |

`64×16` ≈ 1024 cells — Canvas 2D path thường dư sức nếu không allocate mỗi frame.

## 6. Phase risk order

```text
A scaffold → B state → C renderer(test pattern)
  → D font VI  ★ xác nhận AC-04 ở đây
  → E marquee+loop → F other MUST effects
  → G fullscreen/responsive → H SHOULD → I verify
```

Nếu D fail: dừng theo `09` Escalation — đừng build thêm 4 effect trên font hỏng.

## 7. Verify tối thiểu trước khi báo done

1. Default VI marquee đỏ  
2. Network: không Google Fonts  
3. Offline (DevTools): vẫn chạy  
4. 4 effect MUST  
5. Fullscreen hoặc pseudo  
6. Reload giữ config  
7. `npm test && npm run build`  
8. Manual visual rubric `13` §10  

Chi tiết QC: `11`–`14`.  
