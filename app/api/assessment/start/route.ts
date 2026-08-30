import { appsScriptRequest } from "@/lib/apps-script";
import { apiError, apiSuccess, sessionToken } from "@/lib/api-route";
import { updateAssessmentIdentity } from "@/lib/session";

export async function POST() {
  try { const data=await appsScriptRequest<{assessment:{status:"in_progress"|"completed"}}>("startAssessment", { token: await sessionToken() });await updateAssessmentIdentity(data.assessment.status);return apiSuccess(data); }
  catch (error) { return apiError(error); }
}
