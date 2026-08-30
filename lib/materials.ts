import "server-only";
import { appsScriptRequest } from "@/lib/apps-script";
import { materials as fallbackMaterials } from "@/data/emora";

export type PublishedMaterial={id:string;slug:string;title:string;summary:string;content:string;image:string;status:string;created_at:string;updated_at:string};

export async function getPublishedMaterials():Promise<PublishedMaterial[]>{
  try{
    const rows=await appsScriptRequest<PublishedMaterial[]>("getMaterials");
    if(rows.length)return rows;
  }catch{
    // The bundled copy keeps public educational pages available before setup.
  }
  return fallbackMaterials.map((item,index)=>({id:`fallback-${index+1}`,slug:item.slug,title:item.title,summary:item.intro,content:item.intro,image:"",status:"published",created_at:"",updated_at:""}));
}
