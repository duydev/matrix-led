import { clearFrameBuffer, type FrameBuffer } from '../framebuffer';
import { paintCentered } from './compose';
import type { Effect, EffectContext, EffectFactory } from './types';

/** Cycle ms at speed=1 */
const BASE_CYCLE_MS = 3000;

export function fadeMultiplier(t: number, speed: number): number {
  const cycle = Math.max(200, BASE_CYCLE_MS / Math.max(0.25, speed));
  const p = (t % cycle) / cycle;
  if (p < 0.25) return p / 0.25;
  if (p < 0.6) return 1;
  if (p < 0.9) return 1 - (p - 0.6) / 0.3;
  return 0;
}

export function createFadeEffect(): Effect {
  return {
    id: 'fade_in_out',
    label: 'Fade in / Fade out',
    init() {},
    update(ctx: EffectContext): FrameBuffer {
      const { buffer, textBitmap, config, t } = ctx;
      const m = fadeMultiplier(t, config.speed);
      if (m <= 0.001) {
        clearFrameBuffer(buffer);
        return buffer;
      }
      paintCentered(buffer, textBitmap, m, buffer.cols);
      return buffer;
    },
  };
}

export const fadeFactory: EffectFactory = createFadeEffect;
