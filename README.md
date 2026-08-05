# Matrix LED Simulator

Mô phỏng bảng LED matrix trên trình duyệt — soạn chữ, chọn màu / hiệu ứng / font, xem preview realtime và fullscreen demo. **Không server, không đăng nhập.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6.svg)](./tsconfig.json)

| | |
|---|---|
| **Tác giả** | Trần Nhật Duy |
| **Email** | [duytn.hcm@gmail.com](mailto:duytn.hcm@gmail.com) |
| **Repo** | [github.com/duydev/matrix-led](https://github.com/duydev/matrix-led) |
| **Giấy phép** | [MIT](./LICENSE) |

## Tính năng

- Canvas 2D pixel-grid LED (cell tròn / vuông, tùy chọn glow)
- Hiệu ứng: marquee, static, fade, blink, typewriter, shift-in
- Style preset + màu HEX tùy chỉnh + độ sáng
- Catalog font mono self-host (`@fontsource`) — mặc định Space Mono
- Kích thước matrix từ nhỏ đến lớn (tới `256×64`)
- Play / Pause / tốc độ `0.25×`–`10×`
- Lưu cấu hình trong `localStorage`
- Fullscreen demo (desktop + pseudo-fullscreen thân thiện iOS Safari)
- Dev server có thể truy cập trên LAN (`host: true`)

## Yêu cầu

- Node.js 20+ (khuyến nghị LTS)
- npm 10+

## Bắt đầu nhanh

```bash
git clone https://github.com/duydev/matrix-led.git
cd matrix-led
npm install
npm run dev
```

Mở URL mà Vite in ra (thường `http://localhost:5173`). Trên cùng mạng LAN, dùng IP máy host hiển thị trong terminal.

## Scripts

| Lệnh | Mô tả |
|------|--------|
| `npm run dev` | Dev server (Vite) |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Xem bản build |
| `npm test` | Unit / component (Vitest) |
| `npm run test:coverage` | Coverage (ngưỡng 100% trên `src/`) |
| `npm run test:e2e` | Smoke E2E (Playwright, chạy sau build) |

## Cấu trúc (rút gọn)

```
src/
  engine/     # Loop, effects, font raster
  state/      # Config, defaults, persist, fonts
  ui/         # React controls + display stage
  utils/      # Fullscreen helpers, …
docs/specs/   # SSOT sản phẩm & kỹ thuật
```

Spec chính: [`docs/specs/README.md`](./docs/specs/README.md). Data model: [`docs/specs/05-data-model.md`](./docs/specs/05-data-model.md).

## Đóng góp

Xem [CONTRIBUTING.md](./CONTRIBUTING.md) và [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

Tóm tắt: mở issue → fork / nhánh feature từ `develop` → PR vào `develop`.

## Bảo mật

Xem [SECURITY.md](./SECURITY.md).

## Changelog

Xem [CHANGELOG.md](./CHANGELOG.md).

## Giấy phép

Phát hành theo giấy phép [MIT](./LICENSE). Copyright © 2026 Trần Nhật Duy.
