import type { EffectId } from '../../state/types';
import { marqueeFactory } from './marquee';
import type { Effect, EffectFactory } from './types';

const registry: Partial<Record<EffectId, EffectFactory>> = {
  marquee: marqueeFactory,
};

export function createEffect(id: EffectId): Effect {
  const factory = registry[id] ?? registry.marquee;
  if (!factory) {
    throw new Error(`Unknown effect: ${id}`);
  }
  return factory();
}

export function listRegisteredEffects(): { id: EffectId; label: string }[] {
  return (Object.keys(registry) as EffectId[]).map((id) => {
    const effect = createEffect(id);
    return { id, label: effect.label };
  });
}
