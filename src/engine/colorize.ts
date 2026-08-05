import type { DisplayConfig, PresetId } from '../state/types';
import { PRESET_COLORS } from '../state/defaults';

export type Rgb = { r: number; g: number; b: number };

function clampByte(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

export function parseHexColor(hex: string): Rgb | null {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return null;
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

function hslToRgb(h: number, s: number, l: number): Rgb {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0;
  let g = 0;
  let b = 0;
  if (hp >= 0 && hp < 1) [r, g, b] = [c, x, 0];
  else if (hp < 2) [r, g, b] = [x, c, 0];
  else if (hp < 3) [r, g, b] = [0, c, x];
  else if (hp < 4) [r, g, b] = [0, x, c];
  else if (hp < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = l - c / 2;
  return {
    r: clampByte((r + m) * 255),
    g: clampByte((g + m) * 255),
    b: clampByte((b + m) * 255),
  };
}

export function resolveActiveColor(config: DisplayConfig): Rgb {
  if (config.presetId === 'rainbow') {
    return { r: 255, g: 30, b: 0 };
  }
  if (config.presetId !== 'custom' && config.presetId in PRESET_COLORS) {
    const hex = PRESET_COLORS[config.presetId as Exclude<PresetId, 'rainbow' | 'custom'>];
    return parseHexColor(hex) ?? { r: 255, g: 30, b: 0 };
  }
  return parseHexColor(config.color) ?? { r: 255, g: 30, b: 0 };
}

export function colorForCell(
  config: DisplayConfig,
  x: number,
  t: number,
): Rgb {
  const brightness = config.brightness;
  if (config.presetId === 'rainbow') {
    const hue = (x * 12 + t * 0.05) % 360;
    const rgb = hslToRgb(hue < 0 ? hue + 360 : hue, 1, 0.5);
    return {
      r: clampByte(rgb.r * brightness),
      g: clampByte(rgb.g * brightness),
      b: clampByte(rgb.b * brightness),
    };
  }
  const base = resolveActiveColor(config);
  return {
    r: clampByte(base.r * brightness),
    g: clampByte(base.g * brightness),
    b: clampByte(base.b * brightness),
  };
}
