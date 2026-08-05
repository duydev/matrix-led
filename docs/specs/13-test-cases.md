# 13 — Test Cases

| Field | Value |
|-------|-------|
| Doc | Test Cases |
| Version | 1.0 |
| Oracle | `06` AC IDs |
| Usage | Manual QC + gợi ý case cho automation |

**Ký hiệu kết quả:** P Pass · F Fail · B Blocked · N/A · W Waived  

**Loại:** U Unit-automatable · E E2E-smoke · M Manual-only · B Both (U+M hoặc E+M)

---

## 1. Smoke (chạy đầu mỗi vòng QC)

| TC ID | Title | AC | Type | Steps | Expected |
|-------|-------|----|------|-------|----------|
| TC-S01 | App loads default | AC-01,04,20 | E+M | Mở `/` (preview ưu tiên) | Thấy DisplayStage + textarea có “Chào mừng quý khách”; matrix đang animate |
| TC-S02 | No Google font CDN | AC-52 | E+M | DevTools Network, reload | Không request `fonts.googleapis.com` / `fonts.gstatic.com` |
| TC-S03 | Build production | AC-62 | M | `npm run build` | Exit 0 |

---

## 2. Content & raster

| TC ID | Title | AC | Type | Preconditions | Steps | Expected |
|-------|-------|----|------|---------------|-------|----------|
| TC-C01 | Input updates display | AC-01 | M | App playing | Đổi text thành `HELLO LED` | Pattern LED đổi tương ứng (không crash) |
| TC-C02 | LED grid look | AC-02 | M | Default | Quan sát cells | Thấy lưới đèn + gap; không chỉ `fillText` mềm trên nền trống |
| TC-C03 | Long text marquee loop | AC-03 | M | | Dán câu > 80 ký tự, effect marquee | Chạy liên tục, quay vòng, không đứng hình vĩnh viễn |
| TC-C04 | Vietnamese readable | AC-04,53 | M | fonts loaded | Quan sát default / nhập `Nắng sớm` | Đọc được dấu; không toàn `?` |
| TC-C05 | Empty text safe | AC-05 | M | | Xóa hết text | Không crash; idle/placeholder an toàn |
| TC-C06 | Max length 200 | AC-06 | U+M | | Dán 250 ký tự | Giữ ≤200; có counter/warning |
| TC-C07 | Newline flattened | AC-07 | U+M | | Nhập `A\nB` | Không thành 2 hàng matrix lạ; xử lý như có khoảng trắng |

### Unit data (TC-C06/C07)

```ts
// expect flatten
'A\nB' → 'A B'  // hoặc equivalent single-space rule documented
'A\r\nB' → 'A B'
// expect clamp
'x'.repeat(250).length after clamp === 200
```

---

## 3. Style

| TC ID | Title | AC | Type | Steps | Expected |
|-------|-------|----|------|-------|----------|
| TC-Y01 | Four+ presets | AC-10 | M | Bấm lần lượt Đỏ/Hổ phách/Cyan/Lime | Màu LED đổi rõ mỗi preset |
| TC-Y02 | Custom color | AC-11 | M | Chọn custom / đổi color picker | LED theo màu mới; preset → custom |
| TC-Y03 | Brightness | AC-12 | M | Kéo min → max | Rõ tối hơn / sáng hơn |
| TC-Y04 | Rainbow | AC-13 | M | Chọn Rainbow | Hue đổi theo vị trí và/hoặc thời gian |

---

## 4. Effects

| TC ID | Title | AC | Type | Steps | Expected |
|-------|-------|----|------|-------|----------|
| TC-E01 | Marquee RTL | AC-20 | U+M | effect=marquee, direction=rtl | Chữ chạy phải→trái |
| TC-E02 | Static center | AC-21 | U+M | effect=static | Không scroll; gần giữa |
| TC-E03 | Fade cycle | AC-22 | U+M | effect=fade_in_out; chờ ≥1 chu kỳ | In → hold → out → blank → lặp |
| TC-E04 | Blink | AC-23 | U+M | effect=blink | Xen kẽ hiện/tắt |
| TC-E05 | Switch effect | AC-24 | M | Đang marquee → chọn blink | Không crash; animation bắt đầu lại sạch |
| TC-E06 | Marquee LTR | AC-25 | U+M | direction=ltr | Hướng ngược RTL |
| TC-E07 | Vertical dir | AC-26 | M | ttb hoặc btt | Scroll dọc đúng bảng `04` |
| TC-E08 | Typewriter | AC-27 | M | nếu có | Hiện dần rồi loop |
| TC-E09 | Shift in | AC-28 | M | nếu có | Vào/ra được |

### Unit fixtures gợi ý (effects)

```ts
// Pseudo — chỉnh theo API thật
const cfg = { ...DEFAULT, effectId: 'marquee', speed: 1, direction: 'rtl' };
effect.init({ t:0, config: cfg, textBitmap: fixtureBitmap });
const a = effect.update({ t: 0, deltaMs: 16, config: cfg, textBitmap });
const b = effect.update({ t: 1000, deltaMs: 16, config: cfg, textBitmap });
// expect: buffer a !== buffer b (có dịch chuyển) với bitmap đủ rộng

// fade: tại t in fade-out phase, max(intensity) < peak hold
// blink: tại off window, all cells ~0; on window có cell >0
```

---

## 5. Playback

| TC ID | Title | AC | Type | Steps | Expected |
|-------|-------|----|------|-------|----------|
| TC-P01 | Pause freezes | AC-30 | M | Pause 2s | Frame đứng; Play tiếp tục |
| TC-P02 | Speed | AC-31 | M | speed thấp rồi cao | Tốc độ đổi rõ |
| TC-P03 | Reset | AC-32 | M | nếu có Reset | Về đầu chu kỳ |

---

## 6. Fullscreen & responsive

| TC ID | Title | AC | Type | Steps | Expected |
|-------|-------|----|------|-------|----------|
| TC-F01 | Enter fullscreen/pseudo | AC-40 | M | Bấm Toàn màn hình | Native FS **hoặc** overlay full viewport |
| TC-F02 | Readable when large | AC-41 | M | Trong FS | Cells đọc được |
| TC-F03 | Exit | AC-42 | M | Esc và/hoặc nút Thoát | Về layout thường |
| TC-F04 | Mobile 375 | AC-43 | E+M | Viewport 375×667 | Controls dùng được; không bắt buộc scroll ngang |
| TC-F05 | Desktop 1280 | AC-44 | E+M | 1280×800 | Display dominant |
| TC-F06 | Orientation | AC-45 | M | Xoay mobile (nếu có) | Không vỡ layout nghiêm trọng |

---

## 7. Persistence & offline

| TC ID | Title | AC | Type | Steps | Expected |
|-------|-------|----|------|-------|----------|
| TC-R01 | Reload keeps config | AC-50 | E+M | Đổi text+effect+color+speed+size+dir → reload | Giá trị giữ |
| TC-R02 | Bad storage → defaults | AC-51 | U+M | `localStorage` clear hoặc set JSON hỏng → reload | Defaults an toàn; không trắng trang |
| TC-R03 | Offline after load | AC-52, NFR-07 | M | Load xong → DevTools Offline | Animation/controls vẫn chạy |
| TC-R04 | Font ready VI | AC-53 | M | Hard reload | Sau load, VI đọc được |

### Unit persist

```ts
validate(parse('not-json')) → DEFAULT_CONFIG fields
validate({ version:1, effectId:'nope', text:123 }) → effectId marquee, text stringified/defaulted per 05
```

---

## 8. NFR / non-functional

| TC ID | Title | AC | Type | Steps | Expected |
|-------|-------|----|------|-------|----------|
| TC-N01 | Smoothness feel | AC-60 | M | `64×16`, Chrome, 10s | Không giật nặng cảm nhận |
| TC-N02 | Labels VI | AC-61 | M | Duyệt labels | Tiếng Việt đúng `03` |
| TC-N03 | Strict build | AC-62 | M | `npm run build` | Pass |
| TC-N04 | Tab hidden | AC-63 | M | Đổi tab 5s xem CPU/raf | Pause/throttle (SHOULD) |
| TC-N05 | StrictMode cleanup | AC-64 | M | Dev Strict; mount/unmount | Không tăng tốc gấp đôi lâu dài |

---

## 9. Negative / edge

| TC ID | Title | Type | Steps | Expected |
|-------|-------|------|-------|----------|
| TC-X01 | Only spaces text | M | Input `     ` | Không crash |
| TC-X02 | Emoji / lạ | M | `✅🎸` | `?` hoặc raster được; không crash |
| TC-X03 | Rapid effect spam | M | Đổi effect liên tục 10 lần | Không crash/leak rõ |
| TC-X04 | Invalid hex typed | M | Gõ `#zz` nếu có hex input | Revert/hint theo `03` |
| TC-X05 | localStorage quota throw | U | Mock `setItem` throw | App vẫn chạy |

---

## 10. Visual rubric (manual — LED honesty)

Chấm nhanh **Pass** nếu ≥ 4/5:

| # | Observation |
|---|-------------|
| 1 | Off-cells vẫn thấy vị trí đèn (lưới tối) |
| 2 | Gap giữa cells rõ |
| 3 | On-cells màu đồng nhất theo preset (trừ rainbow) |
| 4 | Text là pattern điểm, không “blur UI font” |
| 5 | Default tiếng Việt đọc được ở khoảng cách nhìn màn hình |

Fail rubric → fail AC-02 và/hoặc AC-04 dù “có chữ”.

---

## 11. Traceability TC → AC

| AC | TCs |
|----|-----|
| AC-01 | TC-S01, TC-C01 |
| AC-02 | TC-C02 + §10 rubric |
| AC-03 | TC-C03 |
| AC-04 | TC-C04, TC-R04 |
| AC-05 | TC-C05 |
| AC-06 | TC-C06 |
| AC-07 | TC-C07 |
| AC-10..13 | TC-Y01..04 |
| AC-20..28 | TC-E01..09 |
| AC-30..32 | TC-P01..03 |
| AC-40..45 | TC-F01..06 |
| AC-50..53 | TC-R01..04, TC-S02 |
| AC-60..64 | TC-N01..05 |

---

## 12. Execution log template

| Date | Build | Env | Tester | Failed TCs | Notes |
|------|-------|-----|--------|------------|-------|
| | | preview / Chrome 1280 | | | |
