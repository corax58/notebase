// entrypoints/popup/RecentNotesView.tsx
import { useEffect, useState } from "react";
import type { Note } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { getRecentNotes } from "@/lib/api-client";
import { cn } from "@/lib/utils";

interface RecentNotesViewProps {
  onAddNote: () => void;
  onOpenNotebase: () => void;
  onSelectNote: (note: Note) => void;
}

const buttonClassName = cn(
  "inline-flex flex-1 cursor-pointer items-center justify-center rounded-4xl",
  "border border-border bg-clip-padding px-4 py-2 text-sm font-medium",
  "whitespace-nowrap transition-colors outline-none select-none",
  "hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50",
);

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
    <div className="flex h-full flex-col gap-4 px-6 pb-6">
      <div
        className={cn(
          "-mx-2 min-h-0 flex-1",
          isLoading ? "overflow-hidden" : "overflow-y-auto",
        )}
      >
        {isLoading && (
          <div
            role="status"
            aria-label="Loading notes"
            className="flex flex-col"
          >
            <Skeleton className="mx-2 my-1 h-4 w-24" />
            <ul className="flex flex-col gap-1">
              {Array.from({ length: 5 }, (_, index) => (
                <li key={index} className="flex flex-col px-2 py-2">
                  <Skeleton className="my-1 h-4 w-2/5" />
                  <Skeleton className="my-0.75 h-3.5 w-full" />
                  <Skeleton className="my-0.75 h-3.5 w-3/4" />
                </li>
              ))}
            </ul>
          </div>
        )}

        {!isLoading && error && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Couldn't load notes: {error}
          </p>
        )}

        {!isLoading && !error && notes.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No notes yet — save your first one.
          </p>
        )}

        {!isLoading && !error && notes.length > 0 && (
          <div>
            <p className="px-2">Recent notes</p>
            <ul className="flex flex-col gap-1">
              {notes.map((note) => (
                <li key={note.id}>
                  <button
                    type="button"
                    onClick={() => onSelectNote(note)}
                    className="w-full rounded-lg px-2 py-2 text-left  transition-colors hover:bg-accent"
                  >
                    <p className="line-clamp-2 font-semibold text-[16px] text-foreground ">
                      {note.label}
                    </p>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {note.content}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onOpenNotebase}
          className={buttonClassName}
        >
          Open Notebase
        </button>
        <button
          type="button"
          onClick={onAddNote}
          className={cn(
            buttonClassName,
            "border-transparent bg-primary text-primary-foreground hover:opacity-90 hover:bg-primary",
          )}
        >
          Add note
        </button>
      </div>
    </div>
  );
}

export default RecentNotesView;
