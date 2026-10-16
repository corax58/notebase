"use client";

import {
  ArchiveIcon,
  CalendarBlankIcon,
  FolderDashedIcon,
  FolderIcon,
  GlobeIcon,
  HashIcon,
  XIcon,
} from "@phosphor-icons/react";
import * as React from "react";
import { SearchInput } from "@/components/search-input";
import { SortMenu } from "@/components/sort-menu";
import { Button } from "@/components/ui/button";
import {
  hasActiveFilters,
  NO_FOLDER,
  NOTE_CREATED_OPTIONS,
  NOTE_SORT_OPTIONS,
  NOTE_SOURCE_OPTIONS,
  NOTE_STATUS_OPTIONS,
  type NoteFilters,
} from "@/lib/note-filters";
import type { Folder, NoteFacets } from "@/lib/queries/notes";
import { cn } from "@/lib/utils";
import { FacetFilter, OptionFilter, type FacetOption } from "./filter-controls";
import type { NoteFilterControls } from "./use-note-filters";

const TAG_MATCH_OPTIONS = [
  { value: "any", label: "Any tag" },
  { value: "all", label: "All tags" },
] as const;

function TagMatchToggle({
  value,
  onChange,
}: {
  value: NoteFilters["tagMatch"];
  onChange: (value: NoteFilters["tagMatch"]) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-t px-3 py-2">
      <span className="text-muted-foreground text-xs">Match</span>
      <div
        role="group"
        aria-label="Tag matching"
        className="bg-muted sunken border-edge inline-flex items-center rounded-lg border p-0.5"
      >
        {TAG_MATCH_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "text-muted-foreground hover:text-foreground rounded-md border border-transparent px-2 py-0.5 text-xs font-semibold transition-colors",
              value === option.value &&
                "bg-background text-foreground border-edge raised [--depth:2px]",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function NotesToolbar({
  controls,
  folders,
  facets,
}: {
  controls: NoteFilterControls;
  folders: Folder[];
  facets: NoteFacets;
}) {
  const { filters, pending, search, update } = controls;

  const folderOptions = React.useMemo<FacetOption[]>(
    () => [
      {
        value: NO_FOLDER,
        label: "No folder",
        icon: <FolderDashedIcon className="text-muted-foreground" />,
        count: facets.folders[NO_FOLDER] ?? 0,
      },
      ...folders.map((folder) => ({
        value: folder.id,
        label: folder.name,
        icon: (
          <FolderIcon
            weight="fill"
            className="text-primary"
            style={folder.color ? { color: folder.color } : undefined}
          />
        ),
        count: facets.folders[folder.id] ?? 0,
      })),
    ],
    [folders, facets],
  );

  // A tag from the URL that no note uses still has to be listed, or there'd
  // be no way to see it's selected and take it back off
  const tagOptions = React.useMemo<FacetOption[]>(() => {
    const unused = filters.tags.filter(
      (name) => !facets.tags.some((tag) => tag.name === name),
    );
    return [...facets.tags, ...unused.map((name) => ({ name, count: 0 }))].map(
      (tag) => ({
        value: tag.name,
        label: `#${tag.name}`,
        count: tag.count,
      }),
    );
  }, [facets, filters.tags]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <SearchInput
          label="Search notes"
          placeholder="Search notes, folders, #tags..."
          value={search}
          onChange={(value) =>
            value ? controls.setSearch(value) : controls.clearSearch()
          }
          onSubmit={controls.submitSearch}
          pending={pending}
        />
        <SortMenu
          label="Sort notes"
          options={NOTE_SORT_OPTIONS}
          value={filters.sort}
          onChange={(sort) => update({ sort })}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FacetFilter
          label="Folder"
          icon={<FolderIcon />}
          options={folderOptions}
          selected={filters.folders}
          onChange={(next) => update({ folders: next })}
          searchPlaceholder="Search folders..."
          emptyText="No matching folders"
        />
        <FacetFilter
          label="Tags"
          icon={<HashIcon />}
          options={tagOptions}
          selected={filters.tags}
          onChange={(next) => update({ tags: next })}
          searchPlaceholder="Search tags..."
          emptyText={tagOptions.length ? "No matching tags" : "No tags yet"}
        >
          {filters.tags.length > 1 && (
            <TagMatchToggle
              value={filters.tagMatch}
              onChange={(tagMatch) => update({ tagMatch })}
            />
          )}
        </FacetFilter>
        <OptionFilter
          label="Created"
          icon={<CalendarBlankIcon />}
          options={NOTE_CREATED_OPTIONS}
          value={filters.created}
          onChange={(created) => update({ created })}
        />
        <OptionFilter
          label="Source"
          icon={<GlobeIcon />}
          options={NOTE_SOURCE_OPTIONS}
          value={filters.source}
          onChange={(source) => update({ source })}
        />
        {/* Nothing in the app archives notes yet, so only offer this to the
            people who have some (through the API) */}
        {(facets.archived > 0 || filters.status !== "all") && (
          <OptionFilter
            label="Status"
            icon={<ArchiveIcon />}
            options={NOTE_STATUS_OPTIONS}
            value={filters.status}
            onChange={(status) => update({ status })}
          />
        )}
        {hasActiveFilters(filters) && (
          <Button variant="ghost" size="sm" onClick={controls.reset}>
            Clear filters
            <XIcon data-icon="inline-end" />
          </Button>
        )}
      </div>
    </div>
  );
}
