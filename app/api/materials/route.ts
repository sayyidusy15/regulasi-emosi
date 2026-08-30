import { appsScriptRequest } from "@/lib/apps-script";
import { apiError, apiSuccess } from "@/lib/api-route";

export async function GET() {
  try { return apiSuccess(await appsScriptRequest("getMaterials")); }
  catch (error) { return apiError(error); }
}
