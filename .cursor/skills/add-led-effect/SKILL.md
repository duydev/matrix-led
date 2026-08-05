---
name: add-led-effect
description: >-
  Adds a Matrix LED effect per docs/specs/04-effects-engine.md (registry, VI
  label, unit tests, AC/TC updates). Use when adding marquee variants,
  typewriter, shift_in, fade, blink, or any new effectId.
---

# Add LED effect

## Steps

1. Confirm effect is MUST/SHOULD/MAY in `04`. Do not add MAY unless user asks.
2. Implement `src/engine/effects/<name>.ts` exporting factory matching `Effect` interface.
3. Register in `registry.ts`; add VI `label`.
4. Intensity-only buffer writes; no DOM; no color logic (rainbow stays in colorize).
5. Add Vitest fixtures (`14`) for deterministic `t` behavior.
6. Wire `EffectSelect` if UI list is static.
7. If new `effectId`: update `05` union, `06` AC row if needed, `13` TC, persist validate allowlist.
8. Manual: switch to effect while playing — no crash; `t` resets (`04` switching rules).

## Done

- [ ] Registered + selectable
- [ ] Unit green
- [ ] AC/TC updated if new public behavior
- [ ] No schema drift vs `05`
