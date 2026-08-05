# 12 — Test Plan

| Field | Value |
|-------|-------|
| Doc | Test Plan |
| Version | 1.0 |
| Relates to | `11`, `13`, `14`, `06` |

## 1. Objectives

| ID | Objective | Metric |
|----|-----------|--------|
| PO-1 | Xác nhận MVP đúng AC MUST | 100% AC MUST = Pass |
| PO-2 | Có lưới an toàn automation cho engine/state | `npm test` xanh trên CI/local |
| PO-3 | Smoke ngăn vỡ trang chủ / persist | E2E smoke xanh hoặc waived |
| PO-4 | Bắt regression trước khi coi phase xong | Chạy lại mini-suite sau mỗi phase lớn `07` |

## 2. Scope by feature

| Feature | Unit | E2E smoke | Manual |
|---------|:----:|:---------:|:------:|
| Text input / clamp / newline | ● | ○ | ● |
| LED renderer look | | | ● |
| Font VI / offline / no CDN | ○ | ● (network) | ● |
| Marquee / static / fade / blink | ● | ○ | ● |
| Style presets / color / brightness | ○ | ○ | ● |
| Play / pause / speed | ○ | ● | ● |
| Fullscreen | | ○* | ● |
| Responsive 375 / 1280 | | ○ | ● |
| Persistence | ● | ● | ● |
| Build / TS | | | ● (`build`) |

● = bắt buộc trong lớp đó · ○ = nên có · ○* = khó assert native FS; ưu tiên pseudo hoặc manual

## 3. Environments

| Env | Purpose |
|-----|---------|
| Local `npm run dev` | Dev + exploratory |
| Local `npm run preview` (sau build) | Gần prod; **manual sign-off ưu tiên đây** |
| CI (MAY) | `lint?` + `test` + `build` |

### Browsers / viewports (MVP)

| Target | Priority |
|--------|----------|
| Chrome desktop latest | MUST |
| Viewport 1280×800 | MUST |
| Viewport 375×667 | MUST |
| Firefox **hoặc** Edge spot-check | SHOULD |
| Safari / iOS Safari fullscreen | SHOULD (manual) |

## 4. Roles & RACI (gọn)

| Activity | Implementer / Agent | QC Human |
|----------|:-------------------:|:--------:|
| Viết unit theo `14` | R | C |
| Chạy `npm test` / fix fail | R | I |
| Manual AC checklist | C (tự chạy trước) | **A** |
| Ký `06` sign-off | I | **A** |
| Waive E2E | C | **A** |

R=Responsible A=Accountable C=Consulted I=Informed

## 5. Entry criteria

- [ ] Code nhánh/MVP build được (`npm run build`)  
- [ ] Có thể mở UI và thấy DisplayStage  
- [ ] Font strategy đã implement (A hoặc B)  
- [ ] `06` + `13` sẵn dùng  

## 6. Exit criteria (MVP release)

- [ ] `npm test` PASS  
- [ ] `npm run build` PASS  
- [ ] Mọi **AC MUST** trong `06` = Pass  
- [ ] Không Bug Blocker/Critical Open  
- [ ] E2E smoke PASS **hoặc** Waive form §10 điền đủ  
- [ ] Human ký `06` §7  

## 7. Suspension / resumption

| Suspend nếu | Resume khi |
|-------------|------------|
| Build fail liên tục | Build xanh |
| Font VI fail AC-04/53 | Theo `09` escalation xong |
| >30% unit fail sau refactor lớn | Unit < 5% fail / có plan fix |

## 8. Schedule gắn phase `07`

| Phase implement | QC activity |
|-----------------|-------------|
| B state | Unit persist/clamp |
| D font | Manual AC-04/53 ngay — **stop-the-line** nếu fail |
| E marquee | Unit offset + manual marquee |
| F effects | Unit fade/blink phase + manual AC-20..23 |
| G UI/FS | Manual responsive + fullscreen |
| I verify | Full gate §6 |

## 9. Defect severity

| Severity | Definition | Ship rule |
|----------|------------|-----------|
| **Blocker** | App không mở / crash loop / không hiện matrix | Không ship |
| **Critical** | AC MUST fail (VI chữ hỏng, không marquee, mất persist, CDN font) | Không ship |
| **Major** | Effect phụ sai, LTR sai, UI lệch nặng mobile | Không ship trừ waive PO |
| **Minor** | Copy/UI polish, glow lệch | Ship được |
| **Trivial** | nit | Ship được |

## 10. Bug report template

```markdown
### Bug ID: BUG-XXX
**Severity:** Blocker|Critical|Major|Minor|Trivial
**AC related:** ACxx / none
**Environment:** browser, viewport, `dev`|`preview`, OS
**Steps:**
1. ...
**Expected:**
**Actual:**
**Evidence:** screenshot / short note (không bắt buộc video)
**Workaround:**
```

## 11. E2E waive form (nếu cần)

| Field | Value |
|-------|-------|
| Reason | |
| Risks accepted | |
| Compensating (manual suite chạy?) | ☐ Yes |
| Approver | |
| Date | |

## 12. Deliverables trước sign-off

1. Kết quả `npm test` (log hoặc note PASS)  
2. `06` checklist đã tick  
3. Danh sách bug còn mở (nếu có) + severity  
4. Waive E2E (nếu dùng)  
