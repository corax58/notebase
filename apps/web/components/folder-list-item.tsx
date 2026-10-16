"use client";

import * as React from "react";
import Link from "next/link";
import {
  DotsThreeVerticalIcon,
  PencilSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react/dist/ssr";
import { DeleteFolderAlert } from "@/components/delete-folder-alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditFolderDialog } from "@/components/edit-folder-dialog";
import { FolderChip, folderColor } from "@/components/folder-chip";
import { Highlight } from "@/components/highlight";
import { Button } from "@/components/ui/button";

type FolderListItemProps = {
  folder: {
    id: string;
    name: string;
    color: string | null;
    noteCount: number;
  };
  // The note count of the fullest folder, whose bar fills its track
  mostNotes: number;
  // Search terms to mark in the name
  highlight?: string[];
};

export function FolderListItem({
  folder,
  mostNotes,
  highlight,
}: FolderListItemProps) {
  const href = `/dashboard/folders/${folder.id}`;
  const color = folderColor(folder);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  // Any folder with notes gets at least a sliver, so it never reads as empty
  const fill =
    folder.noteCount > 0
      ? Math.max(3, Math.round((folder.noteCount / mostNotes) * 100))
      : 0;

  return (
    <div className="hover:bg-background hover:border-edge hover:raised flex items-center gap-3.5 rounded-lg border border-transparent py-2.5 pr-2.5 pl-3 transition-[background-color,border-color,box-shadow] [--depth:2px]">
      <Link href={href} className="flex min-w-0 flex-1 items-center gap-3.5">
        <FolderChip color={color} />
        <span className="truncate text-sm font-semibold">
          <Highlight text={folder.name} terms={highlight} />
        </span>
      </Link>

      <span className="bg-muted block h-1.5 w-40 min-w-15 shrink overflow-hidden rounded-[3px] max-sm:hidden">
        <span
          className="block h-full rounded-[3px]"
          style={{ width: `${fill}%`, background: color }}
        />
      </span>

      <span className="text-muted-foreground w-18 shrink-0 text-right text-xs tabular-nums">
        {folder.noteCount} {folder.noteCount === 1 ? "note" : "notes"}
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`${folder.name} options`}
              className="text-muted-foreground size-7"
            />
          }
        >
          <DotsThreeVerticalIcon className="size-4.5" weight="bold" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
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

      <EditFolderDialog
        folder={folder}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeleteFolderAlert
        folderId={folder.id}
        folderName={folder.name}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
}
