import type { EffectId } from '../../state/types';
import { marqueeFactory } from './marquee';
import { staticFactory } from './static';
import { fadeFactory } from './fade';
import { blinkFactory } from './blink';
import { typewriterFactory } from './typewriter';
import { shiftInFactory } from './shiftIn';
import type { Effect, EffectFactory } from './types';

const registry: Partial<Record<EffectId, EffectFactory>> = {
  marquee: marqueeFactory,
  static: staticFactory,
  fade_in_out: fadeFactory,
  blink: blinkFactory,
  typewriter: typewriterFactory,
  shift_in: shiftInFactory,
};

const ORDER: EffectId[] = [
  'marquee',
  'static',
  'fade_in_out',
  'blink',
  'typewriter',
  'shift_in',
];

export function createEffect(id: EffectId): Effect {
  // marquee is always registered — unknown ids fall back to it
  return (registry[id] ?? registry.marquee!)();
}

export function listRegisteredEffects(): { id: EffectId; label: string }[] {
  return ORDER.filter((id) => registry[id]).map((id) => {
    const effect = createEffect(id);
    return { id, label: effect.label };
  });
}
