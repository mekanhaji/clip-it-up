import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface SegmentedOption<T extends string | number> {
  value: T;
  label: string;
  icon?: ReactNode;
  title?: string;
}

interface SegmentedProps<T extends string | number> {
  value: T;
  options: readonly SegmentedOption<T>[];
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
}

/** A small radio-group rendered as joined buttons. */
export const Segmented = <T extends string | number>({
  value,
  options,
  onChange,
  ariaLabel,
  className,
}: SegmentedProps<T>) => (
  <div
    role="radiogroup"
    aria-label={ariaLabel}
    className={cn(
      "inline-flex max-w-full flex-wrap gap-0.5 rounded border border-[var(--border)] bg-[var(--background)] p-0.5",
      className,
    )}
  >
    {options.map((option) => {
      const active = option.value === value;
      return (
        <button
          key={String(option.value)}
          type="button"
          role="radio"
          aria-checked={active}
          title={option.title}
          onClick={() => onChange(option.value)}
          className={cn(
            "font-mono-ui inline-flex h-8 items-center gap-1.5 rounded px-3 text-[11px] lowercase tracking-[0.08em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
            active
              ? "bg-[var(--foreground)] text-[var(--background)]"
              : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]",
          )}
        >
          {option.icon}
          {option.label}
        </button>
      );
    })}
  </div>
);
