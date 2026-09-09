import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";
import { signOut } from "@/auth/auth-client";
import { cn } from "@/lib/utils";

interface AccountScreenProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

export function AccountScreen({ user }: AccountScreenProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
  }

  return (
    <div className="flex justify-between items-center  p-6">
      <div className="flex items-center gap-3">
        {user.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="size-10 shrink-0 rounded-full"
          />
        ) : (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium">{user.name}</span>
          <span className="truncate text-xs text-muted-foreground">
            {user.email}
          </span>
        </div>
      </div>
      <button
        className={cn(
          "inline-flex size-10 shrink-0 cursor-pointer items-center justify-center  rounded-4xl border border-border bg-clip-padding text-sm font-medium whitespace-nowrap transition-colors outline-none select-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
        )}
        disabled={isSigningOut}
        onClick={handleSignOut}
      >
        {isSigningOut ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <LogOut className="size-4" />
        )}
      </button>
    </div>
  );
}
