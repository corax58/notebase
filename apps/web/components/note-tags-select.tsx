"use client"

import { CaretDownIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"

type Tag = { id: string; name: string }

export function NoteTagsSelect({
  tags,
  selectedIds,
  onToggle,
}: {
  tags: Tag[]
  selectedIds: string[]
  onToggle: (tagId: string, checked: boolean) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>Tags</Label>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button type="button" variant="outline" className="justify-between" />
          }
        >
          <span className="truncate">
            {selectedIds.length > 0 ? `${selectedIds.length} selected` : "No tags"}
          </span>
          <CaretDownIcon
            data-icon="inline-end"
            className="text-muted-foreground"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {tags.length === 0 ? (
            <p className="px-3 py-2.5 text-xs text-muted-foreground">
              No tags yet
            </p>
          ) : (
            tags.map((tag) => (
              <DropdownMenuCheckboxItem
                key={tag.id}
                checked={selectedIds.includes(tag.id)}
                onCheckedChange={(checked) => onToggle(tag.id, checked)}
                closeOnClick={false}
              >
                {tag.name}
              </DropdownMenuCheckboxItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
