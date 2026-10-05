"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { LockSimpleIcon } from "@phosphor-icons/react";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  "Select text",
  "Right-click → Save to Notebase",
  "Saved with its source",
];

const QUOTE =
  "Spaced study leads to better long-term recall than the same amount of study done in one sitting.";

export function CaptureDemo() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => (t + 1) % 10), 900);
    return () => clearInterval(timer);
  }, []);

  const highlighted = tick >= 2;
  const menuOpen = tick >= 3 && tick <= 4;
  const popupOpen = tick >= 5;
  const justSaved = tick >= 5 && tick <= 7;
  const stage = popupOpen ? 2 : highlighted ? 1 : 0;

  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-[0_30px_60px_-20px_oklch(0_0_0/0.45),0_0_0_1px_oklch(0_0_0/0.06)]">
      <div className="flex items-center gap-3 border-b border-border bg-secondary px-3.5 py-3">
        <div className="flex gap-1.5">
          <span className="size-[11px] rounded-full bg-input" />
          <span className="size-[11px] rounded-full bg-input" />
          <span className="size-[11px] rounded-full bg-input" />
        </div>
        <div className="flex h-[30px] min-w-0 flex-1 items-center gap-2 rounded-lg bg-card px-3 text-[12.5px] text-muted-foreground">
          <LockSimpleIcon className="shrink-0" />
          <span className="truncate">en.wikipedia.org/wiki/Spacing_effect</span>
        </div>
        <span
          className={cn(
            "flex size-[30px] shrink-0 items-center justify-center rounded-lg transition-colors duration-300",
            popupOpen && "bg-primary/18",
          )}
        >
          <Image
            src="/favicon.svg"
            alt=""
            width={18}
            height={18}
            className="size-[18px]"
          />
        </span>
      </div>

      <div className="relative min-h-[520px] px-[clamp(20px,6vw,72px)] pt-[clamp(24px,5vw,56px)] pb-[150px]">
        <div className="flex max-w-[min(560px,max(280px,calc(100%_-_350px)))] flex-col gap-4 text-left">
          <div className="font-serif text-[clamp(1.6rem,3vw,2.1rem)] font-medium tracking-[-0.01em] text-foreground">
            Spacing effect
          </div>
          <div className="h-px bg-border" />
          <p className="font-serif text-base leading-[1.75] text-foreground">
            The spacing effect describes how people remember information better
            when they study it in several sessions spread out over time.
          </p>
          <p className="font-serif text-base leading-[1.75] text-foreground">
            It has been observed in many kinds of learning.{" "}
            <span
              className={cn(
                "relative rounded-[3px] transition-colors duration-[350ms]",
                highlighted && "bg-primary/30",
              )}
            >
              {QUOTE}
              <span
                className={cn(
                  "pointer-events-none absolute top-[calc(100%_+_6px)] left-0 z-3 flex w-[190px] flex-col rounded-lg border border-border bg-card p-1 font-sans text-[13px] shadow-[0_12px_24px_-8px_oklch(0_0_0/0.25)] transition-[opacity,transform] duration-[250ms]",
                  menuOpen
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-1.5 opacity-0",
                )}
              >
                <span className="px-2.5 py-1.5 text-muted-foreground">
                  Copy
                </span>
                <span className="px-2.5 py-1.5 text-muted-foreground">
                  Search the web
                </span>
                <span className="flex items-center gap-2 rounded-[5px] bg-primary px-2.5 py-1.5 font-medium text-white">
                  <Image
                    src="/favicon.svg"
                    alt=""
                    width={14}
                    height={14}
                    className="size-3.5 rounded-[3px] bg-white"
                  />
                  Save to Notebase
                </span>
              </span>
            </span>
          </p>
          <div className="flex flex-col gap-2.5 pt-1.5">
            <span className="h-2.5 w-full rounded-[5px] bg-muted" />
            <span className="h-2.5 w-[92%] rounded-[5px] bg-muted" />
            <span className="h-2.5 w-[70%] rounded-[5px] bg-muted" />
          </div>
        </div>

        <div
          className={cn(
            "absolute top-3 right-[clamp(12px,3vw,24px)] z-4 w-[min(320px,calc(100%_-_24px))] overflow-hidden rounded-[14px] border border-border bg-card text-left shadow-[0_25px_50px_-12px_oklch(0_0_0/0.35)] transition-[opacity,transform] duration-[350ms]",
            popupOpen
              ? "translate-y-0 scale-100 opacity-100"
              : "-translate-y-2.5 scale-[0.98] opacity-0",
          )}
        >
          <div className="flex items-center justify-between p-[18px]">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-white">
                A
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-sm font-medium">Alex Morgan</span>
                <span className="text-xs text-muted-foreground">
                  alex@example.com
                </span>
              </div>
            </div>
            <span className="inline-flex size-[38px] shrink-0 items-center justify-center rounded-[26px] border border-border">
              <LogOut className="size-[15px]" />
            </span>
          </div>
          <div className="flex flex-col gap-3 px-3.5 pb-3.5">
            <div>
              <p className="mb-1 text-sm">Recent notes</p>
              <div
                className={cn(
                  "rounded-lg p-2 transition-colors duration-500",
                  justSaved && "bg-primary/10",
                )}
              >
                <p className="flex items-center justify-between gap-2 text-[15px] font-semibold">
                  Spacing effect
                  <span
                    className={cn(
                      "text-[11px] font-medium text-primary transition-opacity duration-300",
                      justSaved ? "opacity-100" : "opacity-0",
                    )}
                  >
                    Saved
                  </span>
                </p>
                <p className="text-[12.5px] leading-[1.45] text-muted-foreground">
                  {QUOTE}
                </p>
              </div>
              <div className="rounded-lg p-2">
                <p className="text-[15px] font-semibold">Retrieval practice</p>
                <p className="text-[12.5px] leading-[1.45] text-muted-foreground">
                  Testing yourself helps you remember more than rereading.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex flex-1 justify-center rounded-[26px] border border-border px-3 py-2 text-[13px] font-medium whitespace-nowrap">
                Open Notebase
              </span>
              <span className="inline-flex flex-1 justify-center rounded-[26px] bg-primary px-3 py-2 text-[13px] font-medium whitespace-nowrap text-white">
                Add note
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-7 left-[clamp(20px,6vw,72px)] flex flex-wrap gap-2">
          {steps.map((label, i) => (
            <span
              key={label}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-[7px] text-[12.5px] font-medium transition-colors duration-300",
                i === stage
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <span className="font-mono tracking-[0]">0{i + 1}</span>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
