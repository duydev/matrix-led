import { useEffect, useRef } from 'react';
import type { DisplayConfig } from '../state/types';
import { DisplayEngine } from '../engine/loop';

type DisplayStageProps = {
  config: DisplayConfig;
};

export function DisplayStage({ config }: DisplayStageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const configRef = useRef(config);
  const engineRef = useRef<DisplayEngine | null>(null);
  configRef.current = config;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new DisplayEngine(canvas);
    engineRef.current = engine;

    let raf = 0;
    let running = true;

    const tick = (now: number) => {
      if (!running) return;
      engine.frame(now, configRef.current);
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
      className="display-stage"
      data-testid="display-stage"
      aria-label="Màn hình Matrix LED"
    >
      <div className="display-stage__bezel">
        <canvas
          ref={canvasRef}
          className="display-stage__canvas"
          aria-label={config.text || 'Matrix LED canvas'}
        />
      </div>
    </section>
  );
}
