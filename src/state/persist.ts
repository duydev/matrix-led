import { DEFAULT_CONFIG, PRESET_COLORS } from './defaults';
import {
  MAX_TEXT_LENGTH,
  STORAGE_KEY,
  type Direction,
  type DisplayConfig,
  type EffectId,
  type MatrixSizeId,
  type PresetId,
} from './types';

const EFFECT_IDS = new Set<EffectId>([
  'marquee',
  'static',
  'fade_in_out',
  'blink',
  'typewriter',
  'shift_in',
]);

const PRESET_IDS = new Set<PresetId>([
  'classic_red',
  'amber',
  'cyan',
  'lime',
  'rainbow',
  'custom',
]);

const DIRECTIONS = new Set<Direction>(['rtl', 'ltr', 'ttb', 'btt']);

const MATRIX_SIZE_IDS = new Set<MatrixSizeId>(['32x8', '64x16', '96x16']);

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function asString(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback;
}

function asBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

export function clampText(text: string): string {
  return text.slice(0, MAX_TEXT_LENGTH);
}

export function validateConfig(input: unknown): DisplayConfig {
  if (!input || typeof input !== 'object') {
    return { ...DEFAULT_CONFIG };
  }

  const raw = input as Partial<DisplayConfig>;
  const effectId = EFFECT_IDS.has(raw.effectId as EffectId)
    ? (raw.effectId as EffectId)
    : DEFAULT_CONFIG.effectId;
  const presetId = PRESET_IDS.has(raw.presetId as PresetId)
    ? (raw.presetId as PresetId)
    : DEFAULT_CONFIG.presetId;
  const direction = DIRECTIONS.has(raw.direction as Direction)
    ? (raw.direction as Direction)
    : DEFAULT_CONFIG.direction;
  const matrixSizeId = MATRIX_SIZE_IDS.has(raw.matrixSizeId as MatrixSizeId)
    ? (raw.matrixSizeId as MatrixSizeId)
    : DEFAULT_CONFIG.matrixSizeId;

  const colorRaw = asString(raw.color, DEFAULT_CONFIG.color);
  const bgRaw = asString(raw.backgroundColor, DEFAULT_CONFIG.backgroundColor);

  let color = HEX_RE.test(colorRaw) ? colorRaw : DEFAULT_CONFIG.color;
  if (presetId !== 'custom' && presetId !== 'rainbow') {
    color = PRESET_COLORS[presetId];
  }

  const cellShape =
    raw.cellShape === 'circle' || raw.cellShape === 'square'
      ? raw.cellShape
      : DEFAULT_CONFIG.cellShape;

  return {
    version: 1,
    text: clampText(asString(raw.text, DEFAULT_CONFIG.text)),
    effectId,
    presetId,
    color,
    backgroundColor: HEX_RE.test(bgRaw) ? bgRaw : DEFAULT_CONFIG.backgroundColor,
    brightness: clamp(asNumber(raw.brightness, DEFAULT_CONFIG.brightness), 0.1, 1),
    speed: clamp(asNumber(raw.speed, DEFAULT_CONFIG.speed), 0.25, 3),
    direction,
    matrixSizeId,
    cellShape,
    glow: asBoolean(raw.glow, DEFAULT_CONFIG.glow),
    playing: asBoolean(raw.playing, DEFAULT_CONFIG.playing),
  };
}

export function loadConfig(): DisplayConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_CONFIG };
    return validateConfig(JSON.parse(raw) as unknown);
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function saveConfig(config: DisplayConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // quota / private mode — degrade silently
  }
}
