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
import { FolderChip, folderColor } from "@/components/folder-chip";
import { Highlight } from "@/components/highlight";
import { Button } from "@/components/ui/button";

type FolderCardProps = {
  folder: {
    id: string;
    name: string;
    color: string | null;
    noteCount: number;
  };
  // Search terms to mark in the name
  highlight?: string[];
};

// A paper peeking out of the folder, white in both themes like real paper
const paperClassName = "absolute h-9 rounded-[2px_3px_3px_2px] border bg-white";

export function FolderCard({ folder, highlight }: FolderCardProps) {
  const href = `/dashboard/folders/${folder.id}`;
  const color = folderColor(folder);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  // Lifts by hand rather than with `pressable`, which would also sink the
  // card whenever its menu button is pressed
  return (
    <article className="bg-card border-edge raised flex flex-col overflow-hidden rounded-xl border transition-[translate,box-shadow] duration-120 hover:-translate-y-0.5 hover:[--depth:5px]">
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden
        className="bg-input/40 flex aspect-16/10 w-full items-center justify-center border-b bg-[radial-gradient(color-mix(in_oklch,var(--foreground)_14%,transparent)_1px,transparent_1px)] bg-size-[18px_18px] bg-center"
      >
        <div className="relative size-28">
          <FolderIcon
            weight="fill"
            className="absolute top-1 left-1 size-26 rotate-180"
            style={{ color: `color-mix(in oklch, ${color}, black 18%)` }}
          />

          {/* Fuller folders hold more papers */}
          {folder.noteCount >= 20 && (
            <div
              className={`${paperClassName} top-4 left-4.5 w-16 -rotate-6`}
            />
          )}
          {folder.noteCount >= 5 && (
            <div
              className={`${paperClassName} top-5.5 left-3.5 w-18 rotate-3`}
            />
          )}
          <div className={`${paperClassName} top-7 left-3.5 w-19.5`} />

          <FolderIcon
            weight="fill"
            className="absolute inset-0 z-10 size-28"
            style={{ color }}
          />
          {/* highlight: same icon, white, faded top-to-bottom via mask */}
          <FolderIcon
            weight="fill"
            className="absolute inset-0 z-10 size-28 text-white opacity-45"
            style={{
              maskImage: "linear-gradient(to bottom, black, transparent 75%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black, transparent 75%)",
            }}
          />
        </div>
      </Link>
      <div className="flex items-center gap-2 py-3 pr-2.5 pl-3.5">
        <Link href={href} className="flex min-w-0 flex-1 items-center gap-3">
          <FolderChip color={color} />
          <span className="flex min-w-0 flex-1 flex-col gap-px">
            <span className="truncate text-[15px] font-bold tracking-[-0.02em]">
              <Highlight text={folder.name} terms={highlight} />
            </span>
            <span className="text-muted-foreground text-xs tabular-nums">
              {folder.noteCount} {folder.noteCount === 1 ? "note" : "notes"}
            </span>
          </span>
        </Link>
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
      </div>

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
    </article>
  );
}
