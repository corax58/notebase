import { headers } from "next/headers";
import Link from "next/link";
import { XIcon } from "@phosphor-icons/react/dist/ssr";
import { AddNoteDialog } from "@/components/add-note-dialog";
import { NoteCard } from "@/components/note-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getFolders, getNotes, getTags } from "@/lib/queries/notes";

export default async function NotesPage({
  searchParams,
}: PageProps<"/dashboard/notes">) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session!.user.id;

  const { folder: folderParam } = await searchParams;
  const folderId = typeof folderParam === "string" ? folderParam : undefined;

  const [noteRows, userFolders, userTags] = await Promise.all([
    getNotes(userId, folderId),
    getFolders(userId),
    getTags(userId),
  ]);

  const activeFolderName = folderId ? noteRows[0]?.folder?.name : undefined;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Notes</h2>
          <p className="text-muted-foreground text-sm">
            Everything you&apos;ve captured, newest first.
          </p>
        </div>
        <AddNoteDialog folders={userFolders} tags={userTags} />
      </div>

      {folderId && (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">
            Filtered by folder:
          </span>
          <Badge variant="secondary">
            {activeFolderName ?? "this folder"}
            <Link
              href="/dashboard/notes"
              aria-label="Clear folder filter"
              className="ml-0.5"
            >
              <XIcon data-icon="inline-end" />
            </Link>
          </Badge>
        </div>
      )}

      {noteRows.length === 0 ? (
        <Card>
          <CardContent className="text-muted-foreground py-12 text-center text-sm">
            {folderId ? "No notes in this folder yet." : "No notes yet."}
          </CardContent>
        </Card>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 md:columns-3">
          {noteRows.map((note) => (
            <div className="mb-4 break-inside-avoid">
              <NoteCard
                key={note.id}
                note={note}
                folders={userFolders}
                tags={userTags}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
