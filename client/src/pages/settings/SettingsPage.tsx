import { navigate } from "@/lib/router";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { ClipboardAccessSetting } from "./components/ClipboardAccessSetting";
import { DeviceNameSetting } from "./components/DeviceNameSetting";
import {
  QualityOfLifeSettings,
  ResetSettings,
} from "./components/QualityOfLifeSettings";
import { ThemeSetting } from "./components/ThemeSetting";
import { VersionFooter } from "./components/VersionFooter";

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLInputElement ||
  target instanceof HTMLTextAreaElement ||
  (target instanceof HTMLElement && target.isContentEditable);

const SettingsPage = () => {
  const goHome = () => navigate("home");

  // Escape closes the page, unless the user is mid-edit in a field.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isTypingTarget(event.target)) {
        goHome();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="fixed left-0 top-0 z-30 flex w-full items-center gap-3 bg-[var(--background)]/85 px-6 py-4 backdrop-blur sm:px-7">
        <button
          type="button"
          onClick={goHome}
          aria-label="Back to clipboard"
          title="back (esc)"
          className="-ml-2 rounded p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="h-[15px] w-[15px]" />
        </button>
        <h1 className="text-[31px] font-semibold lowercase leading-none text-[var(--foreground)] sm:text-[33px]">
          settings
        </h1>
      </header>

      <main className="mx-auto w-full max-w-2xl px-6 pb-16 pt-24 sm:px-8 sm:pt-28">
        <div className="fade-in-up space-y-10">
          <DeviceNameSetting />
          <ThemeSetting />
          <ClipboardAccessSetting />
          <QualityOfLifeSettings />
          <ResetSettings />
        </div>

        <VersionFooter />
      </main>
    </div>
  );
};

export default SettingsPage;
