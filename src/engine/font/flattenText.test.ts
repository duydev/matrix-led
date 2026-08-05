import { describe, expect, it } from 'vitest';
import { flattenText } from './flattenText';

describe('flattenText', () => {
  it('converts newlines to spaces', () => {
    expect(flattenText('A\nB')).toBe('A B');
    expect(flattenText('A\r\nB')).toBe('A B');
    expect(flattenText('A\rB')).toBe('A B');
  });
});
