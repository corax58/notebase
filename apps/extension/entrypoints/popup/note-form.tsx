import { NoteFolderSelect } from "@/components/note-folder-select";
import { NoteSourceCard } from "@/components/note-source-card";
import { NoteTagsInput } from "@/components/note-tags-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createNote, getFolders, updateNote } from "@/lib/api-client";
import { createNoteSchema } from "@/lib/validation";
import type { CreateNote, Folder, Note } from "@/types";
import type { FormEvent } from "react";

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

  useEffect(() => {
    getFolders().then((result) => {
      if (result.success) setFolders(result.data);
    });
  }, []);

  const handleDiscard = () => {
    onDone();
    setError(null);
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!note) return;

    // A new folder replaces the picked one rather than going alongside it
    const parsed = createNoteSchema.safeParse(
      note.newFolder ? { ...note, folderId: undefined } : note,
    );
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
        newFolder: data.newFolder,
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

      // A folder created with the note isn't in the fetched list yet
      const folder =
        folders.find((folder) => folder.id === result.data.folderId) ??
        (data.newFolder && result.data.folderId
          ? {
              id: result.data.folderId,
              name: data.newFolder.name,
              color: data.newFolder.color,
              userId: result.data.userId,
              createdAt: new Date(result.data.updatedAt),
              updatedAt: new Date(result.data.updatedAt),
            }
          : null);
      onDone({ ...result.data, folder });
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
    <form onSubmit={handleSave} className="flex flex-col gap-4 px-6 pt-4 pb-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold">
          {noteId ? "Edit note" : "Add a note"}
        </h2>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="note-content">Content</Label>
        <Textarea
          id="note-content"
          placeholder="Write your note..."
          className="min-h-34 resize-none"
          value={note.content}
          onChange={(e) => setNote({ ...note, content: e.target.value })}
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="note-folder">
          {note.newFolder ? "New folder" : "Folder"}
        </Label>
        <NoteFolderSelect
          id="note-folder"
          folders={folders}
          value={note.folderId}
          onChange={(folderId) => setNote({ ...note, folderId })}
          newFolder={note.newFolder}
          onNewFolderChange={(newFolder) => setNote({ ...note, newFolder })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="note-tag-input">Tags</Label>
        <NoteTagsInput
          id="note-tag-input"
          value={note.tags ?? []}
          onChange={(tags) => setNote({ ...note, tags })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="note-label">Label</Label>
        <Input
          id="note-label"
          type="text"
          placeholder="e.g. Reading list"
          value={note.label ?? ""}
          onChange={(e) => setNote({ ...note, label: e.target.value })}
          maxLength={100}
        />
      </div>

      {(note.sourceTitle || note.sourceUrl || note.faviconUrl) && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">Source</span>
          <NoteSourceCard
            faviconUrl={note.faviconUrl}
            sourceTitle={note.sourceTitle}
            sourceUrl={note.sourceUrl}
            onRemove={handleRemoveSource}
          />
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          disabled={isSaving}
          onClick={handleDiscard}
        >
          {noteId ? "Cancel" : "Discard"}
        </Button>
        <Button type="submit" className="flex-1" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save note"}
        </Button>
      </div>
    </form>
  );
};

export default NoteForm;
