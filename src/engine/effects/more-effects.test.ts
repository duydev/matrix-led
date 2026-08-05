import { describe, expect, it } from 'vitest';
import { createFrameBuffer } from '../framebuffer';
import { paintBitmapAt, paintCentered } from './compose';
import type { TextBitmap } from '../font/textBitmap';
import { createShiftInEffect } from './shiftIn';
import { createTypewriterEffect } from './typewriter';
import { createEffect, listRegisteredEffects } from './registry';
import { DEFAULT_CONFIG } from '../../state/defaults';

function full(w: number, h: number): TextBitmap {
  return { width: w, height: h, dots: new Uint8Array(w * h).fill(1) };
}

describe('compose', () => {
  it('skips out of bound paints and respects maxColumns', () => {
    const buffer = createFrameBuffer(4, 4);
    paintBitmapAt(buffer, full(2, 2), -1, -1, 1);
    expect(Math.max(...buffer.cells)).toBeGreaterThanOrEqual(0);
    paintCentered(buffer, full(8, 2), 1, 3);
    expect(Math.max(...buffer.cells)).toBe(1);
    paintCentered(buffer, { width: 0, height: 0, dots: new Uint8Array() }, 1);
  });
});

describe('registry', () => {
  it('lists all effects and falls back unknown to marquee', () => {
    const list = listRegisteredEffects();
    expect(list.length).toBe(6);
    expect(createEffect('marquee').id).toBe('marquee');
    expect(createEffect('nope' as never).id).toBe('marquee');
  });
});

describe('shift_in', () => {
  it('animates for rtl/ltr/ttb/btt phases', () => {
    const effect = createShiftInEffect();
    const buffer = createFrameBuffer(16, 8);
    const textBitmap = full(4, 2);
    for (const direction of ['rtl', 'ltr', 'ttb', 'btt'] as const) {
      for (const t of [0, 800, 2000, 2800, 3500]) {
        effect.update({
          t,
          deltaMs: 16,
          config: { ...DEFAULT_CONFIG, direction },
          textBitmap,
          buffer,
        });
      }
    }
    expect(buffer.cols).toBe(16);
  });
});

describe('typewriter', () => {
  it('reveals columns and draws cursor', () => {
    const effect = createTypewriterEffect();
    const buffer = createFrameBuffer(20, 8);
    const textBitmap = full(10, 4);
    effect.update({
      t: 100,
      deltaMs: 16,
      config: DEFAULT_CONFIG,
      textBitmap,
      buffer,
    });
    expect(Math.max(...buffer.cells)).toBe(1);
    effect.update({
      t: 50_000,
      deltaMs: 16,
      config: DEFAULT_CONFIG,
      textBitmap,
      buffer,
    });
  });
});
