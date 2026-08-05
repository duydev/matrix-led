import { describe, expect, it } from 'vitest';
import { createFrameBuffer } from '../framebuffer';
import { createMarqueeEffect, sampleMarqueeCell } from './marquee';
import { createFadeEffect } from './fade';
import { createBlinkEffect } from './blink';
import { createStaticEffect } from './static';
import type { TextBitmap } from '../font/textBitmap';
import { DEFAULT_CONFIG } from '../../state/defaults';

const bitmap: TextBitmap = {
  width: 4,
  height: 2,
  dots: new Uint8Array([1, 1, 0, 0, 1, 1, 0, 0]),
};

describe('marquee directions', () => {
  it('samples ltr/ttb/btt and empty bitmap', () => {
    expect(sampleMarqueeCell('ltr', 2, 8, 4, bitmap, 1, 1)).toBeGreaterThanOrEqual(0);
    expect(sampleMarqueeCell('ttb', 2, 8, 4, bitmap, 1, 1)).toBeGreaterThanOrEqual(0);
    expect(sampleMarqueeCell('btt', 2, 8, 4, bitmap, 1, 1)).toBeGreaterThanOrEqual(0);
    const effect = createMarqueeEffect();
    const buffer = createFrameBuffer(8, 4);
    effect.update({
      t: 500,
      deltaMs: 16,
      config: { ...DEFAULT_CONFIG, direction: 'ltr' },
      textBitmap: bitmap,
      buffer,
    });
    effect.update({
      t: 500,
      deltaMs: 16,
      config: { ...DEFAULT_CONFIG, direction: 'ttb' },
      textBitmap: bitmap,
      buffer,
    });
    effect.update({
      t: 500,
      deltaMs: 16,
      config: { ...DEFAULT_CONFIG, direction: 'btt' },
      textBitmap: { width: 0, height: 0, dots: new Uint8Array() },
      buffer,
    });
    expect(buffer.cols).toBe(8);
  });
});

describe('fade/blink on paths', () => {
  it('paints when visible', () => {
    const fade = createFadeEffect();
    const blink = createBlinkEffect();
    const staticFx = createStaticEffect();
    const buffer = createFrameBuffer(8, 4);
    fade.update({
      t: 1000,
      deltaMs: 16,
      config: DEFAULT_CONFIG,
      textBitmap: bitmap,
      buffer,
    });
    blink.update({
      t: 0,
      deltaMs: 16,
      config: DEFAULT_CONFIG,
      textBitmap: bitmap,
      buffer,
    });
    staticFx.init({
      t: 0,
      config: DEFAULT_CONFIG,
      textBitmap: bitmap,
      buffer,
    });
    expect(Math.max(...buffer.cells)).toBeGreaterThan(0);
  });
});
