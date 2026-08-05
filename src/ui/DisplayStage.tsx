import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { createPortal } from 'react-dom';
import type { DisplayConfig } from '../state/types';
import { MATRIX_SIZES } from '../state/types';
import { DisplayEngine } from '../engine/loop';
import {
  applyVisualViewportSize,
  clearVisualViewportSize,
  exitDisplayFullscreen,
  lockPageScroll,
  requestDisplayFullscreen,
  unlockPageScroll,
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
    const slotRef = useRef<HTMLDivElement>(null);
    const rootRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const configRef = useRef(config);
    const engineRef = useRef<DisplayEngine | null>(null);
    const fsModeRef = useRef<FullscreenMode>('none');
    const [fsActive, setFsActive] = useState(false);
    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
    configRef.current = config;

    const size = MATRIX_SIZES[config.matrixSizeId];

    useLayoutEffect(() => {
      setPortalTarget(fsActive ? document.body : slotRef.current);
    }, [fsActive]);

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
      if (mode === 'pseudo') {
        lockPageScroll();
      }
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

    useLayoutEffect(() => {
      const el = rootRef.current;
      if (!el) return;
      if (fsActive && fsModeRef.current === 'pseudo') {
        el.classList.add('is-pseudo-fullscreen');
        applyVisualViewportSize(el);
        lockPageScroll();
      } else if (!fsActive) {
        el.classList.remove('is-pseudo-fullscreen');
        clearVisualViewportSize(el);
      }
    }, [fsActive, portalTarget]);

    useLayoutEffect(() => {
      if (!fsActive || fsModeRef.current !== 'pseudo') return;
      const el = rootRef.current;
      /* v8 ignore next */
      if (!el) return;
      const sync = () => applyVisualViewportSize(el);
      sync();
      const vv = window.visualViewport;
      /* v8 ignore next 2 */
      vv?.addEventListener('resize', sync);
      vv?.addEventListener('scroll', sync);
      window.addEventListener('resize', sync);
      window.addEventListener('orientationchange', sync);
      return () => {
        /* v8 ignore next 2 */
        vv?.removeEventListener('resize', sync);
        vv?.removeEventListener('scroll', sync);
        window.removeEventListener('resize', sync);
        window.removeEventListener('orientationchange', sync);
      };
    }, [fsActive, portalTarget]);

    useEffect(() => {
      const onFsChange = () => {
        if (!document.fullscreenElement && fsModeRef.current === 'native') {
          unlockPageScroll();
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
      if (!canvas || !portalTarget) return;

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
    }, [portalTarget]);

    useEffect(() => {
      void engineRef.current?.syncConfig(config);
    }, [
      config.text,
      config.effectId,
      config.matrixSizeId,
      config.direction,
      config.fontId,
    ]);

    const lastTapRef = useRef(0);
    const exitViaDoubleActivate = useCallback(() => {
      /* v8 ignore next */
      if (fsModeRef.current === 'none') return;
      void toggleFullscreen();
    }, [toggleFullscreen]);

    const onStagePointerUp = useCallback(
      (e: ReactPointerEvent) => {
        if (fsModeRef.current === 'none') return;
        // Mouse uses native dblclick; touch/pen use double-tap.
        /* v8 ignore next — RTL PointerEventInit often omits pointerType */
        if (e.pointerType === 'mouse') return;
        const now = performance.now();
        if (now - lastTapRef.current < 320) {
          lastTapRef.current = 0;
          exitViaDoubleActivate();
          return;
        }
        lastTapRef.current = now;
      },
      [exitViaDoubleActivate],
    );

    const stageClass = [
      'display-stage',
      fsActive ? 'is-fullscreen-active' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const stage = (
      <section
        ref={rootRef}
        className={stageClass}
        data-testid="display-stage"
        aria-label="Màn hình Matrix LED"
        onDoubleClick={exitViaDoubleActivate}
        onPointerUp={onStagePointerUp}
      >
        <div className="display-stage__viewport">
          <div
            className="display-stage__bezel"
            style={
              fsActive
                ? undefined
                : { aspectRatio: `${size.cols} / ${size.rows}` }
            }
          >
            <canvas
              ref={canvasRef}
              className="display-stage__canvas"
              aria-label={config.text || 'Matrix LED canvas'}
            />
          </div>
        </div>
      </section>
    );

    return (
      <>
        <div
          ref={slotRef}
          className="display-stage-slot"
          style={
            fsActive
              ? { minHeight: 160, borderRadius: 10, background: '#101014' }
              : undefined
          }
          aria-hidden={fsActive || undefined}
        />
        {portalTarget ? createPortal(stage, portalTarget) : null}
      </>
    );
  },
);
