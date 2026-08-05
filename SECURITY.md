# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| `0.1.x` / `develop` | Có |
| Older / untagged forks | Tùy trường hợp |

Ứng dụng là **client-only** (không backend của dự án). Rủi ro phổ biến hơn nằm ở phụ thuộc npm, XSS nếu có thay đổi render HTML không an toàn, hoặc lộ dữ liệu nếu fork thêm dịch vụ.

## Báo cáo lỗ hổng

Vui lòng **không** mở GitHub Issue công khai cho lỗ hổng bảo mật.

Gửi email riêng cho maintainer:

- **Trần Nhật Duy** — [duytn.hcm@gmail.com](mailto:duytn.hcm@gmail.com)

Nên kèm:

1. Mô tả lỗ hổng và tác động
2. Bước tái hiện (PoC tối thiểu)
3. Phiên bản / commit, trình duyệt nếu liên quan
4. Đề xuất khắc phục (nếu có)

Maintainer sẽ xác nhận đã nhận trong thời gian hợp lý và phối hợp trước khi công bố công khai (responsible disclosure).
