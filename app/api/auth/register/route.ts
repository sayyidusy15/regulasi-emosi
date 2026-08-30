import { cookies } from "next/headers";
import { appsScriptRequest, AppsScriptError, type AuthResponse } from "@/lib/apps-script";
import { apiError, apiSuccess, jsonBody, requireFields, SESSION_COOKIE } from "@/lib/api-route";

export async function POST(request: Request) {
  try {
    const body = await jsonBody(request);
    requireFields(body, ["name", "email", "password"]);
    if (String(body.password).length < 8) throw new AppsScriptError("Password minimal 8 karakter.", 400);
    const result = await appsScriptRequest<AuthResponse>("register", { name: body.name, email: body.email, password: body.password });
    (await cookies()).set(SESSION_COOKIE, result.token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", expires: new Date(result.expiresAt) });
    return apiSuccess({ user: result.user });
  } catch (error) { return apiError(error); }
}
