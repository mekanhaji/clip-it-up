import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/store/settings";

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
  const enterToSend = useSettingsStore((state) => state.enterToSend);

  return (
    <div className={cn("w-full", className)}>
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onSubmit={onSubmit}
        submitOnEnter={enterToSend}
        placeholder={placeholder}
        compact={compact}
        rows={1}
        autoGrow
      />

      <p className="font-mono-ui mt-2 hidden text-[10px] lowercase tracking-[0.08em] text-[var(--muted-foreground)] sm:block">
        {enterToSend
          ? "enter to send · shift + enter for a new line"
          : "cmd / ctrl + enter to send"}
      </p>
    </div>
  );
};
