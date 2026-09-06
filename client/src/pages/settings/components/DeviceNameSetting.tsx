import { toast } from "@/components/ui/use-toast";
import { useSettingsStore } from "@/store/settings";
import { DEVICE_NAME_MAX_LENGTH } from "@/utils/deviceName";
import { Dices } from "lucide-react";
import { SettingRow, SettingsSection } from "./SettingsSection";

export const DeviceNameSetting = () => {
  const deviceName = useSettingsStore((state) => state.deviceName);
  const setDeviceName = useSettingsStore((state) => state.setDeviceName);
  const randomizeDeviceName = useSettingsStore(
    (state) => state.randomizeDeviceName,
  );

  const commit = () => {
    const trimmed = deviceName.trim();
    if (trimmed) {
      setDeviceName(trimmed);
      return;
    }
    randomizeDeviceName();
    toast({ title: "can't be nameless", description: "picked you a new one." });
  };

  return (
    <SettingsSection title="who's this?">
      <SettingRow label="device name" htmlFor="device-name" stack>
        <div className="flex items-center gap-2">
          <input
            id="device-name"
            type="text"
            value={deviceName}
            maxLength={DEVICE_NAME_MAX_LENGTH}
            autoComplete="off"
            autoCapitalize="words"
            spellCheck={false}
            placeholder="e.g. Totoro"
            onChange={(event) => setDeviceName(event.target.value)}
            onBlur={commit}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.currentTarget.blur();
              }
            }}
            className="font-mono-ui h-10 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 text-base text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--foreground)] focus:outline-none sm:text-sm"
          />
          <button
            type="button"
            onClick={randomizeDeviceName}
            title="reroll"
            aria-label="Pick a random name"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-[var(--border)] text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
          >
            <Dices className="h-4 w-4" />
          </button>
        </div>
      </SettingRow>
    </SettingsSection>
  );
};
