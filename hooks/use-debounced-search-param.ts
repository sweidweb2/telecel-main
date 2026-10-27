"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_DEBOUNCE_MS = 600;

/**
 * Local search input synced to a committed URL/search value, with debounce.
 * Pair with `useTransition` in the parent when navigation should show pending UI.
 */
export function useDebouncedSearchParam({
  committedValue,
  onCommit,
  debounceMs = DEFAULT_DEBOUNCE_MS,
}: {
  committedValue: string;
  onCommit: (next: string) => void;
  debounceMs?: number;
}) {
  const [search, setSearch] = useState(committedValue);
  const [prevCommitted, setPrevCommitted] = useState(committedValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (committedValue !== prevCommitted) {
    setPrevCommitted(committedValue);
    setSearch(committedValue);
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function handleSearchChange(value: string) {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const next = value.trim();
      if (next === committedValue) return;
      onCommit(next);
    }, debounceMs);
  }

  return { search, handleSearchChange };
}
