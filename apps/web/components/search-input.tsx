"use client";

import {
  CircleNotchIcon,
  MagnifyingGlassIcon,
  XIcon,
} from "@phosphor-icons/react";
import * as React from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useFocusShortcut } from "@/hooks/use-focus-shortcut";

/** A page's main search box: `/` focuses it, Escape clears it. */
export function SearchInput({
  label,
  placeholder,
  value,
  onChange,
  onSubmit,
  pending = false,
}: {
  // Not shown; names the field for screen readers
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  // For searches that don't already run on every keystroke
  onSubmit?: () => void;
  // Results for the current value are still loading
  pending?: boolean;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  useFocusShortcut(inputRef);

  return (
    <InputGroup>
      <InputGroupAddon>
        {pending ? (
          <CircleNotchIcon className="animate-spin" />
        ) : (
          <MagnifyingGlassIcon />
        )}
      </InputGroupAddon>
      <InputGroupInput
        ref={inputRef}
        role="searchbox"
        aria-label={label}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") onSubmit?.();
          if (event.key === "Escape") {
            if (value) onChange("");
            else event.currentTarget.blur();
          }
        }}
      />
      <InputGroupAddon align="inline-end">
        {value ? (
          <InputGroupButton
            size="icon-xs"
            aria-label="Clear search"
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
          >
            <XIcon />
          </InputGroupButton>
        ) : (
          <kbd
            data-slot="kbd"
            title="Press / to search"
            className="hidden font-sans text-xs sm:inline"
          >
            /
          </kbd>
        )}
      </InputGroupAddon>
    </InputGroup>
  );
}
