"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArchiveIcon,
  ClockIcon,
  EyeIcon,
  FolderIcon,
  GlobeIcon,
  DotsThreeVerticalIcon,
  PencilSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeleteNoteAlert } from "@/components/delete-note-alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditNoteDialog } from "@/components/edit-note-dialog";
import { ViewNoteDialog } from "@/components/view-note-dialog";
import { formatRelativeDate } from "@/lib/utils";
import { Separator } from "./ui/separator";

type Folder = { id: string; name: string; color: string | null };
type Tag = { id: string; name: string };

type NoteCardProps = {
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

export function NoteCard({ note, folders = [], tags = [] }: NoteCardProps) {
  let hostname: string | null = note.sourceTitle;

  if (note.sourceUrl && !note.sourceTitle) {
    try {
      hostname = new URL(note.sourceUrl).hostname.replace(/^www\./, "");
    } catch {
      hostname = null;
    }
  }

  const hasBadges = note.archived || note.label || note.tags.length > 0;

  const [viewOpen, setViewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  return (
    <Card size="sm" className="flex flex-col gap-2 rounded-xs py-3">
      <CardHeader className="flex flex-row items-center justify-between gap-2 border-b pb-2!">
        <div className="min-w-0">
          {note.folder ? (
            <Link
              href={`/dashboard/notes?folder=${note.folder.id}`}
              className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1 text-xs font-medium hover:underline"
              style={
                note.folder.color ? { color: note.folder.color } : undefined
              }
            >
              <FolderIcon className="size-3.5" weight="fill" />
              {note.folder.name}
            </Link>
          ) : (
            <div className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1 text-xs font-medium hover:underline">
              {" "}
              <FolderIcon className="size-3.5" weight="fill" />
              No folder
            </div>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon-sm" />}
          >
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
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-start gap-3 pt-0!">
        <button
          type="button"
          onClick={() => setViewOpen(true)}
          className="block w-full cursor-pointer text-left"
        >
          <CardTitle className="mt-1 line-clamp-1 text-xl font-semibold hover:underline">
            {note.label ?? "Untitled note"}
          </CardTitle>
          <div className="mt-2 line-clamp-4">{note.content}</div>
        </button>

        {hasBadges && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {note.archived && (
              <Badge variant="outline">
                <ArchiveIcon />
                Archived
              </Badge>
            )}
            {note.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <Separator />
      <CardFooter className="flex items-center">
        <div className="text-muted-foreground flex w-full items-center justify-between gap-2 text-xs">
          {note.sourceUrl ? (
            <a
              href={note.sourceUrl ?? undefined}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground flex min-w-0 items-center gap-1 truncate hover:underline"
            >
              {note.faviconUrl ? (
                <img
                  src={note.faviconUrl}
                  className="size-3.5 shrink-0 object-cover"
                  alt={`${hostname} favicon`}
                />
              ) : (
                <GlobeIcon className="size-3.5 shrink-0" />
              )}

              <span className="truncate">{hostname}</span>
            </a>
          ) : (
            <span />
          )}
          <span
            className="flex shrink-0 items-center gap-1"
            title={note.createdAt.toDateString()}
          >
            <ClockIcon className="size-3.5" />
            {formatRelativeDate(note.createdAt)}
          </span>
        </div>
      </CardFooter>
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
    </Card>
  );
}
