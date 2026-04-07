"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, X, LayoutDashboard, Activity, 
  Settings, User, ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const [isOpen, setIsOpen] = useState(false);

  // 1. LOGIN PAGE HEADER (Normal, Full-Width, No Logo Icon)
  if (isLoginPage) {
    return (
      <header className="sticky top-0 z-50 h-20 w-full border-b-4 border-duo-gray bg-white px-8">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
          <span className="text-2xl font-black tracking-tighter text-duo-text">
            GAIT <span className="text-duo-green">ANALYSER</span>
          </span>
          <div className="flex items-center gap-4">
            <span className="hidden font-bold text-gray-400 md:block text-xs tracking-widest">NEW USER?</span>
            <Link href="/login" className="duo-btn-3d bg-duo-blue border-duo-blue-dark px-8 py-2 text-sm font-bold tracking-widest text-white">
              SIGN UP
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // 2. APP PAGES: HAMBURGER SIDEBAR
  return (
    <>
      {/* TRIGGER BUTTON (Floating at top-left) */}
      <div className="fixed top-6 left-6 z-[60]">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="duo-btn-3d h-14 w-14 bg-white border-duo-gray text-duo-text flex items-center justify-center hover:bg-gray-50 shadow-xl"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* SIDEBAR OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Background Dimmer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-duo-text/20 backdrop-blur-sm z-[58]"
            />

            {/* Side Menu */}
            <motion.aside 
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-80 bg-white border-r-4 border-duo-gray z-[59] p-8 pt-24 flex flex-col"
            >
              <div className="mb-12">
                <p className="text-xs font-black text-gray-300 uppercase tracking-[0.3em] mb-2">Platform</p>
                <h2 className="text-2xl font-black text-duo-text tracking-tighter">GAIT ANALYSER</h2>
              </div>

              <nav className="flex-1 space-y-3">
                <SideNavLink href="/dashboard" icon={<LayoutDashboard />} label="Dashboard" active={pathname === '/dashboard'} onClick={() => setIsOpen(false)} />
                <SideNavLink href="/live" icon={<Activity />} label="Live Session" active={pathname === '/live'} onClick={() => setIsOpen(false)} />
                <SideNavLink href="/settings" icon={<Settings />} label="Settings" active={pathname === '/settings'} onClick={() => setIsOpen(false)} />
              </nav>

              {/* User Section at Bottom */}
              <div className="mt-auto pt-6 border-t-2 border-duo-gray">
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50 border-2 border-duo-gray">
                  <div className="h-10 w-10 rounded-full bg-orange-400 border-b-2 border-orange-600 flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black text-duo-text uppercase tracking-widest">Ashreek</p>
                    <p className="text-[10px] font-bold text-gray-400">Pro Member</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// --- SUB-COMPONENTS ---

function SideNavLink({ href, icon, label, active, onClick }: any) {
  return (
    <Link 
      href={href}
      onClick={onClick}
      className={`flex items-center gap-4 px-4 py-4 rounded-2xl border-2 transition-all font-black tracking-widest text-sm
        ${active 
          ? 'bg-[#DDF4FF] text-duo-blue border-[#84D8FF] translate-x-2' 
          : 'text-gray-400 border-transparent hover:bg-gray-50 hover:text-duo-text hover:translate-x-1'
        }`}
    >
      <span className={active ? 'text-duo-blue' : 'text-gray-300'}>
        {React.cloneElement(icon, { size: 20 })}
      </span>
      {label.toUpperCase()}
    </Link>
  );
}