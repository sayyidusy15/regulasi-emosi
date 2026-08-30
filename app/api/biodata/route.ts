import { appsScriptRequest } from "@/lib/apps-script";
import { apiError, apiSuccess, jsonBody, sessionToken } from "@/lib/api-route";

export async function GET() {
  try { return apiSuccess(await appsScriptRequest("getProfile", { token: await sessionToken() })); }
  catch (error) { return apiError(error); }
}

export async function POST(request: Request) {
  try { return apiSuccess(await appsScriptRequest("saveBiodata", { token: await sessionToken(), biodata: await jsonBody(request) })); }
  catch (error) { return apiError(error); }
}
