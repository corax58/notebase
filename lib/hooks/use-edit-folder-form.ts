import * as React from "react";
import { useRouter } from "next/navigation";

import { toast } from "@/components/ui/toast";

export type EditFolderState = {
  name: string;
  color: string;
};

export function useEditFolderForm(
  folder: { id: string; name: string; color: string | null },
  onSaved?: () => void,
) {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [form, setForm] = React.useState<EditFolderState>({
    name: folder.name,
    color: folder.color ?? "",
  });

  React.useEffect(() => {
    setForm({ name: folder.name, color: folder.color ?? "" });
  }, [folder.id, folder.name, folder.color]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = form.name.trim();
    if (!name) {
      toast.error("Folder name is required");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/folders/${folder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          color: form.color || null,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const firstIssue = Object.values(body?.issues ?? {})[0] as
          string[] | undefined;
        throw new Error(
          firstIssue?.[0] ??
            body?.error ??
            "Something went wrong while updating your folder.",
        );
      }

      toast.success("Folder updated", "Your changes were saved.");
      onSaved?.();
      router.refresh();
    } catch (error) {
      toast.error(
        "Couldn't update folder",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return { form, setForm, submitting, handleSubmit };
}
