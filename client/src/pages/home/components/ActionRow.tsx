import { cn } from "@/lib/utils";
import type { ActionDefinition } from "@/pages/home/types";

interface ActionRowProps {
  actions: ActionDefinition[];
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

export const ActionRow = ({ actions }: ActionRowProps) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
      {actions.map((action) => {
        const variant = action.variant ?? "secondary";
        return (
          <button
            type="button"
            key={action.key}
            onClick={action.onClick}
            disabled={action.disabled}
            className={cn(
              "rounded border px-6 py-2.5 font-mono-ui text-xs tracking-[0.08em] lowercase transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
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
