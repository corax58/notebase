"use client"

import { PlusIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NoteFolderSelect } from "@/components/note-folder-select"
import { NoteSourceFields } from "@/components/note-source-fields"
import { NoteTagsInput } from "@/components/note-tags-input"
import { Textarea } from "@/components/ui/textarea"
import { useAddNoteForm } from "@/lib/hooks/use-add-note-form"

type Folder = { id: string; name: string; color: string | null }
type Tag = { id: string; name: string }

export function AddNoteDialog({
  folders,
  tags,
}: {
  folders: Folder[]
  tags: Tag[]
}) {
  const { open, setOpen, form, setForm, submitting, setTags, reset, handleSubmit } =
    useAddNoteForm()

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) reset()
      }}
    >
      <DialogTrigger render={<Button />}>
        <PlusIcon data-icon="inline-start" />
        Add note
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle>Add a note</DialogTitle>
            <DialogDescription>
              Capture something worth remembering. Only the content is
              required.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="note-content">Content</Label>
              <Textarea
                id="note-content"
                placeholder="Write your note..."
                value={form.content}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, content: event.target.value }))
                }
                required
                autoFocus
              />
            </div>

            <NoteFolderSelect
              folders={folders}
              value={form.folderId}
              onChange={(folderId) =>
                setForm((prev) => ({ ...prev, folderId }))
              }
            />

            <NoteTagsInput
              tags={form.tags}
              onChange={setTags}
              suggestions={tags}
            />

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="note-label">Label</Label>
              <Input
                id="note-label"
                placeholder="e.g. Reading list"
                value={form.label}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, label: event.target.value }))
                }
                maxLength={100}
              />
            </div>

            <NoteSourceFields
              sourceTitle={form.sourceTitle}
              sourceUrl={form.sourceUrl}
              onSourceTitleChange={(sourceTitle) =>
                setForm((prev) => ({ ...prev, sourceTitle }))
              }
              onSourceUrlChange={(sourceUrl) =>
                setForm((prev) => ({ ...prev, sourceUrl }))
              }
            />
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
