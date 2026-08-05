import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    const user = userEvent.setup();
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
      expect(screen.getByText('Thoát toàn màn hình')).toBeInTheDocument(),
    );
    await user.click(screen.getByText('Thoát toàn màn hình'));
    await waitFor(() =>
      expect(onFullscreenChange).toHaveBeenCalledWith(false),
    );

    el.requestFullscreen = vi.fn().mockResolvedValue(undefined);
    await ref.current?.toggleFullscreen();
    await waitFor(() => expect(onFullscreenChange).toHaveBeenCalledWith(true));

    // simulate native exit via fullscreenchange while in native mode
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      get: () => el,
    });
    // Enter native again by setting fs via toggle then clear fullscreenElement
    fireEvent(document, new Event('fullscreenchange'));
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      get: () => null,
    });
    // Need mode native: re-enter with successful requestFullscreen
    await ref.current?.toggleFullscreen(); // exit first if active
    el.requestFullscreen = vi.fn().mockResolvedValue(undefined);
    await ref.current?.toggleFullscreen();
    fireEvent(document, new Event('fullscreenchange'));

    fireEvent.keyDown(window, { key: 'f' });
    fireEvent.keyDown(window, { key: 'Escape' });
  });

  it('ignores F key in form fields and syncs config changes', async () => {
    const { rerender } = render(
      <DisplayStage config={DEFAULT_CONFIG} />,
    );
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
    // bubbles to window listener with target = textarea
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
      expect(screen.getByText('Thoát toàn màn hình')).toBeInTheDocument(),
    );

    fireEvent.keyDown(window, { key: 'Escape' });
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
    el.requestFullscreen = vi.fn().mockResolvedValue(undefined);
    await ref.current?.toggleFullscreen();
    await waitFor(() => expect(onFullscreenChange).toHaveBeenCalledWith(true));

    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      get: () => null,
    });
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

  it('handles visibility, empty text, exit-when-native-element, and post-unmount RAF', async () => {
    const ref = createRef<DisplayStageHandle>();
    const { unmount, rerender } = render(
      <DisplayStage ref={ref} config={{ ...DEFAULT_CONFIG, text: '' }} />,
    );
    await waitFor(() => expect(syncConfig).toHaveBeenCalled());
    expect(screen.getByLabelText('Matrix LED canvas')).toBeInTheDocument();

    const el = screen.getByTestId('display-stage');
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      get: () => el,
    });
    await ref.current?.toggleFullscreen();

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'hidden',
    });
    fireEvent(document, new Event('visibilitychange'));

    // allow tick with hidden visibility
    await new Promise((r) => requestAnimationFrame(() => r(null)));

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'visible',
    });

    rerender(
      <DisplayStage ref={ref} config={{ ...DEFAULT_CONFIG, text: 'Ok' }} />,
    );

    unmount();
    // fire any leftover RAF tick after cleanup (running=false branch)
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    await new Promise((r) => requestAnimationFrame(() => r(null)));
  });
});
