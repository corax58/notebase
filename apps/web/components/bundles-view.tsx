"use client";

import * as React from "react";
import Link from "next/link";
import {
  DotsThreeVerticalIcon,
  PlusIcon,
  StackIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { DeleteBundleAlert } from "@/components/delete-bundle-alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ViewToggle, useViewMode } from "@/components/view-toggle";
import type { BundleRow } from "@/lib/queries/bundles";
import { cn, formatRelativeDate } from "@/lib/utils";

export function BundlesView({ bundles }: { bundles: BundleRow[] }) {
  const { view, setView, ready } = useViewMode("bundles-view");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Bundles</h2>
          <p className="text-muted-foreground text-sm">
            {bundles.length} {bundles.length === 1 ? "bundle" : "bundles"} ·
            ordered collections of notes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle view={view} onChange={setView} />
          <Button
            nativeButton={false}
            render={<Link href="/dashboard/bundles/new" />}
          >
            <PlusIcon data-icon="inline-start" />
            New Bundle
          </Button>
        </div>
      </div>

      {bundles.length === 0 ? (
        <Card>
          <CardContent className="text-muted-foreground flex flex-col items-center gap-3 py-12 text-center text-sm">
            No bundles yet.
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={<Link href="/dashboard/bundles/new" />}
            >
              Create your first bundle
            </Button>
          </CardContent>
        </Card>
      ) : !ready ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-lg" />
          ))}
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {bundles.map((bundle) => (
            <BundleCard key={bundle.id} bundle={bundle} />
          ))}
        </div>
      ) : (
        <div className="bg-card divide-y overflow-hidden rounded-lg border">
          {bundles.map((bundle) => (
            <BundleListItem key={bundle.id} bundle={bundle} />
          ))}
        </div>
      )}
    </div>
  );
}

function BundleCard({ bundle }: { bundle: BundleRow }) {
  const href = `/dashboard/bundles/${bundle.id}`;

  return (
    <Card size="sm" className="rounded-lg py-0">
      <CardContent className="flex flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={href}
            className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg"
          >
            <StackIcon className="size-4" weight="fill" />
          </Link>
          <BundleActions bundle={bundle} />
        </div>
        <Link href={href} className="min-w-0">
          <p className="truncate text-sm font-medium hover:underline">
            {bundle.name}
          </p>
          <BundleMeta bundle={bundle} />
        </Link>
      </CardContent>
    </Card>
  );
}

function BundleListItem({ bundle }: { bundle: BundleRow }) {
  const href = `/dashboard/bundles/${bundle.id}`;

  return (
    <div className="hover:bg-muted/40 flex items-center gap-4 px-4 py-3 transition-colors">
      <Link href={href} className="flex min-w-0 flex-1 items-center gap-3">
        <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
          <StackIcon className="size-4" weight="fill" />
        </div>
        <span className="truncate text-sm font-medium">{bundle.name}</span>
      </Link>

      <BundleMeta bundle={bundle} className="hidden shrink-0 sm:block" />

      <BundleActions bundle={bundle} />
    </div>
  );
}

function BundleMeta({
  bundle,
  className,
}: {
  bundle: BundleRow;
  className?: string;
}) {
  return (
    <p className={cn("text-muted-foreground text-xs", className)}>
      {bundle.noteCount} {bundle.noteCount === 1 ? "note" : "notes"} ·{" "}
      {bundle.compiledAt
        ? `compiled ${formatRelativeDate(bundle.compiledAt)}`
        : "not compiled"}
    </p>
  );
}

function BundleActions({ bundle }: { bundle: BundleRow }) {
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
          <DotsThreeVerticalIcon className="size-5" weight="bold" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteBundleAlert
        bundleId={bundle.id}
        bundleName={bundle.name}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
