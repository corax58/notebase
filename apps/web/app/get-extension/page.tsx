import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  ArrowsClockwiseIcon,
  DownloadSimpleIcon,
  FolderIcon,
  WarningIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { Em } from "@/app/_components/em";
import { LandingFooter } from "@/app/_components/landing-footer";
import { LandingNav } from "@/app/_components/landing-nav";
import { CopyUrl } from "./_components/copy-url";
import {
  AddressBarVisual,
  DeveloperModeVisual,
  DownloadVisual,
  LoadUnpackedVisual,
  PinVisual,
} from "./_components/step-visuals";

export const metadata: Metadata = {
  title: "Get the extension · Notebase",
  description:
    "Install the Notebase browser extension in Chrome, Edge, Brave, or Arc with Load unpacked.",
};

// Served from public/. Build it with `pnpm ext:zip` and copy the result there.
const EXTENSION_ZIP = "/extension/notebase-chrome.zip";
const EXTENSIONS_URL = "chrome://extensions";

const notes: { icon: Icon; title: string; body: string }[] = [
  {
    icon: FolderIcon,
    title: "Keep the folder",
    body: "The browser loads the extension from that folder every time it starts. Move or delete it and the extension stops working.",
  },
  {
    icon: ArrowsClockwiseIcon,
    title: "Updating",
    body: "Download the new zip, replace the folder’s contents, then click the reload icon on the Notebase card.",
  },
  {
    icon: WarningIcon,
    title: "“Manifest file is missing”",
    body: "You picked a folder one level too high. Choose the one with manifest.json directly inside.",
  },
];

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-muted text-foreground rounded-md px-1.5 py-0.5 font-mono text-[0.85em] tracking-[0]">
      {children}
    </code>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="text-foreground font-semibold">{children}</strong>;
}

function Step({
  number,
  title,
  visual,
  children,
}: {
  number: number;
  title: string;
  visual: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="border-border grid items-center gap-x-[clamp(32px,5vw,72px)] gap-y-6 border-t py-[clamp(32px,5vw,56px)] min-[900px]:grid-cols-[minmax(0,1fr)_minmax(0,460px)]">
      <div className="flex flex-col gap-3.5">
        <span className="text-primary font-mono text-[13px] tracking-[0]">
          Step 0{number}
        </span>
        <h2 className="text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.15] font-bold tracking-[-0.035em] text-balance">
          {title}
        </h2>
        <div className="text-muted-foreground flex flex-col items-start gap-4 text-base leading-[1.65] text-pretty">
          {children}
        </div>
      </div>
      <div
        aria-hidden
        className="bg-secondary ring-foreground/8 flex min-h-[220px] items-center justify-center rounded-2xl p-[clamp(16px,4vw,32px)] ring-1"
      >
        {visual}
      </div>
    </li>
  );
}

export default function GetExtensionPage() {
  return (
    <div
      id="top"
      className="bg-background text-foreground selection:bg-primary min-h-screen overflow-x-hidden selection:text-white"
    >
      <section className="bg-background bg-dots px-4 pt-4">
        <LandingNav />

        <div className="mx-auto flex max-w-[1160px] flex-col items-center gap-[26px] px-2 pt-[clamp(56px,9vw,104px)] pb-[clamp(56px,8vw,96px)] text-center">
          <span className="text-primary font-mono text-[13px] tracking-[0]">
            Chrome
          </span>
          <h1 className="max-w-[900px] text-[clamp(2.6rem,7.4vw,5.2rem)] leading-[1.1] font-bold tracking-[-0.045em] text-balance">
            Install the{" "}
            <span className="bg-primary rounded-md px-[0.1em] text-white">
              extension
            </span>{" "}
            in <Em>five steps</Em>.
          </h1>
          <p className="text-muted-foreground max-w-[600px] text-[clamp(1.05rem,1.7vw,1.25rem)] leading-[1.6] text-pretty">
            Notebase isn’t on the Chrome Web Store, so you load it into your
            browser yourself. It takes about a minute.
          </p>
          <a
            href={EXTENSION_ZIP}
            download
            className="pressable depth-primary border border-edge-primary bg-primary inline-flex h-[50px] items-center gap-2.5 rounded-xl px-6 text-base font-semibold whitespace-nowrap text-white"
          >
            <DownloadSimpleIcon weight="bold" className="size-[18px]" />
            Download the extension
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-[1160px] px-6 pb-[clamp(48px,7vw,80px)]">
        <ol className="border-border flex flex-col border-b">
          <Step
            number={1}
            title="Download and unzip"
            visual={<DownloadVisual />}
          >
            <p>
              Download the zip and extract it. You get a folder with{" "}
              <Mono>manifest.json</Mono> inside. Put it somewhere it can stay.
            </p>
            <a
              href={EXTENSION_ZIP}
              download
              className="border-border bg-card text-foreground hover:bg-muted inline-flex h-11 items-center gap-2.5 rounded-xl border px-4 text-[15px] font-medium whitespace-nowrap"
            >
              <DownloadSimpleIcon className="text-primary size-[18px]" />
              notebase-extension.zip
            </a>
          </Step>

          <Step
            number={2}
            title="Open the extensions page"
            visual={<AddressBarVisual url={EXTENSIONS_URL} />}
          >
            <p>
              Paste this address into a new tab. Browsers don’t let a web page
              link to it. Edge, Brave, and Arc accept the same address.
            </p>
            <CopyUrl value={EXTENSIONS_URL} />
          </Step>

          <Step
            number={3}
            title="Turn on Developer mode"
            visual={<DeveloperModeVisual />}
          >
            <p>
              Flip the <Strong>Developer mode</Strong> switch in the top-right
              corner. A row of buttons appears below it. In Edge, the switch is
              in the left sidebar.
            </p>
          </Step>

          <Step
            number={4}
            title="Load the folder"
            visual={<LoadUnpackedVisual />}
          >
            <p>
              Click <Strong>Load unpacked</Strong> and choose the folder you
              unzipped, the one with <Mono>manifest.json</Mono> directly inside.
              Notebase appears in your list of extensions.
            </p>
          </Step>

          <Step number={5} title="Pin it and sign in" visual={<PinVisual />}>
            <p>
              Click the puzzle icon in your toolbar and pin Notebase. Open it
              and continue with Google. It’s the same account as the web app, so
              your notes show up in both.
            </p>
          </Step>
        </ol>
      </section>

      <section className="border-border bg-secondary border-y">
        <div className="mx-auto flex max-w-[1160px] flex-col gap-8 px-6 py-[clamp(48px,7vw,80px)]">
          <div className="flex flex-col gap-3.5">
            <span className="text-primary font-mono text-[13px] tracking-[0]">
              Good to know
            </span>
            <h2 className="text-[clamp(1.75rem,3.4vw,2.4rem)] leading-[1.12] font-bold tracking-[-0.04em] text-balance">
              Three things about <Em>unpacked</Em> extensions
            </h2>
          </div>
          <ul className="grid gap-4 min-[820px]:grid-cols-3">
            {notes.map((note) => (
              <li
                key={note.title}
                className="bg-card ring-foreground/8 flex flex-col gap-3 rounded-2xl p-6 ring-1"
              >
                <span className="bg-foreground text-background flex size-11 items-center justify-center rounded-xl">
                  <note.icon weight="fill" className="size-[22px]" />
                </span>
                <span className="text-base font-semibold">{note.title}</span>
                <span className="text-muted-foreground text-[14.5px] leading-[1.6] text-pretty">
                  {note.body}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-4 py-[clamp(48px,7vw,80px)]">
        <div className="bg-card bg-dots ring-foreground/8 mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-7 rounded-[28px] px-[clamp(24px,5vw,64px)] py-[clamp(40px,7vw,80px)] ring-1">
          <div className="flex max-w-[620px] flex-col gap-3">
            <h2 className="text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.05] font-bold tracking-[-0.04em]">
              Installed? Save your first <Em>note</Em>
            </h2>
            <p className="text-muted-foreground text-base leading-[1.6]">
              Highlight text on any page, right-click, and choose Save to
              Notebase. It lands in the web app with its source.
            </p>
          </div>
          <Link
            href="/auth"
            className="pressable depth-primary border border-edge-primary bg-primary inline-flex h-[52px] items-center gap-2.5 rounded-xl px-[26px] text-base font-semibold whitespace-nowrap text-white"
          >
            Open the web app <ArrowRightIcon />
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
