"use client"

import * as React from "react"
import { PlusIcon, XIcon } from "@phosphor-icons/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Tag = { id: string; name: string }

export function NoteTagsInput({
  tags,
  onChange,
  suggestions = [],
}: {
  tags: string[]
  onChange: (tags: string[]) => void
  suggestions?: Tag[]
}) {
  const [draft, setDraft] = React.useState("")
  const listId = React.useId()

  function addTag() {
    const value = draft.trim().toLowerCase()
    if (value && !tags.includes(value)) {
      onChange([...tags, value])
    }
    setDraft("")
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag))
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="note-tag-input">Tags</Label>
      <div className="flex items-center gap-2">
        <Input
          id="note-tag-input"
          list={listId}
          placeholder="Add a tag"
          value={draft}
          onChange={(event) => setDraft(event.target.value.replace(/\s+/g, ""))}
          onKeyDown={(event) => {
            if (event.key === " " || event.key === "Spacebar") {
              event.preventDefault()
              return
            }
            if (event.key === "Enter") {
              event.preventDefault()
              addTag()
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={!draft.trim()}
          onClick={addTag}
          aria-label="Add tag"
        >
          <PlusIcon />
        </Button>
      </div>

      {suggestions.length > 0 && (
        <datalist id={listId}>
          {suggestions
            .filter((tag) => !tags.includes(tag.name))
            .map((tag) => (
              <option key={tag.id} value={tag.name} />
            ))}
        </datalist>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove tag ${tag}`}
                className="text-muted-foreground hover:text-foreground"
              >
                <XIcon data-icon="inline-end" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
