# 06 — Acceptance Criteria & Definition of Done

| Field | Value |
|-------|-------|
| Doc | Acceptance Criteria |
| Version | 1.3 |
| Usage | Agent tự kiểm trước khi báo xong; human nghiệm thu |
| Test suite | Chi tiết TC/automation → `11`–`14` |

## 1. Definition of Done (MVP)

Ship MVP khi **mọi AC priority = MUST** PASS **và** test gate tối thiểu trong `12` §6:

- `npm test` PASS (Vitest — xem `14`)  
- Manual checklist / TC map `13` cho các AC MUST  
- E2E smoke PASS **hoặc** waive có duyệt (`12` §11)  

SHOULD fail **không** chặn MVP trừ khi product owner yêu cầu.

## 2. Functional AC

### Content & display

| ID | Priority | Criterion | Pass |
|----|----------|-----------|------|
| AC-01 | MUST | Nhập text → LED grid hiển thị tương ứng | ☐ |
| AC-02 | MUST | Cells + gap; không phải chữ vector anti-alias trên nền trống như sản phẩm cuối | ☐ |
| AC-03 | MUST | Marquee RTL loop vô hạn với text dài | ☐ |
| AC-04 | MUST | Tiếng Việt có dấu đọc được (default text đủ để chứng minh) | ☐ |
| AC-05 | MUST | Clear text không crash; idle an toàn | ☐ |
| AC-06 | MUST | Text > 200 bị clamp + có feedback | ☐ |
| AC-07 | MUST | `\n` không tạo hàng mới lạ — bị flatten khoảng trắng | ☐ |

### Style

| ID | Priority | Criterion | Pass |
|----|----------|-----------|------|
| AC-10 | MUST | ≥ 4 presets cứng đổi màu ngay | ☐ |
| AC-11 | MUST | Custom color đổi màu LED | ☐ |
| AC-12 | MUST | Brightness thay đổi rõ | ☐ |
| AC-13 | SHOULD | Rainbow animate hue | ☐ |

### Effects

| ID | Priority | Criterion | Pass |
|----|----------|-----------|------|
| AC-20 | MUST | `marquee` RTL mặc định đúng cảm giác bảng LED | ☐ |
| AC-21 | MUST | `static` center, không scroll | ☐ |
| AC-22 | MUST | `fade_in_out` in → hold → out → loop | ☐ |
| AC-23 | MUST | `blink` on/off | ☐ |
| AC-24 | MUST | Đổi effect đang chạy không crash; effect mới `t=0` | ☐ |
| AC-25 | MUST | `direction` LTR hoạt động với `marquee` | ☐ |
| AC-26 | SHOULD | `ttb` hoặc `btt` hoạt động với `marquee` | ☐ |
| AC-27 | SHOULD | `typewriter` hiện dần rồi loop | ☐ |
| AC-28 | SHOULD | `shift_in` vào/ra được | ☐ |

### Playback

| ID | Priority | Criterion | Pass |
|----|----------|-----------|------|
| AC-30 | MUST | Pause đóng băng; Play tiếp tục | ☐ |
| AC-31 | MUST | Speed đổi tốc độ rõ | ☐ |
| AC-32 | SHOULD | Reset về đầu chu kỳ | ☐ |

### Fullscreen & responsive

| ID | Priority | Criterion | Pass |
|----|----------|-----------|------|
| AC-40 | MUST | “Toàn màn hình” dùng Fullscreen API hoặc pseudo-fallback | ☐ |
| AC-41 | MUST | Fullscreen: matrix lớn, cells đọc được | ☐ |
| AC-42 | MUST | Esc và/hoặc nút Thoát hoạt động | ☐ |
| AC-43 | MUST | Viewport 375×667: controls dùng được, không bắt buộc scroll ngang | ☐ |
| AC-44 | MUST | Viewport 1280×800: display dominant | ☐ |
| AC-45 | SHOULD | Đổi orientation không vỡ layout | ☐ |

### Persistence & offline

| ID | Priority | Criterion | Pass |
|----|----------|-----------|------|
| AC-50 | MUST | Reload giữ text/effect/color/speed/size/direction | ☐ |
| AC-51 | MUST | Xóa localStorage → defaults an toàn | ☐ |
| AC-52 | MUST | Không request network tới CDN font (Google Fonts, fonts.gstatic, …) khi chạy. `@fontsource` / file local trong bundle hoặc `public/` là PASS | ☐ |
| AC-53 | MUST | Sau `fonts.ready`, default text tiếng Việt không toàn `?` | ☐ |

## 3. Non-functional AC

| ID | Priority | Criterion | Pass |
|----|----------|-----------|------|
| AC-60 | MUST | Cảm nhận ≥ ~30fps trên `64×16` Chrome desktop (định tính; không bắt profiler gate) | ☐ |
| AC-61 | MUST | UI labels tiếng Việt | ☐ |
| AC-62 | MUST | `npm run build` pass, TS strict | ☐ |
| AC-63 | SHOULD | Tab ẩn pause/throttle RAF | ☐ |
| AC-64 | SHOULD | React Strict Mode không leak RAF (cleanup OK) | ☐ |

## 4. FR → AC traceability (rút gọn)

| FR | AC |
|----|-----|
| FR-01..05 | AC-01, AC-04..07 |
| FR-10..17 | AC-01..03, AC-20..21 |
| FR-20..23 | AC-10..13 |
| FR-30..33 | AC-20..24 |
| FR-40..42 | AC-30..32 |
| FR-50..54 | AC-40..45 |
| FR-60..61 | AC-50..51 |
| FR-70..75 | AC-04, AC-52, AC-53 |
| NFR-01 | AC-60 |
| NFR-07, NFR-09 | AC-52 |
| NFR-10 | AC-61 |

## 5. Regression mini-suite

Chạy nhanh sau mỗi phase lớn. Map TC: `TC-S01..S03` + bước dưới (chi tiết `13`).

1. Load → default “Chào mừng quý khách” marquee đỏ. (`TC-S01`)  
2. Text dài → loop ổn. (`TC-C03`)  
3. Lần lượt MUST effects: marquee, static, fade_in_out, blink. (`TC-E01..04`)  
4. Preset → custom → brightness. (`TC-Y01..03`)  
5. Direction LTR. (`TC-E06`)  
6. Pause → fullscreen → exit → play. (`TC-P01`, `TC-F01..03`)  
7. Resize hẹp ↔ rộng. (`TC-F04..05`)  
8. Reload → config còn. (`TC-R01`)  
9. DevTools Offline → animation vẫn chạy. (`TC-R03`)  
10. Network tab: không Google Fonts CDN. (`TC-S02`)  
11. `npm test && npm run build`. (`TC-S03` + automation)  

## 6. Out-of-scope guard

| Check | Pass nếu |
|-------|----------|
| Không login | ☐ |
| Không API server bắt buộc | ☐ |
| Không phần cứng | ☐ |
| Không Google Fonts runtime | ☐ |
| Không slider zoom % (MVP) | ☐ |
| Có vietnamese subset (fontsource) hoặc woff2 VI tương đương | ☐ |

## 7. Human sign-off

| Role | Name | Date | Result |
|------|------|------|--------|
| Reviewer | | | ☐ Approve / ☐ Changes requested |
| Notes | | | |
