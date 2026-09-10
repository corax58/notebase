"use client"

import Link from "next/link"
import {
  ArchiveIcon,
  ClockIcon,
  FolderIcon,
  GlobeIcon,
} from "@phosphor-icons/react/dist/ssr"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatRelativeDate } from "@/lib/utils"

type ViewableNote = {
  id: string
  content: string
  sourceTitle: string | null
  sourceUrl: string | null
  label: string | null
  archived: boolean
  faviconUrl: string | null
  createdAt: Date
  folder: { id: string; name: string; color: string | null } | null
  tags: string[]
}

export function ViewNoteDialog({
  note,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: {
  note: ViewableNote
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: () => void
  onDelete: () => void
}) {
  let hostname: string | null = null

  if (note.sourceUrl) {
    try {
      hostname = new URL(note.sourceUrl).hostname.replace(/^www\./, "")
    } catch {
      hostname = null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          {note.folder && (
            <Link
              href={`/dashboard/notes?folder=${note.folder.id}`}
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1 text-xs font-medium hover:underline"
              style={
                note.folder.color ? { color: note.folder.color } : undefined
              }
            >
              <FolderIcon className="size-3.5" weight="fill" />
              {note.folder.name}
            </Link>
          )}
          <DialogTitle className="text-xl">
            {note.label ?? "Untitled note"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Full note details
          </DialogDescription>
        </DialogHeader>

        <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto">
          <p className="text-sm whitespace-pre-wrap text-foreground">
            {note.content}
          </p>

          {(note.archived || note.tags.length > 0) && (
            <div className="flex flex-wrap items-center gap-1.5">
              {note.archived && (
                <Badge variant="outline">
                  <ArchiveIcon />
                  Archived
                </Badge>
              )}
              {note.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {note.sourceUrl && (
            <a
              href={note.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground hover:underline"
            >
              {note.faviconUrl ? (
                <img
                  src={note.faviconUrl}
                  className="size-3.5 shrink-0 object-cover"
                  alt=""
                />
              ) : (
                <GlobeIcon className="size-3.5 shrink-0" />
              )}
              <span className="truncate">
                {note.sourceTitle ?? hostname ?? note.sourceUrl}
              </span>
            </a>
          )}

          <span
            className="flex items-center gap-1 text-xs text-muted-foreground"
            title={note.createdAt.toDateString()}
          >
            <ClockIcon className="size-3.5" />
            Created {formatRelativeDate(note.createdAt)}
          </span>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onDelete}>
            Delete
          </Button>
          <Button type="button" onClick={onEdit}>
            Edit note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
