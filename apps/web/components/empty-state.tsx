import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/**
 * What a list shows before it has anything in it: what would go here, and
 * the actions (children) that add the first one. Tinted with the brand color,
 * unlike the gray "nothing matches" states, since it's an invitation rather
 * than a dead end.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
  className,
}: {
  icon: Icon;
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-3 px-4 py-6 text-center",
        className,
      )}
    >
      <span className="bg-primary/10 text-primary border-primary/30 flex size-10 items-center justify-center rounded-[10px] border">
        <Icon weight="fill" className="size-5" />
      </span>
      <div className="flex max-w-80 flex-col gap-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-muted-foreground text-sm text-pretty">
          {description}
        </p>
      </div>
      {children && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}
