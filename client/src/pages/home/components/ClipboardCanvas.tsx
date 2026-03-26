import type { ClipboardEntry } from "@/pages/home/types";

interface ClipboardCanvasProps {
  entries: ClipboardEntry[];
}

export const ClipboardCanvas = ({ entries }: ClipboardCanvasProps) => {
  if (!entries.length) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 text-center">
        <h2 className="text-5xl font-light lowercase text-[var(--foreground)] sm:text-7xl">
          the desk is clear
        </h2>
        <p className="font-mono-ui mt-4 text-xs tracking-[0.08em] text-[var(--muted-foreground)]">
          paste your first clip to synchronize this room.
        </p>
      </div>
    );
  }

  return (
    <section className="mx-auto w-full max-w-4xl flex-1 px-6 pb-52 pt-28 sm:px-8">
      <div className="space-y-3">
        {entries.map((entry) => (
          <article
            key={entry.id}
            className="rounded border border-[var(--border)] bg-[var(--card)] px-4 py-3 transition-colors hover:border-[var(--muted-foreground)]"
          >
            <p className="text-sm leading-6 text-[var(--foreground)] whitespace-pre-wrap break-words">
              {entry.content}
            </p>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-mono-ui text-[10px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
                {entry.source}
              </span>
              <span className="font-mono-ui text-[10px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
                {new Date(entry.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
