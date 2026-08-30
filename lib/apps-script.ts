import "server-only";

export class AppsScriptError extends Error {
  constructor(message: string, public status = 502) {
    super(message);
  }
}

type AppsScriptEnvelope<T> = { ok: true; data: T } | { ok: false; error: string };

export async function appsScriptRequest<T>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  const url = process.env.APPS_SCRIPT_API_URL;
  const apiSecret = process.env.APPS_SCRIPT_API_SECRET;
  if (!url || !apiSecret) throw new AppsScriptError("Koneksi Google Sheets belum dikonfigurasi.", 503);

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action, apiSecret, ...payload }),
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
    });
  } catch {
    throw new AppsScriptError("Google Sheets sedang tidak dapat dihubungi.", 503);
  }

  if (!response.ok) throw new AppsScriptError("Google Apps Script mengembalikan respons yang tidak valid.", 502);
  let envelope: AppsScriptEnvelope<T>;
  try {
    envelope = (await response.json()) as AppsScriptEnvelope<T>;
  } catch {
    throw new AppsScriptError("Respons Google Apps Script bukan JSON yang valid.", 502);
  }
  if (!envelope.ok) throw new AppsScriptError(envelope.error || "Permintaan tidak dapat diproses.", 400);
  return envelope.data;
}

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "inactive";
};

export type AuthResponse = {
  token: string;
  expiresAt: string;
  user: SessionUser;
};

export type ErqResult = {
  assessmentId: string;
  userId: string;
  calculatedAt: string;
  normSource: string;
  strategies: Array<{
    key: string;
    label: string;
    score: number;
    min: 3;
    max: 21;
    mean: number;
    sd: number;
    category: "high" | "average" | "low";
  }>;
};
