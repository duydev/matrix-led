import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  clearRasterCache,
  rasterizeText,
  getAlphaBit,
} from './rasterizeText';

describe('rasterizeText', () => {
  afterEach(() => {
    clearRasterCache();
    vi.restoreAllMocks();
    Object.defineProperty(document, 'fonts', {
      configurable: true,
      value: { ready: Promise.resolve() },
    });
  });

  it('returns empty for blank text and caches', async () => {
    const a = await rasterizeText('   ', { rows: 8 });
    const b = await rasterizeText('   ', { rows: 8 });
    expect(a.width).toBe(0);
    expect(b).toBe(a);
  });

  it('rasters text with lit pixels', async () => {
    const bitmap = await rasterizeText('A', { rows: 8, threshold: 1 });
    expect(bitmap.height).toBe(8);
    expect(bitmap.width).toBeGreaterThan(0);
    expect(Math.max(...bitmap.dots)).toBe(1);
  });

  it('falls back to placeholder when context missing', async () => {
    clearRasterCache();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    const a = await rasterizeText('Hi', { rows: 8 });
    expect(a.width).toBeGreaterThan(0);
    clearRasterCache();
    const b = await rasterizeText('X', { rows: 3 });
    expect(b.height).toBe(3);
    expect(getAlphaBit(255)).toBe(1);
    expect(getAlphaBit(0)).toBe(0);
  });

  it('uses placeholder when image data has no alpha channel values', async () => {
    clearRasterCache();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
      () =>
        ({
          font: '',
          textBaseline: 'top',
          textAlign: 'left',
          fillStyle: '',
          measureText: () => ({ width: 10 }),
          clearRect: vi.fn(),
          fillText: vi.fn(),
          getImageData: () => ({
            data: new Uint8ClampedArray(0),
            width: 10,
            height: 8,
          }),
        }) as unknown as CanvasRenderingContext2D,
    );
    const bitmap = await rasterizeText('?', { rows: 8 });
    expect(bitmap.width).toBeGreaterThan(0);
  });
});
