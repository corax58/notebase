import { NextResponse } from "next/server";
import type { z } from "zod";

export function parseParams<T extends z.ZodTypeAny>(
  schema: T,
  value: unknown,
): { data: z.infer<T>; error?: undefined } | { data?: undefined; error: NextResponse } {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    return { error: NextResponse.json({ error: "Invalid route parameters" }, { status: 400 }) };
  }
  return { data: parsed.data };
}
