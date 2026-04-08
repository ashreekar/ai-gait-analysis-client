import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SessionProvider } from "@/lib/Provider";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Gait Twin · Clinical Dashboard",
  description: "AI-powered locomotion assessment and digital twin-based rehabilitation.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#f8f9fa",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      {/* Background color on the body provides the 'gutter' color for large screens */}
      <body className="bg-[#f1f3f4] antialiased">
        <SessionProvider>
          {/* CENTRAL APP CONTAINER:
            - Mobile: 100% width
            - Tablet/Large: 50% width (50vw)
          */}
          <Header />
          <div className="mx-auto min-h-screen w-full lg:w-[50vw] bg-[#f8f9fa] shadow-2xl shadow-black/5 flex flex-col relative">
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}