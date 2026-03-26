import { cn } from "@/lib/utils";
import type { ActionDefinition } from "@/pages/home/types";

interface ActionRowProps {
  actions: ActionDefinition[];
  compact?: boolean;
  className?: string;
}

const variantClasses: Record<
  NonNullable<ActionDefinition["variant"]>,
  string
> = {
  primary:
    "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)] hover:opacity-90",
  secondary:
    "border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--secondary)]",
  ghost:
    "border-transparent bg-transparent text-[var(--foreground)] hover:underline",
};

export const ActionRow = ({
  actions,
  compact = false,
  className,
}: ActionRowProps) => {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center",
        compact ? "gap-2 sm:gap-3" : "gap-3 sm:gap-4",
        className,
      )}
    >
      {actions.map((action) => {
        const variant = action.variant ?? "secondary";
        return (
          <button
            type="button"
            key={action.key}
            onClick={action.onClick}
            disabled={action.disabled}
            className={cn(
              "font-mono-ui rounded border lowercase tracking-[0.08em] transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
              variant === "ghost"
                ? compact
                  ? "h-8 px-2 text-[11px]"
                  : "h-9 px-3 text-xs"
                : compact
                  ? "h-8 min-w-[86px] px-3 text-[11px]"
                  : "h-9 min-w-[96px] px-5 text-xs",
              variantClasses[variant],
            )}
          >
            {action.label}
          </button>
        );
      })}
    </div>
  );
};
