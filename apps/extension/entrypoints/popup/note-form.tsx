import { cn } from "@/lib/utils";
import { createNoteSchema } from "@/lib/validation";
import type { CreateNote } from "@/types";
import { X } from "lucide-react";
import React, { type FormEvent } from "react";

const inputClassName = cn(
  "w-full rounded-md border border-border bg-clip-padding px-3 py-2 text-sm outline-none",
  "focus-visible:ring-[3px] focus-visible:ring-ring/50",
);

interface SaveNoteResponse {
  success: boolean;
  message: string;
}

const NoteForm = ({
  initialNote,
  onDone,
}: {
  initialNote: CreateNote;
  onDone: () => void;
}) => {
  const [note, setNote] = useState<CreateNote>(initialNote);

  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleDiscard = () => {
    onDone();
    setError(null);
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!note) return;

    const parsed = createNoteSchema.safeParse(note);
    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ??
          "Please check your note and try again.",
      );
      return;
    }

    setError(null);
    setIsSaving(true);
    const response: SaveNoteResponse = await browser.runtime.sendMessage({
      type: "SAVE_NOTE_REMOTE",
      note: parsed.data,
    });
    setIsSaving(false);

    if (!response?.success) {
      setError(
        response?.message ?? "Something went wrong while saving your note.",
      );
      return;
    }

    onDone();
  };

  const handleRemoveSource = () => {
    if (!note) return;
    setNote({
      ...note,
      sourceUrl: undefined,
      sourceTitle: undefined,
      faviconUrl: undefined,
    });
  };
  return (
    <form
      onSubmit={handleSave}
      className="flex flex-col gap-4 border-t border-border px-6 py-6"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="note-label" className="text-sm font-medium">
          Label
        </label>
        <input
          id="note-label"
          type="text"
          className={inputClassName}
          value={note.label ?? ""}
          onChange={(e) => setNote({ ...note, label: e.target.value })}
          placeholder="Add a label (optional)"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="note-content" className="text-sm font-medium">
          Note
        </label>
        <textarea
          id="note-content"
          rows={6}
          className={cn(inputClassName, "resize-none")}
          value={note.content}
          onChange={(e) => setNote({ ...note, content: e.target.value })}
        />
      </div>

      {(note.sourceTitle || note.sourceUrl || note.faviconUrl) && (
        <div className="relative flex items-start gap-2 rounded-md border border-border bg-clip-padding px-3 py-2 pr-8 text-xs text-muted-foreground">
          {note.faviconUrl && (
            <img
              src={note.faviconUrl}
              alt=""
              className="mt-0.5 size-4 shrink-0"
            />
          )}
          <div className="flex min-w-0 flex-col gap-0.5">
            {note.sourceTitle && (
              <span className="truncate text-foreground">
                {note.sourceTitle}
              </span>
            )}
            {note.sourceUrl && (
              <span className="truncate">{note.sourceUrl}</span>
            )}
          </div>
          <button
            type="button"
            onClick={handleRemoveSource}
            aria-label="Remove source"
            className="absolute top-1.5 right-1.5 inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleDiscard}
          disabled={isSaving}
          className="inline-flex flex-1 cursor-pointer items-center justify-center rounded-4xl border border-border bg-clip-padding px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors outline-none select-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
        >
          Discard
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex flex-1 cursor-pointer items-center justify-center rounded-4xl border border-transparent bg-primary px-4 py-2 text-sm font-medium whitespace-nowrap text-primary-foreground transition-colors outline-none select-none hover:opacity-90 focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
