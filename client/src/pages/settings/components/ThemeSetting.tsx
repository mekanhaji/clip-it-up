import {
  useSettingsStore,
  type ClipDensity,
  type ThemePreference,
} from "@/store/settings";
import { Monitor, Moon, SunMedium } from "lucide-react";
import { Segmented, type SegmentedOption } from "./Segmented";
import { SettingRow, SettingsSection } from "./SettingsSection";

const THEME_OPTIONS: SegmentedOption<ThemePreference>[] = [
  { value: "light", label: "light", icon: <SunMedium className="h-3.5 w-3.5" /> },
  { value: "dark", label: "dark", icon: <Moon className="h-3.5 w-3.5" /> },
  { value: "system", label: "system", icon: <Monitor className="h-3.5 w-3.5" /> },
];

const DENSITY_OPTIONS: SegmentedOption<ClipDensity>[] = [
  { value: "comfortable", label: "comfortable" },
  { value: "compact", label: "compact" },
];

export const ThemeSetting = () => {
  const theme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const density = useSettingsStore((state) => state.density);
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  return (
    <SettingsSection title="appearance" description="paper or ink.">
      <SettingRow label="theme">
        <Segmented
          ariaLabel="Theme"
          value={theme}
          options={THEME_OPTIONS}
          onChange={setTheme}
        />
      </SettingRow>

      <SettingRow label="density">
        <Segmented
          ariaLabel="Clip density"
          value={density}
          options={DENSITY_OPTIONS}
          onChange={(value) => updateSettings({ density: value })}
        />
      </SettingRow>
    </SettingsSection>
  );
};
