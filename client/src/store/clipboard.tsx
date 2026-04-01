import type { ClipboardEntry } from "@/pages/home/types";
import { create } from "zustand";

export interface ClipboardState {
  entries: ClipboardEntry[];

  addEntry: (entry: ClipboardEntry) => void;
  removeEntry: (id: string) => void;
  togglePinned: (id: string) => void;
  clearEntries: () => void;
}

export const useClipboardStore = create<ClipboardState>((set) => ({
  entries: [],

  addEntry: (entry) =>
    set((state) => ({
      entries: [{ pinned: false, ...entry }, ...state.entries],
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
}));
