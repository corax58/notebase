import { asc, count, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { TagIcon } from "@phosphor-icons/react/dist/ssr";
import { db } from "@/db";
import { noteTags, tags } from "@/db/schema";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";

export default async function TagsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session!.user.id;

  const rows = await db
    .select({
      id: tags.id,
      name: tags.name,
      noteCount: count(noteTags.noteId),
    })
    .from(tags)
    .leftJoin(noteTags, eq(noteTags.tagId, tags.id))
    .where(eq(tags.userId, userId))
    .groupBy(tags.id)
    .orderBy(asc(tags.name));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Tags</h2>
        <p className="text-sm text-muted-foreground">
          Labels used to cross-reference your notes.
        </p>
      </div>

      {rows.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No tags yet.
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-wrap gap-3">
          {rows.map((tag) => (
            <Card key={tag.id} size="sm" className="w-fit">
              <CardContent className="flex items-center gap-2.5">
                <TagIcon className="size-4 text-primary" />
                <span className="text-sm font-medium">{tag.name}</span>
                <span className="text-xs text-muted-foreground">
                  {tag.noteCount}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
