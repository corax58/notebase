import { db } from "@/db";
import { bundles } from "@/db/schema";
import { parseParams } from "@/lib/api/params";
import { notFound, unauthorized, validationError } from "@/lib/api/response";
import { requireUserId } from "@/lib/api/session";
import { getBundleWithNotes } from "@/lib/queries/bundles";
import { NoteWithRelations } from "@/lib/queries/notes";
import { CompileSettings, compileSettingsSchema } from "@/lib/validation/notes";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

function renderContent(
  content: string,
  quoteStyle: CompileSettings["quoteStyle"],
) {
  if (quoteStyle !== "blockquote") return content;
  return content
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
}

function renderSeparator(separator: CompileSettings["separator"]) {
  if (separator === "rule") return "\n\n---\n\n";
  if (separator === "blank") return "\n\n";
  return "\n";
}

const compileBundle = ({
  bundleTitle,
  compileSettings,
  notes,
}: {
  bundleTitle: string;
  compileSettings: CompileSettings;
  notes: NoteWithRelations[];
}) => {
  const sections: string[] = [];

  if (compileSettings.includeTitle) {
    sections.push(`# ${bundleTitle}`);
  }

  // url -> footnote number, assigned in first-seen order, 1-indexed
  const sourceOrder = new Map<string, number>();
  if (compileSettings.sources === "footnoted") {
    for (const note of notes) {
      const key = note.sourceUrl ?? note.sourceTitle;
      if (key && !sourceOrder.has(key)) {
        sourceOrder.set(key, sourceOrder.size + 1);
      }
    }
  }

  for (const note of notes) {
    const parts: string[] = [];

    if (compileSettings.labels === "heading" && note.label) {
      parts.push(`## ${note.label}`);
    }

    const hasSource = Boolean(note.sourceTitle || note.sourceUrl);
    let content = renderContent(note.content, compileSettings.quoteStyle);

    if (hasSource && compileSettings.sources === "footnoted") {
      const key = note.sourceUrl ?? note.sourceTitle!;
      content += ` [${sourceOrder.get(key)}]`;
    }
    parts.push(content);

    if (hasSource && compileSettings.sources === "inline") {
      const label = note.sourceTitle ?? "Source";
      parts.push(note.sourceUrl ? `[${label}](${note.sourceUrl})` : label);
    }

    if (compileSettings.includeTags && note.tags.length > 0) {
      parts.push(note.tags.map((tag) => `#${tag}`).join(" "));
    }

    sections.push(parts.join("\n\n"));
  }

  if (compileSettings.sources === "footnoted" && sourceOrder.size > 0) {
    const list = [...sourceOrder.entries()]
      .sort((a, b) => a[1] - b[1])
      .map(([key, num]) => {
        const note = notes.find((n) => (n.sourceUrl ?? n.sourceTitle) === key);
        const label = note?.sourceTitle ?? "Source";
        return note?.sourceUrl
          ? `${num}. [${label}](${note.sourceUrl})`
          : `${num}. ${label}`;
      });
    sections.push(`## Sources\n\n${list.join("\n")}`);
  }

  return sections.join(renderSeparator(compileSettings.separator));
};

const paramsSchema = z.object({ id: z.uuid() });

export async function PUT(
  request: NextRequest,
  { params }: RouteContext<"/api/bundles/[id]/compile">,
) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsed = compileSettingsSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);
  const parsedParams = parseParams(paramsSchema, await params);
  if (parsedParams.error) return parsedParams.error;

  const { id } = parsedParams.data;

  const bundle = await getBundleWithNotes(userId, id);
  if (!bundle) return notFound("Bundle");

  const compileResult = compileBundle({
    bundleTitle: bundle.name,
    compileSettings: parsed.data,
    notes: bundle.notes,
  });

  const [updated] = await db
    .update(bundles)
    .set({
      docContent: compileResult,
      compiledAt: new Date(),
      lastCompileSettings: parsed.data,
    })
    .where(eq(bundles.id, id))
    .returning();

  return NextResponse.json({ bundle: updated });
}
