import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SessionProvider } from "@/lib/Provider";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Gait Twin · Clinical Dashboard",
  description: "AI-powered locomotion assessment and digital twin-based rehabilitation.",
  // --- PWA ADDITIONS ---
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Gait Twin",
    // startupImage: [] // Optional: you can add splash screens here
  },
  formatDetection: {
    telephone: false,
  },
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
        {/* Apple specific icons if not handled by manifest */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="bg-[#f1f3f4] antialiased">
        <SessionProvider>
          <Header />
          <div className="mx-auto min-h-screen w-full lg:w-[50vw] bg-[#f8f9fa] shadow-2xl shadow-black/5 flex flex-col relative">
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}