import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { folders } from "@/db/schema";

export async function folderBelongsToUser(folderId: string, userId: string) {
  const [folder] = await db
    .select({ id: folders.id })
    .from(folders)
    .where(and(eq(folders.id, folderId), eq(folders.userId, userId)));
  return Boolean(folder);
}
