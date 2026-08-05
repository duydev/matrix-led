# 09 — Risk Register

| Field | Value |
|-------|-------|
| Doc | Risks |
| Version | 1.3 |
| Usage | Agent/human kiểm khi estimate hoặc debug |

Scale: **Impact** / **Likelihood** = High · Medium · Low.

| ID | Risk | Impact | Likelihood | Mitigation | Residual |
|----|------|--------|------------|------------|----------|
| R-01 | Tiếng Việt render xấu / thiếu glyph | High | Low→Med | VT323 + vietnamese subset; threshold tune; AC-04/53; `10` | Font khác nếu vẫn fail |
| R-02 | Schema drift `02` vs code vs `05` | High | Medium | SSOT = `05` | Review khi thêm field |
| R-03 | CDN font phá offline | High | Low | Cấm Google CDN; cho phép `@fontsource` hoặc `public/fonts`; AC-52 | Import nhầm CSS CDN |
| R-04 | Strict Mode double-mount leak RAF | Medium | High | `02` §4 + AC-64 | Bỏ cleanup |
| R-05 | `setState` mỗi frame → jank | High | Medium | Cấm trong `07`/`10`; configRef | |
| R-06 | iOS Fullscreen API kém | Medium | High | Pseudo-fullscreen sớm | UX hơi khác |
| R-07 | Glow / 96×16 nặng máy yếu | Medium | Low | DPR clamp; reuse buffer; tắt glow | Giảm size |
| R-08 | Scope creep | Medium | High | ADR-004; non-goals | User mở scope |
| R-09 | `ttb`/`btt` hiểu ngược | Low | Medium | Bảng `04` §2.5 + comment | |
| R-10 | localStorage bị chặn | Low | Low | Degrade; app vẫn chạy | Mất persist |
| R-11 | Raster trước `fonts.ready` → font fallback / toàn `?` | High | Medium | FR-74; đợi ready rồi rebuild cache | |
| R-12 | Chỉ import `latin` fontsource → mất dấu Việt | High | Medium | Bắt buộc import `vietnamese` (FR-75); TC-C04 | |
| R-13 | E2E flake vì assert canvas pixel | Medium | High | Cấm pixel-diff gate (`11`/`14`); manual visual | |
| R-14 | Ship không chạy unit | High | Medium | DoD `06` + Phase I yêu cầu `npm test` | |

## Escalation

Nếu R-01 sau khi (1) đủ subset VI, (2) `fonts.ready`, (3) tune threshold 100–160 vẫn fail AC-04/53 → **dừng**, hỏi human chọn font OFL self-host khác. **Không** chuyển CDN Google.
