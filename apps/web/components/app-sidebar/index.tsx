"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderIcon,
  HouseIcon,
  NotePencilIcon,
  TagIcon,
} from "@phosphor-icons/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { SidebarUser } from "./_components/sidebar-user";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: HouseIcon },
  { title: "Notes", href: "/dashboard/notes", icon: NotePencilIcon },
  { title: "Folders", href: "/dashboard/folders", icon: FolderIcon },
  { title: "Tags", href: "/dashboard/tags", icon: TagIcon },
];

interface AppSidebarProps {
  user: { name: string; email: string; image?: string | null };
}
export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/dashboard" />}>
              <Image
                src="/favicon-96x96.png"
                alt="Notebase"
                width={32}
                height={32}
                className="hidden size-8 shrink-0 group-data-[collapsible=icon]:block"
              />
              <Image
                src="/notebase-logo.webp"
                alt="Notebase"
                width={124}
                height={30}
                className="h-6 w-auto group-data-[collapsible=icon]:hidden dark:hidden"
              />
              <Image
                src="/notebase-logo-dark.webp"
                alt="Notebase"
                width={124}
                height={30}
                className="hidden h-6 w-auto group-data-[collapsible=icon]:hidden dark:block"
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      render={<Link href={item.href} />}
                      className={cn(
                        "rounded-xs",
                        isActive &&
                          "data-active:bg-secondary data-active:text-primary data-active:hover:bg-secondary/80",
                      )}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
