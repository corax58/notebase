"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MagnifyingGlassIcon, SignOutIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function DashboardHeader({
  user,
}: {
  user: { name: string; email: string; image?: string | null };
}) {
  return (
    <header className="border-border bg-background flex items-center gap-3 rounded-lg border px-4 py-3 md:m-3 md:px-6">
      <SidebarTrigger />

      <div className="min-w-0 flex-1 md:border-l md:pl-6">
        <h1 className="truncate text-sm font-semibold">
          Welcome back, {user.name.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground truncate text-xs">
          Here&apos;s what&apos;s happening in your notes today.
        </p>
      </div>

      <div className="relative hidden sm:block">
        <MagnifyingGlassIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input placeholder="Search notes..." className="w-56 pl-9 lg:w-72" />
      </div>
    </header>
  );
}
