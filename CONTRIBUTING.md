# Hướng dẫn đóng góp

Cảm ơn bạn quan tâm đến **Matrix LED Simulator**. Mọi đóng góp hợp lệ (bug report, PR, tài liệu) đều được chào đón.

## Quy tắc ứng xử

Tham gia nghĩa là bạn đồng ý với [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## Cách báo lỗi / đề xuất

1. Tìm issue tương tự trên [Issues](https://github.com/duydev/matrix-led/issues) trước khi mở mới.
2. Mô tả rõ: bước tái hiện, trình duyệt / OS, kỳ vọng vs thực tế.
3. Với đề xuất tính năng: mô tả use-case và (nếu có) liên hệ với scope trong `docs/specs/00-product-overview.md` (in-scope vs non-goals).

## Môi trường phát triển

```bash
git clone https://github.com/duydev/matrix-led.git
cd matrix-led
npm install
npm run dev
```

Trước khi gửi PR, chạy tối thiểu:

```bash
npm test
npm run build
```

Khi chạm engine / coverage, thêm:

```bash
npm run test:coverage
```

E2E (cần browser Playwright đã cài):

```bash
npm run test:e2e
```

## Nhánh & PR

| Nhánh | Vai trò |
|-------|---------|
| `main` | Bản ổn định / release |
| `develop` | Tích hợp đang phát triển — **mặc định mở PR vào đây** |

Luồng gợi ý (GitFlow rút gọn):

1. Fork (hoặc nhánh từ `develop` nếu có quyền).
2. Tạo nhánh: `feature/<tên-ngắn>` hoặc `fix/<tên-ngắn>`.
3. Commit gọn, thông điệp rõ (ví dụ Conventional Commits: `feat:`, `fix:`, `docs:`, `test:`).
4. Mở Pull Request → `develop`.
5. Mô tả thay đổi, AC liên quan (nếu có), cách test thủ công.

Chi tiết nội bộ: [`docs/workflows/gitflow-feature.md`](./docs/workflows/gitflow-feature.md).

## Quy ước kỹ thuật

- **SSOT:** thay đổi hành vi sản phẩm phải cập nhật `docs/specs/` liên quan (đặc biệt `05-data-model.md`).
- **Font runtime:** không thêm Google Fonts / CDN; dùng `@fontsource` hoặc file trong `public/fonts`.
- **Client-only:** không thêm backend / auth cho MVP trừ khi issue đã thống nhất mở scope.
- **UI tiếng Việt** cho chuỗi user-facing; giữ nhất quán với app hiện tại.
- Style code: khớp file xung quanh — TypeScript strict, tránh refactor lan rộng ngoài phạm vi PR.

## Gợi ý phạm vi PR tốt

- Một mục đích rõ (một hiệu ứng, một bug, một mục docs).
- Có test khi đụng logic engine / state / persist.
- Không commit `node_modules`, `dist`, `coverage`, secrets, `.env`.

## Liên hệ maintainer

| | |
|---|---|
| **Tác giả / Maintainer** | Trần Nhật Duy |
| **Email** | [duytn.hcm@gmail.com](mailto:duytn.hcm@gmail.com) |
| **GitHub** | [@duydev](https://github.com/duydev) |

Câu hỏi bảo mật: xem [SECURITY.md](./SECURITY.md) — **không** mở issue công khai cho lỗ hổng nhạy cảm.
