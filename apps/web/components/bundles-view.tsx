"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircleIcon,
  CircleDashedIcon,
  DotsThreeVerticalIcon,
  PlusIcon,
  StackIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import {
  BUNDLE_GRID_CLASS_NAME,
  BundleGridSkeleton,
  LIST_PANEL_CLASS_NAME,
} from "@/components/dashboard-skeletons";
import { DeleteBundleAlert } from "@/components/delete-bundle-alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ViewToggle, useViewMode } from "@/components/view-toggle";
import type { BundleRow } from "@/lib/queries/bundles";
import { cn, formatRelativeDate } from "@/lib/utils";

export function BundlesView({ bundles }: { bundles: BundleRow[] }) {
  const { view, setView, ready } = useViewMode("bundles-view");

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-card flex flex-wrap items-end justify-between gap-4 rounded-xl border p-4 md:px-6 md:py-5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="text-[28px] leading-[1.1] font-bold tracking-[-0.035em]">
            Bundles
          </h2>
          <p className="text-muted-foreground text-sm">
            <span className="text-foreground font-bold tabular-nums">
              {bundles.length}
            </span>{" "}
            {bundles.length === 1 ? "bundle" : "bundles"} · ordered collections
            of notes
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
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
        <BundleGridSkeleton />
      ) : view === "grid" ? (
        <div className={BUNDLE_GRID_CLASS_NAME}>
          {bundles.map((bundle) => (
            <BundleCard key={bundle.id} bundle={bundle} />
          ))}
        </div>
      ) : (
        <div className={LIST_PANEL_CLASS_NAME}>
          {bundles.map((bundle) => (
            <BundleListItem key={bundle.id} bundle={bundle} />
          ))}
        </div>
      )}
    </div>
  );
}

// A note card in the stack. White in both themes like paper, so its edge
// keeps the light theme's border color too.
const paperClassName =
  "raised absolute h-18.5 w-25 rounded-lg border border-[oklch(0.88_0.015_100)] bg-white [--depth-color:oklch(0.88_0.015_100)] [--depth:2px]";

// The bundle's name links to it and stretches over the whole card or row, so
// all of it is clickable while the menu button above stays its own control
const stretchedLinkClassName = "after:absolute after:inset-0";

function BundleCard({ bundle }: { bundle: BundleRow }) {
  return (
    <article className="bg-card border-edge raised relative flex flex-col overflow-hidden rounded-xl border transition-[translate,box-shadow] duration-120 hover:-translate-y-0.5 hover:[--depth:5px]">
      <div className="bg-input/40 flex aspect-16/10 w-full items-center justify-center border-b bg-[radial-gradient(color-mix(in_oklch,var(--foreground)_14%,transparent)_1px,transparent_1px)] bg-size-[18px_18px] bg-center">
        <div className="relative h-24 w-30">
          {/* Bigger bundles stack more cards */}
          {bundle.noteCount >= 5 && (
            <div className={cn(paperClassName, "top-3.5 left-1.5 -rotate-8")} />
          )}
          {bundle.noteCount >= 2 && (
            <div className={cn(paperClassName, "top-2 left-3.5 rotate-5")} />
          )}
          <div
            className={cn(
              paperClassName,
              "top-3 left-2.5 flex flex-col gap-1.5 px-3 py-2.5",
            )}
          >
            <StackIcon weight="fill" className="text-primary size-4" />
            <span className="h-1.25 w-[72%] rounded-[3px] bg-black/8" />
            <span className="h-1.25 w-[90%] rounded-[3px] bg-black/8" />
            <span className="h-1.25 w-[56%] rounded-[3px] bg-black/8" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 pt-3 pr-2.5 pb-3.5 pl-3.5">
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/bundles/${bundle.id}`}
            className={cn(
              stretchedLinkClassName,
              "min-w-0 flex-1 truncate text-[15px] font-bold tracking-[-0.02em]",
            )}
          >
            {bundle.name}
          </Link>
          <BundleActions bundle={bundle} />
        </div>
        <div className="flex items-center justify-between gap-2">
          <NoteCount bundle={bundle} />
          <CompiledBadge compiledAt={bundle.compiledAt} />
        </div>
      </div>
    </article>
  );
}

function BundleListItem({ bundle }: { bundle: BundleRow }) {
  return (
    <div className="hover:bg-background hover:border-edge hover:raised relative flex items-center gap-3.5 rounded-lg border border-transparent py-2.5 pr-2.5 pl-3 transition-[background-color,border-color,box-shadow] [--depth:2px]">
      <span className="bg-primary/10 border-primary/30 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg border">
        <StackIcon className="size-4" weight="fill" />
      </span>
      <Link
        href={`/dashboard/bundles/${bundle.id}`}
        className={cn(
          stretchedLinkClassName,
          "min-w-0 flex-1 truncate text-sm font-semibold",
        )}
      >
        {bundle.name}
      </Link>

      <NoteCount bundle={bundle} className="w-16 shrink-0" />
      <span className="flex w-37.5 shrink-0 max-sm:hidden">
        <CompiledBadge compiledAt={bundle.compiledAt} />
      </span>

      <BundleActions bundle={bundle} />
    </div>
  );
}

function NoteCount({
  bundle,
  className,
}: {
  bundle: BundleRow;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-muted-foreground text-xs whitespace-nowrap tabular-nums",
        className,
      )}
    >
      {bundle.noteCount} {bundle.noteCount === 1 ? "note" : "notes"}
    </span>
  );
}

function CompiledBadge({ compiledAt }: { compiledAt: Date | null }) {
  const className =
    "inline-flex h-5.5 items-center gap-1.25 rounded-[7px] px-2 text-xs font-semibold whitespace-nowrap";

  if (!compiledAt) {
    return (
      <span className={cn(className, "bg-muted text-muted-foreground")}>
        <CircleDashedIcon className="size-3.25" />
        Not compiled
      </span>
    );
  }

  return (
    <span
      className={cn(
        className,
        "bg-success/13 dark:text-success text-[color-mix(in_oklch,var(--success),black_35%)]",
      )}
      title={compiledAt.toLocaleString()}
    >
      <CheckCircleIcon weight="fill" className="text-success size-3.25" />
      Compiled {formatRelativeDate(compiledAt)}
    </span>
  );
}

function BundleActions({ bundle }: { bundle: BundleRow }) {
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`${bundle.name} options`}
              className="text-muted-foreground relative z-10 size-7"
            />
          }
        >
          <DotsThreeVerticalIcon className="size-4.5" weight="bold" />
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
