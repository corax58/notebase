"use client";

import { AddFolderDialog } from "@/components/add-folder-dialog";
import { FolderCard } from "@/components/folder-card";
import { FolderListItem } from "@/components/folder-list-item";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ViewToggle, useViewMode } from "@/components/view-toggle";

type FolderRow = {
  id: string;
  name: string;
  color: string | null;
  noteCount: number;
};

export function FoldersView({ folders }: { folders: FolderRow[] }) {
  const { view, setView, ready } = useViewMode("folders-view");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Folders</h2>
          <p className="text-muted-foreground text-sm">
            {folders.length} {folders.length === 1 ? "folder" : "folders"} ·
            organize your notes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle view={view} onChange={setView} />
          <AddFolderDialog />
        </div>
      </div>

      {folders.length === 0 ? (
        <Card>
          <CardContent className="text-muted-foreground py-12 text-center text-sm">
            No folders yet.
          </CardContent>
        </Card>
      ) : !ready ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-md" />
          ))}
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {folders.map((folder) => (
            <FolderCard key={folder.id} folder={folder} />
          ))}
        </div>
      ) : (
        <div className="bg-card divide-y overflow-hidden rounded-md border">
          {folders.map((folder) => (
            <FolderListItem key={folder.id} folder={folder} />
          ))}
        </div>
      )}
    </div>
  );
}
