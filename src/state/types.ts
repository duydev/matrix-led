/** Mirrors docs/specs/05-data-model.md (SSOT). */

export type EffectId =
  | 'marquee'
  | 'static'
  | 'fade_in_out'
  | 'blink'
  | 'typewriter'
  | 'shift_in';

export type PresetId =
  | 'classic_red'
  | 'amber'
  | 'cyan'
  | 'lime'
  | 'rainbow'
  | 'custom';

export type Direction = 'rtl' | 'ltr' | 'ttb' | 'btt';

export type MatrixSizeId =
  | '32x8'
  | '64x16'
  | '96x16'
  | '128x32'
  | '160x32'
  | '192x48'
  | '256x64';

export type { FontId } from './fonts';
export { LED_FONTS, FONT_ORDER, resolveFontFamily } from './fonts';
import type { FontId } from './fonts';

export interface DisplayConfig {
  version: 1;
  text: string;
  effectId: EffectId;
  presetId: PresetId;
  color: string;
  backgroundColor: string;
  brightness: number;
  speed: number;
  direction: Direction;
  matrixSizeId: MatrixSizeId;
  fontId: FontId;
  cellShape: 'circle' | 'square';
  glow: boolean;
  playing: boolean;
}

export const MATRIX_SIZES: Record<MatrixSizeId, { cols: number; rows: number }> = {
  '32x8': { cols: 32, rows: 8 },
  '64x16': { cols: 64, rows: 16 },
  '96x16': { cols: 96, rows: 16 },
  '128x32': { cols: 128, rows: 32 },
  '160x32': { cols: 160, rows: 32 },
  '192x48': { cols: 192, rows: 48 },
  '256x64': { cols: 256, rows: 64 },
};

export const MAX_TEXT_LENGTH = 200;

/** Playback speed multiplier bounds (UI slider + persist clamp). */
export const SPEED_MIN = 0.25;
export const SPEED_MAX = 10;

export const STORAGE_KEY = 'matrix-led:config:v1';
