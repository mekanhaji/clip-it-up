import type { ClipboardEntry } from "@/pages/home/types";
import { create } from "zustand";

export interface ClipboardState {
  entries: ClipboardEntry[];

  addEntry: (entry: ClipboardEntry) => void;
  clearEntries: () => void;
}

export const useClipboardStore = create<ClipboardState>((set) => ({
  entries: [],

  addEntry: (entry) => set((state) => ({ entries: [entry, ...state.entries] })),
  clearEntries: () => set({ entries: [] }),
}));
