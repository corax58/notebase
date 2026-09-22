import { auth } from "@/lib/auth";
import { getFolders, getNotes, getTags } from "@/lib/queries/notes";
import { headers } from "next/headers";
import NotesList from "./_components/notes-list";

export default async function NotesPage({
  searchParams,
}: PageProps<"/dashboard/notes">) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session!.user.id;

  const [notes, userFolders, userTags] = await Promise.all([
    getNotes(userId),
    getFolders(userId),
    getTags(userId),
  ]);

  return (
    <div className="bg-background flex flex-col gap-6 border-t p-4 md:p-6">
      <NotesList notes={notes} userFolders={userFolders} userTags={userTags} />
    </div>
  );
}
