"use client";

import { useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DotsSixVerticalIcon,
  DownloadSimpleIcon,
  FileTextIcon,
  SlidersHorizontalIcon,
  StackIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const NOTES = {
  a: {
    label: "Spacing effect",
    content:
      "Spaced study leads to better long-term recall than the same amount of study done in one sitting.",
    title: "Spacing effect - Wikipedia",
    url: "https://en.wikipedia.org/wiki/Spacing_effect",
    tags: ["memory", "learning"],
  },
  b: {
    label: "Retrieval practice",
    content: "Testing yourself helps you remember more than rereading.",
    title: "How to study - Study Guide",
    url: "https://example.edu/study-guide",
    tags: ["learning"],
  },
  c: {
    label: "Review schedule",
    content: "Each review should come a little later than the one before.",
    title: "Spacing effect - Wikipedia",
    url: "https://en.wikipedia.org/wiki/Spacing_effect",
    tags: ["memory"],
  },
};

type NoteKey = keyof typeof NOTES;

const DEFAULTS = {
  title: "on",
  labels: "heading",
  quote: "blockquote",
  sources: "footnoted",
  tags: "off",
  sep: "rule",
};

type Config = typeof DEFAULTS;

const SETTINGS: { key: keyof Config; label: string; options: string[] }[] = [
  { key: "title", label: "Include title", options: ["on", "off"] },
  { key: "labels", label: "Labels", options: ["none", "heading"] },
  { key: "quote", label: "Quote style", options: ["plain", "blockquote"] },
  {
    key: "sources",
    label: "Sources",
    options: ["none", "inline", "footnoted"],
  },
  { key: "tags", label: "Include tags", options: ["on", "off"] },
  { key: "sep", label: "Separator", options: ["none", "blank", "rule"] },
];

type DocLine = { text: string; className: string };

const FG = "text-foreground";
const MUTED = "text-muted-foreground";
const PRIMARY = "text-primary";

function buildDoc(order: NoteKey[], cfg: Config): DocLine[] {
  const lines: DocLine[] = [];
  const add = (text: string, className = FG) => lines.push({ text, className });
  const blank = () => add(" ");
  const footnotes: (typeof NOTES)[NoteKey][] = [];
  const footnoteIndex: Record<string, number> = {};
  const quotePrefix = cfg.quote === "blockquote" ? "> " : "";

  if (cfg.title === "on") {
    add("# Study methods", cn(PRIMARY, "font-medium"));
    blank();
  }
  order.forEach((key, i) => {
    const note = NOTES[key];
    if (i > 0) {
      if (cfg.sep === "rule") {
        add("---", MUTED);
        blank();
      } else if (cfg.sep === "blank") blank();
    }
    if (cfg.labels === "heading") {
      add("## " + note.label, cn(FG, "font-medium"));
      blank();
    }
    let body = note.content;
    if (cfg.sources === "footnoted") {
      if (!footnoteIndex[note.url]) {
        footnotes.push(note);
        footnoteIndex[note.url] = footnotes.length;
      }
      body += `[^${footnoteIndex[note.url]}]`;
    }
    add(quotePrefix + body, cfg.quote === "blockquote" ? MUTED : FG);
    if (cfg.sources === "inline")
      add(`${quotePrefix}— [${note.title}](${note.url})`, MUTED);
    if (cfg.tags === "on") {
      blank();
      add(note.tags.map((t) => "#" + t).join(" "), PRIMARY);
    }
    blank();
  });
  footnotes.forEach((note, i) =>
    add(`[^${i + 1}]: [${note.title}](${note.url})`, MUTED),
  );
  while (lines.length && lines[lines.length - 1].text === " ") lines.pop();
  return lines;
}

const panel = "rounded-[18px] bg-card ring-1 ring-foreground/8";

export function CompileDemo() {
  const [order, setOrder] = useState<NoteKey[]>(["a", "b", "c"]);
  const [cfg, setCfg] = useState<Config>(DEFAULTS);

  function move(i: number, delta: number) {
    setOrder((prev) => {
      const j = i + delta;
      if (j < 0 || j >= prev.length) return prev;
      const next = prev.slice();
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] items-start gap-5">
      <div className="flex min-w-0 flex-col gap-5">
        <div className={cn(panel, "flex flex-col gap-3.5 p-5")}>
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-[15px] font-semibold">
              <StackIcon className="text-primary" />
              Study methods
            </span>
            <span className="text-xs text-muted-foreground">
              Bundle · {order.length} notes
            </span>
          </div>
          <ol className="flex flex-col gap-2">
            {order.map((key, i) => {
              const note = NOTES[key];
              return (
                <li
                  key={key}
                  className="flex items-center gap-2.5 rounded-[10px] border border-border bg-card py-1.5 pr-1.5 pl-2"
                >
                  <span className="flex h-8 w-5 shrink-0 items-center justify-center text-sm text-muted-foreground">
                    <DotsSixVerticalIcon weight="bold" />
                  </span>
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-medium">
                      {note.label}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {note.content}
                    </span>
                  </span>
                  <button
                    type="button"
                    aria-label="Move up"
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                    className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[15px] text-foreground hover:bg-muted disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ArrowUpIcon />
                  </button>
                  <button
                    type="button"
                    aria-label="Move down"
                    disabled={i === order.length - 1}
                    onClick={() => move(i, 1)}
                    className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[15px] text-foreground hover:bg-muted disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ArrowDownIcon />
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div className={cn(panel, "flex flex-col gap-4 p-5")}>
          <span className="flex items-center gap-2 text-[15px] font-semibold">
            <SlidersHorizontalIcon className="text-primary" />
            Compile settings
          </span>
          <div className="flex flex-col gap-3">
            {SETTINGS.map((setting) => (
              <div
                key={setting.key}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2"
              >
                <span className="text-[13.5px] font-medium">
                  {setting.label}
                </span>
                <div className="inline-flex gap-0.5 rounded-[9px] bg-muted p-[3px]">
                  {setting.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={cfg[setting.key] === option}
                      onClick={() =>
                        setCfg((prev) => ({ ...prev, [setting.key]: option }))
                      }
                      className={cn(
                        "cursor-pointer rounded-[7px] px-[11px] py-[5px] text-[12.5px] font-medium whitespace-nowrap",
                        cfg[setting.key] === option
                          ? "bg-card text-foreground shadow-[0_1px_3px_0_oklch(0_0_0/0.1)]"
                          : "text-muted-foreground",
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setCfg(DEFAULTS)}
            className="cursor-pointer self-start text-[13px] font-medium text-primary"
          >
            Reset to defaults
          </button>
        </div>
      </div>

      <div
        className={cn(
          panel,
          "flex min-w-0 flex-col overflow-hidden shadow-[0_24px_48px_-24px_oklch(0_0_0/0.25)]",
        )}
      >
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <FileTextIcon className="text-primary" />
            study-methods.md
          </span>
          <span className="inline-flex h-[30px] items-center gap-1.5 rounded-lg border border-border px-3 text-[12.5px] font-medium">
            <DownloadSimpleIcon />
            Export
          </span>
        </div>
        <div className="min-h-[420px] overflow-x-auto px-5 pt-5 pb-6 font-mono text-[13px] leading-[1.7] tracking-[0]">
          {buildDoc(order, cfg).map((line, i) => (
            <div
              key={i}
              className={cn(
                "min-h-[1.7em] break-words whitespace-pre-wrap",
                line.className,
              )}
            >
              {line.text}
            </div>
          ))}
        </div>
        <div className="border-t border-border bg-[color-mix(in_oklab,var(--primary)_7%,var(--card))] px-5 py-3.5 text-[13px] leading-[1.6] text-pretty text-foreground">
          A doc is a snapshot. Editing it doesn&apos;t change your notes, and
          editing a note doesn&apos;t change the doc. Recompile when you want a
          fresh copy from the bundle.
        </div>
      </div>
    </div>
  );
}
