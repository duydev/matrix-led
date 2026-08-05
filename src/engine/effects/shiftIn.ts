import { clearFrameBuffer, type FrameBuffer } from '../framebuffer';
import { paintBitmapAt } from './compose';
import type { Effect, EffectContext, EffectFactory } from './types';

const BASE_CYCLE_MS = 3600;

function phaseTimes(speed: number) {
  const cycle = Math.max(800, BASE_CYCLE_MS / Math.max(0.25, speed));
  return {
    cycle,
    inEnd: cycle * 0.35,
    holdEnd: cycle * 0.65,
    outEnd: cycle * 0.9,
  };
}

export function createShiftInEffect(): Effect {
  return {
    id: 'shift_in',
    label: 'Trượt vào',
    init() {},
    update(ctx: EffectContext): FrameBuffer {
      const { buffer, textBitmap, config, t } = ctx;
      clearFrameBuffer(buffer);
      if (textBitmap.width === 0) return buffer;

      const { cycle, inEnd, holdEnd, outEnd } = phaseTimes(config.speed);
      const p = t % cycle;
      const centerX = Math.floor((buffer.cols - textBitmap.width) / 2);
      const centerY = Math.floor((buffer.rows - textBitmap.height) / 2);
      const dir = config.direction;

      let ox = centerX;
      let oy = centerY;

      if (dir === 'rtl' || dir === 'ltr') {
        const startX = dir === 'rtl' ? buffer.cols : -textBitmap.width;
        const endX = centerX;
        const exitX = dir === 'rtl' ? -textBitmap.width : buffer.cols;
        if (p < inEnd) {
          const u = p / inEnd;
          ox = Math.round(startX + (endX - startX) * u);
        } else if (p < holdEnd) {
          ox = endX;
        } else if (p < outEnd) {
          const u = (p - holdEnd) / (outEnd - holdEnd);
          ox = Math.round(endX + (exitX - endX) * u);
        } else {
          return buffer;
        }
      } else {
        const startY = dir === 'ttb' ? -textBitmap.height : buffer.rows;
        const endY = centerY;
        const exitY = dir === 'ttb' ? buffer.rows : -textBitmap.height;
        if (p < inEnd) {
          const u = p / inEnd;
          oy = Math.round(startY + (endY - startY) * u);
        } else if (p < holdEnd) {
          oy = endY;
        } else if (p < outEnd) {
          const u = (p - holdEnd) / (outEnd - holdEnd);
          oy = Math.round(endY + (exitY - endY) * u);
        } else {
          return buffer;
        }
      }

      paintBitmapAt(buffer, textBitmap, ox, oy, 1);
      return buffer;
    },
  };
}

export const shiftInFactory: EffectFactory = createShiftInEffect;
