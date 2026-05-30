"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DomainResult } from "@/lib/domain/types";

type ShortlistState = {
  items: DomainResult[];
  add: (item: DomainResult) => void;
  remove: (domain: string) => void;
  toggle: (item: DomainResult) => void;
  clear: () => void;
  has: (domain: string) => boolean;
};

export const useShortlistStore = create<ShortlistState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((state) =>
          state.items.some((i) => i.domain === item.domain)
            ? state
            : { items: [...state.items, item] }
        ),
      remove: (domain) =>
        set((state) => ({
          items: state.items.filter((i) => i.domain !== domain),
        })),
      toggle: (item) =>
        set((state) =>
          state.items.some((i) => i.domain === item.domain)
            ? { items: state.items.filter((i) => i.domain !== item.domain) }
            : { items: [...state.items, item] }
        ),
      clear: () => set({ items: [] }),
      has: (domain) => get().items.some((i) => i.domain === domain),
    }),
    {
      name: "sdf-shortlist",
      version: 1,
    }
  )
);

/** Escape a single CSV field per RFC 4180. */
function csvField(value: string): string {
  const needsQuote = /[",\n\r]/.test(value);
  const escaped = value.replace(/"/g, '""');
  return needsQuote ? `"${escaped}"` : escaped;
}

/** Build a CSV document from shortlist items. */
export function shortlistToCsv(items: DomainResult[]): string {
  const header = [
    "domain",
    "availability",
    "smartScore",
    "style",
    "rationale",
    "risks",
    "registrarUrl",
  ];
  const rows = items.map((i) =>
    [
      i.domain,
      i.availability,
      String(i.smartScore),
      i.style,
      i.rationale,
      i.risks.join("; "),
      i.registrarUrl ?? "",
    ]
      .map(csvField)
      .join(",")
  );
  return [header.join(","), ...rows].join("\n");
}
