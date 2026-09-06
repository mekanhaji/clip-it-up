import { cn } from "@/lib/utils";

interface ToggleProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Accessible name when no visible <label htmlFor> points at the toggle. */
  label?: string;
  disabled?: boolean;
}

export const Toggle = ({
  id,
  checked,
  onChange,
  label,
  disabled = false,
}: ToggleProps) => (
  <button
    id={id}
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={cn(
      "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)] disabled:cursor-not-allowed disabled:opacity-50",
      checked
        ? "border-[var(--foreground)] bg-[var(--foreground)]"
        : "border-[var(--border)] bg-[var(--background)]",
    )}
  >
    <span
      aria-hidden
      className={cn(
        "absolute left-0.5 h-[18px] w-[18px] rounded-full transition-transform duration-200",
        checked
          ? "translate-x-5 bg-[var(--background)]"
          : "translate-x-0 bg-[var(--muted-foreground)]",
      )}
    />
  </button>
);
