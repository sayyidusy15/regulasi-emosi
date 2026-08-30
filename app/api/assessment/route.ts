import { appsScriptRequest } from "@/lib/apps-script";
import { apiError, apiSuccess, sessionToken } from "@/lib/api-route";

export async function GET() {
  try {
    const data = await appsScriptRequest("getAssessment", { token: await sessionToken() });
    return apiSuccess(data);
  } catch (error) {
    return apiError(error);
  }
}
