import { describe, expect, it } from 'vitest';
import { createFrameBuffer } from '../framebuffer';
import type { TextBitmap } from '../font/textBitmap';
import { DEFAULT_CONFIG } from '../../state/defaults';
import { createMarqueeEffect, sampleMarqueeCell } from './marquee';

function makeBitmap(width: number, height: number, fill = 1): TextBitmap {
  return {
    width,
    height,
    dots: new Uint8Array(width * height).fill(fill),
  };
}

describe('sampleMarqueeCell', () => {
  it('shifts RTL sample with increasing offset', () => {
    const bitmap = makeBitmap(4, 2, 0);
    // light column 0 only
    bitmap.dots[0 * 2 + 0] = 1;
    bitmap.dots[0 * 2 + 1] = 1;

    const cols = 4;
    const rows = 2;
    const a = sampleMarqueeCell('rtl', 0, cols, rows, bitmap, 3, 0);
    const b = sampleMarqueeCell('rtl', 4, cols, rows, bitmap, 0, 0);
    // at offset=cols=4, sx = 4+0-4 = 0 → lit
    expect(b).toBe(1);
    // at offset=0, sx for x=3 = 0+3-4 = -1 → off
    expect(a).toBe(0);
  });
});

describe('createMarqueeEffect', () => {
  it('changes buffer over time for wide text', () => {
    const effect = createMarqueeEffect();
    const buffer = createFrameBuffer(8, 4);
    const textBitmap = makeBitmap(20, 4, 1);
    const config = { ...DEFAULT_CONFIG, direction: 'rtl' as const, speed: 1 };

    effect.init({ t: 0, config, textBitmap, buffer });
    const a = effect.update({
      t: 0,
      deltaMs: 16,
      config,
      textBitmap,
      buffer,
    });
    const snapA = Float32Array.from(a.cells);

    const b = effect.update({
      t: 2000,
      deltaMs: 16,
      config,
      textBitmap,
      buffer,
    });

    let same = true;
    for (let i = 0; i < snapA.length; i += 1) {
      if (snapA[i] !== b.cells[i]) {
        same = false;
        break;
      }
    }
    expect(same).toBe(false);
  });
});
