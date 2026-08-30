import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AppsScriptError } from "@/lib/apps-script";

export const SESSION_COOKIE = "emora_session";

export async function sessionToken() {
  return (await cookies()).get(SESSION_COOKIE)?.value || "";
}

export async function jsonBody(request: Request) {
  try { return (await request.json()) as Record<string, unknown>; }
  catch { throw new AppsScriptError("Payload JSON tidak valid.", 400); }
}

export function apiError(error: unknown) {
  const status = error instanceof AppsScriptError ? error.status : 500;
  const message = error instanceof Error ? error.message : "Terjadi kesalahan pada server.";
  return NextResponse.json({ ok: false, error: message }, { status });
}

export function apiSuccess<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function requireFields(body: Record<string, unknown>, fields: string[]) {
  for (const field of fields) {
    if (body[field] == null || String(body[field]).trim() === "") throw new AppsScriptError(`${field} wajib diisi.`, 400);
  }
}
