# Changelog

Mọi thay đổi đáng chú ý của dự án được ghi tại đây.

Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
và dự án tuân theo [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Footer web app: phiên bản (`package.json`), tác giả Trần Nhật Duy, email, GitHub, MIT
- Catalog font LED mono self-host (`fontId`): VT323, Share Tech Mono, IBM Plex Mono, Space Mono, Silkscreen, Press Start 2P, Nova Mono
- Kích thước matrix lớn hơn: `128×32`, `160×32`, `192×48`, `256×64`
- Phạm vi tốc độ mở rộng: `0.25`–`10` (marquee / typewriter nhanh hơn theo scale)
- Dev / preview Vite bind `host: true` để truy cập LAN
- Pseudo-fullscreen thân thiện iOS Safari (portal `document.body`, `visualViewport`, khóa scroll)
- Thoát fullscreen bằng double-click / double-tap (không nút Exit trên overlay)
- Ngưỡng coverage Vitest 100% trên `src/` + báo cáo QC

### Changed

- Fullscreen chỉ còn gesture: double-click / double-tap trên màn LED để **toggle** (bỏ nút Toàn màn hình)
- Default config: `fontId: space_mono`, `matrixSizeId: 256x64`, `speed: 4`
- Font raster supersample (`RASTER_SCALE = 6`) để giảm hiện tượng “dính dấu” / stem chữ M
- Tài liệu SSOT cập nhật theo font / size / speed / fullscreen

## [0.1.0] — 2026-08-05

Release MVP đầu tiên (tag `v0.1.0`).

### Added

- Scaffold Vite + React + TypeScript (strict)
- State + persist `localStorage` (`matrix-led:config:v1`)
- LED Canvas engine + raster font VT323 (self-host)
- Marquee RTL liên tục và các effect: static, fade, blink, typewriter, shift-in
- Style presets, màu custom, brightness, cell shape, glow
- Playback: play / pause / speed
- Fullscreen API (desktop) + UI responsive
- Specs v1.3, Cursor toolkit, GitFlow docs
- Vitest unit/component + Playwright smoke E2E
- Gate QC cho các milestone M1–M6

### Notes

- Client-only: không backend, không auth
- Mục tiêu mô phỏng cảm giác LED, không emulate driver phần cứng cụ thể

---

[Unreleased]: https://github.com/duydev/matrix-led/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/duydev/matrix-led/releases/tag/v0.1.0
