import { auth } from "@/lib/auth";
import { NO_FOLDER, notesHref, parseNoteFilters } from "@/lib/note-filters";
import {
  getFolders,
  getNoteFacets,
  getTags,
  searchNotes,
} from "@/lib/queries/notes";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import NotesList from "./_components/notes-list";

export default async function NotesPage({
  searchParams,
}: PageProps<"/dashboard/notes">) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session!.user.id;

  const filters = parseNoteFilters(await searchParams);

  const [{ notes, total }, userFolders, userTags, facets] = await Promise.all([
    searchNotes(userId, filters),
    getFolders(userId),
    getTags(userId),
    getNoteFacets(userId),
  ]);

  // A bookmarked link can outlive the folder it filters by — land on the
  // nearest view that exists
  const folders = filters.folders.filter(
    (id) => id === NO_FOLDER || userFolders.some((folder) => folder.id === id),
  );
  if (folders.length !== filters.folders.length) {
    redirect(notesHref({ ...filters, folders }));
  }

  return (
    <NotesList
      notes={notes}
      total={total}
      filters={filters}
      facets={facets}
      userFolders={userFolders}
      userTags={userTags}
    />
  );
}
