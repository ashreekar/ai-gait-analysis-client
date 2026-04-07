"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, X, LayoutDashboard, Activity, 
  Settings, User, ChevronRight, History,
  BluetoothSearching, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const [isOpen, setIsOpen] = useState(false);

  // 1. LOGIN PAGE HEADER
  if (isLoginPage) {
    return (
      <header className="sticky top-0 z-50 h-20 w-full border-b-4 border-duo-gray bg-white px-8">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
          <span className="text-2xl font-black tracking-tighter text-duo-text uppercase italic">
            Gait Analyser
          </span>
        </div>
      </header>
    );
  }

  // 2. APP PAGES: HAMBURGER SIDEBAR
  return (
    <>
      {/* TRIGGER BUTTON */}
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
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-duo-text/20 backdrop-blur-sm z-[58]"
            />

            <motion.aside 
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-80 bg-white border-r-4 border-duo-gray z-[59] p-8 pt-24 flex flex-col"
            >
              <div className="mb-12">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-1 italic">Diagnostic Suite</p>
                <h2 className="text-2xl font-black text-duo-text tracking-tighter italic">GAIT_ANALYSER</h2>
              </div>

              <nav className="flex-1 space-y-2">
                <SideNavLink 
                  href="/live" 
                  icon={<Activity />} 
                  label="Live Stream" 
                  active={pathname === '/live'} 
                  onClick={() => setIsOpen(false)} 
                />
                <SideNavLink 
                  href="/history" 
                  icon={<History />} 
                  label="Session Logs" 
                  active={pathname.startsWith('/history')} 
                  onClick={() => setIsOpen(false)} 
                />
                <SideNavLink 
                  href="/settings" 
                  icon={<BluetoothSearching />} 
                  label="Pairing" 
                  active={pathname === '/settings'} 
                  onClick={() => setIsOpen(false)} 
                />
              </nav>

              {/* USER & SYSTEM SECTION */}
              <div className="mt-auto pt-6 space-y-4">
                <Link 
                  href="/profile" 
                  className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50 border-2 border-duo-gray hover:border-duo-blue transition-colors group"
                >
                  <div className="h-10 w-10 rounded-full bg-duo-blue border-b-2 border-duo-blue-dark flex items-center justify-center text-white font-black">
                    A
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-duo-text uppercase tracking-widest">Ashreek</p>
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Pro Clinical Tier</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-duo-blue" />
                </Link>

                <button className="w-full flex items-center justify-center gap-2 py-3 text-[10px] font-black text-duo-red uppercase tracking-widest hover:bg-red-50 rounded-xl transition-colors">
                  <LogOut size={14} /> Log Out System
                </button>
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
      className={`flex items-center gap-4 px-4 py-4 rounded-2xl border-2 transition-all font-black tracking-widest text-xs
        ${active 
          ? 'bg-[#DDF4FF] text-duo-blue border-[#84D8FF] translate-x-2' 
          : 'text-gray-400 border-transparent hover:bg-gray-50 hover:text-duo-text hover:translate-x-1'
        }`}
    >
      <span className={active ? 'text-duo-blue' : 'text-gray-300'}>
        {React.cloneElement(icon, { size: 18 })}
      </span>
      {label.toUpperCase()}
    </Link>
  );
}