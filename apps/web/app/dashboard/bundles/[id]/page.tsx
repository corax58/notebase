import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getBundleWithNotes } from "@/lib/queries/bundles";
import { getFolders, getTags } from "@/lib/queries/notes";
import { z } from "zod";
import BundleNotesList from "./_components/bundle-notes-list";

export default async function BundlePage({
  params,
}: PageProps<"/dashboard/bundles/[id]">) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session!.user.id;

  const { id } = await params;

  // Non-uuid ids would otherwise throw in Postgres rather than 404
  if (!z.uuid().safeParse(id).success) notFound();

  const [bundle, userFolders, userTags] = await Promise.all([
    getBundleWithNotes(userId, id),
    getFolders(userId),
    getTags(userId),
  ]);

  if (!bundle) notFound();

  return (
    <div className="bg-background flex flex-col gap-6 rounded-lg border p-4 md:p-6">
      <BundleNotesList
        bundle={bundle}
        userFolders={userFolders}
        userTags={userTags}
      />
    </div>
  );
}
