import { describe, expect, it } from 'vitest';
import { APP_VERSION } from './meta';

describe('meta', () => {
  it('exposes a non-empty app version from package.json', () => {
    expect(APP_VERSION).toMatch(/^\d+\.\d+\.\d+/);
  });
});
