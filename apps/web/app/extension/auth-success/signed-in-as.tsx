"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";

export function SignedInAs() {
  const { data: session } = authClient.useSession();

  if (!session) return null;

  const { name, email, image } = session.user;

  return (
    <div className="flex max-w-full items-center gap-2.5 rounded-full bg-card py-1.5 pr-4 pl-1.5 text-sm ring-1 ring-foreground/8">
      <Avatar size="sm" className="rounded-full after:rounded-full">
        <AvatarImage src={image ?? undefined} alt="" className="rounded-full" />
        <AvatarFallback className="rounded-full bg-primary text-white">
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="truncate text-muted-foreground">
        Signed in as{" "}
        <span className="font-medium text-foreground">{email}</span>
      </span>
    </div>
  );
}
