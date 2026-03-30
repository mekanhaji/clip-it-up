import { useToast } from "@/components/ui/use-toast";
import { ActionRow } from "@/pages/home/components/ActionRow";
import { ClipboardCanvas } from "@/pages/home/components/ClipboardCanvas";
import { Composer } from "@/pages/home/components/Composer";
import { TopBar } from "@/pages/home/components/TopBar";
import type { ActionDefinition, ClipboardEntry } from "@/pages/home/types";
import { useMemo, useState } from "react";

const HomePage = () => {
  const { toast } = useToast();
  const [composerValue, setComposerValue] = useState("");
  const [entries, setEntries] = useState<ClipboardEntry[]>([]);

  const hasClipboardContent = entries.length > 0;

  const actions: ActionDefinition[] = useMemo(
    () => [
      {
        key: "sync",
        label: "sync",
        variant: "primary",
        onClick: () => {},
      },
      {
        key: "leave",
        label: "leave",
        variant: "secondary",
        onClick: () => {},
      },
      {
        key: "more",
        label: "more",
        variant: "ghost",
        onClick: () => {
          toast({
            title: "Placeholder",
            description: "Future action slot is ready.",
          });
        },
      },
    ],
    [toast],
  );

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <TopBar />

      <main className="relative flex min-h-screen flex-col overflow-hidden pt-20 sm:pt-24">
        <ClipboardCanvas entries={entries} />

        {!hasClipboardContent && (
          <section className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center px-6 pb-16 sm:px-8 sm:pb-20">
            <div className="w-full max-w-2xl text-center">
              <h2 className="text-6xl font-light lowercase leading-[0.95] text-[var(--foreground)] sm:text-7xl">
                the desk is clear
              </h2>
              <p className="font-mono-ui mt-6 text-[11px] tracking-[0.08em] text-[var(--muted-foreground)] sm:text-xs">
                paste your first clip to synchronize this room.
              </p>

              <Composer
                value={composerValue}
                onChange={setComposerValue}
                className="mx-auto mt-14 max-w-xl"
              />

              <ActionRow actions={actions} className="mt-8" />
            </div>
          </section>
        )}

        <section
          className={
            "pointer-events-none fixed inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/96 to-transparent"
          }
        >
          <div
            className={
              hasClipboardContent
                ? "pointer-events-auto mx-auto w-full max-w-3xl translate-y-0 px-6 pb-8 opacity-100 transition-all duration-500 sm:px-8"
                : "mx-auto w-full max-w-3xl translate-y-10 px-6 pb-8 opacity-0 transition-all duration-500 sm:px-8"
            }
          >
            <div className="space-y-4">
              <Composer
                value={composerValue}
                onChange={setComposerValue}
                compact={true}
              />
              <ActionRow actions={actions} compact={true} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
