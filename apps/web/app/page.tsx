import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  ClockCounterClockwiseIcon,
  CursorTextIcon,
  FileTextIcon,
  FolderIcon,
  HashIcon,
  NotePencilIcon,
  PuzzlePieceIcon,
  StackIcon,
  UserCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { CaptureDemo } from "./_components/capture-demo";
import { CompileDemo } from "./_components/compile-demo";
import { LandingNav } from "./_components/landing-nav";

type Feature = { icon: Icon; title: string; body: string };

const extFeatures: Feature[] = [
  {
    icon: CursorTextIcon,
    title: "Select to save",
    body: "Highlight text, right-click, and save.",
  },
  {
    icon: NotePencilIcon,
    title: "Quick capture",
    body: "Click the extension icon to open a save form.",
  },
  {
    icon: ClockCounterClockwiseIcon,
    title: "Recent notes",
    body: "See your last few notes in the popup.",
  },
  {
    icon: UserCircleIcon,
    title: "One account",
    body: "Same sign-in and notes as the web app.",
  },
];

const appFeatures: Feature[] = [
  {
    icon: FolderIcon,
    title: "Folders",
    body: "Group notes by project, topic, or source.",
  },
  {
    icon: HashIcon,
    title: "Tags",
    body: "Label themes that cross folders, then filter by them.",
  },
  {
    icon: StackIcon,
    title: "Bundles",
    body: "Collect notes and drag them into the order you want.",
  },
  {
    icon: FileTextIcon,
    title: "Docs",
    body: "Compile a bundle into markdown, edit it, and export.",
  },
];

function Em({ children }: { children: React.ReactNode }) {
  return (
    <em className="font-serif font-medium tracking-[-0.025em] text-primary italic">
      {children}
    </em>
  );
}

function Part({
  eyebrow,
  name,
  tagline,
  features,
  iconClassName,
}: {
  eyebrow: string;
  name: string;
  tagline: string;
  features: Feature[];
  iconClassName: string;
}) {
  return (
    <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-7">
      <div className="flex flex-col gap-3.5">
        <span className="font-mono text-[13px] tracking-[0] text-muted-foreground">
          {eyebrow}
        </span>
        <span className="font-serif text-[clamp(3.2rem,7vw,5.6rem)] leading-[0.92] font-medium tracking-[-0.035em] italic">
          {name}
        </span>
        <span className="text-[17px] leading-normal text-muted-foreground">
          {tagline}
        </span>
      </div>
      <ol className="flex flex-col">
        {features.map((feature) => (
          <li
            key={feature.title}
            className="grid grid-cols-[44px_minmax(0,1fr)] items-start gap-4 border-t border-border py-[18px]"
          >
            <span
              className={cn(
                "flex size-11 items-center justify-center rounded-xl",
                iconClassName,
              )}
            >
              <feature.icon weight="fill" className="size-[22px]" />
            </span>
            <span className="flex flex-col gap-1 pt-0.5">
              <span className="text-base font-semibold">{feature.title}</span>
              <span className="text-[14.5px] leading-[1.6] text-pretty text-muted-foreground">
                {feature.body}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Home() {
  return (
    <div
      id="top"
      className="min-h-screen overflow-x-hidden bg-background text-foreground selection:bg-primary selection:text-white"
    >
      <section className="relative bg-background bg-dots px-4 pt-4">
        <LandingNav />

        <div className="mx-auto flex max-w-[1160px] flex-col items-center gap-[26px] px-2 pt-[clamp(56px,9vw,104px)] pb-[clamp(40px,6vw,64px)] text-center">
          <h1 className="max-w-[1000px] text-[clamp(2.6rem,7.4vw,5.6rem)] leading-[1.1] font-bold tracking-[-0.045em] text-balance">
            Save what you{" "}
            <span className="rounded-md bg-primary px-[0.1em] text-white">
              read
            </span>
            . Turn it into a <Em>document</Em>.
          </h1>
          <p className="max-w-[640px] text-[clamp(1.05rem,1.7vw,1.25rem)] leading-[1.6] text-pretty text-muted-foreground">
            Save highlights from any web page. Organize them, then compile them
            into one document.
          </p>
          <div className="flex w-full flex-wrap items-center justify-center gap-3">
            <Link
              href="/auth"
              className="inline-flex h-[50px] items-center gap-2.5 rounded-xl bg-primary px-6 text-base font-semibold whitespace-nowrap text-white"
            >
              Get started <ArrowRightIcon />
            </Link>
            <a
              href="#"
              className="inline-flex h-[50px] items-center gap-2.5 rounded-xl border border-border bg-card px-5 text-[15px] font-medium whitespace-nowrap text-foreground hover:bg-muted"
            >
              <PuzzlePieceIcon
                className="size-[18px] text-primary"
              />
              Add extension
            </a>
          </div>
        </div>

        <div className="relative z-1 mx-auto -mb-[120px] max-w-[1080px]">
          <CaptureDemo />
        </div>
      </section>

      <section
        id="parts"
        className="mx-auto flex max-w-[1160px] flex-col gap-[clamp(40px,6vw,72px)] px-6 pt-[calc(120px_+_clamp(64px,9vw,112px))] pb-[clamp(64px,9vw,112px)]"
      >
        <div className="flex max-w-[760px] flex-col gap-3.5">
          <span className="font-mono text-[13px] tracking-[0] text-primary">
            Two parts
          </span>
          <h2 className="text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.12] font-bold tracking-[-0.04em] text-balance">
            The extension gets things <Em>in</Em>. The web app makes them{" "}
            <Em>useful</Em>.
          </h2>
        </div>
        <div className="flex flex-wrap gap-[clamp(40px,5vw,56px)]">
          <Part
            eyebrow="01 — Capture"
            name="Extension"
            tagline="Saves notes from the page you’re reading."
            features={extFeatures}
            iconClassName="bg-primary text-white"
          />
          <div className="hidden flex-none flex-col items-center gap-3 pt-[110px] min-[1000px]:flex">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary text-white">
              <ArrowRightIcon weight="fill" className="size-5" />
            </span>
            <span className="w-px flex-1 bg-border" />
          </div>
          <Part
            eyebrow="02 — Organize · Compile"
            name="Web app"
            tagline="Turns those notes into something you can use."
            features={appFeatures}
            iconClassName="bg-foreground text-background"
          />
        </div>
      </section>

      <section id="compile" className="border-y border-border bg-secondary">
        <div className="mx-auto flex max-w-[1160px] flex-col gap-10 px-6 py-[clamp(64px,9vw,112px)]">
          <div className="flex max-w-[640px] flex-col gap-3.5">
            <span className="font-mono text-[13px] tracking-[0] text-primary">
              Bundle → Compile → Doc
            </span>
            <h2 className="text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.12] font-bold tracking-[-0.04em] text-balance">
              From a pile of notes to <Em>one document</Em>
            </h2>
            <p className="text-base leading-[1.65] text-pretty text-muted-foreground">
              Put notes in a bundle, set the order, and compile. Try it: reorder
              the notes or change a setting and the document updates.
            </p>
          </div>
          <CompileDemo />
        </div>
      </section>

      <section className="px-4 py-[clamp(48px,7vw,80px)]">
        <div className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-7 rounded-[28px] bg-card bg-dots px-[clamp(24px,5vw,64px)] py-[clamp(40px,7vw,80px)] ring-1 ring-foreground/8">
          <div className="flex max-w-[620px] flex-col gap-3">
            <h2 className="text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.05] font-bold tracking-[-0.04em]">
              Start saving what you <Em>read</Em>
            </h2>
            <p className="text-base leading-[1.6] text-muted-foreground">
              Sign in with Google. The extension uses the same account, so your
              notes show up in both.
            </p>
          </div>
          <Link
            href="/auth"
            className="inline-flex h-[52px] items-center gap-2.5 rounded-xl bg-primary px-[26px] text-base font-semibold whitespace-nowrap text-white"
          >
            Get started <ArrowRightIcon />
          </Link>
        </div>
      </section>

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
        <nav className="flex gap-5">
          <Link href="/legal#privacy" className="hover:underline">
            Privacy policy
          </Link>
          <Link href="/legal#terms" className="hover:underline">
            Terms and conditions
          </Link>
        </nav>
      </footer>
    </div>
  );
}
