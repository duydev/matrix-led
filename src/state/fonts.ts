/** LED-oriented mono faces (self-hosted via @fontsource). */

export type FontId =
  | 'vt323'
  | 'share_tech_mono'
  | 'ibm_plex_mono'
  | 'space_mono'
  | 'silkscreen'
  | 'press_start_2p'
  | 'nova_mono';

export type LedFontMeta = {
  label: string;
  /** Value for canvas `ctx.font` / CSS font-family */
  cssFamily: string;
  /** Dedicated Vietnamese subset bundled */
  vietnamese: boolean;
};

export const LED_FONTS: Record<FontId, LedFontMeta> = {
  vt323: {
    label: 'VT323 — LED classic',
    cssFamily: '"VT323", monospace',
    vietnamese: true,
  },
  share_tech_mono: {
    label: 'Share Tech Mono — tech LED',
    cssFamily: '"Share Tech Mono", monospace',
    vietnamese: false,
  },
  ibm_plex_mono: {
    label: 'IBM Plex Mono — sạch, VI tốt',
    cssFamily: '"IBM Plex Mono", monospace',
    vietnamese: true,
  },
  space_mono: {
    label: 'Space Mono — display mono',
    cssFamily: '"Space Mono", monospace',
    vietnamese: true,
  },
  silkscreen: {
    label: 'Silkscreen — pixel cứng',
    cssFamily: '"Silkscreen", monospace',
    vietnamese: false,
  },
  press_start_2p: {
    label: 'Press Start 2P — 8-bit',
    cssFamily: '"Press Start 2P", monospace',
    vietnamese: false,
  },
  nova_mono: {
    label: 'Nova Mono — LCD',
    cssFamily: '"Nova Mono", monospace',
    vietnamese: false,
  },
};

/** Stable UI order */
export const FONT_ORDER: FontId[] = [
  'vt323',
  'share_tech_mono',
  'ibm_plex_mono',
  'space_mono',
  'silkscreen',
  'press_start_2p',
  'nova_mono',
];

export function resolveFontFamily(fontId: FontId | undefined): string {
  if (fontId && fontId in LED_FONTS) return LED_FONTS[fontId].cssFamily;
  return LED_FONTS.vt323.cssFamily;
}
