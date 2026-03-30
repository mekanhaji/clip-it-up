import { cn } from "@/lib/utils";
import { useClipboardStore } from "@/store/clipboard";
import { useRoomStore, useSocketStore } from "@/store/room";
import { emitClipboardMessage } from "../api/ws";

interface ComposerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  compact?: boolean;
  className?: string;
}

export const Composer = ({
  value,
  onChange,
  placeholder = "type or paste something to clip...",
  compact = false,
  className,
}: ComposerProps) => {
  const { socket } = useSocketStore();
  const { addEntry } = useClipboardStore();
  const { code } = useRoomStore();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onChange(value.trim());
    const formData = new FormData(event.currentTarget);
    const board = formData.get("board") as string;

    if (!board.trim()) {
      return;
    }

    addEntry({
      id: crypto.randomUUID(),
      content: board.trim(),
      source: "local",
      createdAt: Date.now(),
    });
    socket && emitClipboardMessage(socket, code as string, board.trim());
  };
  // TODO: use textarea with form submit on ctrl+enter
  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={onSubmit}>
        <input
          value={value}
          name="board"
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={cn(
            "font-mono-ui w-full resize-none border-0 border-b border-[var(--border)] bg-transparent px-0 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--foreground)] focus:outline-none",
            compact ? "py-2 text-xs" : "py-3 text-sm",
          )}
          // rows={1}
        />
      </form>
    </div>
  );
};
