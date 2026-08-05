import { PRESET_COLORS } from '../state/defaults';
import type {
  Direction,
  DisplayConfig,
  MatrixSizeId,
  PresetId,
} from '../state/types';

type StyleControlsProps = {
  config: DisplayConfig;
  onPatch: (partial: Partial<DisplayConfig>) => void;
};

const PRESET_LABELS: Record<PresetId, string> = {
  classic_red: 'Đỏ',
  amber: 'Hổ phách',
  cyan: 'Cyan',
  lime: 'Lime',
  rainbow: 'Rainbow',
  custom: 'Custom',
};

const DIRECTION_LABELS: Record<Direction, string> = {
  rtl: 'Phải → trái',
  ltr: 'Trái → phải',
  ttb: 'Trên → dưới',
  btt: 'Dưới → trên',
};

export function StyleControls({ config, onPatch }: StyleControlsProps) {
  return (
    <div className="panel style-controls">
      <div className="field-label">
        <span>Style</span>
      </div>
      <div className="preset-row" role="group" aria-label="Preset màu">
        {(Object.keys(PRESET_LABELS) as PresetId[]).map((id) => (
          <button
            key={id}
            type="button"
            className={`chip${config.presetId === id ? ' is-active' : ''}`}
            onClick={() => {
              if (id === 'custom') {
                onPatch({ presetId: 'custom' });
                return;
              }
              if (id === 'rainbow') {
                onPatch({ presetId: 'rainbow' });
                return;
              }
              onPatch({ presetId: id, color: PRESET_COLORS[id] });
            }}
          >
            {PRESET_LABELS[id]}
          </button>
        ))}
      </div>

      <label className="field-label" htmlFor="color-picker">
        <span>Màu tùy chỉnh</span>
      </label>
      <div className="color-row">
        <input
          id="color-picker"
          type="color"
          value={config.color}
          onChange={(e) =>
            onPatch({ color: e.target.value, presetId: 'custom' })
          }
          aria-label="Chọn màu LED"
        />
        <input
          className="text-input text-input--inline"
          value={config.color}
          onChange={(e) =>
            onPatch({ color: e.target.value, presetId: 'custom' })
          }
          aria-label="Mã màu HEX"
        />
      </div>

      <label className="field-label" htmlFor="direction-select">
        <span>Hướng</span>
      </label>
      <select
        id="direction-select"
        className="select"
        value={config.direction}
        onChange={(e) => onPatch({ direction: e.target.value as Direction })}
      >
        {(Object.keys(DIRECTION_LABELS) as Direction[]).map((d) => (
          <option key={d} value={d}>
            {DIRECTION_LABELS[d]}
          </option>
        ))}
      </select>

      <label className="field-label" htmlFor="size-select">
        <span>Kích thước matrix</span>
      </label>
      <select
        id="size-select"
        className="select"
        value={config.matrixSizeId}
        onChange={(e) =>
          onPatch({ matrixSizeId: e.target.value as MatrixSizeId })
        }
      >
        <option value="32x8">32×8</option>
        <option value="64x16">64×16</option>
        <option value="96x16">96×16</option>
      </select>

      <label className="check-row">
        <input
          type="checkbox"
          checked={config.glow}
          onChange={(e) => onPatch({ glow: e.target.checked })}
        />
        <span>Ánh sáng LED</span>
      </label>
    </div>
  );
}
