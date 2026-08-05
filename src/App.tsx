import { DisplayStage } from './ui/DisplayStage';
import { TextInput } from './ui/TextInput';
import { PlaybackControls } from './ui/PlaybackControls';
import { useDisplayConfig } from './state/useDisplayConfig';

export default function App() {
  const { config, patch, setText, charCount, maxTextLength } = useDisplayConfig();

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1 className="app__title">Matrix LED</h1>
          <p className="app__subtitle">Giả lập bảng chạy chữ</p>
        </div>
        <span className="app__subtitle" aria-live="polite">
          {charCount}/{maxTextLength}
        </span>
      </header>

      <DisplayStage config={config} />

      <PlaybackControls
        playing={config.playing}
        speed={config.speed}
        brightness={config.brightness}
        onTogglePlay={() => patch({ playing: !config.playing })}
        onSpeedChange={(speed) => patch({ speed })}
        onBrightnessChange={(brightness) => patch({ brightness })}
      />

      <TextInput
        value={config.text}
        maxLength={maxTextLength}
        onChange={setText}
      />
    </div>
  );
}
