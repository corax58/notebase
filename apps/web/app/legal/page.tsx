import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { IconThemeToggle } from "@/components/icon-theme-toggle";
import { LegalContent } from "./legal-content";

export const metadata: Metadata = {
  title: "Legal · Notebase",
};

export default function LegalPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary selection:text-white">
      <header className="flex items-center justify-between gap-3 border-b border-border px-6 py-3">
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
        <div className="flex items-center gap-2">
          <IconThemeToggle />
          <Link
            href="/auth"
            className="inline-flex h-8 items-center rounded-lg bg-primary px-3 text-sm font-medium whitespace-nowrap text-primary-foreground"
          >
            Sign in
          </Link>
        </div>
      </header>

      <LegalContent />
    </div>
  );
}
