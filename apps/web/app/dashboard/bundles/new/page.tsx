import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { auth } from "@/lib/auth";
import NewBundleForm from "./_components/new-bundle-form";

export default async function NewBundlePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session!.user.id;

  // Unlike getNotes, no limit — every note has to be pickable
  const noteRows = await db.query.notes.findMany({
    where: eq(notes.userId, userId),
    orderBy: desc(notes.createdAt),
    columns: {
      id: true,
      label: true,
      content: true,
      sourceTitle: true,
      archived: true,
      tags: true,
    },
    with: { folder: { columns: { id: true, name: true, color: true } } },
  });

  return (
    <div className="bg-background flex flex-col gap-6 rounded-lg border p-4 md:p-6">
      <NewBundleForm notes={noteRows} />
    </div>
  );
}
