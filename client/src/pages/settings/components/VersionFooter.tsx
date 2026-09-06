import {
  APP_BUILD_TIME,
  APP_COMMIT,
  APP_VERSION,
  IS_DEV_BUILD,
  REPO_URL,
} from "@/lib/version";

const formatBuildTime = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const VersionFooter = () => (
  <footer className="mt-16 border-t border-[var(--border)] pt-6 text-center">
    <p className="font-mono-ui text-[11px] tracking-[0.08em] text-[var(--foreground)]">
      clipitup v{APP_VERSION}
      {APP_COMMIT && (
        <span className="text-[var(--muted-foreground)]"> · {APP_COMMIT}</span>
      )}
      {IS_DEV_BUILD && (
        <span className="text-[var(--muted-foreground)]"> · dev</span>
      )}
    </p>
    <p className="font-mono-ui mt-1.5 text-[10px] tracking-[0.06em] text-[var(--muted-foreground)]">
      built {formatBuildTime(APP_BUILD_TIME)}
    </p>
    <a
      href={REPO_URL}
      target="_blank"
      rel="noreferrer"
      className="ink-link font-mono-ui mt-3 inline-block text-[10px] lowercase tracking-[0.06em] text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
    >
      source on github
    </a>
  </footer>
);
