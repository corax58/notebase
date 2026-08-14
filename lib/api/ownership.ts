import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { folders, tags } from "@/db/schema";

export async function folderBelongsToUser(folderId: string, userId: string) {
  const [folder] = await db
    .select({ id: folders.id })
    .from(folders)
    .where(and(eq(folders.id, folderId), eq(folders.userId, userId)));
  return Boolean(folder);
}

export async function tagIdsBelongToUser(tagIds: string[], userId: string) {
  if (tagIds.length === 0) return true;
  const owned = await db
    .select({ id: tags.id })
    .from(tags)
    .where(and(inArray(tags.id, tagIds), eq(tags.userId, userId)));
  return owned.length === tagIds.length;
}
