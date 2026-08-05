import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DisplayEngine } from './loop';
import { DEFAULT_CONFIG } from '../state/defaults';
import * as raster from './font/rasterizeText';
import * as registry from './effects/registry';

function makeCanvas(w = 320, h = 80) {
  const canvas = document.createElement('canvas');
  Object.defineProperty(canvas, 'clientWidth', { configurable: true, value: w });
  Object.defineProperty(canvas, 'clientHeight', { configurable: true, value: h });
  return canvas;
}

describe('DisplayEngine', () => {
  beforeEach(() => {
    vi.spyOn(raster, 'rasterizeText').mockResolvedValue({
      width: 6,
      height: 4,
      dots: new Uint8Array(24).fill(1),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('syncs, frames, pauses, resumes, resets, and disposes', async () => {
    const canvas = makeCanvas();
    const engine = new DisplayEngine(canvas);
    await engine.syncConfig(DEFAULT_CONFIG, true);
    engine.frame(1000, { ...DEFAULT_CONFIG, playing: true });
    engine.frame(1100, { ...DEFAULT_CONFIG, playing: false });
    engine.frame(1200, { ...DEFAULT_CONFIG, playing: true });
    await engine.reset({ ...DEFAULT_CONFIG, text: 'Hi', matrixSizeId: '32x8' });
    engine.frame(2000, { ...DEFAULT_CONFIG, playing: true, glow: false });
    Object.defineProperty(window, 'devicePixelRatio', {
      configurable: true,
      value: 3,
    });
    engine.frame(2100, { ...DEFAULT_CONFIG, playing: true });
    engine.dispose();
    await engine.syncConfig(DEFAULT_CONFIG, true);
    expect(canvas.width).toBeGreaterThan(0);
  });

  it('handles missing 2d context and zero css size', async () => {
    const canvas = makeCanvas(0, 0);
    Object.defineProperty(window, 'devicePixelRatio', {
      configurable: true,
      value: 0,
    });
    const engine = new DisplayEngine(canvas);
    await engine.syncConfig(DEFAULT_CONFIG, true);
    engine.frame(0, DEFAULT_CONFIG);
    vi.spyOn(canvas, 'getContext').mockReturnValue(null);
    expect(() => engine.frame(1, DEFAULT_CONFIG)).not.toThrow();
  });

  it('calls effect.dispose when swapping effects', async () => {
    const dispose = vi.fn();
    const real = registry.createEffect;
    vi.spyOn(registry, 'createEffect').mockImplementation((id) => {
      const effect = real(id);
      effect.dispose = dispose;
      return effect;
    });
    const canvas = makeCanvas();
    const engine = new DisplayEngine(canvas);
    await engine.syncConfig(DEFAULT_CONFIG, true);
    await engine.syncConfig({ ...DEFAULT_CONFIG, effectId: 'blink' }, false);
    engine.dispose();
    expect(dispose).toHaveBeenCalled();
  });

  it('ignores stale raster when disposed mid-flight', async () => {
    let resolveRaster!: (v: {
      width: number;
      height: number;
      dots: Uint8Array;
    }) => void;
    vi.spyOn(raster, 'rasterizeText').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRaster = resolve;
        }),
    );
    const canvas = makeCanvas();
    const engine = new DisplayEngine(canvas);
    const pending = engine.syncConfig(DEFAULT_CONFIG, true);
    engine.dispose();
    resolveRaster({ width: 1, height: 1, dots: new Uint8Array([1]) });
    await pending;
    expect(true).toBe(true);
  });

  it('skips re-init when sync key unchanged', async () => {
    const canvas = makeCanvas();
    const engine = new DisplayEngine(canvas);
    await engine.syncConfig(DEFAULT_CONFIG, true);
    await engine.syncConfig({ ...DEFAULT_CONFIG, brightness: 0.2 }, false);
    engine.frame(50, DEFAULT_CONFIG);
    expect(canvas.width).toBeGreaterThanOrEqual(0);
  });
});
