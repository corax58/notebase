"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BellIcon,
  MagnifyingGlassIcon,
  SignOutIcon,
} from "@phosphor-icons/react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

export function DashboardHeader({
  user,
}: {
  user: { name: string; email: string; image?: string | null };
}) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    await authClient.signOut();
    router.push("/auth");
    router.refresh();
  }

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="border-border bg-background flex items-center gap-3 border-b px-4 py-3 md:m-3 md:rounded-t-xs md:px-6">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-5" />

      <div className="min-w-0 flex-1">
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

      {/* <Button variant="secondary" size="icon-sm" aria-label="Notifications">
        <BellIcon />
      </Button> */}

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className="focus-visible:ring-ring/50 rounded-lg outline-none focus-visible:ring-[3px]"
            >
              <Avatar>
                <AvatarImage src={user.image ?? undefined} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">{user.name}</span>
                <span className="text-muted-foreground text-xs font-normal">
                  {user.email}
                </span>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={isSigningOut}
            onClick={handleSignOut}
          >
            <SignOutIcon />
            {isSigningOut ? "Signing out..." : "Sign out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
