import { cookies } from "next/headers";
import { appsScriptRequest, AppsScriptError, type AuthResponse } from "@/lib/apps-script";
import { apiError, apiSuccess, jsonBody, requireFields, SESSION_COOKIE } from "@/lib/api-route";

export async function POST(request: Request) {
  try {
    const body = await jsonBody(request);
    requireFields(body, ["email", "password"]);
    const requireRole = body.admin ? "admin" : "user";
    const result = await appsScriptRequest<AuthResponse>("login", { email: body.email, password: body.password, requireRole });
    if (result.user.role !== requireRole) throw new AppsScriptError("Akun tidak memiliki akses ke ruang ini.", 403);
    (await cookies()).set(SESSION_COOKIE, result.token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", expires: new Date(result.expiresAt) });
    return apiSuccess({ user: result.user });
  } catch (error) { return apiError(error); }
}
