# 01 — Software Requirements Specification (SRS)

| Field | Value |
|-------|-------|
| Doc | SRS |
| Version | 1.2 |
| Relates to | `00`, `05`, `06` |

## 1. Functional requirements

### 1.1 Content input

| ID | Priority | Requirement |
|----|----------|-------------|
| FR-01 | MUST | Nhập chuỗi text (Latin + tiếng Việt có dấu). |
| FR-02 | MUST | Text trống → idle an toàn (matrix off hoặc placeholder cố định `NHAP NOI DUNG`), không crash. |
| FR-03 | MUST | Đổi text không reload; rebuild bitmap theo rule `04` § Switching. |
| FR-04 | MUST | Max length **200** ký tự; vượt thì clamp + hiện counter/warning. |
| FR-05 | MUST | Xuống dòng: flatten `\n` / `\r\n` thành một khoảng trắng trước khi raster. |

### 1.2 Display / Matrix simulation

| ID | Priority | Requirement |
|----|----------|-------------|
| FR-10 | MUST | Vẽ lưới LED (circle hoặc square có bo nhẹ) + gap giữa cells. |
| FR-11 | MUST | Cell off = nền tối nhìn thấy vị trí đèn; cell on = màu active × brightness. |
| FR-12 | MUST | Text **raster hóa** sang bitmap/intensity — cấm lấy `fillText` trên canvas chính làm cách hiển thị duy nhất. |
| FR-13 | MUST | Marquee mặc định **RTL** (chữ chạy phải → trái). |
| FR-14 | MUST | `direction`: `rtl` \| `ltr` \| `ttb` \| `btt` áp dụng cho effect `marquee` (và scroll-based SHOULD khác nếu có). |
| FR-15 | MUST | Text dài hơn viewport → loop vô hạn (gap mặc định = `cols`). |
| FR-16 | MUST | Text ngắn hơn viewport: `marquee` vẫn chạy vào/ra loop; effect `static` căn giữa + clip nếu quá dài. |
| FR-17 | SHOULD | Toggle glow (canvas shadow); tắt được vì perf. |

### 1.3 Style & color

| ID | Priority | Requirement |
|----|----------|-------------|
| FR-20 | MUST | ≥ 4 presets màu cứng + Rainbow + Custom (xem `05`). |
| FR-21 | MUST | Color picker / HEX tùy chỉnh → `presetId = custom`. |
| FR-22 | MUST | Brightness 10–100% (`0.1..1`). |
| FR-23 | SHOULD | Rainbow: hue theo cột và/hoặc thời gian (color mode, **không** phải effect). |
| FR-24 | MAY | Gradient 2 màu custom. |

### 1.4 Effects

| ID | Priority | Requirement |
|----|----------|-------------|
| FR-30 | MUST | Effect selector theo catalog MVP MUST trong `04`. |
| FR-31 | MUST | Đổi effect: dispose cũ → init mới (xem `04`). |
| FR-32 | MUST | Speed chung ảnh hưởng mọi effect trừ khi effect ghi đè (MVP: không override). |
| FR-33 | MUST | Play/Pause không mất text/config. |
| FR-34 | SHOULD | Effects SHOULD trong `04` nếu còn thời gian cùng milestone. |

### 1.5 Playback controls

| ID | Priority | Requirement |
|----|----------|-------------|
| FR-40 | MUST | Play / Pause. |
| FR-41 | MUST | Speed multiplier `0.25..10`. |
| FR-42 | SHOULD | Reset animation về đầu chu kỳ (`t = 0`, re-init effect hiện tại). |
| FR-43 | MAY | Nút reverse direction riêng (MVP dùng select `direction`). |

### 1.6 Fullscreen & responsive

| ID | Priority | Requirement |
|----|----------|-------------|
| FR-50 | MUST | Double-click (chuột) / double-tap (cảm ứng) trên `DisplayStage` toggle Fullscreen API hoặc pseudo-fallback. Không bắt buộc nút UI riêng. |
| FR-51 | MUST | Fullscreen: matrix scale contain tối đa; controls ẩn/thu; Esc thoát; double-activate cũng toggle. |
| FR-52 | MUST | Responsive từ ~320px; không bắt buộc scroll ngang để dùng control chính. |
| FR-53 | SHOULD | Phím `F` toggle fullscreen (desktop). |
| FR-54 | MUST | Canvas scale theo container; `devicePixelRatio` clamp ≤ 2. |
| FR-55 | MAY | Slider/pinch zoom % preview (ngoài fullscreen) — phase 2. |

### 1.7 Persistence

| ID | Priority | Requirement |
|----|----------|-------------|
| FR-60 | MUST | Lưu config theo `05` vào `localStorage`. |
| FR-61 | MUST | Restore khi reload (merge + validate). |
| FR-62 | MAY | Export / import JSON. |

### 1.8 Font / glyphs

| ID | Priority | Requirement |
|----|----------|-------------|
| FR-70 | MUST | Font pixel **self-host**: (A) npm package kiểu `@fontsource/vt323` bundled vào app, **hoặc** (B) file trong `public/fonts` + `@font-face`. **MUST NOT** `@import` / `<link>` Google Fonts hay CDN runtime. |
| FR-71 | MUST | Offscreen raster + alpha threshold mặc định `> 128` (được tune trong khoảng 100–160 nếu dấu Việt bị mất/đứt). |
| FR-72 | MUST | Glyph không render được → `?`. |
| FR-73 | MUST | Cache bitmap theo khóa `(text, rows, matrixSizeId, fontVersion)`. |
| FR-74 | MUST | Trước raster ổn định: chờ `document.fonts.ready` (và/hoặc `FontFace.load`). |
| FR-75 | SHOULD | Import đủ subset cần thiết: tối thiểu latin + vietnamese (và latin-ext nếu font tách file). |

## 2. Non-functional requirements

| ID | Priority | Category | Requirement |
|----|----------|----------|-------------|
| NFR-01 | MUST | Performance | RAF loop; cảm nhận mượt ≥ ~30 FPS trên matrix `64×16` (Chrome desktop). |
| NFR-02 | SHOULD | Performance | Tránh allocate `Float32Array` mỗi frame; reuse buffer. Không yêu cầu profiler gate cứng cho MVP. |
| NFR-03 | MUST | A11y | Label controls; keyboard focus; contrast UI đủ. |
| NFR-04 | SHOULD | A11y | `prefers-reduced-motion`: tắt glow pulse; speed mặc định chậm hơn khi lần đầu (không block marquee). |
| NFR-05 | MUST | Compat | Chrome, Edge, Firefox, Safari gần nhất (desktop + iOS). Fullscreen fail → pseudo-fullscreen CSS. |
| NFR-06 | MUST | Responsive | Usable ≥ 320px width. |
| NFR-07 | MUST | Offline | Sau khi load bundle (gồm font), core app chạy offline được. |
| NFR-08 | SHOULD | Bundle | JS gzipped < 200KB MVP. |
| NFR-09 | MUST | Privacy | Không gửi text/config lên server. |
| NFR-10 | MUST | i18n UI | Labels tiếng Việt. |

## 3. Constraints

| ID | Constraint |
|----|------------|
| C-01 | Client-only; không API bắt buộc. |
| C-02 | Canvas 2D trước; WebGL chỉ khi Canvas không đạt NFR-01 và có ADR mới. |
| C-03 | Không dùng GIF làm engine. |
| C-04 | TypeScript strict. |
| C-05 | Schema config chỉ từ `05`. |
| C-06 | Engine không import React component; UI không chứa công thức scroll. |

## 4. User stories (traceability)

| Story | Maps to |
|-------|---------|
| Nhập chữ thấy LED chạy ngay | FR-01, FR-10–16, FR-70–72 |
| Chọn màu preset hoặc custom | FR-20–22 |
| Đổi effect marquee / fade / blink | FR-30–33 |
| Phóng toàn màn hình demo | FR-50–51 |
| Dùng được trên mobile | FR-52, NFR-06 |
| Reload vẫn giữ cấu hình | FR-60–61 |

Chi tiết FR → AC: `06` § Traceability.

## 5. Error / edge cases

| Case | Expected |
|------|----------|
| Text > 200 | Clamp + warning |
| Glyph thiếu | `?` |
| Fullscreen bị chặn | Pseudo-fullscreen + toast 1 dòng |
| localStorage chặn/đầy | App chạy; skip persist; không crash |
| Tab ẩn | Pause hoặc throttle RAF (SHOULD) |
| Font file lỗi load | Fallback system monospace raster + vẫn threshold; log console |
| Font chưa ready | Không raster vội bằng font sai; đợi `fonts.ready` rồi mới cache bitmap |
