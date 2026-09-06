import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type StatusTone = "ok" | "warn" | "bad" | "muted";

const dotClass: Record<StatusTone, string> = {
  ok: "bg-emerald-500",
  warn: "bg-amber-500",
  bad: "bg-[var(--destructive)]",
  muted: "bg-[var(--muted-foreground)]",
};

interface StatusBadgeProps {
  tone: StatusTone;
  children: ReactNode;
}

export const StatusBadge = ({ tone, children }: StatusBadgeProps) => (
  <span className="font-mono-ui inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-[10px] lowercase tracking-[0.06em] text-[var(--muted-foreground)]">
    <span aria-hidden className={cn("h-2 w-2 rounded-full", dotClass[tone])} />
    {children}
  </span>
);
