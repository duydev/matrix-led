import { useRef, useState } from 'react';
import { DisplayStage, type DisplayStageHandle } from './ui/DisplayStage';
import { TextInput } from './ui/TextInput';
import { PlaybackControls } from './ui/PlaybackControls';
import { EffectSelect } from './ui/EffectSelect';
import { StyleControls } from './ui/StyleControls';
import { AppFooter } from './ui/AppFooter';
import { useDisplayConfig } from './state/useDisplayConfig';

export default function App() {
  const { config, patch, setText, charCount, maxTextLength } = useDisplayConfig();
  const stageRef = useRef<DisplayStageHandle>(null);
  const [fullscreenActive, setFullscreenActive] = useState(false);

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1 className="app__title">Matrix LED</h1>
          <p className="app__subtitle">Giả lập bảng chạy chữ</p>
        </div>
      </header>

      <DisplayStage
        ref={stageRef}
        config={config}
        onFullscreenChange={setFullscreenActive}
      />

      <PlaybackControls
        playing={config.playing}
        speed={config.speed}
        brightness={config.brightness}
        fullscreenActive={fullscreenActive}
        onTogglePlay={() => patch({ playing: !config.playing })}
        onSpeedChange={(speed) => patch({ speed })}
        onBrightnessChange={(brightness) => patch({ brightness })}
        onReset={() => stageRef.current?.resetAnimation()}
        onFullscreen={() => void stageRef.current?.toggleFullscreen()}
      />

      <div className="controls-grid">
        <TextInput
          value={config.text}
          maxLength={maxTextLength}
          onChange={setText}
        />
        <EffectSelect
          value={config.effectId}
          onChange={(effectId) => patch({ effectId })}
        />
        <StyleControls config={config} onPatch={patch} />
      </div>

      <p className="hint" aria-live="polite">
        {charCount}/{maxTextLength} · Phím F: toàn màn hình
      </p>

      <AppFooter />
    </div>
  );
}
