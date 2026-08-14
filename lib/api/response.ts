import { NextResponse } from "next/server";
import { z } from "zod";

export function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export function unauthorized() {
  return errorResponse("Unauthorized", 401);
}

export function notFound(resource: string) {
  return errorResponse(`${resource} not found`, 404);
}

export function validationError(error: z.ZodError) {
  return NextResponse.json(
    { error: "Validation failed", issues: z.flattenError(error).fieldErrors },
    { status: 400 },
  );
}
