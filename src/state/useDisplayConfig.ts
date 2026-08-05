import { useCallback, useEffect, useMemo, useState } from 'react';
import { loadConfig, saveConfig, clampText, validateConfig } from './persist';
import type { DisplayConfig } from './types';
import { MAX_TEXT_LENGTH } from './types';

const SAVE_DEBOUNCE_MS = 300;

export function useDisplayConfig() {
  const [config, setConfig] = useState<DisplayConfig>(() => loadConfig());

  useEffect(() => {
    const id = window.setTimeout(() => saveConfig(config), SAVE_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [config]);

  const patch = useCallback((partial: Partial<DisplayConfig>) => {
    setConfig((prev) => validateConfig({ ...prev, ...partial }));
  }, []);

  const setText = useCallback((text: string) => {
    patch({ text: clampText(text) });
  }, [patch]);

  const charCount = useMemo(() => config.text.length, [config.text]);

  return {
    config,
    patch,
    setText,
    charCount,
    maxTextLength: MAX_TEXT_LENGTH,
  };
}
