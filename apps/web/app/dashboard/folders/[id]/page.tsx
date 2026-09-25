import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { folders } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getFolders, getNotes, getTags } from "@/lib/queries/notes";
import FolderNotesList from "./_components/folder-notes-list";

export default async function FolderPage({
  params,
}: PageProps<"/dashboard/folders/[id]">) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session!.user.id;

  const { id } = await params;

  const [folder] = await db
    .select()
    .from(folders)
    .where(and(eq(folders.id, id), eq(folders.userId, userId)));

  if (!folder) notFound();

  const [noteRows, userFolders, userTags] = await Promise.all([
    getNotes(userId, folder.id),
    getFolders(userId),
    getTags(userId),
  ]);

  return (
    <div className="bg-background flex flex-col gap-6 rounded-lg border p-4 md:p-6">
      <FolderNotesList
        folder={folder}
        notes={noteRows}
        userFolders={userFolders}
        userTags={userTags}
      />
    </div>
  );
}
