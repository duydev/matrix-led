import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

// jsdom lacks FontFaceSet
if (!document.fonts) {
  Object.defineProperty(document, 'fonts', {
    configurable: true,
    value: { ready: Promise.resolve() },
  });
}

if (typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}

function createMock2dContext(): CanvasRenderingContext2D {
  const store = {
    fillStyle: '#000',
    strokeStyle: '#000',
    font: '10px sans-serif',
    textBaseline: 'alphabetic' as CanvasTextBaseline,
    textAlign: 'start' as CanvasTextAlign,
    shadowBlur: 0,
    shadowColor: '',
  };
  const ctx = {
    get fillStyle() {
      return store.fillStyle;
    },
    set fillStyle(v: string | CanvasGradient | CanvasPattern) {
      store.fillStyle = String(v);
    },
    get strokeStyle() {
      return store.strokeStyle;
    },
    set strokeStyle(v: string | CanvasGradient | CanvasPattern) {
      store.strokeStyle = String(v);
    },
    get font() {
      return store.font;
    },
    set font(v: string) {
      store.font = v;
    },
    get textBaseline() {
      return store.textBaseline;
    },
    set textBaseline(v: CanvasTextBaseline) {
      store.textBaseline = v;
    },
    get textAlign() {
      return store.textAlign;
    },
    set textAlign(v: CanvasTextAlign) {
      store.textAlign = v;
    },
    get shadowBlur() {
      return store.shadowBlur;
    },
    set shadowBlur(v: number) {
      store.shadowBlur = v;
    },
    get shadowColor() {
      return store.shadowColor;
    },
    set shadowColor(v: string) {
      store.shadowColor = v;
    },
    setTransform: vi.fn(),
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    roundRect: vi.fn(),
    fillText: vi.fn(),
    measureText: vi.fn((text: string) => ({
      width: Math.max(1, text.length * 24),
      actualBoundingBoxAscent: 28,
      actualBoundingBoxDescent: 4,
    })),
    getImageData: vi.fn((sx: number, sy: number, sw: number, sh: number) => {
      const data = new Uint8ClampedArray(sw * sh * 4);
      // light a diagonal so raster find lit pixels
      for (let y = 0; y < sh; y += 1) {
        for (let x = 0; x < sw; x += 1) {
          if (x === 1 || y === Math.floor(sh / 2)) {
            const i = (y * sw + x) * 4;
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
            data[i + 3] = 255;
          }
        }
      }
      return { data, width: sw, height: sh, colorSpace: 'srgb' as PredefinedColorSpace };
    }),
  };
  return ctx as unknown as CanvasRenderingContext2D;
}

HTMLCanvasElement.prototype.getContext = function getContext(
  this: HTMLCanvasElement,
  type: string,
) {
  if (type === '2d') return createMock2dContext();
  return null;
} as typeof HTMLCanvasElement.prototype.getContext;
