import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  applyVisualViewportSize,
  clearVisualViewportSize,
  exitDisplayFullscreen,
  isAppleTouchDevice,
  isPseudoFullscreen,
  lockPageScroll,
  requestDisplayFullscreen,
  supportsNativeElementFullscreen,
  unlockPageScroll,
} from './fullscreen';

describe('fullscreen utils', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
    document.documentElement.className = '';
    document.body.className = '';
    document.body.removeAttribute('style');
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      get: () => null,
    });
  });

  it('uses native fullscreen when available and verified', async () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    el.requestFullscreen = vi.fn().mockImplementation(async () => {
      Object.defineProperty(document, 'fullscreenElement', {
        configurable: true,
        get: () => el,
      });
    });
    await expect(requestDisplayFullscreen(el)).resolves.toBe('native');
    expect(document.body.classList.contains('is-fs-scroll-lock')).toBe(true);
  });

  it('returns pseudo when native throws or does not stick', async () => {
    const el = document.createElement('div');
    el.requestFullscreen = vi.fn().mockRejectedValue(new Error('denied'));
    await expect(requestDisplayFullscreen(el)).resolves.toBe('pseudo');

    const el2 = document.createElement('div');
    el2.requestFullscreen = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      get: () => null,
    });
    await expect(requestDisplayFullscreen(el2)).resolves.toBe('pseudo');
  });

  it('skips native API on Apple touch devices', async () => {
    vi.stubGlobal('navigator', {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
      platform: 'iPhone',
      maxTouchPoints: 5,
    });
    expect(isAppleTouchDevice()).toBe(true);
    expect(supportsNativeElementFullscreen()).toBe(false);

    const el = document.createElement('div');
    el.requestFullscreen = vi.fn().mockResolvedValue(undefined);
    await expect(requestDisplayFullscreen(el)).resolves.toBe('pseudo');
    expect(el.requestFullscreen).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('detects iPadOS desktop UA via MacIntel + multitouch', () => {
    vi.stubGlobal('navigator', {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      platform: 'MacIntel',
      maxTouchPoints: 5,
    });
    expect(isAppleTouchDevice()).toBe(true);
    vi.unstubAllGlobals();

    vi.stubGlobal('navigator', {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      platform: 'MacIntel',
      maxTouchPoints: 0,
    });
    expect(isAppleTouchDevice()).toBe(false);
    vi.unstubAllGlobals();
  });

  it('sizes via visualViewport', () => {
    const el = document.createElement('div');
    applyVisualViewportSize(el);
    expect(el.style.width).toMatch(/px/);
    expect(el.style.height).toMatch(/px/);
    el.classList.add('is-pseudo-fullscreen');
    expect(isPseudoFullscreen(el)).toBe(true);
    clearVisualViewportSize(el);
    expect(el.style.width).toBe('');
  });

  it('checks prototype support when no element is passed', () => {
    const expected =
      typeof HTMLElement !== 'undefined'
      && typeof HTMLElement.prototype.requestFullscreen === 'function';
    expect(supportsNativeElementFullscreen()).toBe(expected);
    expect(supportsNativeElementFullscreen(null)).toBe(expected);
  });

  it('uses webkit fullscreen when standard API is missing', async () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    // Drop standard API so the webkit branch is exercised.
    Object.defineProperty(el, 'requestFullscreen', {
      configurable: true,
      value: undefined,
    });
    const webkit = el as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void>;
    };
    webkit.webkitRequestFullscreen = vi.fn().mockImplementation(async () => {
      Object.defineProperty(document, 'fullscreenElement', {
        configurable: true,
        get: () => el,
      });
    });
    await expect(requestDisplayFullscreen(el)).resolves.toBe('native');
  });

  it('swallows scrollTo failures when unlocking', () => {
    lockPageScroll();
    const scrollTo = vi.fn(() => {
      throw new Error('scroll blocked');
    });
    vi.stubGlobal('scrollTo', scrollTo);
    expect(() => unlockPageScroll()).not.toThrow();
    vi.unstubAllGlobals();
  });

  it('exits native / pseudo and unlocks scroll', async () => {
    const el = document.createElement('div');
    el.classList.add('is-pseudo-fullscreen');
    lockPageScroll();
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      get: () => el,
    });
    document.exitFullscreen = vi.fn().mockResolvedValue(undefined);
    await exitDisplayFullscreen(el, 'native');
    expect(document.exitFullscreen).toHaveBeenCalled();

    el.classList.add('is-pseudo-fullscreen');
    lockPageScroll();
    document.exitFullscreen = vi.fn().mockRejectedValue(new Error('x'));
    await exitDisplayFullscreen(el, 'native');
    await exitDisplayFullscreen(el, 'pseudo');
    expect(isPseudoFullscreen(el)).toBe(false);
    expect(document.body.classList.contains('is-fs-scroll-lock')).toBe(false);
    unlockPageScroll();
  });
});
