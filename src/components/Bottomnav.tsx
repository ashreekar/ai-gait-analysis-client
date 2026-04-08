"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  {
    id: "home",
    label: "Home",
    href: "/dashboard",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "#1a73e8" : "none"} stroke={active ? "#1a73e8" : "#5f6368"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: "live",
    label: "Live",
    href: "/live",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#1a73e8" : "#5f6368"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2" fill={active ? "#1a73e8" : "none"} />
        <path d="M16.24 7.76a6 6 0 0 1 0 8.48m-8.48 0a6 6 0 0 1 0-8.48" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14" />
      </svg>
    ),
  },
  {
    id: "health",
    label: "Metrics",
    href: "/health",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#1a73e8" : "#5f6368"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: "history",
    label: "History",
    href: "/history",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#1a73e8" : "#5f6368"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const activeId = navItems.find((item) =>
    pathname === item.href || pathname.startsWith(item.href + "/")
  )?.id;

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <nav className="pointer-events-auto flex items-center bg-white/80 backdrop-blur-xl border border-white/20 px-3 py-2 rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-[90%] lg:w-[40vw] max-w-lg">
        {navItems.map((item) => {
          const active = activeId === item.id;
          
          return (
            <button
              key={item.id}
              className="flex flex-col items-center justify-center flex-1 py-1 relative group outline-none"
              onClick={() => router.push(item.href)}
            >
              <div className="relative h-9 w-full flex items-center justify-center">
                <AnimatePresence>
                  {active && (
                    <motion.div
                      layoutId="island-pill"
                      className="absolute h-full w-[70%] bg-blue-600/10 rounded-2xl"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </AnimatePresence>
                
                <div className={`relative z-10 transition-all duration-300 ${active ? "scale-110 text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}>
                  {item.icon(active)}
                </div>
              </div>

              <span className={`text-[9px] mt-1 font-extrabold uppercase tracking-tighter transition-colors duration-200 ${active ? "text-blue-700" : "text-gray-400"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}