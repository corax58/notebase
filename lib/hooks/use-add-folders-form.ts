import * as React from "react";
import { useRouter } from "next/navigation";

import { toast } from "@/components/ui/toast";
import { Name } from "drizzle-orm";

const initialState = {
  name: "",
  color: "",
};

export type AddFolderState = typeof initialState;

export function useAddFolder() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [form, setForm] = React.useState(initialState);

  function reset() {
    setForm(initialState);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = form.name.trim();
    if (!name) {
      toast.error("Folder name is required");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          color: form.color || undefined,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const firstIssue = Object.values(body?.issues ?? {})[0] as
          string[] | undefined;
        throw new Error(
          firstIssue?.[0] ??
            body?.error ??
            "Something went wrong while creating your folder.",
        );
      }

      toast.success("Folder created", "Your folder was saved successfully.");
      reset();
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(
        "Couldn't create folder",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return { open, setOpen, form, setForm, submitting, reset, handleSubmit };
}
