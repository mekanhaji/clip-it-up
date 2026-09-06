import { toast } from "@/components/ui/use-toast";
import { fallbackCopy } from "@/utils/clipboard";
import { useRoomStore } from "@/store/room";
import { Check, Copy, X } from "lucide-react";
import { useState } from "react";
import QRCode from "react-qr-code";
import { buildRoomShareUrl } from "../utils/room";

interface ShareRoomModalProps {
  open: boolean;
  onClose: () => void;
}

export const ShareRoomModal = ({ open, onClose }: ShareRoomModalProps) => {
  const { code } = useRoomStore();
  const [copied, setCopied] = useState(false);

  if (!open || !code) return null;

  const shareUrl = buildRoomShareUrl(code);

  const copyLink = async () => {
    try {
      if (!navigator.clipboard) {
        throw new Error("insecure context");
      }
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      if (!fallbackCopy(shareUrl)) {
        toast({
          variant: "destructive",
          title: "copy failed",
          description: "could not access the system clipboard.",
        });
        return;
      }
    }

    setCopied(true);
    toast({
      title: "link copied",
      description: "share this link with others to join the room.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-md rounded border border-[var(--border)] bg-[var(--background)] p-5 shadow-xl sm:p-6">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-light lowercase">share room</h2>
            <p className="font-mono-ui mt-2 text-xs tracking-[0.08em] text-[var(--muted-foreground)]">
              scan to join instantly
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)]"
            aria-label="Close share room"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5">
          <div className="flex justify-center">
            <div className="rounded bg-white p-4">
              <QRCode
                value={shareUrl}
                size={200}
                level="M"
                fgColor="#1a1916"
                bgColor="#ffffff"
                style={{ height: "auto", maxWidth: "100%", width: "200px" }}
              />
            </div>
          </div>

          <p className="font-mono-ui text-center text-3xl tracking-[0.18em] text-[var(--foreground)]">
            {code}
          </p>

          <div className="space-y-3">
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
              join link
            </p>
            <div className="flex items-center gap-2 rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2.5">
              <span className="font-mono-ui flex-1 truncate text-xs text-[var(--foreground)]">
                {shareUrl}
              </span>
              <button
                type="button"
                onClick={copyLink}
                aria-label="Copy join link"
                title="Copy join link"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
