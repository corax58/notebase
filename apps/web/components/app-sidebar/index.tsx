"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderIcon,
  HouseIcon,
  NotePencilIcon,
  StackIcon,
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
  { title: "Bundles", href: "/dashboard/bundles", icon: StackIcon },
];

interface AppSidebarProps {
  user: { name: string; email: string; image?: string | null };
}
export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="dark:border-transparent">
      <SidebarHeader>
        <div className="bg-background flex h-14 items-center overflow-hidden rounded-lg border px-3 transition-[width,height,padding] group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-1">
          <Image
            src="/favicon-96x96.png"
            alt="Notebase"
            width={32}
            height={32}
            className="hidden size-full shrink-0 group-data-[collapsible=icon]:block"
          />
          {/* Collapse hides the wrapper, so it doesn't fight dark:block on the images */}
          <span className="flex group-data-[collapsible=icon]:hidden">
            <Image
              src="/notebase-logo.webp"
              alt="Notebase"
              width={166}
              height={40}
              className="h-8 w-auto dark:hidden"
            />
            <Image
              src="/notebase-logo-dark.webp"
              alt="Notebase"
              width={166}
              height={40}
              className="hidden h-8 w-auto dark:block"
            />
          </span>
        </div>
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
                        "rounded-lg border border-transparent transition-[width,height,padding,translate,box-shadow,background-color,border-color] [--depth:2px]",
                        isActive
                          ? "data-active:bg-primary data-active:text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary active:text-primary-foreground data-active:border-edge-primary pressable depth-primary data-active:font-semibold"
                          : "hover:bg-background hover:border-edge hover:raised",
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
      <SidebarFooter className="">
        <SidebarUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
