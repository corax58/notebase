import { asc, count, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { FolderIcon } from "@phosphor-icons/react/dist/ssr";
import { db } from "@/db";
import { folders, notes } from "@/db/schema";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";

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
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Folders</h2>
        <p className="text-sm text-muted-foreground">
          Organize your notes into folders.
        </p>
      </div>

      {rows.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No folders yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((folder) => (
            <Card key={folder.id} size="sm">
              <CardContent className="flex items-center gap-3">
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
                  style={
                    folder.color
                      ? { backgroundColor: `${folder.color}1a`, color: folder.color }
                      : undefined
                  }
                >
                  <FolderIcon className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{folder.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {folder.noteCount} {folder.noteCount === 1 ? "note" : "notes"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
