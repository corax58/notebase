"use client";

import { CaretDownIcon } from "@phosphor-icons/react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type FacetOption = {
  value: string;
  label: string;
  icon?: React.ReactNode;
  // How many notes carry this value
  count?: number;
};

// A filter's current value, shown inside its own trigger button
function FilterValue({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-primary/10 text-primary max-w-28 truncate rounded-sm px-1.5 py-0.5 text-xs">
      {children}
    </span>
  );
}

function FilterTrigger({
  icon,
  label,
  values,
}: {
  icon: React.ReactNode;
  label: string;
  values: string[];
}) {
  return (
    <>
      {icon}
      {label}
      {values.length > 0 && (
        <>
          <span aria-hidden className="bg-border mx-0.5 h-4 w-px" />
          {values.length > 2 ? (
            <FilterValue>{values.length} selected</FilterValue>
          ) : (
            values.map((value) => (
              <FilterValue key={value}>{value}</FilterValue>
            ))
          )}
        </>
      )}
    </>
  );
}

/** Pick any number of values from a searchable list. */
export function FacetFilter({
  label,
  icon,
  options,
  selected,
  onChange,
  searchPlaceholder,
  emptyText,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  options: FacetOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  searchPlaceholder: string;
  emptyText: string;
  // Rendered under the list, for controls that belong to this filter
  children?: React.ReactNode;
}) {
  const value = options.filter((option) => selected.includes(option.value));

  return (
    <Combobox
      multiple
      items={options}
      value={value}
      onValueChange={(next: FacetOption[]) =>
        onChange(next.map((option) => option.value))
      }
    >
      <ComboboxTrigger
        render={
          <Button variant="outline" size="sm" className="border-dashed" />
        }
      >
        <FilterTrigger
          icon={icon}
          label={label}
          values={value.map((option) => option.label)}
        />
      </ComboboxTrigger>
      <ComboboxContent className="w-64">
        <ComboboxInput showTrigger={false} placeholder={searchPlaceholder} />
        <ComboboxEmpty className="py-6">{emptyText}</ComboboxEmpty>
        <ComboboxList>
          {(option: FacetOption) => (
            <ComboboxItem key={option.value} value={option}>
              {option.icon}
              <span className="truncate">{option.label}</span>
              {option.count !== undefined && (
                <span className="text-muted-foreground ml-auto text-xs tabular-nums">
                  {option.count}
                </span>
              )}
            </ComboboxItem>
          )}
        </ComboboxList>
        {children}
      </ComboboxContent>
    </Combobox>
  );
}

/** Pick one of a few fixed options; the first one means "not filtering". */
export function OptionFilter<T extends string>({
  label,
  icon,
  options,
  value,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  const active =
    value === options[0].value
      ? undefined
      : options.find((option) => option.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" className="border-dashed" />
        }
      >
        <FilterTrigger
          icon={icon}
          label={label}
          values={active ? [active.label] : []}
        />
        <CaretDownIcon className="text-muted-foreground size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(next) => onChange(next as T)}
        >
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
