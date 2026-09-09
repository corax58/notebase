import { useState } from "react";
import type { Note } from "@/types";
import { cn } from "@/lib/utils";

interface NoteDetailViewProps {
  note: Note;
  onBack: () => void;
  onDeleted: (noteId: string) => void;
}

const buttonClassName = cn(
  "inline-flex flex-1 cursor-pointer items-center justify-center rounded-4xl",
  "border border-border bg-clip-padding px-4 py-2 text-sm font-medium",
  "whitespace-nowrap transition-colors outline-none select-none",
  "hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50",
);

function NoteDetailView({ note, onBack, onDeleted }: NoteDetailViewProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string>();

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(undefined);
    // const result = await deleteNote(note.id);
    // if (result.success) {
    //   onDeleted(note.id);
    // } else {
    //   setError(result.message);
    //   setIsDeleting(false);
    // }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back
      </button>

      {note.sourceUrl && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {note.faviconUrl && (
            <img src={note.faviconUrl} alt="" className="size-4 shrink-0" />
          )}
          <a>
            href={note.sourceUrl}
            target="_blank" rel="noreferrer" className="truncate
            hover:underline"
            {note.sourceTitle || note.sourceUrl}
          </a>
        </div>
      )}

      <p className="whitespace-pre-wrap text-sm text-foreground">
        {note.content}
      </p>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className={cn(
            buttonClassName,
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}

export default NoteDetailView;
