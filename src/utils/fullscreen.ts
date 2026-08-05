export type FullscreenMode = 'none' | 'native' | 'pseudo';

const SCROLL_LOCK = 'is-fs-scroll-lock';

let savedScrollY = 0;

/** iPhone / iPad (incl. iPadOS desktop UA). */
export function isAppleTouchDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return true;
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
}

export function supportsNativeElementFullscreen(
  el?: HTMLElement | null,
): boolean {
  if (typeof document === 'undefined') return false;
  if (isAppleTouchDevice()) return false;

  if (!el) {
    return (
      typeof HTMLElement !== 'undefined'
      && typeof HTMLElement.prototype.requestFullscreen === 'function'
    );
  }

  const webkit = el as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void> | void;
  };
  return (
    typeof el.requestFullscreen === 'function'
    || typeof webkit.webkitRequestFullscreen === 'function'
  );
}

/** Size overlay to the *visible* viewport (iOS URL bar safe). */
export function applyVisualViewportSize(el: HTMLElement): void {
  const vv = window.visualViewport;
  const w = Math.round(vv?.width ?? window.innerWidth);
  const h = Math.round(vv?.height ?? window.innerHeight);
  const offsetTop = Math.round(vv?.offsetTop ?? 0);
  const offsetLeft = Math.round(vv?.offsetLeft ?? 0);
  el.style.setProperty('--fs-w', `${w}px`);
  el.style.setProperty('--fs-h', `${h}px`);
  el.style.setProperty('--fs-top', `${offsetTop}px`);
  el.style.setProperty('--fs-left', `${offsetLeft}px`);
  el.style.top = `${offsetTop}px`;
  el.style.left = `${offsetLeft}px`;
  el.style.width = `${w}px`;
  el.style.height = `${h}px`;
}

export function clearVisualViewportSize(el: HTMLElement): void {
  el.style.removeProperty('--fs-w');
  el.style.removeProperty('--fs-h');
  el.style.removeProperty('--fs-top');
  el.style.removeProperty('--fs-left');
  el.style.top = '';
  el.style.left = '';
  el.style.width = '';
  el.style.height = '';
}

export function lockPageScroll(): void {
  if (document.body.classList.contains(SCROLL_LOCK)) return;
  savedScrollY = window.scrollY || window.pageYOffset || 0;
  document.documentElement.classList.add(SCROLL_LOCK);
  document.body.classList.add(SCROLL_LOCK);
  document.body.style.position = 'fixed';
  document.body.style.top = `-${savedScrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
}

export function unlockPageScroll(): void {
  document.documentElement.classList.remove(SCROLL_LOCK);
  document.body.classList.remove(SCROLL_LOCK);
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  try {
    window.scrollTo(0, savedScrollY);
  } catch {
    /* jsdom */
  }
}

/**
 * Try native Element Fullscreen (desktop). On iOS always returns `pseudo`
 * — caller renders via React portal to document.body.
 */
export async function requestDisplayFullscreen(
  el: HTMLElement,
): Promise<FullscreenMode> {
  if (!isAppleTouchDevice() && supportsNativeElementFullscreen(el)) {
    const webkit = el as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void> | void;
    };
    const req =
      el.requestFullscreen?.bind(el) ??
      webkit.webkitRequestFullscreen?.bind(el);

    if (req) {
      try {
        await Promise.resolve(req());
        if (document.fullscreenElement === el) {
          lockPageScroll();
          return 'native';
        }
      } catch {
        // fall through
      }
    }
  }

  return 'pseudo';
}

export async function exitDisplayFullscreen(
  el: HTMLElement,
  mode: FullscreenMode,
): Promise<void> {
  if (mode === 'native' && document.fullscreenElement) {
    try {
      await document.exitFullscreen();
    } catch {
      /* ignore */
    }
  }
  el.classList.remove('is-pseudo-fullscreen');
  clearVisualViewportSize(el);
  unlockPageScroll();
}

export function isPseudoFullscreen(el: HTMLElement): boolean {
  return el.classList.contains('is-pseudo-fullscreen');
}
