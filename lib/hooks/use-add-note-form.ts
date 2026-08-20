import * as React from "react"
import { useRouter } from "next/navigation"

import { toast } from "@/components/ui/toast"

const initialState = {
  content: "",
  label: "",
  folderId: null as string | null,
  tagIds: [] as string[],
  sourceTitle: "",
  sourceUrl: "",
}

export type AddNoteFormState = typeof initialState

export function useAddNoteForm() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [form, setForm] = React.useState(initialState)

  function toggleTag(tagId: string, checked: boolean) {
    setForm((prev) => ({
      ...prev,
      tagIds: checked
        ? [...prev.tagIds, tagId]
        : prev.tagIds.filter((id) => id !== tagId),
    }))
  }

  function reset() {
    setForm(initialState)
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
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          label: form.label.trim() || undefined,
          folderId: form.folderId ?? undefined,
          tagIds: form.tagIds,
          sourceTitle: form.sourceTitle.trim() || undefined,
          sourceUrl: sourceUrl || undefined,
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
            "Something went wrong while saving your note.",
        )
      }

      toast.success("Note added", "Your note was saved successfully.")
      reset()
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast.error(
        "Couldn't save note",
        error instanceof Error ? error.message : "Please try again.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  return { open, setOpen, form, setForm, submitting, toggleTag, reset, handleSubmit }
}
