import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { DisplayStage, type DisplayStageHandle } from './DisplayStage';
import { DEFAULT_CONFIG } from '../state/defaults';

const syncConfig = vi.fn().mockResolvedValue(undefined);
const frame = vi.fn();
const dispose = vi.fn();
const reset = vi.fn().mockResolvedValue(undefined);

vi.mock('../engine/loop', () => ({
  DisplayEngine: class {
    syncConfig = syncConfig;
    frame = frame;
    dispose = dispose;
    reset = reset;
  },
}));

describe('DisplayStage', () => {
  beforeEach(() => {
    syncConfig.mockClear();
    frame.mockClear();
    dispose.mockClear();
    reset.mockClear();
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      get: () => null,
    });
  });

  it('exposes reset/fullscreen and reacts to keys', async () => {
    const onFullscreenChange = vi.fn();
    const ref = createRef<DisplayStageHandle>();
    render(
      <DisplayStage
        ref={ref}
        config={DEFAULT_CONFIG}
        onFullscreenChange={onFullscreenChange}
      />,
    );

    await waitFor(() => expect(syncConfig).toHaveBeenCalled());
    ref.current?.resetAnimation();
    expect(reset).toHaveBeenCalled();

    const el = screen.getByTestId('display-stage');
    el.requestFullscreen = vi.fn().mockRejectedValue(new Error('x'));
    await ref.current?.toggleFullscreen();
    expect(onFullscreenChange).toHaveBeenCalledWith(true);
    await waitFor(() =>
      expect(screen.getByTestId('display-stage').className).toMatch(
        /is-fullscreen-active/,
      ),
    );
    fireEvent.doubleClick(screen.getByTestId('display-stage'));
    await waitFor(() =>
      expect(onFullscreenChange).toHaveBeenCalledWith(false),
    );

    fireEvent.keyDown(window, { key: 'f' });
    fireEvent.keyDown(window, { key: 'Escape' });
  });

  it('ignores F key in form fields and syncs config changes', async () => {
    const { rerender } = render(<DisplayStage config={DEFAULT_CONFIG} />);
    await waitFor(() => expect(syncConfig).toHaveBeenCalled());
    syncConfig.mockClear();
    rerender(
      <DisplayStage
        config={{ ...DEFAULT_CONFIG, text: 'New', matrixSizeId: '32x8' }}
      />,
    );
    await waitFor(() => expect(syncConfig).toHaveBeenCalled());

    const input = document.createElement('textarea');
    document.body.appendChild(input);
    fireEvent.keyDown(input, { key: 'f' });
    input.remove();
  });

  it('exits pseudo fullscreen on Escape', async () => {
    const onFullscreenChange = vi.fn();
    const ref = createRef<DisplayStageHandle>();
    render(
      <DisplayStage
        ref={ref}
        config={DEFAULT_CONFIG}
        onFullscreenChange={onFullscreenChange}
      />,
    );
    await waitFor(() => expect(syncConfig).toHaveBeenCalled());

    const el = screen.getByTestId('display-stage');
    el.requestFullscreen = vi.fn().mockRejectedValue(new Error('x'));
    await ref.current?.toggleFullscreen();
    await waitFor(() =>
      expect(screen.getByTestId('display-stage').className).toMatch(
        /is-fullscreen-active/,
      ),
    );

    fireEvent.pointerUp(screen.getByTestId('display-stage'), {
      pointerType: 'touch',
    });
    fireEvent.pointerUp(screen.getByTestId('display-stage'), {
      pointerType: 'touch',
    });
    await waitFor(() =>
      expect(onFullscreenChange).toHaveBeenCalledWith(false),
    );
  });

  it('clears native fullscreen on fullscreenchange', async () => {
    const onFullscreenChange = vi.fn();
    const ref = createRef<DisplayStageHandle>();
    render(
      <DisplayStage
        ref={ref}
        config={DEFAULT_CONFIG}
        onFullscreenChange={onFullscreenChange}
      />,
    );
    await waitFor(() => expect(syncConfig).toHaveBeenCalled());
    const el = screen.getByTestId('display-stage');
    let fsEl: Element | null = null;
    el.requestFullscreen = vi.fn().mockImplementation(async () => {
      fsEl = el;
    });
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      get: () => fsEl,
    });
    await ref.current?.toggleFullscreen();
    await waitFor(() => expect(onFullscreenChange).toHaveBeenCalledWith(true));

    fsEl = null;
    fireEvent(document, new Event('fullscreenchange'));
    await waitFor(() => expect(onFullscreenChange).toHaveBeenCalledWith(false));

    const select = document.createElement('select');
    document.body.appendChild(select);
    fireEvent.keyDown(select, { key: 'F' });
    const input = document.createElement('input');
    document.body.appendChild(input);
    fireEvent.keyDown(input, { key: 'f' });
    select.remove();
    input.remove();
  });

  it('handles visibility, empty text, and post-unmount RAF', async () => {
    const ref = createRef<DisplayStageHandle>();
    const { unmount, rerender } = render(
      <DisplayStage ref={ref} config={{ ...DEFAULT_CONFIG, text: '' }} />,
    );
    await waitFor(() => expect(syncConfig).toHaveBeenCalled());
    expect(screen.getByLabelText('Matrix LED canvas')).toBeInTheDocument();

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'hidden',
    });
    fireEvent(document, new Event('visibilitychange'));
    await new Promise((r) => requestAnimationFrame(() => r(null)));

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'visible',
    });

    rerender(
      <DisplayStage ref={ref} config={{ ...DEFAULT_CONFIG, text: 'Ok' }} />,
    );

    unmount();
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    await new Promise((r) => requestAnimationFrame(() => r(null)));
  });
});
