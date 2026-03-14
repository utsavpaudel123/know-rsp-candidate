"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const MAX_COMPARE = 5;
const STORAGE_KEY = "rsp-compare-ids";

interface CompareContextValue {
  selectedIds: string[];
  addCandidate: (id: string) => void;
  removeCandidate: (id: string) => void;
  toggleCandidate: (id: string) => void;
  clearAll: () => void;
  isSelected: (id: string) => boolean;
  isFull: boolean;
  count: number;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSelectedIds(parsed.slice(0, MAX_COMPARE));
        }
      }
    } catch {
      // Ignore parse errors
    }
    setHydrated(true);
  }, []);

  // Persist to sessionStorage on change
  useEffect(() => {
    if (hydrated) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds));
      } catch {
        // Ignore storage errors
      }
    }
  }, [selectedIds, hydrated]);

  const addCandidate = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id) || prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  }, []);

  const removeCandidate = useCallback((id: string) => {
    setSelectedIds((prev) => prev.filter((v) => v !== id));
  }, []);

  const toggleCandidate = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((v) => v !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  }, []);

  const clearAll = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const isSelected = useCallback(
    (id: string) => selectedIds.includes(id),
    [selectedIds]
  );

  return (
    <CompareContext.Provider
      value={{
        selectedIds,
        addCandidate,
        removeCandidate,
        toggleCandidate,
        clearAll,
        isSelected,
        isFull: selectedIds.length >= MAX_COMPARE,
        count: selectedIds.length,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare(): CompareContextValue {
  const ctx = useContext(CompareContext);
  if (!ctx) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return ctx;
}
