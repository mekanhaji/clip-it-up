import type { ClipboardEntry } from "@/pages/home/types";
import { useSettingsStore } from "@/store/settings";
import { create } from "zustand";

/**
 * Drops the oldest unpinned entries until at most `limit` remain.
 * Entries are newest-first. `limit` of 0 means unlimited. Returns the same
 * array instance when nothing needs dropping so callers can skip a re-render.
 */
export const applyHistoryLimit = (
  entries: ClipboardEntry[],
  limit: number,
): ClipboardEntry[] => {
  if (limit <= 0 || entries.length <= limit) {
    return entries;
  }

  let toDrop = entries.length - limit;
  const kept: ClipboardEntry[] = [];

  for (let index = entries.length - 1; index >= 0; index -= 1) {
    const entry = entries[index];
    if (toDrop > 0 && !entry.pinned) {
      toDrop -= 1;
      continue;
    }
    kept.unshift(entry);
  }

  return kept;
};

const currentHistoryLimit = () => useSettingsStore.getState().historyLimit;

export interface ClipboardState {
  entries: ClipboardEntry[];

  addEntry: (entry: ClipboardEntry) => void;
  removeEntry: (id: string) => void;
  togglePinned: (id: string) => void;
  clearEntries: () => void;
  /** Re-applies the history limit from settings, e.g. after it was lowered. */
  trimEntries: () => void;
}

export const useClipboardStore = create<ClipboardState>((set) => ({
  entries: [],

  addEntry: (entry) =>
    set((state) => ({
      entries: applyHistoryLimit(
        [{ pinned: false, ...entry }, ...state.entries],
        currentHistoryLimit(),
      ),
    })),
  removeEntry: (id) =>
    set((state) => ({
      entries: state.entries.filter((entry) => entry.id !== id),
    })),
  togglePinned: (id) =>
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.id === id ? { ...entry, pinned: !entry.pinned } : entry,
      ),
    })),
  clearEntries: () => set({ entries: [] }),
  trimEntries: () =>
    set((state) => {
      const entries = applyHistoryLimit(state.entries, currentHistoryLimit());
      return entries === state.entries ? state : { entries };
    }),
}));
