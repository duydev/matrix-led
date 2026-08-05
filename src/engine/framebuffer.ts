export type FrameBuffer = {
  cols: number;
  rows: number;
  cells: Float32Array;
};

export function createFrameBuffer(cols: number, rows: number): FrameBuffer {
  return { cols, rows, cells: new Float32Array(cols * rows) };
}

export function clearFrameBuffer(buffer: FrameBuffer): void {
  buffer.cells.fill(0);
}

export function resizeFrameBuffer(
  buffer: FrameBuffer,
  cols: number,
  rows: number,
): FrameBuffer {
  if (buffer.cols === cols && buffer.rows === rows) return buffer;
  return createFrameBuffer(cols, rows);
}
