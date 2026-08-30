import { appsScriptRequest } from "@/lib/apps-script";
import { apiError, apiSuccess, sessionToken } from "@/lib/api-route";

export async function POST() {
  try { return apiSuccess(await appsScriptRequest("startAssessment", { token: await sessionToken() })); }
  catch (error) { return apiError(error); }
}
