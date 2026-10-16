"use client";

import * as React from "react";
import { ListBulletsIcon, SquaresFourIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type ViewMode = "grid" | "list";

// Views chosen this visit, kept here too so switching still works when
// storage is blocked
const chosen = new Map<string, ViewMode>();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function readViewMode(storageKey: string): ViewMode {
  const current = chosen.get(storageKey);
  if (current) return current;
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === "grid" || saved === "list") return saved;
  } catch {}
  return "grid";
}

const serverViewMode = (): ViewMode => "grid";
const subscribeNever = () => () => {};

/**
 * Persists the chosen view per page in localStorage. The server can't read
 * it, so `ready` is false while hydrating and callers can show a skeleton
 * rather than flash the grid before the list. Mounted after a client-side
 * navigation, it's ready straight away.
 */
export function useViewMode(storageKey: string) {
  const view = React.useSyncExternalStore(
    subscribe,
    () => readViewMode(storageKey),
    serverViewMode,
  );
  const ready = React.useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );

  const setView = React.useCallback(
    (next: ViewMode) => {
      chosen.set(storageKey, next);
      try {
        localStorage.setItem(storageKey, next);
      } catch {}
      listeners.forEach((listener) => listener());
    },
    [storageKey],
  );

  return { view, setView, ready };
}

/** For loading states: the skeleton of the view the page will open in. */
export function ViewModeSkeleton({
  storageKey,
  grid,
  list,
}: {
  storageKey: string;
  grid: React.ReactNode;
  list: React.ReactNode;
}) {
  const { view } = useViewMode(storageKey);
  return view === "list" ? list : grid;
}

export function ViewToggle({
  view,
  onChange,
}: {
  view: ViewMode;
  onChange: (view: ViewMode) => void;
}) {
  const options = [
    { value: "grid", label: "Grid view", Icon: SquaresFourIcon },
    { value: "list", label: "List view", Icon: ListBulletsIcon },
  ] as const;

  return (
    <div
      role="group"
      aria-label="View mode"
      className="bg-muted sunken border-edge inline-flex items-center rounded-lg border p-0.5"
    >
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
          aria-pressed={view === value}
          title={label}
          onClick={() => onChange(value)}
          className={cn(
            "text-muted-foreground hover:text-foreground flex size-7 items-center justify-center rounded-md border border-transparent transition-colors",
            view === value &&
              "bg-background text-foreground border-edge raised [--depth:2px]",
          )}
        >
          <Icon className="size-4" />
        </button>
      ))}
    </div>
  );
}
