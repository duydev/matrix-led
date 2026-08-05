type PlaybackControlsProps = {
  playing: boolean;
  speed: number;
  brightness: number;
  onTogglePlay: () => void;
  onSpeedChange: (speed: number) => void;
  onBrightnessChange: (brightness: number) => void;
};

export function PlaybackControls({
  playing,
  speed,
  brightness,
  onTogglePlay,
  onSpeedChange,
  onBrightnessChange,
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
      </div>

      <label className="field-label" htmlFor="speed-slider">
        <span>Tốc độ</span>
        <span>{speed.toFixed(2)}×</span>
      </label>
      <input
        id="speed-slider"
        data-testid="speed-slider"
        type="range"
        min={0.25}
        max={3}
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
