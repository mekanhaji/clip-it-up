import { cn } from "@/lib/utils";

export const Textarea = (
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    compact?: boolean;
    // Called when Ctrl+Enter or Cmd+Enter is pressed
    onSubmit?: () => void;
  },
) => {
  const { compact = false, onSubmit, ...rest } = props;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onSubmit?.();
    }
    rest.onKeyDown?.(e);
  };

  return (
    <textarea
      className={cn(
        "font-mono-ui w-full resize-none border-0 border-b border-[var(--border)] bg-transparent px-0 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--foreground)] focus:outline-none",
        compact ? "py-2 text-xs" : "py-3 text-sm",
      )}
      onKeyDown={handleKeyDown}
      {...rest}
    />
  );
};
