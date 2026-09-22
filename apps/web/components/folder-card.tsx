"use client";

import * as React from "react";
import Link from "next/link";
import {
  FolderIcon,
  DotsThreeVerticalIcon,
  PencilSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteFolderAlert } from "@/components/delete-folder-alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditFolderDialog } from "@/components/edit-folder-dialog";
import { Button } from "./ui/button";
import { Folder } from "lucide-react";

type FolderCardProps = {
  folder: {
    id: string;
    name: string;
    color: string | null;
    noteCount: number;
  };
};

export function FolderCard({ folder }: FolderCardProps) {
  const href = `/dashboard/folders/${folder.id}`;
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  return (
    <Card key={folder.id} size="sm" className="rounded-md py-0">
      <CardContent className="p-0">
        <Link
          href={href}
          className="bg-secondary flex aspect-video w-full items-center justify-center"
        >
          <div className="relative size-32">
            <FolderIcon
              weight="fill"
              className="absolute inset-1 size-30 rotate-180"
              style={folder.color ? { color: folder.color } : undefined}
            />

            <div className="absolute inset-x-4 inset-y-7 z-0 h-10 w-20 rounded-r-sm border bg-white"></div>
            <div className="absolute inset-x-4 inset-y-8 z-0 h-10 w-22 rounded-r-sm border bg-white"></div>

            <FolderIcon
              weight="fill"
              className="absolute z-10 size-32"
              style={folder.color ? { color: folder.color } : undefined}
            />
            {/* highlight: same icon, white, faded top-to-bottom via mask */}
            <FolderIcon
              weight="fill"
              className="absolute inset-0 z-10 size-32 text-white opacity-50"
              style={{
                maskImage: "linear-gradient(to bottom, black, transparent 75%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black, transparent 75%)",
              }}
            />
          </div>
        </Link>
        <div className="flex items-center justify-between">
          <Link href={href} className="flex w-full min-w-0 gap-4 p-4">
            <div
              className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg"
              style={
                folder.color
                  ? {
                      backgroundColor: `${folder.color}1a`,
                      color: folder.color,
                    }
                  : undefined
              }
            >
              <FolderIcon className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{folder.name}</p>
              <p className="text-muted-foreground text-xs">
                {folder.noteCount} {folder.noteCount === 1 ? "note" : "notes"}
              </p>
            </div>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" className={"size-6"} />}
            >
              <DotsThreeVerticalIcon className="size-6" weight="bold" />
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
      </CardContent>

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
    </Card>
  );
}
