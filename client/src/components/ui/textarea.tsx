import { cn } from "@/lib/utils";
import { useLayoutEffect, useRef } from "react";

export const Textarea = (
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    compact?: boolean;
    // Grows with its content instead of scrolling inside a fixed height
    autoGrow?: boolean;
    // Called when Ctrl+Enter or Cmd+Enter is pressed
    onSubmit?: () => void;
  },
) => {
  const {
    compact = false,
    autoGrow = false,
    onSubmit,
    className,
    ...rest
  } = props;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const element = textareaRef.current;
    if (!element || !autoGrow) {
      return;
    }

    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }, [autoGrow, rest.value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onSubmit?.();
    }
    rest.onKeyDown?.(e);
  };

  return (
    <textarea
      {...rest}
      ref={textareaRef}
      className={cn(
        "font-mono-ui w-full resize-none border-0 border-b border-[var(--border)] bg-transparent px-0 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--foreground)] focus:outline-none",
        // 16px on small screens keeps iOS Safari from zooming the page on focus
        compact ? "py-2 text-sm sm:text-xs" : "py-3 text-base sm:text-sm",
        autoGrow && "max-h-40 overflow-y-auto",
        className,
      )}
      onKeyDown={handleKeyDown}
    />
  );
};
