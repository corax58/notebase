import * as React from "react"
import { useRouter } from "next/navigation"

import { toast } from "@/components/ui/toast"

type EditableNote = {
  id: string
  content: string
  label: string | null
  folderId: string | null
  tags: string[]
  sourceTitle: string | null
  sourceUrl: string | null
}

function toFormState(note: EditableNote) {
  return {
    content: note.content,
    label: note.label ?? "",
    folderId: note.folderId,
    tags: note.tags,
    sourceTitle: note.sourceTitle ?? "",
    sourceUrl: note.sourceUrl ?? "",
  }
}

export type EditNoteFormState = ReturnType<typeof toFormState>

export function useEditNoteForm(note: EditableNote, onSaved?: () => void) {
  const router = useRouter()
  const [submitting, setSubmitting] = React.useState(false)
  const [form, setForm] = React.useState<EditNoteFormState>(() => toFormState(note))

  React.useEffect(() => {
    setForm(toFormState(note))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note.id])

  function setTags(tags: string[]) {
    setForm((prev) => ({ ...prev, tags }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const content = form.content.trim()
    if (!content) {
      toast.error(
        "Content is required",
        "Write something before saving your note.",
      )
      return
    }

    const sourceUrl = form.sourceUrl.trim()
    if (sourceUrl) {
      try {
        new URL(sourceUrl)
      } catch {
        toast.error(
          "That source URL doesn't look right",
          "Include the full address, e.g. https://example.com/article.",
        )
        return
      }
    }

    setSubmitting(true)
    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          label: form.label.trim() || null,
          folderId: form.folderId,
          tags: form.tags,
          sourceTitle: form.sourceTitle.trim() || null,
          sourceUrl: sourceUrl || null,
        }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        const firstIssue = Object.values(
          body?.issues ?? {},
        )[0] as string[] | undefined
        throw new Error(
          firstIssue?.[0] ??
            body?.error ??
            "Something went wrong while updating your note.",
        )
      }

      toast.success("Note updated", "Your changes were saved.")
      onSaved?.()
      router.refresh()
    } catch (error) {
      toast.error(
        "Couldn't update note",
        error instanceof Error ? error.message : "Please try again.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  return { form, setForm, submitting, setTags, handleSubmit }
}
