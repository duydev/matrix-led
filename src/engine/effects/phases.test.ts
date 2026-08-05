import { describe, expect, it } from 'vitest';
import { createFrameBuffer } from '../framebuffer';
import { createShiftInEffect } from './shiftIn';
import { createFadeEffect } from './fade';
import { createBlinkEffect } from './blink';
import { createTypewriterEffect } from './typewriter';
import { listRegisteredEffects, createEffect } from './registry';
import { DEFAULT_CONFIG } from '../../state/defaults';
import type { TextBitmap } from '../font/textBitmap';
import type { Direction } from '../../state/types';

const bitmap: TextBitmap = {
  width: 3,
  height: 2,
  dots: new Uint8Array([1, 1, 1, 1, 1, 1]),
};

describe('effect phase branches', () => {
  it('covers shift_in directions and phases', () => {
    const fx = createShiftInEffect();
    const buffer = createFrameBuffer(16, 8);
    const dirs: Direction[] = ['rtl', 'ltr', 'ttb', 'btt'];
    for (const direction of dirs) {
      for (const t of [0, 400, 1400, 2500, 3400]) {
        fx.update({
          t,
          deltaMs: 16,
          config: { ...DEFAULT_CONFIG, direction, speed: 1 },
          textBitmap: bitmap,
          buffer,
        });
      }
    }
    fx.update({
      t: 0,
      deltaMs: 16,
      config: DEFAULT_CONFIG,
      textBitmap: { width: 0, height: 0, dots: new Uint8Array() },
      buffer,
    });
    expect(buffer.cols).toBe(16);
  });

  it('covers fade off and blink off', () => {
    const fade = createFadeEffect();
    const blink = createBlinkEffect();
    const buffer = createFrameBuffer(8, 4);
    fade.update({
      t: 2900,
      deltaMs: 16,
      config: { ...DEFAULT_CONFIG, speed: 1 },
      textBitmap: bitmap,
      buffer,
    });
    blink.update({
      t: 600,
      deltaMs: 16,
      config: { ...DEFAULT_CONFIG, speed: 1 },
      textBitmap: bitmap,
      buffer,
    });
    expect(Math.max(...buffer.cells)).toBe(0);
  });

  it('typewriter progresses', () => {
    const fx = createTypewriterEffect();
    const buffer = createFrameBuffer(8, 4);
    fx.init({
      t: 0,
      config: DEFAULT_CONFIG,
      textBitmap: bitmap,
      buffer,
    });
    fx.update({
      t: 5000,
      deltaMs: 16,
      config: DEFAULT_CONFIG,
      textBitmap: bitmap,
      buffer,
    });
    expect(listRegisteredEffects().length).toBe(6);
    expect(createEffect('marquee').id).toBe('marquee');
  });
});
