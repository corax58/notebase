import { asc, count, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { folders, notes } from "@/db/schema";
import { auth } from "@/lib/auth";
import { FoldersView } from "@/components/folders-view";

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
    <div className="bg-background h-full p-4 md:p-6">
      <FoldersView folders={rows} />
    </div>
  );
}
