import { db } from "@/db";
import { user } from "@/db/schema";

export async function GET() {
  try {
    const rows = await db.select().from(user).limit(5);
    return Response.json({ ok: true, rows });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
