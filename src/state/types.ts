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

export type MatrixSizeId = '32x8' | '64x16' | '96x16';

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
  cellShape: 'circle' | 'square';
  glow: boolean;
  playing: boolean;
}

export const MATRIX_SIZES: Record<MatrixSizeId, { cols: number; rows: number }> = {
  '32x8': { cols: 32, rows: 8 },
  '64x16': { cols: 64, rows: 16 },
  '96x16': { cols: 96, rows: 16 },
};

export const MAX_TEXT_LENGTH = 200;

export const STORAGE_KEY = 'matrix-led:config:v1';
