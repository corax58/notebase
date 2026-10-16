"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArchiveIcon,
  ClockIcon,
  EyeIcon,
  FileIcon,
  GlobeIcon,
  DotsThreeVerticalIcon,
  PencilSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { DeleteNoteAlert } from "@/components/delete-note-alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditNoteDialog } from "@/components/edit-note-dialog";
import { Highlight, matchExcerpt } from "@/components/highlight";
import { NoteFolderPill } from "@/components/note-folder-pill";
import { ViewNoteDialog } from "@/components/view-note-dialog";
import { notesHref } from "@/lib/note-filters";
import { getNoteSource } from "@/lib/note-source";
import { cn, formatRelativeDate } from "@/lib/utils";

// A tag or the archived mark, under the note's preview
const tagClassName =
  "bg-background inline-flex h-5.5 items-center rounded-[7px] border px-1.75 text-xs font-semibold";

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
  // Search terms to mark in the title and preview
  highlight?: string[];
};

export function NoteCard({
  note,
  folders = [],
  tags = [],
  highlight,
}: NoteCardProps) {
  const source = getNoteSource(note);

  const hasBadges = note.archived || note.label || note.tags.length > 0;

  const [viewOpen, setViewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  return (
    <article className="bg-card border-edge raised flex flex-col overflow-hidden rounded-xl border transition-[translate,box-shadow] duration-120 hover:-translate-y-0.5 hover:[--depth:5px]">
      <div className="flex items-center justify-between gap-2 pt-3 pr-2.5 pl-4">
        <NoteFolderPill
          folder={note.folder}
          href={
            note.folder ? notesHref({ folders: [note.folder.id] }) : undefined
          }
        />
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
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <TrashIcon />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-1 flex-col gap-2 px-4 pt-2.5 pb-3.5">
        <button
          type="button"
          onClick={() => setViewOpen(true)}
          className="flex w-full cursor-pointer flex-col gap-2 text-left"
        >
          <h3 className="line-clamp-2 text-[17px] leading-[1.3] font-bold tracking-[-0.02em] text-pretty">
            {note.label ? (
              <Highlight text={note.label} terms={highlight} />
            ) : (
              "Untitled note"
            )}
          </h3>
          <p className="text-foreground/75 line-clamp-3 text-sm leading-[1.55]">
            <Highlight
              text={matchExcerpt(note.content, highlight, 120)}
              terms={highlight}
            />
          </p>
        </button>

        {hasBadges && (
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {note.archived && (
              <span className={tagClassName}>
                <ArchiveIcon className="text-muted-foreground mr-1 size-3" />
                Archived
              </span>
            )}
            {note.tags.map((tag) => (
              <Link
                key={tag}
                href={notesHref({ tags: [tag] })}
                prefetch={false}
                className={cn(tagClassName, "hover:border-edge")}
              >
                <span className="text-primary">#</span>
                {tag}
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className="bg-background/60 text-muted-foreground mt-auto flex items-center justify-between gap-2 border-t px-4 py-2.5 text-xs">
        {source?.href ? (
          <a
            href={source.href}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground flex min-w-0 items-center gap-1.5 hover:underline"
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
            <span className="truncate">{source.label}</span>
          </a>
        ) : source ? (
          <span className="flex min-w-0 items-center gap-1.5">
            <FileIcon className="size-3.5 shrink-0" />
            <span className="truncate">{source.label}</span>
          </span>
        ) : (
          <span />
        )}
        <span
          className="flex shrink-0 items-center gap-1 tabular-nums"
          title={note.createdAt.toDateString()}
        >
          <ClockIcon className="size-3.5" />
          {formatRelativeDate(note.createdAt)}
        </span>
      </div>
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
    </article>
  );
}
