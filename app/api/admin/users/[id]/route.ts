import { appsScriptRequest } from "@/lib/apps-script";
import { apiError, apiSuccess, sessionToken } from "@/lib/api-route";
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){try{const {id}=await params;return apiSuccess(await appsScriptRequest("adminUserDetail",{token:await sessionToken(),userId:id}))}catch(error){return apiError(error)}}
