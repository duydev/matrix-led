import { describe, expect, it, vi, beforeEach } from 'vitest';

const render = vi.fn();
const createRoot = vi.fn(() => ({ render }));

vi.mock('react-dom/client', () => ({
  createRoot,
}));

vi.mock('./App', () => ({
  default: () => null,
}));

vi.mock('@fontsource/vt323/latin.css', () => ({}));
vi.mock('@fontsource/vt323/latin-ext.css', () => ({}));
vi.mock('@fontsource/vt323/vietnamese.css', () => ({}));
vi.mock('./styles/global.css', () => ({}));

describe('main bootstrap', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    createRoot.mockClear();
    render.mockClear();
    vi.resetModules();
  });

  it('mounts app on #root', async () => {
    document.body.innerHTML = '<div id="root"></div>';
    await import('./main');
    expect(createRoot).toHaveBeenCalled();
    expect(render).toHaveBeenCalled();
  });

  it('throws when root missing', async () => {
    await expect(import('./main')).rejects.toThrow(/Root element/);
  });
});
