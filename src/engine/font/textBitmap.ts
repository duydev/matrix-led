export type TextBitmap = {
  width: number;
  height: number;
  /** column-major: index = x * height + y */
  dots: Uint8Array;
};

export function sampleBitmap(
  bitmap: TextBitmap,
  x: number,
  y: number,
): number {
  if (x < 0 || y < 0 || x >= bitmap.width || y >= bitmap.height) return 0;
  return bitmap.dots[x * bitmap.height + y] ?? 0;
}

export const EMPTY_BITMAP: TextBitmap = {
  width: 0,
  height: 0,
  dots: new Uint8Array(0),
};
