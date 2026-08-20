import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export function NoteSourceFields({
  sourceTitle,
  sourceUrl,
  onSourceTitleChange,
  onSourceUrlChange,
}: {
  sourceTitle: string
  sourceUrl: string
  onSourceTitleChange: (value: string) => void
  onSourceUrlChange: (value: string) => void
}) {
  return (
    <>
      <Separator />
      <div className="flex flex-col gap-3">
        <p className="text-xs text-muted-foreground">
          Source <span className="opacity-70">(optional)</span> — where this
          note came from, if anywhere.
        </p>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="note-source-title">Source title</Label>
          <Input
            id="note-source-title"
            placeholder="e.g. How to Cook Everything"
            value={sourceTitle}
            onChange={(event) => onSourceTitleChange(event.target.value)}
            maxLength={500}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="note-source-url">Source URL</Label>
          <Input
            id="note-source-url"
            type="url"
            placeholder="https://example.com/article"
            value={sourceUrl}
            onChange={(event) => onSourceUrlChange(event.target.value)}
          />
        </div>
      </div>
    </>
  )
}
