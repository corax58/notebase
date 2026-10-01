import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { auth } from "@/lib/auth";
import EditBundleForm from "./_components/edit-bundle-form";
import { notFound } from "next/navigation";
import z from "zod";
import { getBundleWithNotes } from "@/lib/queries/bundles";
import { getNotes } from "@/lib/queries/notes";

export default async function EditBundlePage({
  params,
}: PageProps<"/dashboard/bundles/[id]/edit">) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session!.user.id;

  const { id } = await params;

  // Non-uuid ids would otherwise throw in Postgres rather than 404
  if (!z.uuid().safeParse(id).success) notFound();

  const [bundle, noteRows] = await Promise.all([
    getBundleWithNotes(userId, id),
    getNotes(userId),
  ]);

  if (!bundle) notFound();

  return (
    <div className="bg-background flex flex-col gap-6 rounded-lg border p-4 md:p-6">
      <EditBundleForm notes={noteRows} bundle={bundle} />
    </div>
  );
}
