"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ClockIcon,
  DotsThreeVerticalIcon,
  FolderIcon,
  GlobeIcon,
} from "@phosphor-icons/react";
import { LogOut } from "lucide-react";

const STAGE_WIDTH = 640;
const STAGE_HEIGHT = 500;

const recent = [
  {
    label: "Spacing effect",
    content:
      "Learning is greater when study sessions are spread out over time.",
  },
  {
    label: "Retrieval practice",
    content: "Testing yourself helps you remember more than rereading.",
  },
  {
    label: "Interleaving",
    content: "Mixing related topics in one session improves recall.",
  },
];

export function AuthShowcase() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    // Fit the fixed-size stage into the half-width panel.
    const onResize = () =>
      setScale(
        Math.max(
          0.4,
          Math.min(
            1,
            (window.innerWidth / 2 - 104) / STAGE_WIDTH,
            (window.innerHeight - 170) / STAGE_HEIGHT,
          ),
        ),
      );
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <aside className="relative m-3 hidden min-w-0 flex-[1_1_50%] flex-col items-center justify-center gap-10 overflow-hidden rounded-[22px] px-10 py-12 min-[900px]:flex">
      <Image
        src="/login-background-x.jpg"
        alt=""
        fill
        sizes="50vw"
        priority
        className="object-cover"
      />
      <div
        className="relative shrink-0"
        style={{
          width: Math.round(STAGE_WIDTH * scale),
          height: Math.round(STAGE_HEIGHT * scale),
        }}
      >
        <div
          className="relative h-[500px] w-[640px] origin-top-left"
          style={{ transform: `scale(${scale})` }}
        >
          <div className="bg-card text-foreground absolute top-0 left-0 w-[330px] overflow-hidden rounded-[14px] shadow-[0_25px_50px_-12px_oklch(0_0_0/0.35)]">
            <div className="flex items-center justify-between p-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="bg-primary flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white">
                  A
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="text-sm font-medium">Alex Morgan</span>
                  <span className="text-muted-foreground text-xs">
                    alex@example.com
                  </span>
                </div>
              </div>
              <span className="border-border inline-flex size-10 shrink-0 items-center justify-center rounded-[26px] border">
                <LogOut className="size-4" />
              </span>
            </div>
            <div className="flex flex-col gap-4 px-4 pb-4">
              <div>
                <p className="mb-1 text-sm">Recent notes</p>
                <ul className="flex flex-col gap-1">
                  {recent.map((note) => (
                    <li key={note.label} className="rounded-lg p-2">
                      <p className="text-base font-semibold">{note.label}</p>
                      <p className="text-muted-foreground line-clamp-2 text-[13px] leading-[1.45]">
                        {note.content}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2">
                <span className="border-border inline-flex flex-1 justify-center rounded-[26px] border px-3.5 py-2 text-[13px] font-medium whitespace-nowrap">
                  Open Notebase
                </span>
                <span className="bg-primary inline-flex flex-1 justify-center rounded-[26px] px-3.5 py-2 text-[13px] font-medium whitespace-nowrap text-white">
                  Add note
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card text-foreground ring-foreground/10 absolute right-0 bottom-0 flex w-[290px] flex-col gap-2 rounded-[14px] py-3 text-sm shadow-[0_25px_50px_-12px_oklch(0_0_0/0.35)] ring-1">
            <div className="border-border flex items-center justify-between gap-2 border-b px-4 pb-2">
              <span className="flex items-center gap-1 text-xs font-medium text-[oklch(0.55_0.17_150)]">
                <FolderIcon weight="fill" />
                Study notes
              </span>
              <span className="inline-flex size-8 items-center justify-center">
                <DotsThreeVerticalIcon weight="bold" className="size-5" />
              </span>
            </div>
            <div className="flex flex-col gap-3 px-4">
              <div>
                <div className="mt-1 text-xl font-semibold">Spacing effect</div>
                <div className="mt-2 leading-normal">
                  Learning is greater when study sessions are spread out over
                  time. Spaced study leads to better long-term recall than the
                  same amount of study done in one sitting, and each review
                  should come a little later than the one before.
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["#memory", "#learning"].map((tag) => (
                  <span
                    key={tag}
                    className="bg-secondary inline-flex h-5 items-center rounded-lg px-2 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-border h-px" />
            <div className="text-muted-foreground flex justify-between gap-2 px-4 text-xs">
              <span className="flex min-w-0 items-center gap-1">
                <GlobeIcon className="shrink-0" />
                <span className="truncate">Spacing effect - Wikipedia</span>
              </span>
              <span className="flex shrink-0 items-center gap-1">
                <ClockIcon />
                2m ago
              </span>
            </div>
          </div>
        </div>
      </div>
      <p className="bg-card text-foreground relative rounded-full border px-6 py-2.5 text-center text-[clamp(11px,1.25vw,18px)] leading-[1.4] font-medium tracking-[-0.03em] whitespace-nowrap shadow-[0_12px_24px_-8px_oklch(0_0_0/0.25)]">
        Your{" "}
        <em className="text-primary font-serif font-medium tracking-[-0.025em] italic">
          highlights
        </em>
        , all in{" "}
        <em className="text-primary font-serif font-medium tracking-[-0.025em] italic">
          one place
        </em>
        .
      </p>
    </aside>
  );
}
