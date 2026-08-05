import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG } from './defaults';
import { clampText, validateConfig } from './persist';
import { MAX_TEXT_LENGTH } from './types';

describe('clampText', () => {
  it('limits to MAX_TEXT_LENGTH', () => {
    const long = 'x'.repeat(250);
    expect(clampText(long)).toHaveLength(MAX_TEXT_LENGTH);
  });
});

describe('validateConfig', () => {
  it('falls back on corrupt input', () => {
    const cfg = validateConfig(null);
    expect(cfg.effectId).toBe('marquee');
    expect(cfg.matrixSizeId).toBe(DEFAULT_CONFIG.matrixSizeId);
    expect(cfg.text).toBe(DEFAULT_CONFIG.text);
  });

  it('maps unknown effect to marquee', () => {
    const cfg = validateConfig({ ...DEFAULT_CONFIG, effectId: 'nope' });
    expect(cfg.effectId).toBe('marquee');
  });

  it('clamps brightness and speed', () => {
    const low = validateConfig({
      ...DEFAULT_CONFIG,
      brightness: 99,
      speed: 0.01,
    });
    expect(low.brightness).toBe(1);
    expect(low.speed).toBe(0.25);

    const high = validateConfig({
      ...DEFAULT_CONFIG,
      speed: 99,
    });
    expect(high.speed).toBe(10);
  });

  it('slices oversized text', () => {
    const cfg = validateConfig({
      ...DEFAULT_CONFIG,
      text: 'y'.repeat(250),
    });
    expect(cfg.text).toHaveLength(MAX_TEXT_LENGTH);
  });

  it('rejects invalid hex color', () => {
    const cfg = validateConfig({
      ...DEFAULT_CONFIG,
      presetId: 'custom',
      color: '#zz',
    });
    expect(cfg.color).toBe(DEFAULT_CONFIG.color);
  });
});
