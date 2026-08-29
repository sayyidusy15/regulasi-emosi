import type { Metadata } from "next";
import { Caveat, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({variable:"--font-jakarta",subsets:["latin"]});
const caveat = Caveat({variable:"--font-caveat",subsets:["latin"]});

const deploymentHost = process.env.NEXT_PUBLIC_SITE_URL
  ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined)
  ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined)
  ?? "http://localhost:3000";
const base = new URL(deploymentHost);
const title="Emora — Kenali Cara Kamu Mengelola Emosi";
const description="Pelajari dan kenali strategi regulasi emosimu melalui pengalaman ERQ-30 yang hangat dan mudah dipahami.";

export const metadata:Metadata = {
  metadataBase:base,title:{default:title,template:"%s | Emora"},description,
  icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"},
  openGraph:{title,description,images:[new URL("/og.png",base).toString()],type:"website",locale:"id_ID"},
  twitter:{card:"summary_large_image",title,description,images:[new URL("/og.png",base).toString()]},
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="id"><body className={`${jakarta.variable} ${caveat.variable}`}>{children}</body></html>;
}
