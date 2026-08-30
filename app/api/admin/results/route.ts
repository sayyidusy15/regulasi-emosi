import { appsScriptRequest } from "@/lib/apps-script";
import { apiError, apiSuccess, sessionToken } from "@/lib/api-route";
export async function GET(){try{return apiSuccess(await appsScriptRequest("adminResults",{token:await sessionToken()}))}catch(error){return apiError(error)}}
