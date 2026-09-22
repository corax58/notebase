"use client";

import * as React from "react";
import { ListBulletsIcon, SquaresFourIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type ViewMode = "grid" | "list";

/**
 * Persists the chosen view per page in localStorage. `ready` stays false until
 * the stored value has been read, so callers can avoid a grid -> list flash.
 */
export function useViewMode(storageKey: string) {
  const [view, setView] = React.useState<ViewMode>("grid");
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === "grid" || saved === "list") setView(saved);
    } catch {}
    setReady(true);
  }, [storageKey]);

  const update = React.useCallback(
    (next: ViewMode) => {
      setView(next);
      try {
        localStorage.setItem(storageKey, next);
      } catch {}
    },
    [storageKey],
  );

  return { view, setView: update, ready };
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
      className="bg-muted inline-flex items-center rounded-md p-0.5"
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
            "text-muted-foreground hover:text-foreground flex size-7 items-center justify-center rounded-sm transition-colors",
            view === value && "bg-background text-foreground shadow-sm",
          )}
        >
          <Icon className="size-4" />
        </button>
      ))}
    </div>
  );
}
