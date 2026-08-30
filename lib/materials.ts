import "server-only";
import { appsScriptRequest } from "@/lib/apps-script";

export type PublishedMaterial={id:string;slug:string;title:string;summary:string;content:string;image:string;status:string;created_at:string;updated_at:string};

export async function getPublishedMaterials():Promise<PublishedMaterial[]>{
  return appsScriptRequest<PublishedMaterial[]>("getMaterials");
}
