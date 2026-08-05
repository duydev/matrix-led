import { describe, expect, it } from 'vitest';
import {
  parseHexColor,
  resolveActiveColor,
  colorForCell,
} from './colorize';
import { DEFAULT_CONFIG, PRESET_COLORS } from '../state/defaults';

describe('colorize', () => {
  it('parses valid and invalid hex', () => {
    expect(parseHexColor('#ff1e00')).toEqual({ r: 255, g: 30, b: 0 });
    expect(parseHexColor('#zz')).toBeNull();
  });

  it('resolves preset and custom colors', () => {
    expect(resolveActiveColor({ ...DEFAULT_CONFIG, presetId: 'amber' }).r).toBe(
      255,
    );
    // defensive fallback when PRESET_COLORS parse would fail — force via custom bad already covered;
    // exercise classic_red path through resolve for brightness apply too
    expect(
      resolveActiveColor({ ...DEFAULT_CONFIG, presetId: 'classic_red' }),
    ).toEqual(parseHexColor('#ff1e00'));

    expect(
      resolveActiveColor({
        ...DEFAULT_CONFIG,
        presetId: 'custom',
        color: '#00ff00',
      }),
    ).toEqual({ r: 0, g: 255, b: 0 });
    expect(
      resolveActiveColor({ ...DEFAULT_CONFIG, presetId: 'rainbow' }).r,
    ).toBe(255);
    expect(
      resolveActiveColor({
        ...DEFAULT_CONFIG,
        presetId: 'custom',
        color: 'bad',
      }).r,
    ).toBe(255);
  });

  it('applies brightness and rainbow hue', () => {
    const dim = colorForCell(
      { ...DEFAULT_CONFIG, brightness: 0.5, presetId: 'classic_red' },
      0,
      0,
    );
    expect(dim.r).toBeLessThan(255);
    const rainbow = colorForCell(
      { ...DEFAULT_CONFIG, presetId: 'rainbow', brightness: 1 },
      5,
      1000,
    );
    expect(rainbow.r + rainbow.g + rainbow.b).toBeGreaterThan(0);
  });

  it('falls back when preset hex is invalid', () => {
    const prev = PRESET_COLORS.amber;
    (PRESET_COLORS as { amber: string }).amber = 'not-hex';
    expect(
      resolveActiveColor({ ...DEFAULT_CONFIG, presetId: 'amber' }),
    ).toEqual({ r: 255, g: 30, b: 0 });
    (PRESET_COLORS as { amber: string }).amber = prev;
  });
});
