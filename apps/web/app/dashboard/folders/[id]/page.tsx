import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, FolderIcon } from "@phosphor-icons/react/dist/ssr";
import { db } from "@/db";
import { folders } from "@/db/schema";
import { AddNoteDialog } from "@/components/add-note-dialog";
import { NoteCard } from "@/components/note-card";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getFolders, getNotes, getTags } from "@/lib/queries/notes";

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
    <div className="flex flex-col gap-6">
      <Link
        href="/dashboard/folders"
        className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1 text-sm hover:underline"
      >
        <ArrowLeftIcon className="size-3.5" />
        Folders
      </Link>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg"
            style={
              folder.color
                ? { backgroundColor: `${folder.color}1a`, color: folder.color }
                : undefined
            }
          >
            <FolderIcon className="size-4" weight="fill" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{folder.name}</h2>
            <p className="text-muted-foreground text-sm">
              {noteRows.length} {noteRows.length === 1 ? "note" : "notes"}
            </p>
          </div>
        </div>
        <AddNoteDialog folders={userFolders} tags={userTags} />
      </div>

      {noteRows.length === 0 ? (
        <Card>
          <CardContent className="text-muted-foreground py-12 text-center text-sm">
            No notes in this folder yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {noteRows.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              folders={userFolders}
              tags={userTags}
            />
          ))}
        </div>
      )}
    </div>
  );
}
