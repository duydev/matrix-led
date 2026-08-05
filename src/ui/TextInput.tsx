type TextInputProps = {
  value: string;
  maxLength: number;
  onChange: (value: string) => void;
};

export function TextInput({ value, maxLength, onChange }: TextInputProps) {
  const count = value.length;
  const nearLimit = count >= maxLength;

  return (
    <div className="panel">
      <label className="field-label" htmlFor="text-input">
        <span>Nội dung</span>
        <span className={nearLimit ? 'is-over' : undefined}>
          {count}/{maxLength}
        </span>
      </label>
      <textarea
        id="text-input"
        className="text-input"
        data-testid="text-input"
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Nhập nội dung hiển thị trên LED..."
        rows={4}
      />
    </div>
  );
}
