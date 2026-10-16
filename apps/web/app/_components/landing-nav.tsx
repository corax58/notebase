"use client";

import Image from "next/image";
import Link from "next/link";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth-client";

const links = [
  { href: "/#parts", label: "Extension" },
  { href: "/#parts", label: "Web app" },
  { href: "/#compile", label: "Bundles and docs" },
];

export function LandingNav() {
  const { resolvedTheme, setTheme } = useTheme();
  const { data: session } = authClient.useSession();

  return (
    <>
      {/* Holds the nav's place in the page now that it floats above it */}
      <div aria-hidden className="h-[54px]" />
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
        <nav className="mx-auto flex max-w-[1160px] items-center justify-between gap-3 rounded-2xl bg-card py-2 pr-2 pl-[18px] shadow-[0_10px_30px_-12px_oklch(0_0_0/0.35)]">
          <Link href="/#top" className="flex items-center">
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
          <div className="hidden gap-1 text-sm font-medium min-[860px]:flex">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-[10px] px-3.5 py-2 text-foreground hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Toggle theme"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              className="inline-flex size-[38px] cursor-pointer items-center justify-center rounded-[10px] text-foreground hover:bg-muted"
            >
              <SunIcon className="hidden size-[17px] dark:block" />
              <MoonIcon className="size-[17px] dark:hidden" />
            </button>
            <Link
              href={session ? "/dashboard" : "/auth"}
              className="pressable depth-primary border border-edge-primary inline-flex h-[38px] items-center rounded-[10px] bg-primary px-4 text-sm font-semibold whitespace-nowrap text-white"
            >
              {session ? "Dashboard" : "Sign in"}
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}
