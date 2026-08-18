import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { auth } from "@/lib/auth";

export default async function DashboardLayout(
  props: LayoutProps<"/dashboard">,
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/auth?redirectTo=/dashboard");
  }

  const { user } = session;
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <TooltipProvider>
      <SidebarProvider
        defaultOpen={defaultOpen}
        className="dashboard-shell bg-background"
      >
        <AppSidebar />
        <SidebarInset className="ring-border bg-secondary flex-1 overflow-hidden ring-1">
          <DashboardHeader user={user} />
          <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4 md:p-6">
            {props.children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
