import { describe, expect, it } from 'vitest';
import { createFrameBuffer } from '../framebuffer';
import type { TextBitmap } from '../font/textBitmap';
import { DEFAULT_CONFIG } from '../../state/defaults';
import { createStaticEffect } from './static';
import { fadeMultiplier, createFadeEffect } from './fade';
import { blinkIsOn, createBlinkEffect } from './blink';
import { typewriterVisibleColumns } from './typewriter';

function box(w: number, h: number): TextBitmap {
  return { width: w, height: h, dots: new Uint8Array(w * h).fill(1) };
}

describe('static effect', () => {
  it('paints centered without scrolling', () => {
    const effect = createStaticEffect();
    const buffer = createFrameBuffer(10, 4);
    const textBitmap = box(4, 2);
    effect.update({
      t: 0,
      deltaMs: 16,
      config: DEFAULT_CONFIG,
      textBitmap,
      buffer,
    });
    const a = Float32Array.from(buffer.cells);
    effect.update({
      t: 2000,
      deltaMs: 16,
      config: DEFAULT_CONFIG,
      textBitmap,
      buffer,
    });
    expect(Array.from(buffer.cells)).toEqual(Array.from(a));
    expect(a.some((v) => v > 0)).toBe(true);
  });
});

describe('fadeMultiplier', () => {
  it('fades in then out within a cycle', () => {
    expect(fadeMultiplier(0, 1)).toBeCloseTo(0, 1);
    expect(fadeMultiplier(750, 1)).toBeGreaterThan(0.9);
    expect(fadeMultiplier(2700, 1)).toBeLessThan(0.5);
    expect(fadeMultiplier(2900, 1)).toBe(0);
  });
});

describe('fade effect', () => {
  it('reduces intensity in fade-out vs hold', () => {
    const effect = createFadeEffect();
    const buffer = createFrameBuffer(8, 4);
    const textBitmap = box(4, 2);
    const hold = effect.update({
      t: 1000,
      deltaMs: 16,
      config: DEFAULT_CONFIG,
      textBitmap,
      buffer,
    });
    const holdMax = Math.max(...hold.cells);
    const fade = effect.update({
      t: 2400,
      deltaMs: 16,
      config: DEFAULT_CONFIG,
      textBitmap,
      buffer,
    });
    const fadeMax = Math.max(...fade.cells);
    expect(holdMax).toBeGreaterThan(fadeMax);
  });
});

describe('blinkIsOn', () => {
  it('toggles on/off windows', () => {
    expect(blinkIsOn(0, 1)).toBe(true);
    expect(blinkIsOn(600, 1)).toBe(false);
  });
});

describe('blink effect', () => {
  it('clears buffer when off', () => {
    const effect = createBlinkEffect();
    const buffer = createFrameBuffer(8, 4);
    const textBitmap = box(3, 2);
    effect.update({
      t: 600,
      deltaMs: 16,
      config: DEFAULT_CONFIG,
      textBitmap,
      buffer,
    });
    expect(Math.max(...buffer.cells)).toBe(0);
  });
});

describe('typewriterVisibleColumns', () => {
  it('increases then clears', () => {
    expect(typewriterVisibleColumns(0, 1, 10)).toBeGreaterThan(0);
    const mid = typewriterVisibleColumns(200, 1, 10);
    const later = typewriterVisibleColumns(800, 1, 10);
    expect(later).toBeGreaterThanOrEqual(mid);
  });
});
