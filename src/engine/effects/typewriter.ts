import { clearFrameBuffer, type FrameBuffer } from '../framebuffer';
import { paintCentered } from './compose';
import type { Effect, EffectContext, EffectFactory } from './types';

const COLS_PER_SEC = 12;
const HOLD_MS = 1000;

export function typewriterVisibleColumns(
  t: number,
  speed: number,
  totalWidth: number,
): number {
  if (totalWidth <= 0) return 0;
  const revealMs = (totalWidth / (COLS_PER_SEC * Math.max(0.25, speed))) * 1000;
  const cycle = revealMs + HOLD_MS + 400;
  const p = t % cycle;
  if (p < revealMs) {
    return Math.min(totalWidth, Math.floor((p / revealMs) * totalWidth) + 1);
  }
  if (p < revealMs + HOLD_MS) return totalWidth;
  return 0;
}

export function createTypewriterEffect(): Effect {
  return {
    id: 'typewriter',
    label: 'Gõ từng chữ',
    init() {},
    update(ctx: EffectContext): FrameBuffer {
      const { buffer, textBitmap, config, t } = ctx;
      const visible = typewriterVisibleColumns(
        t,
        config.speed,
        textBitmap.width,
      );
      if (visible <= 0) {
        clearFrameBuffer(buffer);
        return buffer;
      }
      paintCentered(buffer, textBitmap, 1, visible);
      // cursor blink at end
      if (Math.floor(t / 300) % 2 === 0 && visible < textBitmap.width) {
        const width = visible;
        const ox = Math.floor((buffer.cols - width) / 2) + width;
        const oy = Math.floor((buffer.rows - textBitmap.height) / 2);
        if (ox >= 0 && ox < buffer.cols) {
          for (let y = 0; y < Math.min(textBitmap.height, buffer.rows); y += 1) {
            const dy = oy + y;
            if (dy >= 0 && dy < buffer.rows) buffer.cells[dy * buffer.cols + ox] = 1;
          }
        }
      }
      return buffer;
    },
  };
}

export const typewriterFactory: EffectFactory = createTypewriterEffect;
