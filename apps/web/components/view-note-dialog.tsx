"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArchiveIcon,
  ArrowSquareOutIcon,
  CalendarBlankIcon,
  CheckIcon,
  CopyIcon,
  FolderIcon,
  GlobeIcon,
  HashIcon,
  PencilSimpleIcon,
  TextAlignLeftIcon,
  TrashIcon,
} from "@phosphor-icons/react/dist/ssr"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
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

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr] items-start gap-3 py-2.5">
      <dt className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
        <Icon className="size-4 shrink-0" />
        {label}
      </dt>
      <dd className="min-w-0 text-sm">{children}</dd>
    </div>
  )
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
  const [copied, setCopied] = React.useState(false)

  let hostname: string | null = null

  if (note.sourceUrl) {
    try {
      hostname = new URL(note.sourceUrl).hostname.replace(/^www\./, "")
    } catch {
      hostname = null
    }
  }

  const trimmed = note.content.trim()
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0
  const charCount = note.content.length
  const readingMinutes = Math.max(1, Math.round(wordCount / 200))

  const fullDate = note.createdAt.toLocaleString(undefined, {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(note.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error("Couldn't copy note", "Clipboard access was denied.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="gap-3 border-b px-6 pt-6 pb-5 pr-14">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {note.folder ? (
              <Link
                href={`/dashboard/notes?folder=${note.folder.id}`}
                onClick={() => onOpenChange(false)}
                className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1 font-medium hover:underline"
                style={
                  note.folder.color ? { color: note.folder.color } : undefined
                }
              >
                <FolderIcon className="size-3.5" weight="fill" />
                {note.folder.name}
              </Link>
            ) : (
              <span className="text-muted-foreground flex items-center gap-1 font-medium">
                <FolderIcon className="size-3.5" weight="fill" />
                No folder
              </span>
            )}
            {note.archived && (
              <Badge variant="outline">
                <ArchiveIcon />
                Archived
              </Badge>
            )}
          </div>

          <DialogTitle className="text-2xl leading-tight font-semibold tracking-tight">
            {note.label ?? "Untitled note"}
          </DialogTitle>

          <DialogDescription className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            <span title={fullDate}>
              Created {formatRelativeDate(note.createdAt)}
            </span>
            <span aria-hidden>·</span>
            <span>
              {wordCount.toLocaleString()} {wordCount === 1 ? "word" : "words"}
            </span>
            <span aria-hidden>·</span>
            <span>{readingMinutes} min read</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-5">
            <div className="bg-muted/40 rounded-lg border p-4">
              <p className="text-foreground text-[0.9375rem] leading-relaxed wrap-break-word whitespace-pre-wrap">
                {note.content || (
                  <span className="text-muted-foreground italic">
                    This note is empty.
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="px-6 pb-6">
            <h3 className="text-muted-foreground mb-1 text-xs font-semibold tracking-wider uppercase">
              Details
            </h3>
            <dl className="divide-y">
              <DetailRow icon={FolderIcon} label="Folder">
                {note.folder ? (
                  <span className="flex items-center gap-2">
                    <span
                      className="bg-muted-foreground size-2.5 shrink-0 rounded-full"
                      style={
                        note.folder.color
                          ? { backgroundColor: note.folder.color }
                          : undefined
                      }
                    />
                    <span className="truncate">{note.folder.name}</span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">None</span>
                )}
              </DetailRow>

              <DetailRow icon={GlobeIcon} label="Source">
                {note.sourceUrl ? (
                  <a
                    href={note.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex min-w-0 items-center gap-2 hover:underline"
                  >
                    {note.faviconUrl ? (
                      <img
                        src={note.faviconUrl}
                        className="size-4 shrink-0 rounded-sm object-cover"
                        alt=""
                      />
                    ) : (
                      <GlobeIcon className="text-muted-foreground size-4 shrink-0" />
                    )}
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate">
                        {note.sourceTitle ?? hostname ?? note.sourceUrl}
                      </span>
                      {hostname && (
                        <span className="text-muted-foreground truncate text-xs">
                          {hostname}
                        </span>
                      )}
                    </span>
                    <ArrowSquareOutIcon className="text-muted-foreground size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                ) : (
                  <span className="text-muted-foreground">Added manually</span>
                )}
              </DetailRow>

              <DetailRow icon={CalendarBlankIcon} label="Created">
                <span>{fullDate}</span>
              </DetailRow>

              <DetailRow icon={TextAlignLeftIcon} label="Length">
                <span>
                  {wordCount.toLocaleString()}{" "}
                  {wordCount === 1 ? "word" : "words"}
                  <span className="text-muted-foreground">
                    {" "}
                    · {charCount.toLocaleString()} characters
                  </span>
                </span>
              </DetailRow>

              <DetailRow icon={HashIcon} label="Tags">
                {note.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground">No tags</span>
                )}
              </DetailRow>
            </dl>
          </div>
        </div>

        <div className="bg-muted/30 flex flex-col-reverse gap-2 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={onDelete}
          >
            <TrashIcon />
            Delete
          </Button>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
            <Button type="button" variant="outline" onClick={handleCopy}>
              {copied ? <CheckIcon /> : <CopyIcon />}
              {copied ? "Copied" : "Copy"}
            </Button>
            {note.sourceUrl && (
              <Button
                type="button"
                variant="outline"
                render={
                  <a href={note.sourceUrl} target="_blank" rel="noreferrer" />
                }
                nativeButton={false}
              >
                <ArrowSquareOutIcon />
                Open source
              </Button>
            )}
            <Button type="button" onClick={onEdit}>
              <PencilSimpleIcon />
              Edit note
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
