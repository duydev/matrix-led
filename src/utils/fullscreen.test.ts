import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  exitDisplayFullscreen,
  isPseudoFullscreen,
  requestDisplayFullscreen,
} from './fullscreen';

describe('fullscreen utils', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('uses native fullscreen when available', async () => {
    const el = document.createElement('div');
    el.requestFullscreen = vi.fn().mockResolvedValue(undefined);
    await expect(requestDisplayFullscreen(el)).resolves.toBe('native');
  });

  it('falls back to pseudo when native throws or missing', async () => {
    const el = document.createElement('div');
    el.requestFullscreen = vi.fn().mockRejectedValue(new Error('denied'));
    await expect(requestDisplayFullscreen(el)).resolves.toBe('pseudo');
    expect(isPseudoFullscreen(el)).toBe(true);

    const el2 = document.createElement('div');
    // @ts-expect-error force missing
    el2.requestFullscreen = undefined;
    await expect(requestDisplayFullscreen(el2)).resolves.toBe('pseudo');
  });

  it('exits native and pseudo modes', async () => {
    const el = document.createElement('div');
    el.classList.add('is-pseudo-fullscreen');
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      get: () => el,
    });
    document.exitFullscreen = vi.fn().mockResolvedValue(undefined);
    await exitDisplayFullscreen(el, 'native');
    expect(document.exitFullscreen).toHaveBeenCalled();

    document.exitFullscreen = vi.fn().mockRejectedValue(new Error('x'));
    await exitDisplayFullscreen(el, 'native');
    await exitDisplayFullscreen(el, 'pseudo');
    expect(isPseudoFullscreen(el)).toBe(false);
  });
});
