import type { Metadata } from "next";
import { headers } from "next/headers";
import { Caveat, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({variable:"--font-jakarta",subsets:["latin"]});
const caveat = Caveat({variable:"--font-caveat",subsets:["latin"]});

export async function generateMetadata():Promise<Metadata>{
  const h=await headers(); const host=h.get("host")??"localhost:3000"; const protocol=host.includes("localhost")?"http":"https"; const base=new URL(`${protocol}://${host}`);
  const title="Emora — Kenali Cara Kamu Mengelola Emosi"; const description="Pelajari dan kenali strategi regulasi emosimu melalui pengalaman ERQ-30 yang hangat dan mudah dipahami.";
  return {metadataBase:base,title:{default:title,template:"%s | Emora"},description,icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"},openGraph:{title,description,images:[new URL("/og.png",base).toString()],type:"website",locale:"id_ID"},twitter:{card:"summary_large_image",title,description,images:[new URL("/og.png",base).toString()]}};
}

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="id"><body className={`${jakarta.variable} ${caveat.variable}`}>{children}</body></html>;
}
