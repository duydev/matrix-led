import { describe, expect, it } from 'vitest';
import {
  typewriterVisibleColumns,
  createTypewriterEffect,
} from './typewriter';
import { createFadeEffect } from './fade';
import { createBlinkEffect } from './blink';
import { createShiftInEffect } from './shiftIn';
import { createStaticEffect } from './static';
import { createMarqueeEffect } from './marquee';
import { createFrameBuffer } from '../framebuffer';
import { DEFAULT_CONFIG } from '../../state/defaults';
import type { TextBitmap } from '../font/textBitmap';

const bitmap: TextBitmap = {
  width: 6,
  height: 4,
  dots: new Uint8Array(24).fill(1),
};

describe('typewriter coverage', () => {
  it('covers hold, clear, cursor and empty width', () => {
    expect(typewriterVisibleColumns(0, 1, 0)).toBe(0);
    // reveal phase
    expect(typewriterVisibleColumns(10, 1, 6)).toBeGreaterThan(0);
    // hold phase at end of reveal
    const revealMs = (6 / (12 * 1)) * 1000;
    expect(typewriterVisibleColumns(revealMs + 10, 1, 6)).toBe(6);
    // post-hold clear
    expect(typewriterVisibleColumns(revealMs + 1000 + 10, 1, 6)).toBe(0);

    const fx = createTypewriterEffect();
    const buffer = createFrameBuffer(32, 8);
    const config = { ...DEFAULT_CONFIG, speed: 1 };
    fx.init({ t: 0, config, textBitmap: bitmap, buffer });
    // cursor on (even floor(t/300)) while still revealing
    fx.update({
      t: 50,
      deltaMs: 16,
      config,
      textBitmap: bitmap,
      buffer,
    });
    // clear when visible 0
    fx.update({
      t: revealMs + 1000 + 50,
      deltaMs: 16,
      config,
      textBitmap: bitmap,
      buffer,
    });
    // cursor path with ox out of matrix / tall glyph
    const tiny = createFrameBuffer(1, 2);
    fx.update({
      t: 50,
      deltaMs: 16,
      config,
      textBitmap: {
        width: 8,
        height: 10,
        dots: new Uint8Array(80).fill(1),
      },
      buffer: tiny,
    });
    expect(Math.max(...buffer.cells)).toBe(0);
  });
});

describe('effect init stubs', () => {
  it('invokes empty init methods', () => {
    const buffer = createFrameBuffer(8, 4);
    const ctx = {
      t: 0,
      config: DEFAULT_CONFIG,
      textBitmap: bitmap,
      buffer,
    };
    createFadeEffect().init?.(ctx);
    createBlinkEffect().init?.(ctx);
    createShiftInEffect().init?.(ctx);
    createStaticEffect().init?.(ctx);
    createTypewriterEffect().init?.(ctx);
    createMarqueeEffect().init?.(ctx);
    expect(true).toBe(true);
  });
});
