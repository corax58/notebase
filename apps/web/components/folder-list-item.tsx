"use client";

import * as React from "react";
import Link from "next/link";
import {
  FolderIcon,
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
import { Button } from "@/components/ui/button";

type FolderListItemProps = {
  folder: {
    id: string;
    name: string;
    color: string | null;
    noteCount: number;
  };
};

export function FolderListItem({ folder }: FolderListItemProps) {
  const href = `/dashboard/folders/${folder.id}`;
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  return (
    <div className="hover:bg-muted/40 flex items-center gap-4 px-4 py-3 transition-colors">
      <Link href={href} className="flex min-w-0 flex-1 items-center gap-3">
        <div
          className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg"
          style={
            folder.color
              ? { backgroundColor: `${folder.color}1a`, color: folder.color }
              : undefined
          }
        >
          <FolderIcon className="size-4" weight="fill" />
        </div>
        <span className="truncate text-sm font-medium">{folder.name}</span>
      </Link>

      <span className="text-muted-foreground w-24 shrink-0 text-right text-xs">
        {folder.noteCount} {folder.noteCount === 1 ? "note" : "notes"}
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
          <DotsThreeVerticalIcon className="size-5" weight="bold" />
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
