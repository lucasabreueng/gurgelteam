import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Sora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Preloader } from "@/components/preloader";
import { QueryProvider } from "@/lib/query/query-provider";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Gurgel Team — Aluguel e aulas de kart",
  description:
    "Aulas de pilotagem e aluguel de karts profissionais no Kartódromo Ayrton Senna, em Brasília.",
  icons: { icon: "/images/favicon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "auto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${sora.variable} font-sans`}>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('theme-preference');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-color-mode',t);}catch(e){}})();`}
        </Script>
        <Script id="app-vh-init" strategy="beforeInteractive">
          {`(function(){try{var d=document.documentElement;d.style.setProperty('--app-vh',(window.innerHeight*0.01)+'px');}catch(e){}})();`}
        </Script>
        <ThemeProvider>
          <QueryProvider>
            <Preloader />
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
