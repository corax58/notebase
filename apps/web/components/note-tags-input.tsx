"use client"

import * as React from "react"

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@/components/ui/combobox"
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
  const anchor = useComboboxAnchor()
  const [inputValue, setInputValue] = React.useState("")
  const [highlighted, setHighlighted] = React.useState<string | null>(null)

  const items = React.useMemo(
    () =>
      suggestions
        .map((tag) => tag.name)
        .filter((name) => !tags.includes(name)),
    [suggestions, tags]
  )

  function addTag(value: string) {
    const next = value.trim().toLowerCase()
    if (next && !tags.includes(next)) {
      onChange([...tags, next])
    }
    setInputValue("")
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="note-tag-input">Tags</Label>
      <Combobox
        multiple
        items={items}
        value={tags}
        onValueChange={onChange}
        inputValue={inputValue}
        onInputValueChange={setInputValue}
        onItemHighlighted={(item) =>
          setHighlighted((item as string | undefined) ?? null)
        }
      >
        <ComboboxChips ref={anchor}>
          {tags.map((tag) => (
            <ComboboxChip key={tag} aria-label={`Remove tag ${tag}`}>
              #{tag}
            </ComboboxChip>
          ))}
          <ComboboxChipsInput
            id="note-tag-input"
            placeholder={tags.length ? undefined : "Add a tag"}
            onKeyDown={(event) => {
              if (event.key === "Enter" && highlighted === null) {
                event.preventDefault()
                addTag(inputValue)
              }
            }}
          />
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxList>
            <ComboboxEmpty>No matching tags</ComboboxEmpty>
            {items.map((name) => (
              <ComboboxItem key={name} value={name}>
                #{name}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
