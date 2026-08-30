import { appsScriptRequest } from "@/lib/apps-script";
import { apiError, apiSuccess, jsonBody, requireFields, sessionToken } from "@/lib/api-route";

export async function POST(request: Request) {
  try {
    const body = await jsonBody(request); requireFields(body, ["assessmentId"]);
    return apiSuccess(await appsScriptRequest("submitAssessment", { token: await sessionToken(), assessmentId: body.assessmentId, answers: body.answers || {} }));
  } catch (error) { return apiError(error); }
}
