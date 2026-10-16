import { useEffect, useState } from "react";
import {
  ArchiveIcon,
  ArrowSquareOutIcon,
  FileIcon,
  GlobeIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import type { Note } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getRecentNotes } from "@/lib/api-client";
import { getNoteSource } from "@/lib/note-source";
import { cn, formatRelativeDate } from "@/lib/utils";

interface RecentNotesViewProps {
  onAddNote: () => void;
  onOpenNotebase: () => void;
  onSelectNote: (note: Note) => void;
}

// A row in the web app's notes list, without the folder column and menu
function RecentNoteItem({
  note,
  onSelect,
}: {
  note: Note;
  onSelect: () => void;
}) {
  const source = getNoteSource(note);
  const createdAt = new Date(note.createdAt);

  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-transparent py-2.5 pr-2.5 pl-3 text-left transition-[background-color,border-color,box-shadow] [--depth:2px] outline-none hover:raised hover:border-edge hover:bg-card focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-card"
        title={source?.label}
      >
        {note.faviconUrl ? (
          <img src={note.faviconUrl} className="size-4 object-cover" alt="" />
        ) : source?.href ? (
          <GlobeIcon className="size-4 text-muted-foreground" />
        ) : (
          <FileIcon className="size-4 text-muted-foreground" />
        )}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold">
            {note.label || "Untitled note"}
          </span>
          {note.archived && (
            <Badge variant="outline" className="shrink-0">
              <ArchiveIcon />
              Archived
            </Badge>
          )}
        </span>
        <span className="truncate text-[13px] text-muted-foreground">
          {note.content}
        </span>
      </span>
      <span
        className="shrink-0 self-start pt-0.5 text-xs text-muted-foreground tabular-nums"
        title={createdAt.toDateString()}
      >
        {formatRelativeDate(createdAt)}
      </span>
    </button>
  );
}

function RecentNotesView({
  onAddNote,
  onOpenNotebase,
  onSelectNote,
}: RecentNotesViewProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    getRecentNotes().then((result) => {
      if (result.success) {
        setNotes(result.data);
      } else {
        setError(result.message);
      }
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="flex h-full flex-col gap-4 px-6 pt-4 pb-6">
      <div
        className={cn(
          "-mx-3 min-h-0 flex-1",
          isLoading ? "overflow-hidden" : "overflow-y-auto",
        )}
      >
        <h2 className="mb-1 px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Recent notes
        </h2>

        {isLoading && (
          <ul role="status" aria-label="Loading notes" className="flex flex-col">
            {Array.from({ length: 5 }, (_, index) => (
              <li key={index} className="flex items-center gap-3 px-3 py-2.5">
                <Skeleton className="size-9 shrink-0 rounded-lg" />
                <span className="flex flex-1 flex-col gap-1.5">
                  <Skeleton className="h-4 w-2/5" />
                  <Skeleton className="h-3.5 w-4/5" />
                </span>
              </li>
            ))}
          </ul>
        )}

        {!isLoading && error && (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">
            Couldn't load notes: {error}
          </p>
        )}

        {!isLoading && !error && notes.length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">
            No notes yet. Save your first one.
          </p>
        )}

        {!isLoading && !error && notes.length > 0 && (
          <ul className="flex flex-col gap-0.5">
            {notes.map((note) => (
              <li key={note.id}>
                <RecentNoteItem
                  note={note}
                  onSelect={() => onSelectNote(note)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onOpenNotebase}
        >
          <ArrowSquareOutIcon data-icon="inline-start" />
          Open Notebase
        </Button>
        <Button type="button" className="flex-1" onClick={onAddNote}>
          <PlusIcon data-icon="inline-start" />
          Add note
        </Button>
      </div>
    </div>
  );
}

export default RecentNotesView;
