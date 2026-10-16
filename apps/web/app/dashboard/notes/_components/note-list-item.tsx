"use client";

import { DeleteNoteAlert } from "@/components/delete-note-alert";
import { EditNoteDialog } from "@/components/edit-note-dialog";
import { Highlight, matchExcerpt } from "@/components/highlight";
import { NoteFolderPill } from "@/components/note-folder-pill";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ViewNoteDialog } from "@/components/view-note-dialog";
import { getNoteSource } from "@/lib/note-source";
import { formatRelativeDate } from "@/lib/utils";
import {
  ArchiveIcon,
  DotsThreeVerticalIcon,
  EyeIcon,
  FileIcon,
  GlobeIcon,
  MinusCircleIcon,
  PencilSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react/dist/ssr";
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
  // Search terms to mark in the title and preview
  highlight?: string[];
  // Shown as a menu action when the list is a bundle's notes
  onRemoveFromBundle?: () => void;
};

export function NoteListItem({
  note,
  folders = [],
  tags = [],
  highlight,
  onRemoveFromBundle,
}: NoteListItemProps) {
  const source = getNoteSource(note);

  const [viewOpen, setViewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  return (
    <div className="hover:bg-background hover:border-edge hover:raised flex items-center gap-3.5 rounded-lg border border-transparent py-2.5 pr-2.5 pl-3 transition-[background-color,border-color,box-shadow] [--depth:2px]">
      <button
        type="button"
        onClick={() => setViewOpen(true)}
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-3.5 text-left"
      >
        <span
          className="bg-background flex size-9 shrink-0 items-center justify-center rounded-lg border"
          title={source?.label}
        >
          {note.faviconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={note.faviconUrl} className="size-4 object-cover" alt="" />
          ) : source?.href ? (
            <GlobeIcon className="text-muted-foreground size-4" />
          ) : (
            <FileIcon className="text-muted-foreground size-4" />
          )}
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold">
              {note.label ? (
                <Highlight text={note.label} terms={highlight} />
              ) : (
                "Untitled note"
              )}
            </span>
            {note.archived && (
              <Badge variant="outline" className="shrink-0">
                <ArchiveIcon />
                Archived
              </Badge>
            )}
          </span>
          <span className="text-muted-foreground truncate text-[13px]">
            <Highlight
              text={matchExcerpt(note.content, highlight, 30)}
              terms={highlight}
            />
          </span>
        </span>
      </button>

      <span className="hidden w-37.5 shrink-0 md:flex">
        <NoteFolderPill folder={note.folder} />
      </span>

      <span
        className="text-muted-foreground w-18 shrink-0 text-right text-xs tabular-nums"
        title={note.createdAt.toDateString()}
      >
        {formatRelativeDate(note.createdAt)}
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Note options"
              className="text-muted-foreground size-7"
            />
          }
        >
          <DotsThreeVerticalIcon className="size-4.5" weight="bold" />
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
          {onRemoveFromBundle && (
            <DropdownMenuItem onClick={onRemoveFromBundle}>
              <MinusCircleIcon />
              Remove from bundle
            </DropdownMenuItem>
          )}
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
