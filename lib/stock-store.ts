"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "sl_known_stock_cache";

let memoryStockMap: Record<string, number> = {};
const listeners = new Set<() => void>();

function initFromStorage() {
  if (typeof window === "undefined") return;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      memoryStockMap = { ...memoryStockMap, ...JSON.parse(raw) };
    }
  } catch (e) {
    // Ignore storage errors
  }
}

if (typeof window !== "undefined") {
  initFromStorage();
}

function notify() {
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(memoryStockMap));
    } catch (e) {}
  }
  listeners.forEach((listener) => listener());
}

export function setKnownStock(variantId: string, quantity: number) {
  if (memoryStockMap[variantId] === quantity) return;
  memoryStockMap = {
    ...memoryStockMap,
    [variantId]: quantity,
  };
  notify();
}

export function getKnownStock(
  variantId: string | undefined,
): number | undefined {
  if (!variantId) return undefined;
  return memoryStockMap[variantId];
}

export function useKnownStock(
  variantId: string | undefined,
): number | undefined {
  return useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange);
      return () => listeners.delete(onStoreChange);
    },
    () => (variantId ? memoryStockMap[variantId] : undefined),
    () => undefined,
  );
}
