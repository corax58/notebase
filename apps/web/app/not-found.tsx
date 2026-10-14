import Link from "next/link";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import { Em } from "./_components/em";

export default function NotFound() {
  return (
    <main className="flex min-h-[80svh] flex-col items-center justify-center gap-5 bg-dots px-6 py-16 text-center selection:bg-primary selection:text-white">
      <span className="font-mono text-[13px] tracking-[0] text-primary">
        404
      </span>
      <h1 className="max-w-[720px] text-[clamp(2rem,5vw,3.2rem)] leading-[1.1] font-bold tracking-[-0.04em] text-balance">
        This page <Em>doesn’t exist</Em>
      </h1>
      <p className="max-w-[480px] text-base leading-[1.6] text-pretty text-muted-foreground">
        The link may be broken, or the page may have been moved or deleted.
      </p>
      <Link
        href="/"
        className="inline-flex h-11 items-center gap-2.5 rounded-xl bg-primary px-5 text-[15px] font-semibold whitespace-nowrap text-white"
      >
        <ArrowLeftIcon /> Back to home
      </Link>
    </main>
  );
}
