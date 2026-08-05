import type { EffectId } from '../state/types';
import { listRegisteredEffects } from '../engine/effects/registry';

type EffectSelectProps = {
  value: EffectId;
  onChange: (id: EffectId) => void;
};

export function EffectSelect({ value, onChange }: EffectSelectProps) {
  const options = listRegisteredEffects();

  return (
    <div className="panel">
      <label className="field-label" htmlFor="effect-select">
        <span>Hiệu ứng</span>
      </label>
      <select
        id="effect-select"
        className="select"
        data-testid="effect-select"
        value={value}
        onChange={(e) => onChange(e.target.value as EffectId)}
      >
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
