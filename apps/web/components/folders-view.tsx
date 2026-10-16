"use client";

import { FolderDashedIcon, FolderIcon } from "@phosphor-icons/react";
import * as React from "react";
import {
  FOLDER_GRID_CLASS_NAME,
  FolderGridSkeleton,
  LIST_PANEL_CLASS_NAME,
} from "@/components/dashboard-skeletons";
import { AddFolderDialog } from "@/components/add-folder-dialog";
import { EmptyState } from "@/components/empty-state";
import { FolderCard } from "@/components/folder-card";
import { FolderListItem } from "@/components/folder-list-item";
import { SearchInput } from "@/components/search-input";
import { SortMenu } from "@/components/sort-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ViewToggle, useViewMode } from "@/components/view-toggle";
import { normalizeQuery } from "@/lib/note-filters";

type FolderRow = {
  id: string;
  name: string;
  color: string | null;
  createdAt: Date;
  noteCount: number;
};

// The first option is the default
const FOLDER_SORT_OPTIONS = [
  { value: "name", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
  { value: "most-notes", label: "Most notes" },
  { value: "fewest-notes", label: "Fewest notes" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
] as const;

type FolderSort = (typeof FOLDER_SORT_OPTIONS)[number]["value"];

// "Folder 2" before "Folder 10", and no split between upper and lower case
function byName(a: FolderRow, b: FolderRow) {
  return a.name.localeCompare(b.name, undefined, {
    sensitivity: "base",
    numeric: true,
  });
}

// Ties fall back to the name so the order never looks arbitrary
const FOLDER_COMPARATORS: Record<
  FolderSort,
  (a: FolderRow, b: FolderRow) => number
> = {
  name: byName,
  "name-desc": (a, b) => byName(b, a),
  "most-notes": (a, b) => b.noteCount - a.noteCount || byName(a, b),
  "fewest-notes": (a, b) => a.noteCount - b.noteCount || byName(a, b),
  newest: (a, b) =>
    b.createdAt.getTime() - a.createdAt.getTime() || byName(a, b),
  oldest: (a, b) =>
    a.createdAt.getTime() - b.createdAt.getTime() || byName(a, b),
};

const SORT_STORAGE_KEY = "folders-sort";

// Remembers the chosen order between visits, the way useViewMode does the view
function useFolderSort() {
  const [sort, setSort] = React.useState<FolderSort>(
    FOLDER_SORT_OPTIONS[0].value,
  );

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(SORT_STORAGE_KEY);
      const option = FOLDER_SORT_OPTIONS.find((o) => o.value === saved);
      if (option) setSort(option.value);
    } catch {}
  }, []);

  const update = React.useCallback((next: FolderSort) => {
    setSort(next);
    try {
      localStorage.setItem(SORT_STORAGE_KEY, next);
    } catch {}
  }, []);

  return [sort, update] as const;
}

export function FoldersView({ folders }: { folders: FolderRow[] }) {
  const { view, setView, ready } = useViewMode("folders-view");
  const [sort, setSort] = useFolderSort();
  const [search, setSearch] = React.useState("");

  // Every folder is already on the page, so searching and sorting happen
  // right here instead of going back to the server
  const terms = React.useMemo(
    () => normalizeQuery(search).toLowerCase().split(" ").filter(Boolean),
    [search],
  );
  const visible = React.useMemo(() => {
    const matches = folders.filter((folder) => {
      const name = folder.name.toLowerCase();
      return terms.every((term) => name.includes(term));
    });
    return matches.sort(FOLDER_COMPARATORS[sort]);
  }, [folders, terms, sort]);

  // List bars are relative to the fullest folder, searched for or not
  const mostNotes = React.useMemo(
    () => Math.max(0, ...folders.map((folder) => folder.noteCount)),
    [folders],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-card flex flex-col gap-4 rounded-xl border p-4 md:px-6 md:py-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="text-[28px] leading-[1.1] font-bold tracking-[-0.035em]">
              Folders
            </h2>
            <p className="text-muted-foreground text-sm" aria-live="polite">
              <span className="text-foreground font-bold tabular-nums">
                {terms.length > 0
                  ? `${visible.length} of ${folders.length}`
                  : folders.length}
              </span>{" "}
              {folders.length === 1 ? "folder" : "folders"} · organize your
              notes
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <ViewToggle view={view} onChange={setView} />
            <AddFolderDialog />
          </div>
        </div>

        {folders.length > 0 && (
          <div className="flex items-center gap-2">
            <SearchInput
              label="Search folders"
              placeholder="Search folders..."
              value={search}
              onChange={setSearch}
            />
            <SortMenu
              label="Sort folders"
              options={FOLDER_SORT_OPTIONS}
              value={sort}
              onChange={setSort}
            />
          </div>
        )}
      </div>

      {folders.length === 0 ? (
        <Card>
          <CardContent className="py-6">
            <EmptyState
              icon={FolderIcon}
              title="No folders yet"
              description="Group notes by topic or project to keep them easy to find."
            >
              <AddFolderDialog />
            </EmptyState>
          </CardContent>
        </Card>
      ) : visible.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-lg">
              <FolderDashedIcon className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium">
                No folders match “{normalizeQuery(search)}”
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                Folders are searched by name.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSearch("")}>
              Clear search
            </Button>
          </CardContent>
        </Card>
      ) : !ready ? (
        <FolderGridSkeleton />
      ) : view === "grid" ? (
        <div className={FOLDER_GRID_CLASS_NAME}>
          {visible.map((folder) => (
            <FolderCard key={folder.id} folder={folder} highlight={terms} />
          ))}
        </div>
      ) : (
        <div className={LIST_PANEL_CLASS_NAME}>
          {visible.map((folder) => (
            <FolderListItem
              key={folder.id}
              folder={folder}
              mostNotes={mostNotes}
              highlight={terms}
            />
          ))}
        </div>
      )}
    </div>
  );
}
