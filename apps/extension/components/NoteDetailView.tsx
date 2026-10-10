import { useState } from "react";
import {
  Archive,
  ArrowLeft,
  ExternalLink,
  Folder,
  Globe,
  Pencil,
  Trash2,
} from "lucide-react";
import type { Note } from "@/types";
import { deleteNote } from "@/lib/api";
import { cn } from "@/lib/utils";

interface NoteDetailViewProps {
  note: Note;
  onBack: () => void;
  onEdit: () => void;
  onDeleted: (noteId: string) => void;
}

const buttonClassName = cn(
  "inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-4xl",
  "border border-border bg-clip-padding px-4 py-2 text-sm font-medium",
  "whitespace-nowrap transition-colors outline-none select-none",
  "hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50",
  "disabled:pointer-events-none disabled:opacity-50",
);

const sectionLabelClassName = "text-xs font-medium text-muted-foreground";

// Only http(s) sources are linked; anything else is shown as plain text
function parseSourceUrl(url: string | null) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return {
      href: parsed.href,
      hostname: parsed.hostname.replace(/^www\./, ""),
    };
  } catch {
    return null;
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
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

  const source = parseSourceUrl(note.sourceUrl);
  const sourceTitle =
    note.sourceTitle || source?.hostname || note.sourceUrl || "";
  const wasEdited = note.updatedAt !== note.createdAt;

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

  const sourceDetails = (
    <>
      {note.faviconUrl ? (
        <img src={note.faviconUrl} alt="" className="size-4 shrink-0" />
      ) : (
        <Globe className="size-4 shrink-0" />
      )}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-foreground">{sourceTitle}</span>
        {source && sourceTitle !== source.hostname && (
          <span className="truncate">{source.hostname}</span>
        )}
      </span>
    </>
  );

  const sourceClassName =
    "flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground";

  return (
    <div className="flex h-full flex-col gap-4 px-6 pb-6">
      <button
        type="button"
        onClick={onBack}
        className="flex w-fit cursor-pointer items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back
      </button>

      <div className="-mx-2 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-2">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
            <span
              className="flex min-w-0 items-center gap-1"
              style={
                note.folder?.color ? { color: note.folder.color } : undefined
              }
            >
              <Folder className="size-3.5 shrink-0" />
              <span className="truncate">
                {note.folder?.name ?? "No folder"}
              </span>
            </span>
            {note.archived && (
              <span className="flex items-center gap-1 rounded-sm border border-border px-1.5 py-0.5">
                <Archive className="size-3" />
                Archived
              </span>
            )}
          </div>
          <h2 className="text-base font-semibold wrap-break-word text-foreground">
            {note.label || "Untitled note"}
          </h2>
          <p className="text-xs text-muted-foreground">
            Created {formatDate(note.createdAt)}
            {wasEdited && ` · Edited ${formatDate(note.updatedAt)}`}
          </p>
        </div>

        <p className="rounded-lg border border-border bg-muted/40 p-3 text-sm wrap-break-word whitespace-pre-wrap text-foreground">
          {note.content}
        </p>

        {note.tags.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <span className={sectionLabelClassName}>Tags</span>
            <ul className="flex flex-wrap gap-1.5">
              {note.tags.map((tag) => (
                <li
                  key={tag}
                  className="max-w-full truncate rounded-sm bg-muted px-1.5 py-0.5 text-xs font-medium text-foreground"
                >
                  #{tag}
                </li>
              ))}
            </ul>
          </div>
        )}

        {sourceTitle && (
          <div className="flex flex-col gap-1.5">
            <span className={sectionLabelClassName}>Source</span>
            {source ? (
              <a
                href={source.href}
                target="_blank"
                rel="noreferrer"
                title={source.href}
                className={cn(
                  sourceClassName,
                  "transition-colors hover:bg-accent",
                )}
              >
                {sourceDetails}
                <ExternalLink className="size-3.5 shrink-0" />
              </a>
            ) : (
              <div className={sourceClassName}>{sourceDetails}</div>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {isConfirmingDelete ? (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsConfirmingDelete(false)}
            disabled={isDeleting}
            className={buttonClassName}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className={cn(
              buttonClassName,
              "border-transparent bg-destructive text-white hover:bg-destructive hover:opacity-90",
            )}
          >
            {isDeleting ? "Deleting..." : "Delete note"}
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsConfirmingDelete(true)}
            className={cn(buttonClassName, "text-destructive")}
          >
            <Trash2 className="size-4" />
            Delete
          </button>
          <button
            type="button"
            onClick={onEdit}
            className={cn(
              buttonClassName,
              "border-transparent bg-primary text-primary-foreground hover:bg-primary hover:opacity-90",
            )}
          >
            <Pencil className="size-4" />
            Edit
          </button>
        </div>
      )}
    </div>
  );
}

export default NoteDetailView;
