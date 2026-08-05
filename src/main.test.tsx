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
vi.mock('@fontsource/share-tech-mono/latin.css', () => ({}));
vi.mock('@fontsource/ibm-plex-mono/latin-400.css', () => ({}));
vi.mock('@fontsource/ibm-plex-mono/latin-ext-400.css', () => ({}));
vi.mock('@fontsource/ibm-plex-mono/vietnamese-400.css', () => ({}));
vi.mock('@fontsource/space-mono/latin-400.css', () => ({}));
vi.mock('@fontsource/space-mono/latin-ext-400.css', () => ({}));
vi.mock('@fontsource/space-mono/vietnamese-400.css', () => ({}));
vi.mock('@fontsource/silkscreen/latin-400.css', () => ({}));
vi.mock('@fontsource/silkscreen/latin-ext-400.css', () => ({}));
vi.mock('@fontsource/press-start-2p/latin.css', () => ({}));
vi.mock('@fontsource/press-start-2p/latin-ext.css', () => ({}));
vi.mock('@fontsource/nova-mono/latin.css', () => ({}));
vi.mock('@fontsource/nova-mono/latin-ext.css', () => ({}));
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
