import type { DisplayConfig } from '../state/types';
import { colorForCell, parseHexColor } from './colorize';
import type { FrameBuffer } from './framebuffer';

export type RenderOptions = {
  cellShape: DisplayConfig['cellShape'];
  glow: boolean;
  backgroundColor: string;
  config: DisplayConfig;
  t: number;
};

export function drawFrame(
  ctx: CanvasRenderingContext2D,
  buffer: FrameBuffer,
  cssWidth: number,
  cssHeight: number,
  dpr: number,
  options: RenderOptions,
): void {
  const { cols, rows, cells } = buffer;
  const w = Math.max(1, cssWidth);
  const h = Math.max(1, cssHeight);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const bg = parseHexColor(options.backgroundColor) ?? { r: 5, g: 5, b: 5 };
  ctx.fillStyle = `rgb(${bg.r},${bg.g},${bg.b})`;
  ctx.fillRect(0, 0, w, h);

  const gapRatio = 0.22;
  const cellW = w / cols;
  const cellH = h / rows;
  const size = Math.min(cellW, cellH) * (1 - gapRatio);
  const radius = size / 2;

  if (options.glow) {
    ctx.shadowBlur = Math.max(2, size * 0.55);
  } else {
    ctx.shadowBlur = 0;
  }

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const intensity = cells[y * cols + x] ?? 0;
      const cx = x * cellW + cellW / 2;
      const cy = y * cellH + cellH / 2;

      if (intensity <= 0.001) {
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(40,40,48,0.55)';
      } else {
        const rgb = colorForCell(options.config, x, options.t);
        if (options.glow) {
          ctx.shadowBlur = Math.max(2, size * 0.55);
          ctx.shadowColor = `rgba(${rgb.r},${rgb.g},${rgb.b},0.85)`;
        }
        ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${Math.min(1, intensity)})`;
      }

      if (options.cellShape === 'circle') {
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const half = size / 2;
        ctx.beginPath();
        ctx.roundRect(cx - half, cy - half, size, size, size * 0.2);
        ctx.fill();
      }
    }
  }

  ctx.shadowBlur = 0;
}
