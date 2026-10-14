import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardNotFound() {
  return (
    <div className="bg-secondary flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border p-6 text-center">
      <p className="text-primary font-mono text-sm">404</p>
      <h2 className="text-lg font-semibold">Page not found</h2>
      <p className="text-muted-foreground max-w-sm text-sm">
        This page doesn’t exist, or what it showed has been deleted.
      </p>
      <Button nativeButton={false} render={<Link href="/dashboard" />}>
        Back to dashboard
      </Button>
    </div>
  );
}
