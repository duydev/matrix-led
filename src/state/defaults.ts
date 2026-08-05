import type { DisplayConfig } from './types';

export const DEFAULT_CONFIG: DisplayConfig = {
  version: 1,
  text: 'Chào mừng quý khách',
  effectId: 'marquee',
  presetId: 'classic_red',
  color: '#ff1e00',
  backgroundColor: '#050505',
  brightness: 0.85,
  speed: 4,
  direction: 'rtl',
  matrixSizeId: '256x64',
  fontId: 'space_mono',
  cellShape: 'circle',
  glow: true,
  playing: true,
};

export const PRESET_COLORS: Record<
  Exclude<DisplayConfig['presetId'], 'rainbow' | 'custom'>,
  string
> = {
  classic_red: '#ff1e00',
  amber: '#ffb000',
  cyan: '#00e5ff',
  lime: '#b6ff00',
};
