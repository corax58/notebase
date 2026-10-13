import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createNote,
  getFolders,
  getTags,
  updateNote,
} from "@/lib/api-client";
import { createNoteSchema } from "@/lib/validation";
import type { CreateNote, Folder, Note, Tag } from "@/types";
import { X } from "lucide-react";
import React, { type FormEvent } from "react";

const RECENT_TAG_LIMIT = 10;

const NoteForm = ({
  initialNote,
  noteId,
  onDone,
}: {
  initialNote: CreateNote;
  // Set when editing an existing note instead of creating a new one
  noteId?: string;
  // Receives the updated note after a successful edit
  onDone: (saved?: Note) => void;
}) => {
  const [note, setNote] = useState<CreateNote>(initialNote);

  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [folders, setFolders] = useState<Folder[]>([]);
  const [tagSuggestions, setTagSuggestions] = useState<Tag[]>([]);
  const [tagInputValue, setTagInputValue] = useState("");
  const [highlightedTag, setHighlightedTag] = useState<string | null>(null);
  const tagAnchor = useComboboxAnchor();

  useEffect(() => {
    getFolders().then((result) => {
      if (result.success) setFolders(result.data);
    });
    getTags().then((result) => {
      if (result.success) setTagSuggestions(result.data);
    });
  }, []);

  const selectedFolder =
    folders.find((folder) => folder.id === note.folderId) ?? null;

  const tags = note.tags ?? [];

  const tagItems = useMemo(
    () =>
      tagSuggestions
        .map((tag) => tag.name)
        .filter((name) => !tags.includes(name)),
    [tagSuggestions, tags],
  );

  const setTags = (next: string[]) => {
    setNote({ ...note, tags: next });
  };

  const addTag = (value: string) => {
    const next = value.trim().toLowerCase();
    if (next && !tags.includes(next)) {
      setNote({ ...note, tags: [...tags, next] });
    }
    setTagInputValue("");
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

    if (noteId) {
      const { data } = parsed;
      // Send explicit nulls so cleared fields are removed, not left as-is
      const result = await updateNote(noteId, {
        content: data.content,
        label: data.label || null,
        folderId: data.folderId ?? null,
        sourceUrl: data.sourceUrl ?? null,
        sourceTitle: data.sourceTitle ?? null,
        faviconUrl: data.faviconUrl ?? null,
        tags: data.tags ?? [],
      });
      setIsSaving(false);

      if (!result.success) {
        setError(result.message);
        return;
      }

      onDone({
        ...result.data,
        folder:
          folders.find((folder) => folder.id === result.data.folderId) ?? null,
      });
      return;
    }

    const response = await createNote(parsed.data);
    setIsSaving(false);

    if (!response.success) {
      setError(response.message);
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
        <Input
          id="note-label"
          type="text"
          value={note.label ?? ""}
          onChange={(e) => setNote({ ...note, label: e.target.value })}
          placeholder="Add a label (optional)"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="note-content" className="text-sm font-medium">
          Note
        </label>
        <Textarea
          id="note-content"
          className="min-h-34 resize-none"
          value={note.content}
          onChange={(e) => setNote({ ...note, content: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="note-folder" className="text-sm font-medium">
          Folder
        </label>
        <Combobox
          items={folders}
          value={selectedFolder}
          onValueChange={(folder: Folder | null) =>
            setNote({ ...note, folderId: folder?.id })
          }
          itemToStringLabel={(folder: Folder) => folder.name}
        >
          <ComboboxInput id="note-folder" placeholder="No folder" showClear />
          <ComboboxContent>
            <ComboboxEmpty>No matching folders</ComboboxEmpty>
            <ComboboxList>
              {(folder: Folder) => (
                <ComboboxItem key={folder.id} value={folder}>
                  <span className="truncate">{folder.name}</span>
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="note-tag-input" className="text-sm font-medium">
          Tags
        </label>
        <Combobox
          multiple
          items={tagItems}
          // Tags arrive most recently used first, so the cap leaves the latest
          // ones until a query narrows the list
          limit={tagInputValue.trim() ? -1 : RECENT_TAG_LIMIT}
          value={tags}
          onValueChange={setTags}
          inputValue={tagInputValue}
          onInputValueChange={setTagInputValue}
          onItemHighlighted={(item) =>
            setHighlightedTag((item as string | undefined) ?? null)
          }
        >
          <ComboboxChips ref={tagAnchor}>
            {tags.map((tag) => (
              <ComboboxChip key={tag} aria-label={`Remove tag ${tag}`}>
                #{tag}
              </ComboboxChip>
            ))}
            <ComboboxChipsInput
              id="note-tag-input"
              placeholder={tags.length ? undefined : "Add a tag"}
              onKeyDown={(e) => {
                if (e.key === "Enter" && highlightedTag === null) {
                  e.preventDefault();
                  addTag(tagInputValue);
                }
              }}
            />
          </ComboboxChips>
          <ComboboxContent anchor={tagAnchor}>
            <ComboboxEmpty>No matching tags</ComboboxEmpty>
            <ComboboxList>
              {(name: string) => (
                <ComboboxItem key={name} value={name}>
                  #{name}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      {(note.sourceTitle || note.sourceUrl || note.faviconUrl) && (
        <div className="relative flex items-start gap-2 rounded-lg border border-border bg-clip-padding px-3 py-2 pr-8 text-xs text-muted-foreground">
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
          {noteId ? "Cancel" : "Discard"}
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
