import { describe, expect, it } from 'vitest';
import { downsampleAlphaGrid, DEFAULT_ALPHA_THRESHOLD } from './rasterizeText';

/** Build high-res ImageData with two vertical stems separated by a gap (like "M"). */
function makeStemImage(
  hiW: number,
  hiH: number,
  stemXs: number[],
): ImageData {
  const data = new Uint8ClampedArray(hiW * hiH * 4);
  for (let y = 0; y < hiH; y += 1) {
    for (const x of stemXs) {
      if (x < 0 || x >= hiW) continue;
      const i = (y * hiW + x) * 4;
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = 255;
    }
  }
  return { data, width: hiW, height: hiH, colorSpace: 'srgb' } as ImageData;
}

describe('downsampleAlphaGrid', () => {
  it('preserves gaps between multi-stem columns (M topology)', () => {
    const scale = 4;
    const outCols = 6;
    const outRows = 8;
    const hiW = outCols * scale;
    const hiH = outRows * scale;
    // Lit stems at LED cols 1 and 4 only (high-res x in middle of those blocks)
    const stemXs = [
      1 * scale + 1,
      1 * scale + 2,
      4 * scale + 1,
      4 * scale + 2,
    ];
    const image = makeStemImage(hiW, hiH, stemXs);
    const { dots, lit } = downsampleAlphaGrid(
      image,
      outCols,
      outRows,
      scale,
      DEFAULT_ALPHA_THRESHOLD,
    );

    expect(lit).toBeGreaterThan(0);
    // Gap columns 2–3 must stay off at mid row
    const midY = 4;
    expect(dots[2 * outRows + midY]).toBe(0);
    expect(dots[3 * outRows + midY]).toBe(0);
    // Stem columns lit
    expect(dots[1 * outRows + midY]).toBe(1);
    expect(dots[4 * outRows + midY]).toBe(1);
  });

  it('clips high-res samples outside image bounds', () => {
    const data = new Uint8ClampedArray(10 * 8 * 4);
    for (let i = 3; i < data.length; i += 4) data[i] = 255;
    const { lit } = downsampleAlphaGrid(
      { data, width: 10, height: 8 },
      3,
      2,
      4,
      128,
    );
    expect(lit).toBeGreaterThan(0);
  });
});
