import { cookies } from "next/headers";
import { appsScriptRequest } from "@/lib/apps-script";
import { apiError, apiSuccess, SESSION_COOKIE } from "@/lib/api-route";

export async function POST() {
  try {
    const store = await cookies();
    const token = store.get(SESSION_COOKIE)?.value || "";
    if (token) await appsScriptRequest("logout", { token });
    store.delete(SESSION_COOKIE);
    return apiSuccess({ loggedOut: true });
  } catch (error) { (await cookies()).delete(SESSION_COOKIE); return apiError(error); }
}
