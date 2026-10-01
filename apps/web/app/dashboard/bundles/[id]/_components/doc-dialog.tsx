"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DEFAULT_COMPILE_SETTINGS } from "@/lib/validation/notes";
import { FileTextIcon } from "@phosphor-icons/react";
import dynamic from "next/dynamic";
import DocEditor from "./doc-editor";
import * as React from "react";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

export function DocDialog({
  docContent,
  bundle,
}: {
  bundle: { id: string; title: string };
  docContent: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(docContent);
  const [baseline, setBaseline] = React.useState(docContent);
  const [saving, setSaving] = React.useState(false);
  const editorRef = React.useRef<MDXEditorMethods>(null);

  const router = useRouter();
  const hasChanges = value !== baseline;

  const handleChange = (markdown: string, initialNormalize: boolean) => {
    setValue(markdown);
    if (initialNormalize) {
      setBaseline(markdown);
    }
  };

  const handleReset = () => {
    setValue(baseline);
    editorRef.current?.setMarkdown(baseline); // editor is uncontrolled-ish, so push it in
  };

  async function handleSave() {
    setSaving(true);
    const body = JSON.stringify({ docContent: value });
    try {
      const response = await fetch(`/api/bundles/${bundle.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const firstIssue = Object.values(body?.issues ?? {})[0] as
          string[] | undefined;
        throw new Error(
          firstIssue?.[0] ??
            body?.error ??
            "Something went wrong while saving your changes.",
        );
      }

      toast.success("Saved");
      setBaseline(value);
      router.refresh();
    } catch (error) {
      toast.error(
        "Couldn't save changes ",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  function handleDownload() {
    const blob = new Blob([value], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${bundle.title}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleOpenChange(next: boolean) {
    if (!next && hasChanges && !saving) {
      if (!window.confirm("Discard unsaved changes?")) return;
      handleReset();
    }
    setOpen(next);
  }

  return (
    <>
      <Button variant={"outline"} onClick={() => handleOpenChange(true)}>
        <FileTextIcon data-icon="inline-start" />
        Document
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="flex max-h-[85vh] flex-col sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit document</DialogTitle>
            <DialogDescription>
              Edit the markdown for this bundle. Changes are saved to the bundle
              and won't affect your original notes.{" "}
            </DialogDescription>
          </DialogHeader>
          <DocEditor
            editorRef={editorRef}
            value={docContent}
            handleChange={handleChange}
          />

          <DialogFooter className="sm:items-center sm:justify-between">
            <div>
              <Button type="button" variant="outline" onClick={handleDownload}>
                Download MD
              </Button>
            </div>
            <div className="space-x-4">
              <Button
                type="button"
                variant="outline"
                disabled={!hasChanges || saving}
                onClick={() => handleReset()}
              >
                Reset Changes
              </Button>
              <Button
                disabled={!hasChanges || saving}
                type="button"
                onClick={() => handleSave()}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
