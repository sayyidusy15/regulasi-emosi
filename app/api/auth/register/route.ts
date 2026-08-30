import { cookies } from "next/headers";
import { appsScriptRequest, AppsScriptError, type AuthResponse } from "@/lib/apps-script";
import { apiError, apiSuccess, IDENTITY_COOKIE, jsonBody, requireFields, SESSION_COOKIE } from "@/lib/api-route";
import { createIdentityCookie } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body = await jsonBody(request);
    requireFields(body, ["name", "email", "password"]);
    if (String(body.password).length < 8) throw new AppsScriptError("Password minimal 8 karakter.", 400);
    const result = await appsScriptRequest<AuthResponse>("register", { name: body.name, email: body.email, password: body.password });
    const store = await cookies();
    const options = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", expires: new Date(result.expiresAt) };
    store.set(SESSION_COOKIE, result.token, options);
    store.set(IDENTITY_COOKIE, createIdentityCookie(result.user, result.expiresAt, result.assessmentStatus), options);
    return apiSuccess({ user: result.user });
  } catch (error) { return apiError(error); }
}
