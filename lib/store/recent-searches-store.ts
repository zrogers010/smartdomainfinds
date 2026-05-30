"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_RECENT = 8;

type RecentSearchesState = {
  searches: string[];
  add: (idea: string) => void;
  clear: () => void;
};

export const useRecentSearchesStore = create<RecentSearchesState>()(
  persist(
    (set) => ({
      searches: [],
      add: (idea) =>
        set((state) => {
          const trimmed = idea.trim();
          if (!trimmed) return state;
          const deduped = [
            trimmed,
            ...state.searches.filter(
              (s) => s.toLowerCase() !== trimmed.toLowerCase()
            ),
          ];
          return { searches: deduped.slice(0, MAX_RECENT) };
        }),
      clear: () => set({ searches: [] }),
    }),
    {
      name: "sdf-recent-searches",
      version: 1,
    }
  )
);
