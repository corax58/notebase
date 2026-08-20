import Link from "next/link";
import {
  ArchiveIcon,
  ClockIcon,
  FolderIcon,
  LinkSimpleIcon,
  GlobeIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatRelativeDate } from "@/lib/utils";

type NoteCardProps = {
  note: {
    id: string;
    content: string;
    sourceTitle: string | null;
    sourceUrl: string | null;
    label: string | null;
    archived: boolean;
    faviconUrl: string | null;
    createdAt: Date;
    folder: { id: string; name: string; color: string | null } | null;
    tags: { id: string; name: string }[];
  };
};

export function NoteCard({ note }: NoteCardProps) {
  let hostname: string | null = null;

  if (note.sourceUrl && !note.sourceTitle) {
    try {
      hostname = new URL(note.sourceUrl).hostname.replace(/^www\./, "");
    } catch {
      hostname = null;
    }
  }

  const hasBadges = note.archived || note.label || note.tags.length > 0;

  return (
    <Card size="sm" className="flex flex-col rounded-md">
      <CardHeader>
        {note.folder && (
          <Link
            href={`/dashboard/notes?folder=${note.folder.id}`}
            className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1 text-xs font-medium hover:underline"
            style={note.folder.color ? { color: note.folder.color } : undefined}
          >
            <FolderIcon className="size-3.5" weight="fill" />
            {note.folder.name}
          </Link>
        )}
        <CardTitle className="line-clamp-1">
          {note.label ?? "Untitled note"}
        </CardTitle>
        <CardDescription className="line-clamp-4">
          {note.content}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-end gap-3">
        {hasBadges && (
          <div className="flex flex-wrap items-center gap-1.5">
            {note.archived && (
              <Badge variant="outline">
                <ArchiveIcon />
                Archived
              </Badge>
            )}
            {note.label && <Badge variant="outline">{note.label}</Badge>}
            {note.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary">
                #{tag.name}
              </Badge>
            ))}
          </div>
        )}

        <div className="text-muted-foreground flex items-center justify-between gap-2 text-xs">
          {note.sourceUrl ? (
            <a
              href={note.sourceUrl ?? undefined}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground flex min-w-0 items-center gap-1 truncate hover:underline"
            >
              {note.faviconUrl ? (
                <img
                  src={note.faviconUrl}
                  className="size-3.5 shrink-0 object-cover"
                  alt={`${hostname} favicon`}
                />
              ) : (
                <GlobeIcon className="size-3.5 shrink-0" />
              )}

              <span className="truncate">{hostname}</span>
            </a>
          ) : (
            <span />
          )}
          <span
            className="flex shrink-0 items-center gap-1"
            title={note.createdAt.toDateString()}
          >
            <ClockIcon className="size-3.5" />
            {formatRelativeDate(note.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
