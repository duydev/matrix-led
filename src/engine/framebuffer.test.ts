import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
  createFrameBuffer,
  clearFrameBuffer,
  resizeFrameBuffer,
} from './framebuffer';

describe('framebuffer', () => {
  it('creates and clears buffer', () => {
    const buf = createFrameBuffer(2, 2);
    buf.cells[0] = 1;
    clearFrameBuffer(buf);
    expect([...buf.cells]).toEqual([0, 0, 0, 0]);
  });

  it('reuses buffer when size unchanged', () => {
    const buf = createFrameBuffer(3, 2);
    expect(resizeFrameBuffer(buf, 3, 2)).toBe(buf);
  });

  it('allocates new buffer when size changes', () => {
    const buf = createFrameBuffer(3, 2);
    const next = resizeFrameBuffer(buf, 4, 2);
    expect(next).not.toBe(buf);
    expect(next.cols).toBe(4);
  });
});
