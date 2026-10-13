import Image from "next/image";
import {
  ArrowRightIcon,
  CursorIcon,
  FileIcon,
  FileZipIcon,
  FolderIcon,
  FolderOpenIcon,
  LockSimpleIcon,
  PushPinIcon,
  PuzzlePieceIcon,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

function MockWindow({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[380px] overflow-hidden rounded-xl bg-card text-foreground shadow-[0_18px_36px_-16px_oklch(0_0_0/0.35),0_0_0_1px_oklch(0_0_0/0.06)]">
      {children}
    </div>
  );
}

function BrowserBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 border-b border-border bg-secondary px-3 py-2.5">
      <div className="flex gap-1.5">
        <span className="size-[11px] rounded-full bg-input" />
        <span className="size-[11px] rounded-full bg-input" />
        <span className="size-[11px] rounded-full bg-input" />
      </div>
      {children}
    </div>
  );
}

function ExtensionsHeader({ highlighted }: { highlighted?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
      <span className="flex items-center gap-2 text-sm font-semibold">
        <PuzzlePieceIcon
          weight="fill"
          className="size-4 text-muted-foreground"
        />
        Extensions
      </span>
      <span
        className={cn(
          "flex items-center gap-2.5 rounded-full py-1 pr-1 pl-3 text-[12.5px] font-medium whitespace-nowrap",
          highlighted && "ring-2 ring-primary",
        )}
      >
        Developer mode
        <span className="flex h-5 w-9 items-center justify-end rounded-full bg-primary p-0.5">
          <span className="size-4 rounded-full bg-white" />
        </span>
      </span>
    </div>
  );
}

export function DownloadVisual() {
  const files = [
    { icon: FileIcon, name: "manifest.json", highlighted: true },
    { icon: FileIcon, name: "popup.html" },
    { icon: FileIcon, name: "background.js" },
    { icon: FolderIcon, name: "icon" },
  ];

  return (
    <div className="flex w-full max-w-[380px] items-center gap-3">
      <div className="flex flex-none flex-col items-center gap-1.5 rounded-xl bg-card px-4 py-3.5 shadow-[0_18px_36px_-16px_oklch(0_0_0/0.35),0_0_0_1px_oklch(0_0_0/0.06)]">
        <FileZipIcon weight="fill" className="size-9 text-primary" />
        <span className="font-mono text-[11px] tracking-[0] text-muted-foreground">
          .zip
        </span>
      </div>
      <ArrowRightIcon className="size-4 flex-none text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <MockWindow>
          <div className="flex items-center gap-2 border-b border-border px-3 py-2 text-[13px] font-medium">
            <FolderOpenIcon
              weight="fill"
              className="size-4 shrink-0 text-primary"
            />
            <span className="truncate">notebase-extension</span>
          </div>
          <ul className="flex flex-col p-1.5 font-mono text-xs tracking-[0] text-muted-foreground">
            {files.map((file) => (
              <li
                key={file.name}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1",
                  file.highlighted && "bg-primary/10 text-foreground",
                )}
              >
                <file.icon className="size-3.5 shrink-0" />
                {file.name}
              </li>
            ))}
          </ul>
        </MockWindow>
      </div>
    </div>
  );
}

export function AddressBarVisual({ url }: { url: string }) {
  return (
    <MockWindow>
      <BrowserBar>
        <div className="flex h-[30px] min-w-0 flex-1 items-center rounded-lg bg-card px-3 font-mono text-[12.5px] tracking-[0] ring-2 ring-primary">
          <span className="truncate">{url}</span>
          <span className="ml-px h-4 w-px shrink-0 animate-pulse bg-foreground" />
        </div>
      </BrowserBar>
      <div className="flex flex-col gap-2.5 p-4">
        <span className="h-2.5 w-[40%] rounded-[5px] bg-muted" />
        <span className="h-2.5 w-full rounded-[5px] bg-muted" />
        <span className="h-2.5 w-[70%] rounded-[5px] bg-muted" />
      </div>
    </MockWindow>
  );
}

export function DeveloperModeVisual() {
  return (
    <MockWindow>
      <ExtensionsHeader highlighted />
      <div className="grid grid-cols-2 gap-2.5 p-4">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-lg border border-border p-3"
          >
            <span className="size-6 rounded-md bg-muted" />
            <span className="h-2 w-[70%] rounded-[4px] bg-muted" />
            <span className="h-2 w-full rounded-[4px] bg-muted" />
          </div>
        ))}
      </div>
    </MockWindow>
  );
}

export function LoadUnpackedVisual() {
  return (
    <MockWindow>
      <ExtensionsHeader />
      <div className="flex flex-wrap gap-2 border-b border-border bg-secondary px-4 py-2.5 text-[12.5px] font-medium whitespace-nowrap">
        <span className="relative rounded-full bg-primary px-3 py-1.5 text-white">
          Load unpacked
          <CursorIcon
            weight="fill"
            className="absolute -right-1 -bottom-2.5 size-4 text-foreground"
          />
        </span>
        <span className="rounded-full border border-border px-3 py-1.5 text-muted-foreground">
          Pack extension
        </span>
        <span className="rounded-full border border-border px-3 py-1.5 text-muted-foreground">
          Update
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <span className="flex min-w-0 items-center gap-2 rounded-lg bg-primary/10 px-2.5 py-1.5 text-[13px] font-medium">
          <FolderIcon weight="fill" className="size-4 shrink-0 text-primary" />
          <span className="truncate">notebase-extension</span>
        </span>
        <span className="flex-none rounded-lg border border-border px-3 py-1.5 text-[12.5px] font-medium">
          Select folder
        </span>
      </div>
    </MockWindow>
  );
}

export function PinVisual() {
  return (
    <MockWindow>
      <BrowserBar>
        <div className="flex h-[30px] min-w-0 flex-1 items-center gap-2 rounded-lg bg-card px-3 text-[12.5px] text-muted-foreground">
          <LockSimpleIcon className="shrink-0" />
          <span className="truncate">en.wikipedia.org</span>
        </div>
        <span className="flex size-[30px] shrink-0 items-center justify-center rounded-lg bg-primary/18">
          <PuzzlePieceIcon className="size-[18px]" />
        </span>
      </BrowserBar>
      <div className="flex justify-end p-3">
        <div className="flex w-[230px] max-w-full flex-col rounded-lg border border-border bg-card p-1 text-[13px] shadow-[0_12px_24px_-8px_oklch(0_0_0/0.25)]">
          <span className="px-2.5 pt-1.5 pb-1 text-xs text-muted-foreground">
            Extensions
          </span>
          <span className="flex items-center gap-2 rounded-[5px] bg-primary/10 px-2.5 py-1.5 font-medium">
            <Image
              src="/favicon.svg"
              alt=""
              width={16}
              height={16}
              className="size-4"
            />
            Notebase
            <PushPinIcon
              weight="fill"
              className="ml-auto size-4 text-primary"
            />
          </span>
        </div>
      </div>
    </MockWindow>
  );
}
