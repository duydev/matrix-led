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
          textBaseline: 'alphabetic',
          textAlign: 'left',
          fillStyle: '',
          measureText: () => ({
            width: 40,
            actualBoundingBoxAscent: 28,
            actualBoundingBoxDescent: 4,
          }),
          clearRect: vi.fn(),
          fillText: vi.fn(),
          getImageData: () => ({
            data: new Uint8ClampedArray(0),
            width: 40,
            height: 32,
          }),
        }) as unknown as CanvasRenderingContext2D,
    );
    const bitmap = await rasterizeText('?', { rows: 8 });
    expect(bitmap.width).toBeGreaterThan(0);
  });

  it('falls back when text metrics omit bounding boxes', async () => {
    clearRasterCache();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
      () =>
        ({
          font: '',
          textBaseline: 'alphabetic',
          textAlign: 'left',
          fillStyle: '',
          measureText: () => ({
            width: 20,
            actualBoundingBoxAscent: Number.NaN,
            // descent omitted → fallback branch
          }),
          clearRect: vi.fn(),
          fillText: vi.fn(),
          getImageData: (_sx: number, _sy: number, sw: number, sh: number) => {
            const data = new Uint8ClampedArray(sw * sh * 4);
            for (let i = 3; i < data.length; i += 4) data[i] = 255;
            return { data, width: sw, height: sh };
          },
        }) as unknown as CanvasRenderingContext2D,
    );
    const bitmap = await rasterizeText('M', { rows: 8 });
    expect(bitmap.height).toBe(8);
    expect(Math.max(...bitmap.dots)).toBe(1);
  });
});
