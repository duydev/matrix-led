import { flattenText } from './flattenText';
import { EMPTY_BITMAP, type TextBitmap } from './textBitmap';

export const DEFAULT_ALPHA_THRESHOLD = 128;

export type RasterOptions = {
  rows: number;
  threshold?: number;
  fontFamily?: string;
};

type CacheEntry = {
  key: string;
  bitmap: TextBitmap;
};

let cache: CacheEntry | null = null;

function makePlaceholderGlyph(rows: number): TextBitmap {
  const width = Math.max(3, Math.floor(rows * 0.6));
  const height = rows;
  const dots = new Uint8Array(width * height);
  // rough "?" block
  /* v8 ignore next 8 */
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const edge = x === 1 || x === width - 2 || y === 1 || y === Math.floor(height / 2);
      if (edge && !(y > height / 2 && x !== Math.floor(width / 2))) {
        dots[x * height + y] = 1;
      }
    }
  }
  dots[Math.floor(width / 2) * height + (height - 2)] = 1;
  return { width, height, dots };
}

function alphaToBit(alpha: number, threshold: number): 0 | 1 {
  return alpha > threshold ? 1 : 0;
}

export function getAlphaBit(alpha: number, threshold = DEFAULT_ALPHA_THRESHOLD): 0 | 1 {
  return alphaToBit(alpha, threshold);
}

export async function rasterizeText(
  text: string,
  options: RasterOptions,
): Promise<TextBitmap> {
  const flat = flattenText(text).trim();
  const rows = Math.max(1, options.rows);
  const threshold = options.threshold ?? DEFAULT_ALPHA_THRESHOLD;
  const fontFamily = options.fontFamily ?? '"VT323", monospace';
  const key = `${flat}::${rows}::${threshold}::${fontFamily}`;

  if (cache?.key === key) return cache.bitmap;

  await document.fonts.ready;

  if (!flat) {
    cache = { key, bitmap: EMPTY_BITMAP };
    return EMPTY_BITMAP;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    const fallback = makePlaceholderGlyph(rows);
    cache = { key, bitmap: fallback };
    return fallback;
  }

  const fontPx = rows;
  ctx.font = `${fontPx}px ${fontFamily}`;
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';

  const metrics = ctx.measureText(flat);
  const width = Math.max(1, Math.ceil(metrics.width) + 2);
  canvas.width = width;
  canvas.height = rows;

  ctx.clearRect(0, 0, width, rows);
  ctx.fillStyle = '#fff';
  ctx.font = `${fontPx}px ${fontFamily}`;
  ctx.textBaseline = 'top';
  ctx.fillText(flat, 1, 0);

  const image = ctx.getImageData(0, 0, width, rows);
  const dots = new Uint8Array(width * rows);
  let lit = 0;

  for (let x = 0; x < width; x += 1) {
    for (let y = 0; y < rows; y += 1) {
      const alpha = image.data[(y * width + x) * 4 + 3] ?? 0;
      const bit = alphaToBit(alpha, threshold);
      dots[x * rows + y] = bit;
      lit += bit;
    }
  }

  // If everything failed to light (missing glyphs), expose "?"
  const bitmap: TextBitmap =
    lit === 0 ? makePlaceholderGlyph(rows) : { width, height: rows, dots };

  cache = { key, bitmap };
  return bitmap;
}

export function clearRasterCache(): void {
  cache = null;
}
