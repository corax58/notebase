import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";

export default async function NotesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session!.user.id;

  const rows = await db.query.notes.findMany({
    where: eq(notes.userId, userId),
    orderBy: desc(notes.createdAt),
    limit: 50,
    with: {
      folder: true,
      noteTags: { with: { tag: true } },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Notes</h2>
        <p className="text-sm text-muted-foreground">
          Everything you&apos;ve captured, newest first.
        </p>
      </div>

      {rows.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No notes yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((note) => (
            <Card key={note.id} size="sm">
              <CardHeader>
                <CardTitle className="line-clamp-1">
                  {note.sourceTitle ?? "Untitled note"}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {note.content}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-1.5">
                {note.folder && (
                  <Badge variant="secondary">{note.folder.name}</Badge>
                )}
                {note.noteTags.map(({ tag }) => (
                  <Badge key={tag.id} variant="outline">
                    {tag.name}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
