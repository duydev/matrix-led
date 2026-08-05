import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

vi.mock('./ui/DisplayStage', async () => {
  const React = await import('react');
  return {
    DisplayStage: React.forwardRef(function MockStage(
      props: { onFullscreenChange?: (v: boolean) => void },
      ref,
    ) {
      React.useImperativeHandle(ref, () => ({
        resetAnimation: vi.fn(),
        toggleFullscreen: async () => props.onFullscreenChange?.(true),
      }));
      return <div data-testid="display-stage" />;
    }),
  };
});

describe('App', () => {
  it('renders Vietnamese chrome and wires controls', async () => {
    localStorage.clear();
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByText('Matrix LED')).toBeInTheDocument();
    expect(screen.getByText('Giả lập bảng chạy chữ')).toBeInTheDocument();
    expect(screen.getByTestId('app-footer')).toBeInTheDocument();
    expect(screen.getByTestId('app-version')).toHaveTextContent(/^v/);
    expect(screen.getByTestId('app-author-email')).toHaveTextContent(
      'Trần Nhật Duy',
    );
    await user.click(screen.getByTestId('fullscreen-btn'));
    expect(screen.getByTestId('fullscreen-btn')).toHaveTextContent(
      'Thoát toàn màn hình',
    );
    await user.click(screen.getByTestId('play-pause'));
    await user.click(screen.getByText('Đặt lại'));
    await user.selectOptions(screen.getByTestId('effect-select'), 'static');
    expect(screen.getByTestId('effect-select')).toHaveValue('static');

    const { fireEvent } = await import('@testing-library/react');
    fireEvent.change(screen.getByTestId('speed-slider'), {
      target: { value: '1.5' },
    });
    fireEvent.change(document.getElementById('brightness-slider')!, {
      target: { value: '0.4' },
    });
    fireEvent.change(screen.getByTestId('text-input'), {
      target: { value: 'QC coverage' },
    });
    await user.click(screen.getByRole('button', { name: 'Hổ phách' }));
    expect(screen.getByTestId('text-input')).toHaveValue('QC coverage');
  });
});
