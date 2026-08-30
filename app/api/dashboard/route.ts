import { appsScriptRequest } from "@/lib/apps-script";
import { apiError, apiSuccess, sessionToken } from "@/lib/api-route";
import { updateAssessmentIdentity } from "@/lib/session";

export async function GET() {
  try {
    const data = await appsScriptRequest<{assessmentStatus:"not_started"|"in_progress"|"completed"}>("getUserDashboard", { token: await sessionToken() });
    await updateAssessmentIdentity(data.assessmentStatus);
    return apiSuccess(data);
  } catch (error) {
    return apiError(error);
  }
}
