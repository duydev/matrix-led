import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type { DisplayConfig } from '../state/types';
import { MATRIX_SIZES } from '../state/types';
import { DisplayEngine } from '../engine/loop';
import {
  exitDisplayFullscreen,
  requestDisplayFullscreen,
  type FullscreenMode,
} from '../utils/fullscreen';

export type DisplayStageHandle = {
  resetAnimation: () => void;
  toggleFullscreen: () => Promise<void>;
};

type DisplayStageProps = {
  config: DisplayConfig;
  onFullscreenChange?: (active: boolean) => void;
};

export const DisplayStage = forwardRef<DisplayStageHandle, DisplayStageProps>(
  function DisplayStage({ config, onFullscreenChange }, ref) {
    const rootRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const configRef = useRef(config);
    const engineRef = useRef<DisplayEngine | null>(null);
    const fsModeRef = useRef<FullscreenMode>('none');
    const [fsActive, setFsActive] = useState(false);
    configRef.current = config;

    const size = MATRIX_SIZES[config.matrixSizeId];

    const setFullscreenState = useCallback(
      (active: boolean, mode: FullscreenMode = 'none') => {
        fsModeRef.current = mode;
        setFsActive(active);
        onFullscreenChange?.(active);
      },
      [onFullscreenChange],
    );

    const toggleFullscreen = useCallback(async () => {
      const el = rootRef.current;
      /* v8 ignore next */
      if (!el) return;
      if (fsModeRef.current !== 'none' || document.fullscreenElement === el) {
        await exitDisplayFullscreen(el, fsModeRef.current);
        setFullscreenState(false, 'none');
        return;
      }
      const mode = await requestDisplayFullscreen(el);
      setFullscreenState(true, mode);
    }, [setFullscreenState]);

    useImperativeHandle(
      ref,
      () => ({
        resetAnimation: () => {
          void engineRef.current?.reset(configRef.current);
        },
        toggleFullscreen,
      }),
      [toggleFullscreen],
    );

    useEffect(() => {
      const onFsChange = () => {
        if (!document.fullscreenElement && fsModeRef.current === 'native') {
          rootRef.current?.classList.remove('is-pseudo-fullscreen');
          setFullscreenState(false, 'none');
        }
      };
      document.addEventListener('fullscreenchange', onFsChange);
      return () => document.removeEventListener('fullscreenchange', onFsChange);
    }, [setFullscreenState]);

    useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && fsModeRef.current === 'pseudo') {
          const el = rootRef.current;
          /* v8 ignore next */
          if (!el) return;
          void exitDisplayFullscreen(el, 'pseudo').then(() => {
            setFullscreenState(false, 'none');
          });
        }
        if (e.key === 'f' || e.key === 'F') {
          const tag = (e.target as HTMLElement | null)?.tagName;
          if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
          void toggleFullscreen();
        }
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, [setFullscreenState, toggleFullscreen]);

    useEffect(() => {
      const canvas = canvasRef.current;
      /* v8 ignore next */
      if (!canvas) return;

      const engine = new DisplayEngine(canvas);
      engineRef.current = engine;

      let raf = 0;
      let running = true;

      const tick = (now: number) => {
        /* v8 ignore next */
        if (!running) return;
        const base = configRef.current;
        const visible = document.visibilityState === 'visible';
        engine.frame(now, {
          ...base,
          playing: base.playing && visible,
        });
        raf = requestAnimationFrame(tick);
      };

      void engine.syncConfig(configRef.current, true).then(() => {
        if (running) raf = requestAnimationFrame(tick);
      });

      return () => {
        running = false;
        cancelAnimationFrame(raf);
        engine.dispose();
        engineRef.current = null;
      };
    }, []);

    useEffect(() => {
      void engineRef.current?.syncConfig(config);
    }, [
      config.text,
      config.effectId,
      config.matrixSizeId,
      config.direction,
    ]);

    return (
      <section
        ref={rootRef}
        className={`display-stage${fsActive ? ' is-fullscreen-active' : ''}`}
        data-testid="display-stage"
        aria-label="Màn hình Matrix LED"
      >
        <div
          className="display-stage__bezel"
          style={{ aspectRatio: `${size.cols} / ${size.rows}` }}
        >
          <canvas
            ref={canvasRef}
            className="display-stage__canvas"
            aria-label={config.text || 'Matrix LED canvas'}
          />
        </div>
        {fsActive ? (
          <button
            type="button"
            className="btn display-stage__exit"
            onClick={() => {
              void toggleFullscreen();
            }}
          >
            Thoát toàn màn hình
          </button>
        ) : null}
      </section>
    );
  },
);
