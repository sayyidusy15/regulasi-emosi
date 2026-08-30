import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { appsScriptRequest, type SessionUser } from "@/lib/apps-script";
import { IDENTITY_COOKIE, SESSION_COOKIE } from "@/lib/api-route";

type SignedIdentity = {
  version: 1;
  expiresAt: string;
  user: SessionUser;
  assessmentStatus: "not_started" | "in_progress" | "completed";
};

function signingSecret() {
  return process.env.APPS_SCRIPT_API_SECRET || "";
}

function signature(payload: string) {
  return createHmac("sha256", signingSecret()).update(payload).digest("base64url");
}

export function createIdentityCookie(user: SessionUser, expiresAt: string, assessmentStatus: SignedIdentity["assessmentStatus"] = "not_started") {
  const payload = Buffer.from(JSON.stringify({ version: 1, user, expiresAt, assessmentStatus } satisfies SignedIdentity)).toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function verifyIdentityCookie(value: string): SignedIdentity | null {
  if (!value || !signingSecret()) return null;
  const [payload, suppliedSignature] = value.split(".");
  if (!payload || !suppliedSignature) return null;
  const expected = signature(payload);
  const suppliedBuffer = Buffer.from(suppliedSignature);
  const expectedBuffer = Buffer.from(expected);
  if (suppliedBuffer.length !== expectedBuffer.length || !timingSafeEqual(suppliedBuffer, expectedBuffer)) return null;
  try {
    const identity = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SignedIdentity;
    if (identity.version !== 1 || !identity.user?.id || Date.parse(identity.expiresAt) <= Date.now()) return null;
    return identity;
  } catch {
    return null;
  }
}

export const getSessionIdentity = cache(async (): Promise<SignedIdentity | null> => {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value || "";
  if (!token) return null;

  const identity = verifyIdentityCookie(store.get(IDENTITY_COOKIE)?.value || "");
  if (identity?.user.status === "active") return identity;

  // Backward-compatible fallback keeps sessions created before the identity
  // cookie rollout alive. The Apps Script token remains the authority.
  try {
    const profile = await appsScriptRequest<{ user: SessionUser; assessment: { status: "in_progress" | "completed" } | null }>("getProfile", { token });
    return profile.user.status === "active" ? { version: 1, user: profile.user, expiresAt: new Date(Date.now()+1000*60*60).toISOString(), assessmentStatus: profile.assessment?.status || "not_started" } : null;
  } catch {
    return null;
  }
});

export const getCurrentUser = cache(async (): Promise<SessionUser | null> => (await getSessionIdentity())?.user || null);

export async function updateAssessmentIdentity(assessmentStatus: SignedIdentity["assessmentStatus"]) {
  const store = await cookies();
  const current = verifyIdentityCookie(store.get(IDENTITY_COOKIE)?.value || "");
  if (!current) return;
  store.set(IDENTITY_COOKIE, createIdentityCookie(current.user, current.expiresAt, assessmentStatus), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", expires: new Date(current.expiresAt),
  });
}

export async function requirePageUser(role?: "user" | "admin") {
  const user = await getCurrentUser();
  if (!user) redirect(role === "admin" ? "/admin/login" : "/login");
  if (role && user.role !== role) redirect(user.role === "admin" ? "/admin" : "/app");
  return user;
}
