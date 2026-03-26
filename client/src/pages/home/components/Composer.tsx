import { cn } from "@/lib/utils";

interface ComposerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  compact?: boolean;
  className?: string;
}

export const Composer = ({
  value,
  onChange,
  placeholder = "type or paste something to clip...",
  compact = false,
  className,
}: ComposerProps) => {
  return (
    <div className={cn("w-full", className)}>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(
          "font-mono-ui w-full resize-none border-0 border-b border-[var(--border)] bg-transparent px-0 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--foreground)] focus:outline-none",
          compact ? "py-2 text-xs" : "py-3 text-sm",
        )}
        rows={1}
      />
    </div>
  );
};
