"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns false during SSR and the first client render, then true once
 * hydrated. Uses useSyncExternalStore so it avoids the set-state-in-effect
 * pattern while still preventing hydration mismatches for client-only UI
 * (e.g. persisted Zustand state or theme-dependent icons).
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
