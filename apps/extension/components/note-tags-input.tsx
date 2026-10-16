import { useEffect, useMemo, useState } from "react";
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
} from "@/components/ui/combobox";
import { getTags } from "@/lib/api-client";
import type { Tag } from "@/types";

const RECENT_TAG_LIMIT = 10;

/**
 * Chips input for a note's tags. Suggests the user's existing tags and lets
 * Enter add a new one when no suggestion is highlighted.
 */
export function NoteTagsInput({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string[];
  onChange: (tags: string[]) => void;
}) {
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [highlightedTag, setHighlightedTag] = useState<string | null>(null);
  const anchor = useComboboxAnchor();

  useEffect(() => {
    getTags().then((result) => {
      if (result.success) setSuggestions(result.data);
    });
  }, []);

  const items = useMemo(
    () =>
      suggestions
        .map((tag) => tag.name)
        .filter((name) => !value.includes(name)),
    [suggestions, value],
  );

  const addTag = (raw: string) => {
    const next = raw.trim().toLowerCase();
    if (next && !value.includes(next)) {
      onChange([...value, next]);
    }
    setInputValue("");
  };

  return (
    <Combobox
      multiple
      items={items}
      // Tags arrive most recently used first, so the cap leaves the latest
      // ones until a query narrows the list
      limit={inputValue.trim() ? -1 : RECENT_TAG_LIMIT}
      value={value}
      onValueChange={onChange}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
      onItemHighlighted={(item) =>
        setHighlightedTag((item as string | undefined) ?? null)
      }
    >
      <ComboboxChips ref={anchor}>
        {value.map((tag) => (
          <ComboboxChip key={tag} aria-label={`Remove tag ${tag}`}>
            #{tag}
          </ComboboxChip>
        ))}
        <ComboboxChipsInput
          id={id}
          placeholder={value.length ? undefined : "Add a tag"}
          onKeyDown={(e) => {
            if (e.key === "Enter" && highlightedTag === null) {
              e.preventDefault();
              addTag(inputValue);
            }
          }}
        />
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No matching tags</ComboboxEmpty>
        <ComboboxList>
          {(name: string) => (
            <ComboboxItem key={name} value={name}>
              #{name}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
