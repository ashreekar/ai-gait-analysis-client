"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={5 * 60}>
      <Provider store={store}>
        <AuthGuard>{children}</AuthGuard>
      </Provider>
    </SessionProvider>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicPage = pathname === "/login";

  useEffect(() => {
    if (status === "loading") return;

    // 1. If not logged in and trying to access app pages -> Redirect to Login
    if (status === "unauthenticated" && !isPublicPage) {
      router.push("/login");
    }

    // 2. If logged in and trying to access Login page -> Redirect to Dashboard
    if (status === "authenticated" && isPublicPage) {
      router.push("/live");
    }
  }, [status, pathname, router, isPublicPage]);

  // Show a high-tech loader while checking session to prevent "flicker"
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="text-duo-blue animate-spin mb-4" size={40} />
        <p className="text-[10px] font-black text-duo-text uppercase tracking-[0.3em] animate-pulse">
          Initializing_Systems...
        </p>
      </div>
    );
  }

  // Prevent rendering protected content while redirecting unauthenticated users
  if (status === "unauthenticated" && !isPublicPage) {
    return null;
  }

  return <>{children}</>;
}