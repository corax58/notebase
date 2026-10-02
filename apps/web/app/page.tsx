import Link from "next/link";
import { ArrowUpRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const notes = [
  { label: "Ideas", color: "bg-[#d8b3a8]" },
  { label: "Work", color: "bg-[#b9b4d3]" },
  { label: "Personal", color: "bg-[#d9c8a3]" },
];

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-57px)] overflow-hidden bg-[#f7f5f2] text-[#27232d]">
      <section className="relative mx-auto flex min-h-[calc(100vh-57px)] max-w-7xl flex-col justify-between px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
        <div className="pointer-events-none absolute -right-32 -top-40 size-[32rem] rounded-full bg-[#e6d4cf]/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-36 size-[28rem] rounded-full bg-[#d8d5e5]/60 blur-3xl" />

        <div className="relative grid items-center gap-16 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
          <div className="max-w-2xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#d7c7c1] bg-white/65 px-3.5 py-2 text-xs font-medium tracking-[0.12em] text-[#765b62] uppercase shadow-sm">
              <Sparkles className="size-3.5" aria-hidden="true" />
              A softer way to think
            </div>
            <h1 className="max-w-xl text-5xl leading-[0.98] font-medium tracking-[-0.055em] text-[#29232b] sm:text-7xl lg:text-[5.5rem]">
              Make space for your <span className="text-[#9c6873]">thoughts.</span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-[#766d73] sm:text-lg">
              Notebase is a quiet home for notes, ideas, and everything you do not want to lose. Capture quickly. Find easily. Think clearly.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button nativeButton={false} render={<Link href="/auth" />} className="h-12 rounded-full bg-[#9d6974] px-6 text-sm text-white shadow-[0_8px_20px_rgba(142,91,103,0.22)] hover:bg-[#895762]">
                Start writing free
                <ArrowUpRight data-icon="inline-end" />
              </Button>
              <Link href="#how-it-works" className="flex h-12 items-center justify-center rounded-full px-5 text-sm font-medium text-[#655b61] transition-colors hover:bg-white/70">
                See how it works
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#857b80]">
              <span className="flex items-center gap-2"><Check className="size-3.5 text-[#9d6974]" /> No clutter</span>
              <span className="flex items-center gap-2"><Check className="size-3.5 text-[#9d6974]" /> Always yours</span>
              <span className="flex items-center gap-2"><Check className="size-3.5 text-[#9d6974]" /> Free to start</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[31rem] lg:mx-0 lg:justify-self-end">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-white/45 shadow-2xl shadow-[#b28b8f]/10 blur-sm" />
            <div className="relative rotate-[2deg] rounded-[1.75rem] border border-white bg-[#ebe9f2] p-3 shadow-[0_28px_80px_rgba(73,56,65,0.18)]">
              <div className="rounded-[1.25rem] bg-[#fbfafc] p-5 sm:p-7">
                <div className="flex items-center justify-between border-b border-[#ece8ec] pb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="grid size-8 place-items-center rounded-lg bg-[#9d6974] text-xs font-bold text-white">N</div>
                    <span className="text-sm font-semibold tracking-tight">notebase</span>
                  </div>
                  <span className="text-xs text-[#9a9094]">Tuesday, 9:41 AM</span>
                </div>
                <div className="grid gap-7 py-7 sm:grid-cols-[0.68fr_1fr]">
                  <div>
                    <p className="text-xs font-medium tracking-[0.15em] text-[#9d6974] uppercase">Your notes</p>
                    <h2 className="mt-3 text-3xl font-medium tracking-[-0.05em] text-[#342d35]">A little<br />more clarity.</h2>
                    <p className="mt-4 text-xs leading-5 text-[#978e93]">Keep the useful things close, and let the rest wait.</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    {notes.map((note) => (
                      <div key={note.label} className="rounded-xl border border-[#eeeaee] bg-white px-4 py-3 shadow-sm">
                        <div className="flex items-center gap-2.5">
                          <span className={`size-2 rounded-full ${note.color}`} />
                          <span className="text-xs font-medium text-[#665d63]">{note.label}</span>
                        </div>
                        <div className="mt-3 h-1.5 w-4/5 rounded-full bg-[#eeeaf0]" />
                        <div className="mt-2 h-1.5 w-1/2 rounded-full bg-[#f2eff3]" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl bg-[#f2edf0] px-4 py-3 text-xs text-[#94767e]">+ Capture a new thought...</div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-5 rounded-2xl border border-white/80 bg-white/85 px-4 py-3 shadow-lg backdrop-blur sm:-left-10">
              <p className="text-[10px] tracking-[0.16em] text-[#9d6974] uppercase">Small steps</p>
              <p className="mt-1 text-sm font-medium text-[#51454c]">Add one good idea today.</p>
            </div>
          </div>
        </div>

        <div id="how-it-works" className="relative mt-20 flex flex-col gap-5 border-t border-[#e4deda] pt-6 text-sm text-[#84797d] sm:flex-row sm:items-center sm:justify-between">
          <p>Made for the notes that matter.</p>
          <div className="flex items-center gap-6 text-xs">
            <span>Capture</span><span className="text-[#c0adb0]">—</span><span>Organize</span><span className="text-[#c0adb0]">—</span><span>Return to it</span>
          </div>
        </div>
      </section>
    </main>
  );
}
