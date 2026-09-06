import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  compact?: boolean;
  className?: string;
}

export const Composer = ({
  value,
  onChange,
  onSubmit,
  placeholder = "type or paste something to clip...",
  compact = false,
  className,
}: ComposerProps) => {
  return (
    <div className={cn("w-full", className)}>
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onSubmit={onSubmit}
        placeholder={placeholder}
        compact={compact}
        rows={1}
        autoGrow
      />

      <p className="font-mono-ui mt-2 hidden text-[10px] lowercase tracking-[0.08em] text-[var(--muted-foreground)] sm:block">
        cmd / ctrl + enter to send
      </p>
    </div>
  );
};
