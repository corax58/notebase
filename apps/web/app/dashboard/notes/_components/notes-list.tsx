"use client";
import {
  CircleNotchIcon,
  FileMagnifyingGlassIcon,
} from "@phosphor-icons/react";
import * as React from "react";
import { AddNoteDialog } from "@/components/add-note-dialog";
import { NoteCard } from "@/components/note-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ViewToggle, useViewMode } from "@/components/view-toggle";
import {
  hasActiveFilters,
  NOTE_SORT_OPTIONS,
  parseSearchTerms,
  type NoteFilters,
} from "@/lib/note-filters";
import {
  Folder,
  NoteFacets,
  NoteWithRelations,
  Tag,
} from "@/lib/queries/notes";
import { cn } from "@/lib/utils";
import { NoteListItem } from "./note-list-item";
import { NotesToolbar } from "./notes-toolbar";
import { useInfiniteNotes } from "./use-infinite-notes";
import { useNoteFilters } from "./use-note-filters";

interface NotesListProps {
  // The first stretch of the results; scrolling loads the rest
  notes: NoteWithRelations[];
  // Notes matching the filters altogether, not just the ones in `notes`
  total: number;
  filters: NoteFilters;
  facets: NoteFacets;
  userFolders: Folder[];
  userTags: Tag[];
}

// Overlaps the end of the list, so it scrolls into view — and the next notes
// get asked for — a little before the last of them does
function LoadMoreSentinel({ onReach }: { onReach: () => void }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reach = React.useEffectEvent(onReach);

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) reach();
    });
    observer.observe(ref.current!);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 h-160"
    />
  );
}

const NotesList = ({
  notes: firstPage,
  total,
  filters,
  facets,
  userFolders,
  userTags,
}: NotesListProps) => {
  const { view, setView, ready } = useViewMode("notes-view");
  const controls = useNoteFilters(filters);
  const { notes, canLoadMore, loadingMore, failed, loadMore } =
    useInfiniteNotes(firstPage, total, filters);

  // Everything below describes the notes on screen, so it reads the filters
  // they were fetched with rather than the ones still on their way. With no
  // notes at all there's nothing for a filter to have narrowed down.
  const filtered = facets.total > 0 && hasActiveFilters(filters);
  const highlight = React.useMemo(
    () => parseSearchTerms(filters.q).text,
    [filters.q],
  );
  const sortLabel = NOTE_SORT_OPTIONS.find(
    (option) => option.value === filters.sort,
  )?.label;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Notes</h2>
            <p className="text-muted-foreground text-sm" aria-live="polite">
              {filtered
                ? `${total} of ${facets.total} ${facets.total === 1 ? "note" : "notes"}`
                : `${total} ${total === 1 ? "note" : "notes"}`}{" "}
              · {sortLabel?.toLowerCase()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ViewToggle view={view} onChange={setView} />
            <AddNoteDialog folders={userFolders} tags={userTags} />
          </div>
        </div>

        {/* Nothing to search until there's a first note */}
        {facets.total > 0 && (
          <NotesToolbar
            controls={controls}
            folders={userFolders}
            facets={facets}
          />
        )}
      </div>

      <div
        aria-busy={controls.pending}
        className={cn(
          "relative flex flex-col gap-4 transition-opacity",
          controls.pending && "opacity-60",
        )}
      >
        {notes.length === 0 ? (
          filtered ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                <div className="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-lg">
                  <FileMagnifyingGlassIcon className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {filters.q
                      ? `No notes match “${filters.q}”`
                      : "No notes match these filters"}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Try a different search, or remove a filter to widen it.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={controls.reset}>
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-muted-foreground py-12 text-center text-sm">
                No notes yet.
              </CardContent>
            </Card>
          )
        ) : !ready ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                folders={userFolders}
                tags={userTags}
                highlight={highlight}
              />
            ))}
          </div>
        ) : (
          <div className="bg-card divide-y overflow-hidden rounded-xl border">
            {notes.map((note) => (
              <NoteListItem
                key={note.id}
                note={note}
                folders={userFolders}
                tags={userTags}
                highlight={highlight}
              />
            ))}
          </div>
        )}

        {/* Mounted only while there's more to ask for, so each stretch that
            loads gets a fresh look at whether the end is still in view */}
        {ready && canLoadMore && <LoadMoreSentinel onReach={loadMore} />}

        {loadingMore && (
          <p
            role="status"
            className="text-muted-foreground flex items-center justify-center gap-2 py-2 text-sm"
          >
            <CircleNotchIcon className="size-4 animate-spin" />
            Loading more notes...
          </p>
        )}

        {failed && (
          <div className="flex items-center justify-center gap-3 py-2">
            <p className="text-muted-foreground text-sm">
              Couldn’t load more notes.
            </p>
            <Button variant="outline" size="sm" onClick={loadMore}>
              Try again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesList;
