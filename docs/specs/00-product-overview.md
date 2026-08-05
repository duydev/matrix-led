# 00 — Product Overview

| Field | Value |
|-------|-------|
| Product name | Matrix LED Simulator |
| Spec version | 1.3 |
| Type | Single-page web application (client-only) |
| Primary users | Người dùng giả lập/xem trước nội dung LED; demo / hobbyist |
| Doc status | **Approved for implementation** |

## 1. Problem

Màn hình Matrix LED (cửa hàng, sự kiện, bảng chạy chữ) hiển thị text theo lưới LED với hiệu ứng chạy chữ đặc trưng. Người dùng cần công cụ web để **soạn nội dung + chọn kiểu/màu/hiệu ứng** và **xem ngay** mô phỏng, không cần phần cứng.

## 2. Product goal

1. Nhập nội dung hiển thị  
2. Chọn kích thước matrix / hướng chạy / kiểu hiển thị (effect)  
3. Chọn style preset **hoặc** màu thủ công  
4. Chạy text loop giống bảng LED (pixel grid + scroll)  
5. Có các hiệu ứng: marquee, fade, blink, …  
6. Responsive mọi thiết bị  
7. **Zoom toàn màn hình** = chế độ Fullscreen (xem mục 9)

## 3. Success definition

Mở app trên điện thoại hoặc desktop → nhập chữ → chọn effect + màu → matrix chạy mượt → bấm fullscreen để demo như bảng LED — **không đăng nhập, không server**.

## 4. In scope (MVP)

| ID | Capability |
|----|------------|
| S-01 | Text input + live preview |
| S-02 | Pixel-grid matrix renderer (Canvas 2D) |
| S-03 | Continuous marquee loop (RTL bắt buộc; LTR/TTB/BTT qua `direction`) |
| S-04 | Style presets + custom HEX color + brightness |
| S-05 | Effect engine — MVP MUST set trong `04` |
| S-06 | Responsive layout + display scaling theo container |
| S-07 | Fullscreen display (“zoom toàn màn hình”) |
| S-08 | Play / Pause / Speed |
| S-09 | Persist config trong `localStorage` |

## 5. Out of scope / Non-goals

| ID | Non-goal | Rationale |
|----|----------|-----------|
| N-01 | Backend, auth, multi-user sync | Client-only |
| N-02 | Kết nối phần cứng LED | Simulator only |
| N-03 | Video / GIF / image playlist | Phase 2 MAY |
| N-04 | Real-time collaboration | Out of scope |
| N-05 | Native app stores | Web-first |
| N-06 | Emulate driver cụ thể (MAX7219 quirks) | Cảm giác LED, không chip-accurate |
| N-07 | Slider zoom preview riêng (pinch/zoom %) | MAY phase 2; MVP dùng fullscreen |
| N-08 | Google Fonts / CDN **runtime** | Vi phạm offline; `@fontsource` bundle hoặc `public/fonts` thì OK |

## 6. Personas & jobs-to-be-done

| Persona | Job |
|---------|-----|
| Shop owner | Soạn câu chào / KM, chọn màu, fullscreen trình bày |
| Event staff | Thử tốc độ & effect trước khi lên bảng thật |
| Developer / hobbyist | Demo “LED vibe”, tùy chỉnh nhanh |

## 7. Experience principles

1. **Display-first** — matrix là hero  
2. **Instant feedback** — đổi config phản ánh frame kế  
3. **LED honesty** — lưới đèn, không chữ UI anti-aliased  
4. **Touch-friendly** — control chính ≥ 44px  
5. **Demo-ready** — 1 nút fullscreen đủ để trình diễn  

## 8. Decided tech stack

| Layer | Choice | ADR |
|-------|--------|-----|
| Build | Vite | ADR-001 |
| Language | TypeScript (strict) | ADR-001 |
| UI | React | ADR-001 |
| Render | HTML Canvas 2D | ADR-001 |
| Font | Offscreen raster + **self-host** pixel font (khuyến nghị VT323) | ADR-002 |
| State | React state + `localStorage` | ADR-003 |
| Style | CSS + CSS variables (không design-system nặng) | — |

Đổi stack **MUST** có ADR mới + cập nhật `02`/`07`. Module boundaries giữ nguyên kể cả khi đổi framework UI.

## 9. Terminology lock — “Zoom toàn màn hình”

Trong yêu cầu gốc, **“zoom lên toàn màn hình”** được chốt nghĩa MVP:

> Người dùng phóng vùng matrix lên chiếm toàn bộ màn hình để demo (Fullscreen API + CSS fallback).

| Term | MVP meaning |
|------|-------------|
| Zoom toàn màn hình | **Fullscreen** display stage |
| Scale theo container | Tự fit canvas trong khung (responsive) — luôn bật |
| Pinch / % zoom control | **MAY** phase 2 (N-07) |

## 10. Closed decisions (không hỏi lại agent)

| Topic | Decision |
|-------|----------|
| Font | Self-host VT323 (hoặc font pixel OFL có Vietnamese); offscreen + threshold mặc định `> 128` (tune 100–160); glyph thiếu → `?`. Packaging: `@fontsource/vt323` **hoặc** `public/fonts/*.woff2` — không CDN runtime |
| Color | HEX + brightness; native color input |
| Matrix sizes | `32x8`, `64x16`, `96x16`, `128x32`, `160x32`, `192x48`, `256x64` (default) |
| Fonts (mono LED) | `vt323` (VI), `share_tech_mono`, `ibm_plex_mono` (VI), `space_mono` (default, VI), `silkscreen`, `press_start_2p`, `nova_mono` — self-host `@fontsource`, không CDN |
| Config schema | SSOT = `05-data-model.md` |
| Short text | Marquee vẫn chạy vào/ra được; `static` là effect riêng |
| Newlines | MVP flatten `\n` → khoảng trắng |
| Vertical scroll | `marquee` + `direction: ttb\|btt` — **không** effect `vertical_marquee` riêng |
| URL share | MAY phase 2 |

## 11. Glossary

| Term | Definition |
|------|------------|
| Cell / Dot | Một “LED” trên lưới (intensity 0..1) |
| Matrix | Lưới `cols × rows` |
| Frame buffer | Buffer intensity 1 frame |
| Marquee | Text dịch chuyển liên tục theo `direction` |
| Loop | Lặp vô hạn sau khi hết chu kỳ |
| Effect | Strategy animate buffer theo thời gian |
| Preset | Bộ màu/style đặt sẵn (không phải effect) |
| Fullscreen display | DisplayStage chiếm fullscreen / pseudo-fullscreen |
