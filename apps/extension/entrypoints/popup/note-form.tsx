import { getFolders, getTags } from "@/lib/api";
import { cn } from "@/lib/utils";
import { createNoteSchema } from "@/lib/validation";
import type { CreateNote, Folder, Tag } from "@/types";
import { Plus, X } from "lucide-react";
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

  const [folders, setFolders] = useState<Folder[]>([]);
  const [tagSuggestions, setTagSuggestions] = useState<Tag[]>([]);
  const [tagDraft, setTagDraft] = useState("");

  useEffect(() => {
    getFolders().then((result) => {
      if (result.success) setFolders(result.data);
    });
    getTags().then((result) => {
      if (result.success) setTagSuggestions(result.data);
    });
  }, []);

  const addTag = () => {
    const value = tagDraft.trim().toLowerCase();
    if (value && !note.tags?.includes(value)) {
      setNote({ ...note, tags: [...(note.tags ?? []), value] });
    }
    setTagDraft("");
  };

  const removeTag = (tag: string) => {
    setNote({ ...note, tags: note.tags?.filter((t) => t !== tag) });
  };

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

      <div className="flex flex-col gap-1.5">
        <label htmlFor="note-folder" className="text-sm font-medium">
          Folder
        </label>
        <select
          id="note-folder"
          className={inputClassName}
          value={note.folderId ?? ""}
          onChange={(e) =>
            setNote({ ...note, folderId: e.target.value || undefined })
          }
        >
          <option value="">No folder</option>
          {folders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="note-tag-input" className="text-sm font-medium">
          Tags
        </label>
        <div className="flex items-center gap-2">
          <input
            id="note-tag-input"
            type="text"
            list="note-tag-suggestions"
            className={inputClassName}
            placeholder="Add a tag"
            value={tagDraft}
            onChange={(e) => setTagDraft(e.target.value.replace(/\s+/g, ""))}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Spacebar") {
                e.preventDefault();
                return;
              }
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <button
            type="button"
            onClick={addTag}
            disabled={!tagDraft.trim()}
            aria-label="Add tag"
            className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border bg-clip-padding outline-none transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
          >
            <Plus className="size-4" />
          </button>
        </div>

        {tagSuggestions.length > 0 && (
          <datalist id="note-tag-suggestions">
            {tagSuggestions
              .filter((tag) => !note.tags?.includes(tag.name))
              .map((tag) => (
                <option key={tag.id} value={tag.name} />
              ))}
          </datalist>
        )}

        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-clip-padding px-2.5 py-1 text-xs"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  aria-label={`Remove tag ${tag}`}
                  className="text-muted-foreground outline-none hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}
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
