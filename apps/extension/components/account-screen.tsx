import { useState } from "react";
import { CircleNotchIcon, SignOutIcon } from "@phosphor-icons/react";
import { signOut } from "@/auth/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface AccountScreenProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

export function AccountScreen({ user }: AccountScreenProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Two letters either way: first and second name, or the start of a lone one
  const [first = "", second] = user.name.trim().split(/\s+/);
  const initials = (
    second ? first.charAt(0) + second.charAt(0) : first.slice(0, 2)
  ).toUpperCase();

  async function handleSignOut() {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
  }

  return (
    <div className="flex items-center justify-between gap-3 border-b px-6 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar size="lg">
          <AvatarImage src={user.image ?? undefined} alt={user.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="grid min-w-0 flex-1 text-sm leading-tight">
          <span className="truncate font-semibold">{user.name}</span>
          <span className="truncate text-xs text-muted-foreground">
            {user.email}
          </span>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Sign out"
        title="Sign out"
        disabled={isSigningOut}
        onClick={handleSignOut}
      >
        {isSigningOut ? (
          <CircleNotchIcon className="animate-spin" />
        ) : (
          <SignOutIcon />
        )}
      </Button>
    </div>
  );
}
