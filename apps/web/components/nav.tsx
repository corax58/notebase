"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function Nav() {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-3">
      <Link href="/" className="flex items-center">
        <Image
          src="/notebase-logo.webp"
          alt="Notebase"
          width={124}
          height={30}
          className="h-6 w-auto dark:hidden"
          priority
        />
        <Image
          src="/notebase-logo-dark.webp"
          alt="Notebase"
          width={124}
          height={30}
          className="hidden h-6 w-auto dark:block"
          priority
        />
      </Link>
      <div className="flex items-center gap-3">
        {isPending ? null : session ? (
          <>
            <span className="text-sm text-muted-foreground">
              {session.user.email}
            </span>
            <Button
              size="sm"
              variant="outline"
              nativeButton={false}
              render={<Link href="/dashboard" />}
            >
              Dashboard
            </Button>
          </>
        ) : (
          <Button size="sm" nativeButton={false} render={<Link href="/auth" />}>
            Sign in
          </Button>
        )}
      </div>
    </header>
  );
}
