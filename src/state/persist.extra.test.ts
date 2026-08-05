import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  loadConfig,
  saveConfig,
  validateConfig,
} from './persist';
import { DEFAULT_CONFIG } from './defaults';
import { MAX_TEXT_LENGTH, STORAGE_KEY } from './types';
import { renderHook, act } from '@testing-library/react';
import { useDisplayConfig } from './useDisplayConfig';

describe('persist extras', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('validates enums, shapes, and non-string fields', () => {
    const cfg = validateConfig({
      effectId: 'blink',
      presetId: 'nope',
      direction: 'up',
      matrixSizeId: '1x1',
      color: 1,
      backgroundColor: 'bad',
      brightness: 'x',
      speed: Number.NaN,
      text: 99,
      cellShape: 'triangle',
      glow: 'yes',
      playing: 'no',
    });
    expect(cfg.effectId).toBe('blink');
    expect(cfg.presetId).toBe('classic_red');
    expect(cfg.direction).toBe('rtl');
    expect(cfg.matrixSizeId).toBe('256x64');
    expect(cfg.cellShape).toBe('circle');
    expect(cfg.glow).toBe(DEFAULT_CONFIG.glow);
    expect(cfg.playing).toBe(DEFAULT_CONFIG.playing);
    expect(cfg.text).toBe(DEFAULT_CONFIG.text);
  });

  it('keeps square shape and rainbow/custom colors', () => {
    expect(
      validateConfig({
        ...DEFAULT_CONFIG,
        cellShape: 'square',
        presetId: 'rainbow',
      }).cellShape,
    ).toBe('square');
    expect(
      validateConfig({
        ...DEFAULT_CONFIG,
        presetId: 'custom',
        color: '#112233',
      }).color,
    ).toBe('#112233');
    expect(
      validateConfig({
        ...DEFAULT_CONFIG,
        fontId: 'space_mono',
      }).fontId,
    ).toBe('space_mono');
    expect(
      validateConfig({
        ...DEFAULT_CONFIG,
        fontId: 'nope' as never,
      }).fontId,
    ).toBe('space_mono');
  });

  it('loads defaults, saved json, and corrupt storage', () => {
    expect(loadConfig().text).toBe(DEFAULT_CONFIG.text);
    saveConfig({ ...DEFAULT_CONFIG, text: 'OK' });
    expect(loadConfig().text).toBe('OK');
    localStorage.setItem(STORAGE_KEY, '{broken');
    expect(loadConfig().text).toBe(DEFAULT_CONFIG.text);
  });

  it('swallows save errors', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    expect(() => saveConfig(DEFAULT_CONFIG)).not.toThrow();
    spy.mockRestore();
  });
});

describe('useDisplayConfig', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('patches text with clamp and debounced save', () => {
    const { result } = renderHook(() => useDisplayConfig());
    act(() => {
      result.current.setText('x'.repeat(250));
      result.current.patch({ speed: 2 });
    });
    expect(result.current.config.text).toHaveLength(MAX_TEXT_LENGTH);
    expect(result.current.charCount).toBe(MAX_TEXT_LENGTH);
    act(() => {
      vi.advanceTimersByTime(350);
    });
    expect(localStorage.getItem(STORAGE_KEY)).toContain('"speed":2');
  });
});
