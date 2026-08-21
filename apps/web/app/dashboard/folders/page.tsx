import { asc, count, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { FolderIcon } from "@phosphor-icons/react/dist/ssr";
import { db } from "@/db";
import { folders, notes } from "@/db/schema";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { AddFolderDialog } from "@/components/add-folder-dialog";
import { FolderCard } from "@/components/folder-card";

export default async function FoldersPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session!.user.id;

  const rows = await db
    .select({
      id: folders.id,
      name: folders.name,
      color: folders.color,
      noteCount: count(notes.id),
    })
    .from(folders)
    .leftJoin(notes, eq(notes.folderId, folders.id))
    .where(eq(folders.userId, userId))
    .groupBy(folders.id)
    .orderBy(asc(folders.name));

  return (
    <div className="bg-background flex h-full flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Folders</h2>
          <p className="text-muted-foreground text-sm">
            Organize your notes into folders.
          </p>
        </div>
        <AddFolderDialog />
      </div>

      {rows.length === 0 ? (
        <Card>
          <CardContent className="text-muted-foreground py-12 text-center text-sm">
            No folders yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {rows.map((folder) => (
            <FolderCard key={folder.id} folder={folder} />
          ))}
        </div>
      )}
    </div>
  );
}
