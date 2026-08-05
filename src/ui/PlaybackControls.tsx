import { SPEED_MAX, SPEED_MIN } from '../state/types';

type PlaybackControlsProps = {
  playing: boolean;
  speed: number;
  brightness: number;
  onTogglePlay: () => void;
  onSpeedChange: (speed: number) => void;
  onBrightnessChange: (brightness: number) => void;
  onReset: () => void;
  onFullscreen: () => void;
  fullscreenActive: boolean;
};

export function PlaybackControls({
  playing,
  speed,
  brightness,
  onTogglePlay,
  onSpeedChange,
  onBrightnessChange,
  onReset,
  onFullscreen,
  fullscreenActive,
}: PlaybackControlsProps) {
  return (
    <div className="panel playback">
      <div className="playback__row">
        <button
          type="button"
          className="btn"
          data-testid="play-pause"
          onClick={onTogglePlay}
        >
          {playing ? 'Tạm dừng' : 'Chạy'}
        </button>
        <button type="button" className="btn" onClick={onReset}>
          Đặt lại
        </button>
        <button
          type="button"
          className="btn"
          data-testid="fullscreen-btn"
          onClick={onFullscreen}
        >
          {fullscreenActive ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
        </button>
      </div>

      <label className="field-label" htmlFor="speed-slider">
        <span>Tốc độ</span>
        <span>{speed.toFixed(2)}×</span>
      </label>
      <input
        id="speed-slider"
        data-testid="speed-slider"
        type="range"
        min={SPEED_MIN}
        max={SPEED_MAX}
        step={0.05}
        value={speed}
        onChange={(e) => onSpeedChange(Number(e.target.value))}
        aria-valuetext={`${speed.toFixed(2)} lần`}
      />

      <label className="field-label" htmlFor="brightness-slider">
        <span>Độ sáng</span>
        <span>{Math.round(brightness * 100)}%</span>
      </label>
      <input
        id="brightness-slider"
        type="range"
        min={0.1}
        max={1}
        step={0.05}
        value={brightness}
        onChange={(e) => onBrightnessChange(Number(e.target.value))}
        aria-valuetext={`${Math.round(brightness * 100)} phần trăm`}
      />
    </div>
  );
}
