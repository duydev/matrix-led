import { DisplayStage } from './ui/DisplayStage';
import { TextInput } from './ui/TextInput';
import { useDisplayConfig } from './state/useDisplayConfig';

export default function App() {
  const { config, setText, charCount, maxTextLength } = useDisplayConfig();

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

      <DisplayStage text={config.text} />

      <TextInput
        value={config.text}
        maxLength={maxTextLength}
        onChange={setText}
      />
    </div>
  );
}
