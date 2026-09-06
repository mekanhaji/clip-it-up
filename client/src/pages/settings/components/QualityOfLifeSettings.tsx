import { toast } from "@/components/ui/use-toast";
import { useClipboardStore } from "@/store/clipboard";
import { HISTORY_LIMIT_OPTIONS, useSettingsStore } from "@/store/settings";
import { RotateCcw } from "lucide-react";
import { Segmented, type SegmentedOption } from "./Segmented";
import { SettingRow, SettingsSection } from "./SettingsSection";
import { Toggle } from "./Toggle";

const HISTORY_OPTIONS: SegmentedOption<number>[] = HISTORY_LIMIT_OPTIONS.map(
  (limit) => ({
    value: limit,
    label: limit === 0 ? "all" : String(limit),
    title: limit === 0 ? "keep every clip" : `keep the latest ${limit}`,
  }),
);

export const QualityOfLifeSettings = () => {
  const enterToSend = useSettingsStore((state) => state.enterToSend);
  const autoCopyIncoming = useSettingsStore((state) => state.autoCopyIncoming);
  const notifyOnIncoming = useSettingsStore((state) => state.notifyOnIncoming);
  const clearOnLeave = useSettingsStore((state) => state.clearOnLeave);
  const use24HourClock = useSettingsStore((state) => state.use24HourClock);
  const historyLimit = useSettingsStore((state) => state.historyLimit);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const trimEntries = useClipboardStore((state) => state.trimEntries);

  const changeHistoryLimit = (limit: number) => {
    updateSettings({ historyLimit: limit });
    // Apply immediately instead of waiting for the next clip to arrive.
    trimEntries();
  };

  return (
    <SettingsSection title="quirks">
      <SettingRow
        label="enter to send"
        htmlFor="qol-enter-to-send"
        description="shift + enter for a new line"
      >
        <Toggle
          id="qol-enter-to-send"
          checked={enterToSend}
          onChange={(value) => updateSettings({ enterToSend: value })}
        />
      </SettingRow>

      <SettingRow
        label="auto-copy incoming"
        htmlFor="qol-auto-copy"
        description="needs the tab focused"
      >
        <Toggle
          id="qol-auto-copy"
          checked={autoCopyIncoming}
          onChange={(value) => updateSettings({ autoCopyIncoming: value })}
        />
      </SettingRow>

      <SettingRow label="notify on incoming" htmlFor="qol-notify">
        <Toggle
          id="qol-notify"
          checked={notifyOnIncoming}
          onChange={(value) => updateSettings({ notifyOnIncoming: value })}
        />
      </SettingRow>

      <SettingRow label="clear board on leave" htmlFor="qol-clear-on-leave">
        <Toggle
          id="qol-clear-on-leave"
          checked={clearOnLeave}
          onChange={(value) => updateSettings({ clearOnLeave: value })}
        />
      </SettingRow>

      <SettingRow label="24-hour clock" htmlFor="qol-24h">
        <Toggle
          id="qol-24h"
          checked={use24HourClock}
          onChange={(value) => updateSettings({ use24HourClock: value })}
        />
      </SettingRow>

      <SettingRow label="keep last">
        <Segmented
          ariaLabel="Clips kept on the board"
          value={historyLimit}
          options={HISTORY_OPTIONS}
          onChange={changeHistoryLimit}
        />
      </SettingRow>
    </SettingsSection>
  );
};

export const ResetSettings = () => {
  const resetSettings = useSettingsStore((state) => state.resetSettings);
  const trimEntries = useClipboardStore((state) => state.trimEntries);

  const reset = () => {
    resetSettings();
    trimEntries();
    toast({ title: "back to defaults", description: "your name stuck around." });
  };

  return (
    <SettingsSection title="reset">
      <SettingRow label="restore defaults" description="keeps your name">
        <button
          type="button"
          onClick={reset}
          className="font-mono-ui inline-flex h-9 items-center gap-2 rounded border border-[var(--border)] px-4 text-[11px] lowercase tracking-[0.08em] text-[var(--foreground)] transition-colors hover:bg-[var(--secondary)]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          reset
        </button>
      </SettingRow>
    </SettingsSection>
  );
};
