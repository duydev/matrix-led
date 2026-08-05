export type FullscreenMode = 'none' | 'native' | 'pseudo';

export async function requestDisplayFullscreen(
  el: HTMLElement,
): Promise<FullscreenMode> {
  const req = el.requestFullscreen?.bind(el);
  if (req) {
    try {
      await req();
      return 'native';
    } catch {
      // fall through to pseudo
    }
  }
  el.classList.add('is-pseudo-fullscreen');
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
}

export function isPseudoFullscreen(el: HTMLElement): boolean {
  return el.classList.contains('is-pseudo-fullscreen');
}
