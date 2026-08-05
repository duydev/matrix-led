import { describe, expect, it } from 'vitest';
import { sampleBitmap, EMPTY_BITMAP } from './textBitmap';

describe('textBitmap', () => {
  it('samples in bounds and out of bounds', () => {
    const bitmap = {
      width: 2,
      height: 2,
      dots: new Uint8Array([1, 0, 1, 0]),
    };
    expect(sampleBitmap(bitmap, 0, 0)).toBe(1);
    expect(sampleBitmap(bitmap, -1, 0)).toBe(0);
    expect(sampleBitmap(bitmap, 0, 2)).toBe(0);
    expect(sampleBitmap(bitmap, 2, 0)).toBe(0);
    expect(EMPTY_BITMAP.width).toBe(0);
    expect(
      sampleBitmap(
        { width: 1, height: 1, dots: [] as unknown as Uint8Array },
        0,
        0,
      ),
    ).toBe(0);
  });
});
