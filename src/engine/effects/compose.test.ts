import { describe, expect, it } from 'vitest';
import { createFrameBuffer } from '../framebuffer';
import { paintBitmapAt, paintCentered } from './compose';
import type { TextBitmap } from '../font/textBitmap';

const bitmap: TextBitmap = {
  width: 4,
  height: 2,
  dots: new Uint8Array([1, 1, 0, 0, 1, 0, 0, 0]),
};

describe('compose', () => {
  it('paints with maxColumns and skips OOB', () => {
    const buffer = createFrameBuffer(6, 4);
    paintCentered(buffer, { width: 0, height: 0, dots: new Uint8Array() });
    paintCentered(buffer, { width: 3, height: 0, dots: new Uint8Array() });
    paintCentered(buffer, { width: 0, height: 3, dots: new Uint8Array() });
    expect(Math.max(...buffer.cells)).toBe(0);
    paintBitmapAt(buffer, bitmap, -1, -1, 0.5, 2);
    paintBitmapAt(buffer, bitmap, 5, 3, 1, 10);
    paintBitmapAt(buffer, bitmap, 0, 0); // default intensity/maxColumns
    paintCentered(buffer, bitmap); // maxColumns undefined branch
    paintCentered(buffer, bitmap, 1, 2);
    expect(buffer.cells.some((c) => c > 0)).toBe(true);
  });
});
