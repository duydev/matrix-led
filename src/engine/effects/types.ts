import type { FrameBuffer } from '../framebuffer';
import type { TextBitmap } from '../font/textBitmap';
import type { DisplayConfig } from '../../state/types';

export type EffectContext = {
  t: number;
  deltaMs: number;
  config: DisplayConfig;
  textBitmap: TextBitmap;
  buffer: FrameBuffer;
};

export interface Effect {
  id: string;
  label: string;
  init(ctx: Omit<EffectContext, 'deltaMs'>): void;
  update(ctx: EffectContext): FrameBuffer;
  dispose?(): void;
}

export type EffectFactory = () => Effect;
