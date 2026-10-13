import Image from "next/image";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-4 px-6 pt-2 pb-8 text-[13px] text-muted-foreground">
      <div className="flex items-center gap-4">
        <Image
          src="/notebase-logo.webp"
          alt="Notebase"
          width={124}
          height={30}
          className="h-5 w-auto dark:hidden"
        />
        <Image
          src="/notebase-logo-dark.webp"
          alt="Notebase"
          width={124}
          height={30}
          className="hidden h-5 w-auto dark:block"
        />
        <span>© 2026</span>
      </div>
      <nav className="flex flex-wrap gap-5">
        <Link href="/get-extension" className="hover:underline">
          Get the extension
        </Link>
        <Link href="/legal#privacy" className="hover:underline">
          Privacy policy
        </Link>
        <Link href="/legal#terms" className="hover:underline">
          Terms and conditions
        </Link>
      </nav>
    </footer>
  );
}
