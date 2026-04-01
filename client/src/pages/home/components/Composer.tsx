import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
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

  const handleSubmit = () => {
    onChange(value.trim());

    if (!value.trim()) {
      return;
    }

    addEntry({
      id: crypto.randomUUID(),
      content: value.trim(),
      source: "local",
      createdAt: Date.now(),
    });
    if (socket && code) {
      emitClipboardMessage(socket, code, value.trim());
    }
    onChange("");
  };

  return (
    <div className={cn("w-full", className)}>
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onSubmit={handleSubmit}
        placeholder={placeholder}
        compact={compact}
      />
    </div>
  );
};
