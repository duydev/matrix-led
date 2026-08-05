import { flattenText } from './flattenText';
import { EMPTY_BITMAP, type TextBitmap } from './textBitmap';

export const DEFAULT_ALPHA_THRESHOLD = 128;

/** Offscreen supersample factor — keeps multi-stem glyphs (M/m/W) from fusing at LED resolution. */
export const RASTER_SCALE = 6;

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

function metricNumber(value: number | undefined, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? Math.abs(value) : fallback;
}

/**
 * Pool each SCALE×SCALE block into one LED bit (column-major).
 * A cell lights when enough hi-res samples clear the alpha threshold —
 * preserves thin stems and open valleys in multi-stem glyphs (M/m/W).
 */
export function downsampleAlphaGrid(
  image: { data: ArrayLike<number>; width: number; height: number },
  outCols: number,
  outRows: number,
  scale: number,
  threshold: number,
): { dots: Uint8Array; lit: number } {
  const dots = new Uint8Array(outCols * outRows);
  let lit = 0;
  const hiW = image.width;
  const hiH = image.height;
  // Require roughly one full hi-res column inside the block (~25% for SCALE=4).
  const minHits = Math.max(1, scale);

  for (let x = 0; x < outCols; x += 1) {
    for (let y = 0; y < outRows; y += 1) {
      let hits = 0;
      const x0 = x * scale;
      const y0 = y * scale;
      for (let dy = 0; dy < scale; dy += 1) {
        for (let dx = 0; dx < scale; dx += 1) {
          const sx = x0 + dx;
          const sy = y0 + dy;
          if (sx < 0 || sy < 0 || sx >= hiW || sy >= hiH) continue;
          if ((image.data[(sy * hiW + sx) * 4 + 3] ?? 0) > threshold) {
            hits += 1;
          }
        }
      }
      const bit: 0 | 1 = hits >= minHits ? 1 : 0;
      dots[x * outRows + y] = bit;
      lit += bit;
    }
  }

  return { dots, lit };
}

export async function rasterizeText(
  text: string,
  options: RasterOptions,
): Promise<TextBitmap> {
  const flat = flattenText(text).trim();
  const rows = Math.max(1, options.rows);
  const threshold = options.threshold ?? DEFAULT_ALPHA_THRESHOLD;
  const fontFamily = options.fontFamily ?? '"VT323", monospace';
  const scale = RASTER_SCALE;
  const key = `${flat}::${rows}::${threshold}::${fontFamily}::s${scale}`;

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

  const hiH = rows * scale;
  const padX = scale;

  // Probe ink extent at target high-res size, then fit font so ink fills the matrix height.
  ctx.font = `${hiH}px ${fontFamily}`;
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  const probe = ctx.measureText(flat);
  const probeAscent = metricNumber(probe.actualBoundingBoxAscent, hiH * 0.8);
  const probeDescent = metricNumber(probe.actualBoundingBoxDescent, hiH * 0.2);
  const probeInk = Math.max(1, probeAscent + probeDescent);
  const targetInk = Math.max(scale, hiH - 2);
  const fontPx = Math.max(scale, Math.floor(hiH * (targetInk / probeInk)));

  ctx.font = `${fontPx}px ${fontFamily}`;
  const metrics = ctx.measureText(flat);
  const ascent = metricNumber(metrics.actualBoundingBoxAscent, fontPx * 0.8);
  const descent = metricNumber(metrics.actualBoundingBoxDescent, fontPx * 0.2);
  const inkH = Math.max(1, ascent + descent);
  const advance = Math.max(1, Math.ceil(metrics.width));
  const hiW = Math.max(scale, advance + padX * 2);

  canvas.width = hiW;
  canvas.height = hiH;

  // Canvas resize resets state — reapply draw settings.
  ctx.clearRect(0, 0, hiW, hiH);
  ctx.fillStyle = '#fff';
  ctx.font = `${fontPx}px ${fontFamily}`;
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';

  const topPad = Math.floor((hiH - inkH) / 2);
  const baselineY = topPad + ascent;
  ctx.fillText(flat, padX, baselineY);

  const image = ctx.getImageData(0, 0, hiW, hiH);
  const outCols = Math.max(1, Math.ceil(hiW / scale));
  const { dots, lit } = downsampleAlphaGrid(
    image,
    outCols,
    rows,
    scale,
    threshold,
  );

  // If everything failed to light (missing glyphs), expose "?"
  const bitmap: TextBitmap =
    lit === 0 ? makePlaceholderGlyph(rows) : { width: outCols, height: rows, dots };

  cache = { key, bitmap };
  return bitmap;
}

export function clearRasterCache(): void {
  cache = null;
}
