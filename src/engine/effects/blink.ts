import { clearFrameBuffer, type FrameBuffer } from '../framebuffer';
import { paintCentered } from './compose';
import type { Effect, EffectContext, EffectFactory } from './types';

export function blinkIsOn(t: number, speed: number): boolean {
  const onMs = Math.max(50, 500 / Math.max(0.25, speed));
  const offMs = Math.max(50, 300 / Math.max(0.25, speed));
  const cycle = onMs + offMs;
  return t % cycle < onMs;
}

export function createBlinkEffect(): Effect {
  return {
    id: 'blink',
    label: 'Nhấp nháy',
    init() {},
    update(ctx: EffectContext): FrameBuffer {
      const { buffer, textBitmap, config, t } = ctx;
      if (!blinkIsOn(t, config.speed)) {
        clearFrameBuffer(buffer);
        return buffer;
      }
      paintCentered(buffer, textBitmap, 1, buffer.cols);
      return buffer;
    },
  };
}

export const blinkFactory: EffectFactory = createBlinkEffect;
