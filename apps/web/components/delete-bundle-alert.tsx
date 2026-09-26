"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export function DeleteBundleAlert({
  bundleId,
  bundleName,
  open,
  onOpenChange,
  redirectTo,
}: {
  bundleId: string;
  bundleName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Set when deleting from the bundle's own page, which would otherwise 404
  redirectTo?: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = React.useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const response = await fetch(`/api/bundles/${bundleId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
          body?.error ?? "Something went wrong while deleting your bundle.",
        );
      }

      toast.success("Bundle deleted", `"${bundleName}" was removed.`);
      onOpenChange(false);
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    } catch (error) {
      toast.error(
        "Couldn't delete bundle",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete bundle?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete &quot;{bundleName}&quot;. The notes
            inside it won&apos;t be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            disabled={deleting}
            onClick={handleDelete}
          >
            {deleting ? "Deleting..." : "Delete bundle"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
