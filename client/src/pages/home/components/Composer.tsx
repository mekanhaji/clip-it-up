interface ComposerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  compact?: boolean;
}

export const Composer = ({
  value,
  onChange,
  placeholder = "type or paste something to clip...",
  compact = false,
}: ComposerProps) => {
  return (
    <div className="w-full">
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="font-mono-ui w-full resize-none border-0 border-b border-[var(--border)] bg-transparent px-0 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--foreground)] focus:outline-none"
        rows={compact ? 2 : 4}
      />
    </div>
  );
};
