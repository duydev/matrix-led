import { clearFrameBuffer, type FrameBuffer } from '../framebuffer';
import { sampleBitmap, type TextBitmap } from '../font/textBitmap';
import type { Direction } from '../../state/types';
import type { Effect, EffectContext, EffectFactory } from './types';

/** cells/sec at speed=1 */
export const MARQUEE_BASE_SPEED = 16;

/**
 * direction (docs/specs/04):
 * rtl — content moves left (enters from right)
 * ltr — content moves right (enters from left)
 * ttb — content moves down (enters from top)
 * btt — content moves up (enters from bottom)
 */
export function sampleMarqueeCell(
  direction: Direction,
  offset: number,
  cols: number,
  rows: number,
  bitmap: TextBitmap,
  x: number,
  y: number,
): number {
  if (direction === 'rtl' || direction === 'ltr') {
    const yOff = Math.floor((rows - bitmap.height) / 2);
    const sy = y - yOff;
    const sx =
      direction === 'rtl'
        ? offset + x - cols
        : bitmap.width - 1 - (offset + (cols - 1 - x) - cols);
    return sampleBitmap(bitmap, sx, sy);
  }

  const xOff = Math.floor((cols - bitmap.width) / 2);
  const sx = x - xOff;
  const sy =
    direction === 'ttb'
      ? offset + y - rows
      : bitmap.height - 1 - (offset + (rows - 1 - y) - rows);
  return sampleBitmap(bitmap, sx, sy);
}

function paint(
  buffer: FrameBuffer,
  bitmap: TextBitmap,
  direction: Direction,
  offset: number,
): void {
  const { cols, rows, cells } = buffer;
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      cells[y * cols + x] = sampleMarqueeCell(
        direction,
        offset,
        cols,
        rows,
        bitmap,
        x,
        y,
      );
    }
  }
}

export function createMarqueeEffect(): Effect {
  return {
    id: 'marquee',
    label: 'Chạy chữ (Marquee)',
    init() {},
    update(ctx: EffectContext): FrameBuffer {
      const { buffer, textBitmap, config, t } = ctx;
      clearFrameBuffer(buffer);
      if (textBitmap.width === 0 || textBitmap.height === 0) return buffer;

      const periodBase =
        config.direction === 'ttb' || config.direction === 'btt'
          ? textBitmap.height + buffer.rows
          : textBitmap.width + buffer.cols;
      const period = Math.max(1, periodBase);
      const offset =
        Math.floor((t / 1000) * MARQUEE_BASE_SPEED * config.speed) % period;

      paint(buffer, textBitmap, config.direction, offset);
      return buffer;
    },
  };
}

export const marqueeFactory: EffectFactory = createMarqueeEffect;
