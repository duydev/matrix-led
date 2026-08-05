import type { DisplayConfig } from '../state/types';
import { MATRIX_SIZES } from '../state/types';
import { createEffect } from './effects/registry';
import type { Effect } from './effects/types';
import {
  createFrameBuffer,
  resizeFrameBuffer,
  type FrameBuffer,
} from './framebuffer';
import { EMPTY_BITMAP, type TextBitmap } from './font/textBitmap';
import { rasterizeText, DEFAULT_ALPHA_THRESHOLD } from './font/rasterizeText';
import { drawFrame } from './renderer';
import { resolveFontFamily } from '../state/fonts';

export type EngineHandles = {
  configRef: { current: DisplayConfig };
  canvas: HTMLCanvasElement;
};

export class DisplayEngine {
  private buffer: FrameBuffer;
  private effect: Effect;
  private textBitmap: TextBitmap = EMPTY_BITMAP;
  private effectStartedAt = 0;
  private frozenT = 0;
  private lastNow = 0;
  private playing = true;
  private rasterGen = 0;
  private disposed = false;
  private syncKey = '';
  private readonly canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.buffer = createFrameBuffer(64, 16);
    this.effect = createEffect('marquee');
  }

  dispose(): void {
    this.disposed = true;
    this.effect.dispose?.();
  }

  async syncConfig(config: DisplayConfig, forceEffectReset = false): Promise<void> {
    const size = MATRIX_SIZES[config.matrixSizeId];
    this.buffer = resizeFrameBuffer(this.buffer, size.cols, size.rows);

    const nextKey = [
      config.text,
      config.effectId,
      config.matrixSizeId,
      config.direction,
      config.fontId,
    ].join('|');
    const keyChanged = nextKey !== this.syncKey;
    const effectChanged = this.effect.id !== config.effectId || forceEffectReset;

    if (effectChanged) {
      this.effect.dispose?.();
      this.effect = createEffect(config.effectId);
    }

    const gen = ++this.rasterGen;
    const bitmap = await rasterizeText(config.text, {
      rows: size.rows,
      threshold: DEFAULT_ALPHA_THRESHOLD,
      fontFamily: resolveFontFamily(config.fontId),
    });
    if (this.disposed || gen !== this.rasterGen) return;

    this.textBitmap = bitmap;
    this.syncKey = nextKey;

    if (effectChanged || keyChanged || forceEffectReset) {
      this.effectStartedAt = this.lastNow || performance.now();
      this.frozenT = 0;
      this.effect.init({
        t: 0,
        config,
        textBitmap: this.textBitmap,
        buffer: this.buffer,
      });
    }

    this.playing = config.playing;
  }

  async reset(config: DisplayConfig): Promise<void> {
    await this.syncConfig(config, true);
  }

  frame(now: number, config: DisplayConfig): void {
    this.lastNow = now;
    const size = MATRIX_SIZES[config.matrixSizeId];
    this.buffer = resizeFrameBuffer(this.buffer, size.cols, size.rows);

    if (!config.playing) {
      // keep frozenT
    } else if (!this.playing) {
      // resumed — shift start so t continues from frozenT
      this.effectStartedAt = now - this.frozenT;
    }

    this.playing = config.playing;

    const t = config.playing
      ? Math.max(0, now - this.effectStartedAt)
      : this.frozenT;
    if (config.playing) this.frozenT = t;

    const buffer = this.effect.update({
      t,
      deltaMs: 16,
      config,
      textBitmap: this.textBitmap,
      buffer: this.buffer,
    });
    this.buffer = buffer;

    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssWidth = this.canvas.clientWidth || 1;
    const cssHeight = this.canvas.clientHeight || 1;
    const pw = Math.floor(cssWidth * dpr);
    const ph = Math.floor(cssHeight * dpr);
    if (this.canvas.width !== pw || this.canvas.height !== ph) {
      this.canvas.width = pw;
      this.canvas.height = ph;
    }

    drawFrame(ctx, this.buffer, cssWidth, cssHeight, dpr, {
      cellShape: config.cellShape,
      glow: config.glow,
      backgroundColor: config.backgroundColor,
      config,
      t,
    });
  }
}
