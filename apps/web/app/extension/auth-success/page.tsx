import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  CheckIcon,
  CursorTextIcon,
  LockSimpleIcon,
  NotePencilIcon,
  PushPinIcon,
  PuzzlePieceIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { Em } from "@/app/_components/em";
import { IconThemeToggle } from "@/components/icon-theme-toggle";
import { SignedInAs } from "./signed-in-as";

export const metadata: Metadata = {
  title: "Signed in · Notebase",
};

const nextSteps: { icon: Icon; title: string; body: string }[] = [
  {
    icon: PushPinIcon,
    title: "Pin it",
    body: "Open the puzzle menu in your toolbar and pin Notebase.",
  },
  {
    icon: CursorTextIcon,
    title: "Select to save",
    body: "Highlight text on any page, right-click, and choose Save to Notebase.",
  },
  {
    icon: NotePencilIcon,
    title: "Quick capture",
    body: "Click the Notebase icon to write a note or see your recent ones.",
  },
];

export default function ExtensionAuthSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background bg-dots text-foreground selection:bg-primary selection:text-white">
      <header className="flex items-center justify-between gap-3 px-6 py-5">
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
        <IconThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pt-6 pb-16">
        <div className="flex w-full max-w-[520px] flex-col items-center gap-8 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-success text-white ring-8 ring-success/15">
            <CheckIcon weight="bold" className="size-7" />
          </span>

          <div className="flex flex-col items-center gap-3.5">
            <span className="font-mono text-[13px] tracking-[0] text-primary">
              Extension connected
            </span>
            <h1 className="text-[clamp(2.4rem,6vw,3.6rem)] leading-[1.05] font-bold tracking-[-0.045em]">
              You’re signed <Em>in</Em>.
            </h1>
            <p className="max-w-[420px] text-base leading-[1.6] text-pretty text-muted-foreground">
              The extension now uses your Notebase account. You can close this
              tab and go back to what you were reading.
            </p>
          </div>

          <SignedInAs />

          <div className="w-full overflow-hidden rounded-2xl bg-card text-left shadow-[0_30px_60px_-20px_oklch(0_0_0/0.35),0_0_0_1px_oklch(0_0_0/0.06)]">
            <div
              aria-hidden
              className="flex items-center gap-3 border-b border-border bg-secondary px-3.5 py-3"
            >
              <div className="flex gap-1.5">
                <span className="size-[11px] rounded-full bg-input" />
                <span className="size-[11px] rounded-full bg-input" />
                <span className="size-[11px] rounded-full bg-input" />
              </div>
              <div className="flex h-[30px] min-w-0 flex-1 items-center gap-2 rounded-lg bg-card px-3 text-[12.5px] text-muted-foreground">
                <LockSimpleIcon className="shrink-0" />
                <span className="truncate">Any page you’re reading</span>
              </div>
              <span className="relative flex size-[30px] shrink-0 items-center justify-center rounded-lg bg-primary/18 ring-2 ring-primary">
                <Image
                  src="/favicon.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="size-[18px]"
                />
                <span className="absolute -top-1 -right-1 size-2.5 animate-ping rounded-full bg-primary" />
                <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-primary" />
              </span>
              <PuzzlePieceIcon className="size-[18px] shrink-0 text-muted-foreground" />
            </div>
            <ol className="flex flex-col divide-y divide-border px-5">
              {nextSteps.map((step) => (
                <li
                  key={step.title}
                  className="grid grid-cols-[36px_minmax(0,1fr)] items-start gap-3.5 py-4"
                >
                  <span className="flex size-9 items-center justify-center rounded-[10px] bg-primary/10 text-primary">
                    <step.icon weight="fill" className="size-[18px]" />
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="text-[15px] font-semibold">
                      {step.title}
                    </span>
                    <span className="text-sm leading-[1.55] text-pretty text-muted-foreground">
                      {step.body}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <Link
            href="/dashboard/notes"
            className="pressable depth-primary border border-edge-primary inline-flex h-[46px] items-center gap-2.5 rounded-xl bg-primary px-[22px] text-[15px] font-semibold whitespace-nowrap text-white"
          >
            Open your notes <ArrowRightIcon />
          </Link>
        </div>
      </main>
    </div>
  );
}
