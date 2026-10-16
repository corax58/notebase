import * as React from "react"

import { randomPresetColor } from "@/components/color-picker"
import type { NewFolderDraft } from "@/components/note-folder-select"
import { toast } from "@/components/ui/toast"

// A folder the user is drafting from a note form; the note endpoints create
// it alongside the note
export function useNewFolder() {
  const [draft, setDraft] = React.useState<NewFolderDraft | null>(null)

  // The color is picked on click rather than in the initial state so the
  // server and the client don't render different colors
  function start() {
    setDraft({ name: "", color: randomPresetColor() })
  }

  function reset() {
    setDraft(null)
  }

  // Checked before submitting, since a nested field error from the server
  // reads poorly in a toast
  function validate() {
    if (draft && !draft.name.trim()) {
      toast.error(
        "Folder name is required",
        "Name the new folder, or cancel it to pick an existing one.",
      )
      return false
    }
    return true
  }

  // The `newFolder` field of a note request body
  const payload = draft ? { name: draft.name.trim(), color: draft.color } : undefined

  return { draft, setDraft, start, reset, validate, payload }
}
