import type { ClipboardEntry } from "@/pages/home/types";
import { toast } from "@/components/ui/use-toast";
import { useClipboardStore } from "@/store/clipboard";
import { Copy, Pin, Trash2 } from "lucide-react";
import { useMemo } from "react";

interface ClipboardCanvasProps {
  entries: ClipboardEntry[];
}

interface ClipCanvasItemProps {
  entry: ClipboardEntry;
  onCopy: (entry: ClipboardEntry) => void;
  onDelete: (entry: ClipboardEntry) => void;
  onPin: (entry: ClipboardEntry) => void;
}

const ClipCanvas = ({
  entry,
  onCopy,
  onDelete,
  onPin,
}: ClipCanvasItemProps) => {
  const sourceLabel = entry.source === "local" ? "text/local" : "text/remote";
  const isLongEntry = entry.content.length > 180;
  const widthClass = isLongEntry
    ? "md:flex-[2_1_32rem]"
    : "md:flex-[1_1_20rem]";
  const timestamp = new Date(entry.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <article
      className={`group h-fit min-w-[16rem] flex-[1_1_16rem] ${widthClass} rounded border border-[color:color-mix(in_srgb,var(--muted-foreground)_15%,transparent)] bg-[var(--background)] p-[1.4rem] transition-colors hover:bg-[var(--secondary)]/60`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-2">
          <span className="font-mono-ui rounded-full bg-[var(--secondary)] px-2 py-0.5 text-[10px] lowercase tracking-[0.04em] text-[var(--muted-foreground)]">
            {sourceLabel}
          </span>
          <span className="font-mono-ui rounded-full bg-[var(--secondary)] px-2 py-0.5 text-[10px] lowercase tracking-[0.04em] text-[var(--muted-foreground)]">
            {timestamp}
          </span>
        </div>
        <div className="flex items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
          <button
            type="button"
            onClick={() => onPin(entry)}
            aria-label={entry.pinned ? "Unpin clip" : "Pin clip"}
            className="rounded p-1 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
          >
            <Pin
              className={
                entry.pinned ? "h-3.5 w-3.5 fill-current" : "h-3.5 w-3.5"
              }
            />
          </button>
          <button
            type="button"
            onClick={() => onCopy(entry)}
            aria-label="Copy clip"
            className="rounded p-1 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(entry)}
            aria-label="Delete clip"
            className="rounded p-1 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--destructive)]"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <p className="font-mono-ui mt-4 text-sm leading-[1.6] lowercase text-[var(--foreground)] whitespace-pre-wrap break-words">
        {entry.content}
      </p>
    </article>
  );
};

export const ClipboardCanvas = ({ entries }: ClipboardCanvasProps) => {
  const { removeEntry, togglePinned } = useClipboardStore();

  const orderedEntries = useMemo(
    () =>
      [...entries].sort((a, b) => {
        if (Boolean(a.pinned) === Boolean(b.pinned)) {
          return b.createdAt - a.createdAt;
        }

        return a.pinned ? -1 : 1;
      }),
    [entries],
  );

  if (!entries.length) {
    return null;
  }

  const handleCopy = (entry: ClipboardEntry) => {
    navigator.clipboard
      .writeText(entry.content)
      .then(() => {
        toast({
          title: "clip copied",
          description: "clipboard content copied to your system clipboard.",
        });
      })
      .catch(() => {
        toast({
          title: "copy failed",
          description: "could not access the system clipboard.",
          variant: "destructive",
        });
      });
  };

  const handleDelete = (entry: ClipboardEntry) => {
    removeEntry(entry.id);
    toast({
      title: "clip deleted",
      description: "the clip has been removed from this room.",
    });
  };

  const handlePin = (entry: ClipboardEntry) => {
    togglePinned(entry.id);
    toast({
      title: entry.pinned ? "clip unpinned" : "clip pinned",
      description: entry.pinned
        ? "this clip moved back to the stream."
        : "this clip is now pinned to the top.",
    });
  };

  return (
    <section className="mx-auto w-full max-w-4xl px-6 pb-4 pt-28 sm:px-8">
      <div className="max-h-[calc(100vh-22rem)] overflow-y-auto overscroll-contain pr-1">
        <div className="flex flex-wrap items-start gap-4 md:gap-6">
          {orderedEntries.map((entry) => (
            <ClipCanvas
              key={entry.id}
              entry={entry}
              onCopy={handleCopy}
              onDelete={handleDelete}
              onPin={handlePin}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
