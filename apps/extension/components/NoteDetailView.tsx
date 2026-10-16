import { useState, type ElementType, type ReactNode } from "react";
import {
  ArchiveIcon,
  ArrowLeftIcon,
  ArrowSquareOutIcon,
  CalendarBlankIcon,
  FileIcon,
  GlobeIcon,
  HashIcon,
  PencilSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import type { Note } from "@/types";
import { NoteFolderPill } from "@/components/note-folder-pill";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteNote } from "@/lib/api-client";
import { getNoteSource } from "@/lib/note-source";
import { formatRelativeDate } from "@/lib/utils";

interface NoteDetailViewProps {
  note: Note;
  onBack: () => void;
  onEdit: () => void;
  onDeleted: (noteId: string) => void;
}

function formatDate(value: Date) {
  return value.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// One labelled line of the details list, as in the web app's note view
function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: ElementType;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[5.5rem_1fr] items-start gap-3 py-2.5">
      <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon className="size-4 shrink-0" />
        {label}
      </dt>
      <dd className="min-w-0 text-sm">{children}</dd>
    </div>
  );
}

function NoteDetailView({
  note,
  onBack,
  onEdit,
  onDeleted,
}: NoteDetailViewProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string>();

  const source = getNoteSource(note);
  const createdAt = new Date(note.createdAt);
  const updatedAt = new Date(note.updatedAt);
  const wasEdited = note.updatedAt !== note.createdAt;

  const trimmed = note.content.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
  const readingMinutes = Math.max(1, Math.round(wordCount / 200));

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(undefined);
    const result = await deleteNote(note.id);
    if (result.success) {
      onDeleted(note.id);
    } else {
      setError(result.message);
      setIsDeleting(false);
      setIsConfirmingDelete(false);
    }
  };

  return (
    <div className="flex h-full flex-col gap-4 px-6 pt-3 pb-6">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="-ml-3 w-fit text-muted-foreground"
        onClick={onBack}
      >
        <ArrowLeftIcon data-icon="inline-start" />
        Back
      </Button>

      <div className="-mx-2 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-2">
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <NoteFolderPill folder={note.folder} />
            {note.archived && (
              <Badge variant="outline">
                <ArchiveIcon />
                Archived
              </Badge>
            )}
          </div>
          <h2 className="text-xl leading-tight font-semibold tracking-tight wrap-break-word">
            {note.label || "Untitled note"}
          </h2>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span title={formatDate(createdAt)}>
              Created {formatRelativeDate(createdAt)}
            </span>
            <span aria-hidden>·</span>
            <span>
              {wordCount.toLocaleString()} {wordCount === 1 ? "word" : "words"}
            </span>
            <span aria-hidden>·</span>
            <span>{readingMinutes} min read</span>
          </p>
        </div>

        <div className="rounded-lg border bg-muted/40 p-3">
          <p className="text-sm leading-relaxed wrap-break-word whitespace-pre-wrap text-foreground">
            {note.content || (
              <span className="text-muted-foreground italic">
                This note is empty.
              </span>
            )}
          </p>
        </div>

        <div>
          <h3 className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Details
          </h3>
          <dl className="divide-y">
            <DetailRow icon={GlobeIcon} label="Source">
              {source?.href ? (
                <a
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  title={source.href}
                  className="group flex min-w-0 items-center gap-2 hover:underline"
                >
                  {note.faviconUrl ? (
                    <img
                      src={note.faviconUrl}
                      className="size-4 shrink-0 rounded-sm object-cover"
                      alt=""
                    />
                  ) : (
                    <GlobeIcon className="size-4 shrink-0 text-muted-foreground" />
                  )}
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate">{source.label}</span>
                    {source.hostname && source.hostname !== source.label && (
                      <span className="truncate text-xs text-muted-foreground">
                        {source.hostname}
                      </span>
                    )}
                  </span>
                  <ArrowSquareOutIcon className="size-3.5 shrink-0 text-muted-foreground" />
                </a>
              ) : source ? (
                <span className="flex min-w-0 items-center gap-2">
                  <FileIcon className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{source.label}</span>
                </span>
              ) : (
                <span className="text-muted-foreground">Added manually</span>
              )}
            </DetailRow>

            <DetailRow icon={CalendarBlankIcon} label="Created">
              <span>{formatDate(createdAt)}</span>
              {wasEdited && (
                <span className="block text-xs text-muted-foreground">
                  Edited {formatDate(updatedAt)}
                </span>
              )}
            </DetailRow>

            <DetailRow icon={HashIcon} label="Tags">
              {note.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {note.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="max-w-full">
                      <span className="truncate">#{tag}</span>
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="text-muted-foreground">No tags</span>
              )}
            </DetailRow>
          </dl>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {isConfirmingDelete ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Permanently delete this note? This can't be undone.
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={isDeleting}
              onClick={() => setIsConfirmingDelete(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="flex-1"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? "Deleting..." : "Delete note"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setIsConfirmingDelete(true)}
          >
            <TrashIcon data-icon="inline-start" />
            Delete
          </Button>
          <Button type="button" className="flex-1" onClick={onEdit}>
            <PencilSimpleIcon data-icon="inline-start" />
            Edit note
          </Button>
        </div>
      )}
    </div>
  );
}

export default NoteDetailView;
