import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextInput } from './TextInput';
import { EffectSelect } from './EffectSelect';
import { PlaybackControls } from './PlaybackControls';
import { StyleControls } from './StyleControls';
import { DEFAULT_CONFIG } from '../state/defaults';

describe('UI controls', () => {
  it('TextInput updates and flags near limit', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <TextInput value={'a'.repeat(199)} maxLength={200} onChange={onChange} />,
    );
    expect(screen.getByText('199/200')).toBeInTheDocument();
    await user.type(screen.getByTestId('text-input'), 'x');
    expect(onChange).toHaveBeenCalled();
    rerender(
      <TextInput value={'a'.repeat(200)} maxLength={200} onChange={onChange} />,
    );
    expect(screen.getByText('200/200').className).toContain('is-over');
  });

  it('EffectSelect changes effect', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<EffectSelect value="marquee" onChange={onChange} />);
    await user.selectOptions(screen.getByTestId('effect-select'), 'blink');
    expect(onChange).toHaveBeenCalledWith('blink');
  });

  it('PlaybackControls fires actions', async () => {
    const user = userEvent.setup();
    const props = {
      playing: true,
      speed: 1,
      brightness: 0.8,
      onTogglePlay: vi.fn(),
      onSpeedChange: vi.fn(),
      onBrightnessChange: vi.fn(),
      onReset: vi.fn(),
      onFullscreen: vi.fn(),
      fullscreenActive: false,
    };
    const { rerender } = render(<PlaybackControls {...props} />);
    await user.click(screen.getByTestId('play-pause'));
    await user.click(screen.getByText('Đặt lại'));
    await user.click(screen.getByTestId('fullscreen-btn'));
    fireEvent.change(screen.getByTestId('speed-slider'), {
      target: { value: '2' },
    });
    fireEvent.change(document.getElementById('brightness-slider')!, {
      target: { value: '0.5' },
    });
    expect(props.onTogglePlay).toHaveBeenCalled();
    expect(props.onReset).toHaveBeenCalled();
    expect(props.onFullscreen).toHaveBeenCalled();
    expect(props.onSpeedChange).toHaveBeenCalledWith(2);
    expect(props.onBrightnessChange).toHaveBeenCalledWith(0.5);

    rerender(<PlaybackControls {...props} playing={false} fullscreenActive />);
    expect(screen.getByTestId('play-pause')).toHaveTextContent('Chạy');
    expect(screen.getByTestId('fullscreen-btn')).toHaveTextContent(
      'Thoát toàn màn hình',
    );
  });

  it('StyleControls patches presets and fields', async () => {
    const user = userEvent.setup();
    const onPatch = vi.fn();
    const { rerender } = render(
      <StyleControls config={DEFAULT_CONFIG} onPatch={onPatch} />,
    );
    const panel = screen.getByText('Style').closest('.panel')!;
    await user.click(within(panel).getByRole('button', { name: 'Hổ phách' }));
    await user.click(within(panel).getByRole('button', { name: 'Rainbow' }));
    await user.click(within(panel).getByRole('button', { name: 'Custom' }));
    fireEvent.change(screen.getByLabelText('Chọn màu LED'), {
      target: { value: '#00ff00' },
    });
    fireEvent.change(screen.getByLabelText('Mã màu HEX'), {
      target: { value: '#abcdef' },
    });
    await user.selectOptions(screen.getByLabelText('Hướng'), 'ltr');
    await user.selectOptions(screen.getByLabelText('Kích thước matrix'), '256x64');
    await user.selectOptions(screen.getByTestId('font-select'), 'ibm_plex_mono');
    expect(onPatch).toHaveBeenCalledWith({ fontId: 'ibm_plex_mono' });
    rerender(
      <StyleControls
        config={{ ...DEFAULT_CONFIG, fontId: 'silkscreen' }}
        onPatch={onPatch}
      />,
    );
    expect(screen.getByText(/thiếu subset tiếng Việt/i)).toBeInTheDocument();
    await user.click(screen.getByLabelText('Ánh sáng LED'));
    expect(onPatch).toHaveBeenCalled();
  });
});
