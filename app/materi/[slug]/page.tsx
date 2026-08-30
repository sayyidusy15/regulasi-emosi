import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { Footer, PublicNavbar } from "@/components/emora";
import { getPublishedMaterials } from "@/lib/materials";

type Props={params:Promise<{slug:string}>};
export const dynamic="force-dynamic";

async function findMaterial(slug:string){return (await getPublishedMaterials()).find(material=>material.slug===slug)}
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {slug}=await params; const item=await findMaterial(slug);
  if(!item)return {title:"Materi tidak ditemukan",openGraph:{images:[]},twitter:{images:[]}};
  return {title:item.title,description:item.summary,openGraph:{title:item.title,description:item.summary,images:[]},twitter:{card:"summary",title:item.title,description:item.summary,images:[]}};
}

export default async function Article({params}:Props){
  const {slug}=await params; const item=await findMaterial(slug); if(!item)notFound();
  const paragraphs=item.content.split(/\n{2,}/).filter(Boolean);
  return <main className="site-shell article-page"><PublicNavbar active="materi"/><article><Link className="back-link" href="/materi"><ArrowLeft size={17}/>Kembali ke materi</Link><header><span>MATERI EMORA</span><h1>{item.title}</h1><p>{item.summary}</p></header><div className="article-opening mint"><span className="blob-face">•‿•</span><p>{paragraphs[0]||item.summary}</p></div><section>{paragraphs.slice(1).map((paragraph,index)=><p key={index}>{paragraph}</p>)}<div className="article-note"><Info/><p><strong>Catatan penting</strong><span>Materi Emora bersifat edukatif. Untuk dukungan profesional, hubungi tenaga kesehatan yang sesuai.</span></p></div></section><footer><p>Selanjutnya</p><Link href="/app/pengukuran">Kenali pola regulasi emosimu <ArrowRight size={18}/></Link></footer></article><Footer/></main>
}
