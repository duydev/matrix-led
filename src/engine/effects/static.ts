import type { FrameBuffer } from '../framebuffer';
import { paintCentered } from './compose';
import type { Effect, EffectContext, EffectFactory } from './types';

export function createStaticEffect(): Effect {
  return {
    id: 'static',
    label: 'Tĩnh',
    init() {},
    update(ctx: EffectContext): FrameBuffer {
      const { buffer, textBitmap } = ctx;
      // clip if wider than matrix (centered)
      paintCentered(buffer, textBitmap, 1, buffer.cols);
      return buffer;
    },
  };
}

export const staticFactory: EffectFactory = createStaticEffect;
