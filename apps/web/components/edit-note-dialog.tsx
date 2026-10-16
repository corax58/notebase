"use client"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NoteFolderSelect } from "@/components/note-folder-select"
import { NoteSourceFields } from "@/components/note-source-fields"
import { NoteTagsInput } from "@/components/note-tags-input"
import { Textarea } from "@/components/ui/textarea"
import { useEditNoteForm } from "@/lib/hooks/use-edit-note-form"

type Folder = { id: string; name: string; color: string | null }
type Tag = { id: string; name: string }
type EditableNote = {
  id: string
  content: string
  label: string | null
  folderId: string | null
  tags: string[]
  sourceTitle: string | null
  sourceUrl: string | null
}

export function EditNoteDialog({
  note,
  folders,
  tags,
  open,
  onOpenChange,
}: {
  note: EditableNote
  folders: Folder[]
  tags: Tag[]
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { form, setForm, submitting, setTags, newFolder, handleSubmit } =
    useEditNoteForm(note, () => onOpenChange(false))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[min(42rem,calc(100dvh-2rem))] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <DialogHeader className="shrink-0 border-b px-6 pt-6 pb-4 pr-14">
            <DialogTitle>Edit note</DialogTitle>
            <DialogDescription>Update your note's details.</DialogDescription>
          </DialogHeader>

          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-note-content">Content</Label>
              <Textarea
                id="edit-note-content"
                placeholder="Write your note..."
                value={form.content}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, content: event.target.value }))
                }
                required
                autoFocus
                className="h-40 max-h-[50vh] min-h-24"
              />
            </div>

            <NoteFolderSelect
              folders={folders}
              value={form.folderId}
              onChange={(folderId) =>
                setForm((prev) => ({ ...prev, folderId }))
              }
              newFolder={newFolder.draft}
              onNewFolderStart={newFolder.start}
              onNewFolderChange={newFolder.setDraft}
            />

            <NoteTagsInput
              tags={form.tags}
              onChange={setTags}
              suggestions={tags}
            />

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-note-label">Label</Label>
              <Input
                id="edit-note-label"
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

          <DialogFooter className="shrink-0 border-t px-6 py-4">
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
