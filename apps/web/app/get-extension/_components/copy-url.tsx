"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";

export function CopyUrl({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access denied: the address is still selectable by hand
    }
  }

  return (
    <div className="flex h-11 w-full max-w-[340px] items-center gap-2 sunken rounded-xl border border-edge bg-card pr-1.5 pl-3.5">
      <code className="min-w-0 flex-1 truncate font-mono text-sm tracking-[0] text-foreground select-all">
        {value}
      </code>
      <button
        type="button"
        onClick={handleCopy}
        className="pressable inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-edge bg-card px-2.5 text-[13px] font-semibold text-foreground [--depth:2px] hover:bg-muted"
      >
        {copied ? <CheckIcon className="text-success" /> : <CopyIcon />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
