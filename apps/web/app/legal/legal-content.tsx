"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

type Section = { title: string; paragraphs: React.ReactNode[] };
type LegalDoc = { title: string; intro: string; sections: Section[] };

const LAST_UPDATED = "October 4, 2026";

const contactEmail = (
  <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm tracking-[0]">
    [contact email]
  </span>
);

const docs: Record<"privacy" | "terms", LegalDoc> = {
  privacy: {
    title: "Privacy policy",
    intro:
      "This policy explains what information Notebase collects when you use the web app and the browser extension, how it is used, and the choices you have.",
    sections: [
      {
        title: "1. Information we collect",
        paragraphs: [
          "When you sign in with Google, we receive your name, email address, and profile picture. We use these to create and identify your account.",
          "When you save a note, we store the text you saved and the label you gave it, along with the source page's address, title, and icon. We also store the folders, tags, bundles, and documents you create.",
        ],
      },
      {
        title: "2. The browser extension",
        paragraphs: [
          "The extension runs on the pages you visit so that you can select text and save it. It sends information to Notebase only when you save a note, and only the details listed above. It does not record your browsing history.",
        ],
      },
      {
        title: "3. How we use your information",
        paragraphs: [
          "We use your information to run Notebase: to sign you in, store your notes, show them to you in the extension and the web app, and produce the documents you compile. We do not sell your information or use your notes for advertising.",
        ],
      },
      {
        title: "4. Cookies and sign-in",
        paragraphs: [
          "We use a cookie to keep you signed in. The extension shares this sign-in with the web app. We do not use advertising or tracking cookies.",
        ],
      },
      {
        title: "5. Sharing",
        paragraphs: [
          "Your notes are private to your account. We share information only with services that help us run Notebase, such as Google for sign-in and our hosting provider for storage, or when required by law.",
        ],
      },
      {
        title: "6. Keeping and deleting your data",
        paragraphs: [
          "We keep your data for as long as your account exists. You can delete individual notes, folders, bundles, and documents at any time. Deleting a note also removes it from any bundle that held it. To delete your account and all of its data, contact us using the details below.",
        ],
      },
      {
        title: "7. Changes to this policy",
        paragraphs: [
          "If we make significant changes, we will update the date at the top of this page and let you know in the app.",
        ],
      },
      {
        title: "8. Contact",
        paragraphs: [
          <>Questions about this policy can be sent to {contactEmail}.</>,
        ],
      },
    ],
  },
  terms: {
    title: "Terms and conditions",
    intro:
      "These terms apply to your use of the Notebase web app and browser extension. By signing in, you agree to them.",
    sections: [
      {
        title: "1. Your account",
        paragraphs: [
          "You sign in to Notebase with a Google account. You are responsible for activity on your account and for keeping access to your Google account secure.",
        ],
      },
      {
        title: "2. Your content",
        paragraphs: [
          "The notes, bundles, and documents you create belong to you. You give us permission to store and process them only so that we can provide Notebase to you.",
          "Text you save from websites may be owned by others. You are responsible for how you use it, including in documents you export and share.",
        ],
      },
      {
        title: "3. Acceptable use",
        paragraphs: [
          "Do not use Notebase to break the law, to interfere with the service or other users, or to try to access data that is not yours.",
        ],
      },
      {
        title: "4. The service",
        paragraphs: [
          "Notebase is in an early stage. Features may change, be added, or be removed. We aim to keep the service available and your data safe, but we cannot promise it will always be free of errors or interruptions.",
          "Compiled documents are snapshots. Recompiling a bundle replaces its current document, including any edits, after you confirm. You can export documents as markdown files to keep your own copies.",
        ],
      },
      {
        title: "5. Ending your use",
        paragraphs: [
          "You can stop using Notebase at any time and ask us to delete your account. We may suspend or close accounts that break these terms.",
        ],
      },
      {
        title: "6. Liability",
        paragraphs: [
          "Notebase is provided as is. To the extent allowed by law, we are not liable for indirect losses or for loss of data arising from your use of the service.",
        ],
      },
      {
        title: "7. Changes to these terms",
        paragraphs: [
          "If we change these terms, we will update the date at the top of this page. Continuing to use Notebase after a change means you accept the updated terms.",
        ],
      },
      {
        title: "8. Contact",
        paragraphs: [
          <>Questions about these terms can be sent to {contactEmail}.</>,
        ],
      },
    ],
  },
};

const tabs = [
  { key: "privacy", label: "Privacy policy" },
  { key: "terms", label: "Terms and conditions" },
] as const;

function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

export function LegalContent() {
  const hash = useSyncExternalStore(
    subscribeToHash,
    () => window.location.hash,
    () => "",
  );
  const active = hash === "#terms" ? "terms" : "privacy";
  const doc = docs[active];

  return (
    <>
      <main className="mx-auto flex w-full max-w-[760px] flex-1 flex-col gap-9 px-6 pt-[clamp(40px,7vw,80px)] pb-[clamp(64px,8vw,96px)]">
        <div className="inline-flex max-w-full flex-wrap gap-1 self-start rounded-xl bg-muted p-1">
          {tabs.map((tab) => (
            <a
              key={tab.key}
              href={`#${tab.key}`}
              onClick={() => window.scrollTo(0, 0)}
              className={cn(
                "rounded-[9px] px-3.5 py-[7px] text-sm font-medium whitespace-nowrap",
                tab.key === active
                  ? "bg-card text-foreground shadow-[0_1px_3px_0_oklch(0_0_0/0.08)]"
                  : "text-muted-foreground",
              )}
            >
              {tab.label}
            </a>
          ))}
        </div>

        <article className="flex flex-col gap-8">
          <div className="flex flex-col gap-3 border-b border-border pb-7">
            <h1 className="text-[clamp(2rem,5vw,2.75rem)] leading-[1.1] font-semibold tracking-[-0.035em]">
              {doc.title}
            </h1>
            <p className="font-mono text-[13px] tracking-[0] text-muted-foreground">
              Last updated {LAST_UPDATED}
            </p>
            <p className="text-base leading-[1.7] text-muted-foreground">
              {doc.intro}
            </p>
          </div>
          {doc.sections.map((section) => (
            <section key={section.title} className="flex flex-col gap-2.5">
              <h2 className="text-[19px] font-semibold tracking-[-0.02em]">
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph, i) => (
                <p key={i} className="text-[15.5px] leading-[1.75]">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </article>
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-5 text-[13px] text-muted-foreground">
        <span>© 2026 Notebase</span>
        <nav className="flex gap-5">
          {tabs.map((tab) => (
            <a
              key={tab.key}
              href={`#${tab.key}`}
              onClick={() => window.scrollTo(0, 0)}
              className="hover:underline"
            >
              {tab.label}
            </a>
          ))}
        </nav>
      </footer>
    </>
  );
}
