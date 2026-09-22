"use client";

import { DeleteNoteAlert } from "@/components/delete-note-alert";
import { EditNoteDialog } from "@/components/edit-note-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ViewNoteDialog } from "@/components/view-note-dialog";
import { formatRelativeDate } from "@/lib/utils";
import {
  ArchiveIcon,
  DotsThreeVerticalIcon,
  EyeIcon,
  FolderIcon,
  GlobeIcon,
  PencilSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import * as React from "react";

type Folder = { id: string; name: string; color: string | null };
type Tag = { id: string; name: string };

type NoteListItemProps = {
  note: {
    id: string;
    content: string;
    sourceTitle: string | null;
    sourceUrl: string | null;
    label: string | null;
    archived: boolean;
    faviconUrl: string | null;
    createdAt: Date;
    folder: { id: string; name: string; color: string | null } | null;
    tags: string[];
  };
  folders?: Folder[];
  tags?: Tag[];
};

export function NoteListItem({
  note,
  folders = [],
  tags = [],
}: NoteListItemProps) {
  let hostname: string | null = note.sourceTitle;

  if (note.sourceUrl && !note.sourceTitle) {
    try {
      hostname = new URL(note.sourceUrl).hostname.replace(/^www\./, "");
    } catch {
      hostname = null;
    }
  }

  const [viewOpen, setViewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const visibleTags = note.tags.slice(0, 3);
  const extraTags = note.tags.length - visibleTags.length;

  return (
    <div className="hover:bg-muted/40 flex items-center gap-4 px-4 py-3 transition-colors">
      <button
        type="button"
        onClick={() => setViewOpen(true)}
        className="flex min-w-0 flex-1 cursor-pointer flex-col gap-1 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold">
            {note.label ?? "Untitled note"}
          </span>
          {note.archived && (
            <Badge variant="outline" className="shrink-0">
              <ArchiveIcon />
              Archived
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground line-clamp-1 text-sm">
          {note.content}
        </p>
      </button>

      <div className="hidden w-36 shrink-0 md:block">
        {note.folder ? (
          <Link
            href={`/dashboard/folders/${note.folder.id}`}
            className="text-muted-foreground hover:text-foreground flex w-fit max-w-full items-center gap-1.5 text-xs font-medium hover:underline"
            style={note.folder.color ? { color: note.folder.color } : undefined}
          >
            <FolderIcon className="size-3.5 shrink-0" weight="fill" />
            <span className="truncate">{note.folder.name}</span>
          </Link>
        ) : (
          <span className="text-muted-foreground/60 flex items-center gap-1.5 text-xs">
            <FolderIcon className="size-3.5" />
            No folder
          </span>
        )}
      </div>

      <div className="hidden w-48 shrink-0 items-center gap-1 lg:flex">
        {visibleTags.map((tag) => (
          <Badge key={tag} variant="secondary" className="max-w-20 truncate">
            #{tag}
          </Badge>
        ))}
        {extraTags > 0 && (
          <span className="text-muted-foreground text-xs">+{extraTags}</span>
        )}
      </div>

      <div className="text-muted-foreground hidden w-32 shrink-0 xl:block">
        {note.sourceUrl ? (
          <a
            href={note.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground flex items-center gap-1.5 text-xs hover:underline"
          >
            {note.faviconUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={note.faviconUrl}
                className="size-3.5 shrink-0 object-cover"
                alt=""
              />
            ) : (
              <GlobeIcon className="size-3.5 shrink-0" />
            )}
            <span className="truncate">{hostname}</span>
          </a>
        ) : null}
      </div>

      <span
        className="text-muted-foreground w-24 shrink-0 text-right text-xs"
        title={note.createdAt.toDateString()}
      >
        {formatRelativeDate(note.createdAt)}
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
          <DotsThreeVerticalIcon className="size-5" weight="bold" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setViewOpen(true)}>
            <EyeIcon />
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <PencilSimpleIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ViewNoteDialog
        note={note}
        open={viewOpen}
        onOpenChange={setViewOpen}
        onEdit={() => {
          setViewOpen(false);
          setEditOpen(true);
        }}
        onDelete={() => {
          setViewOpen(false);
          setDeleteOpen(true);
        }}
      />
      <EditNoteDialog
        note={{
          id: note.id,
          content: note.content,
          label: note.label,
          folderId: note.folder?.id ?? null,
          tags: note.tags,
          sourceTitle: note.sourceTitle,
          sourceUrl: note.sourceUrl,
        }}
        folders={folders}
        tags={tags}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeleteNoteAlert
        noteId={note.id}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
}
