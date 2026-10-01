"use client";

import * as React from "react";
import { FileTextIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "@/components/ui/toast";
import {
  DEFAULT_COMPILE_SETTINGS,
  parseCompileSettings,
  type CompileSettings,
} from "@/lib/validation/notes";
import { useRouter } from "next/dist/client/components/navigation";

export function CompileDialog({
  lastCompileSettings,
  noteCount,
  bundleId,
}: {
  lastCompileSettings: {
    includeTitle: boolean;
    labels: "none" | "heading";
    quoteStyle: "plain" | "blockquote";
    sources: "none" | "inline" | "footnoted";
    includeTags: boolean;
    separator: "none" | "blank" | "rule";
  } | null;
  noteCount: number;
  bundleId: string;
}) {
  const [open, setOpen] = React.useState(false);

  const [settings, setSettings] = React.useState(
    lastCompileSettings ?? DEFAULT_COMPILE_SETTINGS,
  );

  const [compiling, setCompiling] = React.useState(false);

  const router = useRouter();
  const isDefault = (
    Object.keys(DEFAULT_COMPILE_SETTINGS) as (keyof CompileSettings)[]
  ).every((key) => settings[key] === DEFAULT_COMPILE_SETTINGS[key]);

  function handleOpenChange(next: boolean) {
    // Every open starts from the last-used settings; cancel just discards
    if (next) setSettings(lastCompileSettings ?? DEFAULT_COMPILE_SETTINGS);
    setOpen(next);
  }

  function update<K extends keyof CompileSettings>(
    key: K,
    value: CompileSettings[K],
  ) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCompile() {
    // TODO: send settings to the compile endpoint
    setCompiling(true);

    try {
      const response = await fetch(`/api/bundles/${bundleId}/compile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const firstIssue = Object.values(body?.issues ?? {})[0] as
          string[] | undefined;
        throw new Error(
          firstIssue?.[0] ??
            body?.error ??
            "Something went wrong while compiling this bundle.",
        );
      }

      toast.success(
        "Bundle compiled",
        "Your bundle was compiled successfully.",
      );
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(
        "Couldn't compile bundle",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setCompiling(false);
    }

    setOpen(false);
  }

  return (
    <>
      <Button disabled={noteCount === 0} onClick={() => handleOpenChange(true)}>
        <FileTextIcon data-icon="inline-start" />
        Compile
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="flex max-h-[85vh] flex-col sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Compile bundle</DialogTitle>
            <DialogDescription>
              Choose how the notes are combined into a single document.
            </DialogDescription>
          </DialogHeader>

          <div className="-mx-2 flex min-h-0 flex-1 flex-col divide-y overflow-x-hidden overflow-y-auto px-2">
            <SettingRow
              id="compile-title"
              label="Document title"
              description="The bundle name as a top-level heading. Turn off when pasting into an existing document."
            >
              <Switch
                id="compile-title"
                checked={settings.includeTitle}
                onCheckedChange={(checked) => update("includeTitle", checked)}
              />
            </SettingRow>

            <SettingRow
              label="Note titles"
              description="Show each note's label as a heading. Notes without a label get none."
            >
              <OptionGroup
                label="Note titles"
                value={settings.labels}
                onChange={(value) => update("labels", value)}
                options={[
                  { value: "none", label: "None" },
                  { value: "heading", label: "Heading" },
                ]}
              />
            </SettingRow>

            <SettingRow
              label="Content style"
              description="Blockquotes set captured text apart from anything you write later."
            >
              <OptionGroup
                label="Content style"
                value={settings.quoteStyle}
                onChange={(value) => update("quoteStyle", value)}
                options={[
                  { value: "plain", label: "Plain" },
                  { value: "blockquote", label: "Blockquote" },
                ]}
              />
            </SettingRow>

            <SettingRow
              label="Sources"
              description="Inline adds a link under each note. Footnoted numbers each source and lists them at the end."
            >
              <OptionGroup
                label="Sources"
                value={settings.sources}
                onChange={(value) => update("sources", value)}
                options={[
                  { value: "none", label: "None" },
                  { value: "inline", label: "Inline" },
                  { value: "footnoted", label: "Footnoted" },
                ]}
              />
            </SettingRow>

            <SettingRow
              id="compile-tags"
              label="Tags"
              description="List each note's tags under it as #tag."
            >
              <Switch
                id="compile-tags"
                checked={settings.includeTags}
                onCheckedChange={(checked) => update("includeTags", checked)}
              />
            </SettingRow>

            <SettingRow
              label="Separator"
              description="What goes between notes."
            >
              <OptionGroup
                label="Separator"
                value={settings.separator}
                onChange={(value) => update("separator", value)}
                options={[
                  { value: "none", label: "None" },
                  { value: "blank", label: "Blank line" },
                  { value: "rule", label: "Rule" },
                ]}
              />
            </SettingRow>
          </div>

          <DialogFooter className="sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              disabled={isDefault}
              onClick={() => setSettings(DEFAULT_COMPILE_SETTINGS)}
            >
              Reset to defaults
            </Button>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleCompile}
                disabled={compiling}
              >
                {compiling ? "Compiling..." : "Compile"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function SettingRow({
  id,
  label,
  description,
  children,
}: {
  // Set when the control is a single input the label can point at
  id?: string;
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  const titleClassName = "text-sm leading-none font-medium";
  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="flex min-w-0 flex-col gap-1">
        {id ? (
          <label htmlFor={id} className={titleClassName}>
            {label}
          </label>
        ) : (
          <p className={titleClassName}>{label}</p>
        )}
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function OptionGroup<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <ToggleGroup
      aria-label={label}
      variant="outline"
      size="sm"
      spacing={0}
      value={[value]}
      // Pressing the active item would empty the group; always keep one
      onValueChange={(next) => {
        if (next[0]) onChange(next[0] as T);
      }}
    >
      {options.map((option) => (
        <ToggleGroupItem key={option.value} value={option.value}>
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
