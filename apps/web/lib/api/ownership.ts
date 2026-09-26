import { and, count, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { folders, notes } from "@/db/schema";

export async function folderBelongsToUser(folderId: string, userId: string) {
  const [folder] = await db
    .select({ id: folders.id })
    .from(folders)
    .where(and(eq(folders.id, folderId), eq(folders.userId, userId)));
  return Boolean(folder);
}

// Expects unique ids — true only if every one is a note owned by the user
export async function notesBelongToUser(noteIds: string[], userId: string) {
  if (!noteIds.length) return true;
  const [row] = await db
    .select({ total: count() })
    .from(notes)
    .where(and(inArray(notes.id, noteIds), eq(notes.userId, userId)));
  return row.total === noteIds.length;
}
