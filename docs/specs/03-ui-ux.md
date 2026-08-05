# 03 — UI / UX Specification

| Field | Value |
|-------|-------|
| Doc | UI/UX |
| Version | 1.2 |

## 1. Composition principle

Một composition giả lập thiết bị LED — **không** dashboard.

**First viewport (desktop):**

1. Brand: “Matrix LED”  
2. **Display stage** (dominant)  
3. Controls dưới / cạnh — không át matrix  

**MUST NOT:** stats, marketing cards, badge nổi trên matrix.

## 2. Visual direction

| Token | Guidance |
|-------|----------|
| Atmosphere | Nền near-black; panel than chì; cảm giác phòng demo LED |
| Accent | Theo màu LED active hiện tại (dynamic) — tránh purple AI-default |
| Typography (UI) | Font UI rõ; brand có thể dùng pixel font self-host |
| Matrix | Cell circle default; gap rõ; bezel tối SHOULD |
| Motion | Matrix = motion chính; UI transition 150–250ms |

## 3. Layout breakpoints

| Breakpoint | Layout |
|------------|--------|
| `< 768px` | Stack: Display → Playback → Text → Effect/Style |
| `≥ 768px` | Display full width trên; controls 2 cột dưới |
| `≥ 1200px` | Display max-width giữa; controls 3 nhóm |

- Page padding 12–24px; control gap 12–16px  
- Aspect display theo `cols:rows`

## 4. Regions

### 4.1 Header

- Title: Matrix LED  
- Subtitle optional: “Giả lập bảng chạy chữ”  
- Action: Toàn màn hình  

### 4.2 DisplayStage (hero)

- Canvas + bezel SHOULD  
- Pause overlay icon mờ  
- Idle: placeholder bitmap hoặc cells tối  

### 4.3 PlaybackControls

- Chạy / Tạm dừng  
- Tốc độ  
- Đặt lại (SHOULD)  
- Toàn màn hình  

### 4.4 TextInput

- Textarea  
- Placeholder VI  
- Counter `n/200`  

### 4.5 EffectSelect

- Select các effect đã register (MUST trước, SHOULD nếu có)  
- Label VI từ `04`  

### 4.6 StyleControls

- Preset: Đỏ / Hổ phách / Cyan / Lime / Rainbow / Custom  
- Color picker + hex (enable rõ khi Custom hoặc luôn cho phép sửa → Custom)  
- Độ sáng  
- Hướng (`rtl/ltr/ttb/btt`)  
- Kích thước matrix  
- Glow toggle  

## 5. Fullscreen (“Zoom toàn màn hình”)

| State | Behavior |
|-------|----------|
| Enter | DisplayStage fullscreen hoặc pseudo-fullscreen; nền đen; matrix contain |
| During | Nút Thoát góc (auto-hide 2s SHOULD); Esc thoát native fullscreen |
| Exit | Layout thường; giữ `t` / vị trí animation |

Không có slider zoom % trong MVP (xem `00` §9, N-07).

## 6. Interaction feedback

| Action | Feedback |
|--------|----------|
| Đổi màu / brightness | Frame kế |
| Đổi effect | Hard cut + `t = 0` (crossfade MAY) |
| Hex invalid | Revert + hint |
| Fullscreen denied | Toast + fallback expand |
| Text > 200 | Clamp + counter đỏ |

## 7. Accessibility

- Mọi control có label / `aria-label`  
- Slider `aria-valuetext`  
- Focus ring rõ trên nền tối  
- Play/Pause: icon + text, không chỉ màu  

## 8. Touch targets

| Control | Mobile min |
|---------|------------|
| Buttons | 44×44px |
| Sliders | full width nhóm |
| Color input | ≥ 44px |
| Select | full width |

## 9. Copy (VI)

| Key | Copy |
|-----|------|
| appTitle | Matrix LED |
| textLabel | Nội dung |
| effectLabel | Hiệu ứng |
| styleLabel | Style |
| colorLabel | Màu tùy chỉnh |
| brightnessLabel | Độ sáng |
| speedLabel | Tốc độ |
| directionLabel | Hướng |
| sizeLabel | Kích thước matrix |
| play | Chạy |
| pause | Tạm dừng |
| reset | Đặt lại |
| fullscreen | Toàn màn hình |
| exitFullscreen | Thoát toàn màn hình |
| glow | Ánh sáng LED |
| charCounter | `{n}/200` |

## 10. Wireframe

```text
┌─────────────────────────────────────────────┐
│ Matrix LED                    [Toàn màn hình]│
├─────────────────────────────────────────────┤
│  ┌───────────────────────────────────────┐  │
│  │ ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● │  │
│  │ ● ●   CHÀO MỪNG QUÝ KHÁCH   ● ● ● ● │  │
│  │ ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● │  │
│  └───────────────────────────────────────┘  │
├─────────────────────────────────────────────┤
│ [▶ Chạy]  Tốc độ ———●——  [Đặt lại]          │
├─────────────────────────────────────────────┤
│ Nội dung                         24/200     │
│ ┌─────────────────────────────────────────┐ │
│ │ Chào mừng quý khách...                  │ │
│ └─────────────────────────────────────────┘ │
│ Hiệu ứng: [Chạy chữ (Marquee) ▼]            │
│ Style: [Đỏ][Hổ phách][Cyan][Lime][Rainbow]  │
│ Màu · Độ sáng · Hướng · Kích thước · Glow   │
└─────────────────────────────────────────────┘
```
