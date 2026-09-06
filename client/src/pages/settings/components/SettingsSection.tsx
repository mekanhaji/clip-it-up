import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export const SettingsSection = ({
  title,
  description,
  children,
}: SettingsSectionProps) => (
  <section className="space-y-4">
    <div>
      <h2 className="text-2xl font-light lowercase text-[var(--foreground)]">
        {title}
      </h2>
      {description && (
        <p className="font-mono-ui mt-1.5 text-[11px] tracking-[0.08em] text-[var(--muted-foreground)]">
          {description}
        </p>
      )}
    </div>
    <div className="paper-panel divide-y divide-[var(--border)]">{children}</div>
  </section>
);

interface SettingRowProps {
  label: string;
  description?: ReactNode;
  /** Id of the control this row labels; clicking the label focuses/toggles it. */
  htmlFor?: string;
  /** Put the control under the label instead of beside it. */
  stack?: boolean;
  children: ReactNode;
}

const labelClass = "block text-sm lowercase text-[var(--foreground)]";

export const SettingRow = ({
  label,
  description,
  htmlFor,
  stack = false,
  children,
}: SettingRowProps) => (
  <div
    className={cn(
      "flex gap-4 px-4 py-4 sm:px-5",
      stack
        ? "flex-col"
        : "flex-col sm:flex-row sm:items-center sm:justify-between",
    )}
  >
    <div className="min-w-0 flex-1">
      {htmlFor ? (
        <label htmlFor={htmlFor} className={labelClass}>
          {label}
        </label>
      ) : (
        <p className={labelClass}>{label}</p>
      )}
      {description && (
        <p className="font-mono-ui mt-1 text-[10px] leading-relaxed tracking-[0.06em] text-[var(--muted-foreground)]">
          {description}
        </p>
      )}
    </div>
    <div className={cn("shrink-0", stack && "w-full")}>{children}</div>
  </div>
);
