import { describe, expect, it, vi } from 'vitest';
import { createFrameBuffer } from './framebuffer';
import { drawFrame } from './renderer';
import { DEFAULT_CONFIG } from '../state/defaults';
import { colorForCell } from './colorize';

function mockCtx() {
  return {
    setTransform: vi.fn(),
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    roundRect: vi.fn(),
    shadowBlur: 0,
    shadowColor: '',
    fillStyle: '',
  } as unknown as CanvasRenderingContext2D;
}

describe('renderer', () => {
  it('draws off and on cells for circle and square', () => {
    const buffer = createFrameBuffer(2, 2);
    buffer.cells[0] = 1;
    const ctx = mockCtx();
    drawFrame(ctx, buffer, 100, 40, 1, {
      cellShape: 'circle',
      glow: true,
      backgroundColor: '#050505',
      config: DEFAULT_CONFIG,
      t: 0,
    });
    drawFrame(ctx, buffer, 100, 40, 1, {
      cellShape: 'square',
      glow: false,
      backgroundColor: 'bad',
      config: { ...DEFAULT_CONFIG, presetId: 'rainbow' },
      t: 100,
    });
    drawFrame(
      ctx,
      { cols: 1, rows: 1, cells: [] as unknown as Float32Array },
      10,
      10,
      1,
      {
        cellShape: 'circle',
        glow: true,
        backgroundColor: '#000000',
        config: DEFAULT_CONFIG,
        t: 0,
      },
    );
    expect(ctx.fill).toHaveBeenCalled();
  });
});

describe('colorForCell hue branches', () => {
  it('covers hsl sectors and negative hue', () => {
    const cfg = { ...DEFAULT_CONFIG, presetId: 'rainbow' as const, brightness: 1 };
    for (const x of [0, 5, 10, 15, 20, 25, 30]) {
      const c = colorForCell(cfg, x, 0);
      expect(c.r + c.g + c.b).toBeGreaterThan(0);
    }
    expect(colorForCell(cfg, 0, -100000).r).toBeGreaterThanOrEqual(0);
  });
});
