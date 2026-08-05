import { describe, expect, it } from 'vitest';
import {
  FONT_ORDER,
  LED_FONTS,
  resolveFontFamily,
  type FontId,
} from './fonts';

describe('LED font catalog', () => {
  it('lists stable order covering all catalog entries', () => {
    expect(FONT_ORDER).toHaveLength(Object.keys(LED_FONTS).length);
    for (const id of FONT_ORDER) {
      expect(LED_FONTS[id].cssFamily).toMatch(/monospace/);
    }
  });

  it('resolves known and unknown font families', () => {
    expect(resolveFontFamily('vt323')).toContain('VT323');
    expect(resolveFontFamily('ibm_plex_mono')).toContain('IBM Plex Mono');
    expect(resolveFontFamily(undefined)).toContain('VT323');
    expect(resolveFontFamily('nope' as FontId)).toContain('VT323');
  });

  it('marks Vietnamese-capable faces', () => {
    expect(LED_FONTS.vt323.vietnamese).toBe(true);
    expect(LED_FONTS.ibm_plex_mono.vietnamese).toBe(true);
    expect(LED_FONTS.space_mono.vietnamese).toBe(true);
    expect(LED_FONTS.silkscreen.vietnamese).toBe(false);
  });
});
