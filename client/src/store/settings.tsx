import { randomAnimeName, sanitizeDeviceName } from "@/utils/deviceName";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ThemePreference = "light" | "dark" | "system";
export type ClipDensity = "comfortable" | "compact";

/** localStorage key. Also read by the pre-paint theme script in index.html. */
export const SETTINGS_STORAGE_KEY = "clipitup:settings";

/** `0` means unlimited. */
export const HISTORY_LIMIT_OPTIONS = [25, 50, 100, 0] as const;

export interface SettingsValues {
  /** Friendly name sent along with each clip so other devices know its origin. */
  deviceName: string;
  theme: ThemePreference;
  density: ClipDensity;
  /** Enter sends; Shift+Enter inserts a newline. Ctrl/Cmd+Enter always sends. */
  enterToSend: boolean;
  /** Write incoming clips straight to this device's system clipboard. */
  autoCopyIncoming: boolean;
  /** Show a toast when a clip arrives from another device. */
  notifyOnIncoming: boolean;
  /** Wipe the board when leaving a room. */
  clearOnLeave: boolean;
  use24HourClock: boolean;
  /** Max clips kept on the board; oldest unpinned are dropped first. `0` = unlimited. */
  historyLimit: number;
}

interface SettingsActions {
  setDeviceName: (name: string) => void;
  randomizeDeviceName: () => void;
  setTheme: (theme: ThemePreference) => void;
  updateSettings: (patch: Partial<SettingsValues>) => void;
  /** Restores every default except the device name. */
  resetSettings: () => void;
}

export type SettingsState = SettingsValues & SettingsActions;

const createDefaults = (): SettingsValues => ({
  deviceName: randomAnimeName(),
  theme: "system",
  density: "comfortable",
  enterToSend: false,
  autoCopyIncoming: false,
  notifyOnIncoming: true,
  clearOnLeave: false,
  use24HourClock: true,
  historyLimit: 0,
});

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...createDefaults(),

      setDeviceName: (name) => set({ deviceName: sanitizeDeviceName(name) }),
      randomizeDeviceName: () => {
        const current = get().deviceName;
        let next = randomAnimeName();
        // Make the button feel like it did something.
        while (next === current) {
          next = randomAnimeName();
        }
        set({ deviceName: next });
      },
      setTheme: (theme) => set({ theme }),
      updateSettings: (patch) => set(patch),
      resetSettings: () => {
        const { deviceName } = get();
        set({ ...createDefaults(), deviceName });
      },
    }),
    {
      name: SETTINGS_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Persist only data, never the action functions.
      partialize: (state): SettingsValues => ({
        deviceName: state.deviceName,
        theme: state.theme,
        density: state.density,
        enterToSend: state.enterToSend,
        autoCopyIncoming: state.autoCopyIncoming,
        notifyOnIncoming: state.notifyOnIncoming,
        clearOnLeave: state.clearOnLeave,
        use24HourClock: state.use24HourClock,
        historyLimit: state.historyLimit,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error || !state) {
          return;
        }
        // First visit: nothing was stored yet, so the random default name
        // would be re-rolled on every reload. Writing it once pins it down.
        state.setDeviceName(state.deviceName.trim() || randomAnimeName());
      },
    },
  ),
);
