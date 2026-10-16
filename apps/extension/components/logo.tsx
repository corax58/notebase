import { cn } from "@/lib/utils";

// The web app's wordmark, swapped for the dark theme the same way
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center", className)}>
      <img
        src="/notebase-logo.webp"
        alt="Notebase"
        className="h-6 w-auto dark:hidden"
      />
      <img
        src="/notebase-logo-dark.webp"
        alt="Notebase"
        className="hidden h-6 w-auto dark:block"
      />
    </span>
  );
}
