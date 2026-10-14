"use client";

import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useFocusShortcut } from "@/hooks/use-focus-shortcut";
import { normalizeQuery, notesHref } from "@/lib/note-filters";
import { cn } from "@/lib/utils";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";

function HeaderSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  // On small screens the box is only its icon until it's in use, then it
  // takes over the header's width
  const expanded = focused || query !== "";

  // This box always searches notes. The folders page has a search of its own
  // for folders, which gets the / shortcut there; the notes page has one tied
  // into its filters, which replaces this box altogether.
  const pageHasSearch = pathname === "/dashboard/folders";
  useFocusShortcut(inputRef, !pageHasSearch);

  if (pathname === "/dashboard/notes") return null;

  return (
    <form
      role="search"
      data-expanded={expanded || undefined}
      className={cn("relative", expanded && "max-sm:flex-1")}
      onSubmit={(event) => {
        event.preventDefault();
        const q = normalizeQuery(query);
        if (!q) return;
        setQuery("");
        // The notes page drops this box, so let go of it first
        inputRef.current?.blur();
        router.push(notesHref({ q }));
      }}
    >
      <MagnifyingGlassIcon
        className={cn(
          "text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2",
          !expanded && "max-sm:left-2.5",
        )}
      />
      <Input
        ref={inputRef}
        aria-label="Search notes"
        placeholder="Search notes..."
        enterKeyHint="search"
        autoComplete="off"
        className={cn(
          "pr-8 pl-9 sm:w-56 lg:w-72",
          !expanded &&
            "max-sm:w-9 max-sm:cursor-pointer max-sm:px-0 max-sm:placeholder:text-transparent",
        )}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(event) => {
          if (event.key !== "Escape") return;
          setQuery("");
          event.currentTarget.blur();
        }}
      />
      {!query && !pageHasSearch && (
        <kbd
          title="Press / to search"
          className="bg-muted-foreground/10 text-muted-foreground pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 rounded-sm px-1.5 font-sans text-xs max-sm:hidden"
        >
          /
        </kbd>
      )}
    </form>
  );
}

export function DashboardHeader({
  user,
}: {
  user: { name: string; email: string; image?: string | null };
}) {
  return (
    <header className="group/header border-border bg-secondary flex items-center gap-3 rounded-xl border px-4 py-3 md:m-3 md:px-6">
      <SidebarTrigger />

      {/* Steps aside on small screens while the search box is expanded */}
      <div className="min-w-0 flex-1 max-sm:group-has-data-expanded/header:hidden md:border-l md:pl-6">
        <h1 className="truncate text-sm font-semibold">
          Welcome back, {user.name.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground truncate text-xs">
          Here&apos;s what&apos;s happening in your notes today.
        </p>
      </div>

      <HeaderSearch />
    </header>
  );
}
