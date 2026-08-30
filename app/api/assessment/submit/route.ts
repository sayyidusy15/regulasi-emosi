import { appsScriptRequest } from "@/lib/apps-script";
import { apiError, apiSuccess, jsonBody, requireFields, sessionToken } from "@/lib/api-route";
import { updateAssessmentIdentity } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body = await jsonBody(request); requireFields(body, ["assessmentId"]);
    const data=await appsScriptRequest("submitAssessment", { token: await sessionToken(), assessmentId: body.assessmentId, answers: body.answers || {} });
    await updateAssessmentIdentity("completed");
    return apiSuccess(data);
  } catch (error) { return apiError(error); }
}
