import { describe, expect, it } from 'vitest';
import { getAlphaBit } from './rasterizeText';

describe('getAlphaBit', () => {
  it('thresholds alpha', () => {
    expect(getAlphaBit(200, 128)).toBe(1);
    expect(getAlphaBit(50, 128)).toBe(0);
    expect(getAlphaBit(128, 128)).toBe(0);
  });
});
