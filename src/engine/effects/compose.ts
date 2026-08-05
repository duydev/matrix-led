import { clearFrameBuffer, type FrameBuffer } from '../framebuffer';
import { sampleBitmap, type TextBitmap } from '../font/textBitmap';

export function paintBitmapAt(
  buffer: FrameBuffer,
  bitmap: TextBitmap,
  originX: number,
  originY: number,
  intensity = 1,
  maxColumns?: number,
): void {
  const { cols, rows, cells } = buffer;
  const colLimit =
    maxColumns === undefined
      ? bitmap.width
      : Math.max(0, Math.min(bitmap.width, maxColumns));

  for (let x = 0; x < colLimit; x += 1) {
    const dx = originX + x;
    if (dx < 0 || dx >= cols) continue;
    for (let y = 0; y < bitmap.height; y += 1) {
      const dy = originY + y;
      if (dy < 0 || dy >= rows) continue;
      if (sampleBitmap(bitmap, x, y) === 1) {
        cells[dy * cols + dx] = intensity;
      }
    }
  }
}

export function paintCentered(
  buffer: FrameBuffer,
  bitmap: TextBitmap,
  intensity = 1,
  maxColumns?: number,
): void {
  clearFrameBuffer(buffer);
  if (bitmap.width === 0 || bitmap.height === 0) return;
  const width = maxColumns === undefined ? bitmap.width : Math.min(bitmap.width, maxColumns);
  const ox = Math.floor((buffer.cols - width) / 2);
  const oy = Math.floor((buffer.rows - bitmap.height) / 2);
  paintBitmapAt(buffer, bitmap, ox, oy, intensity, maxColumns);
}
