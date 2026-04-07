"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Zap, 
  LayoutDashboard, 
  Activity, 
  User, 
  Settings,
  ChevronDown
} from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for the island
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 1. LOGIN PAGE HEADER (Normal, Full-Width)
  if (isLoginPage) {
    return (
      <header className="sticky top-0 z-50 h-20 w-full border-b-4 border-duo-gray bg-white px-6">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
          <BrandLogo />
          <div className="flex items-center gap-4">
            <span className="hidden font-bold text-gray-400 md:block">NEW USER?</span>
            <Link href="/signup" className="duo-button-blue px-8 py-2 text-sm font-bold tracking-widest text-white">
              SIGN UP
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // 2. DYNAMIC ISLAND HEADER (Floating Capsule)
  return (
    <div className="pointer-events-none fixed top-0 z-50 flex w-full justify-center p-4 transition-all duration-500">
      <header 
        className={`pointer-events-auto flex items-center justify-between rounded-full border-b-4 border-duo-gray bg-white transition-all duration-500 ease-in-out shadow-island
          ${isScrolled ? 'h-14 w-[400px] px-4' : 'h-16 w-full max-w-4xl px-8'}
        `}
      >
        {/* ICON / LOGO */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border-b-2 border-duo-green-dark bg-duo-green text-white">
            <Zap size={20} fill="currentColor" />
          </div>
          {!isScrolled && (
            <span className="text-lg font-black tracking-tighter text-duo-text">GAIT<span className="text-duo-green">MATE</span></span>
          )}
        </Link>

        {/* COMPACT NAV OPTIONS */}
        <nav className="flex items-center gap-2">
          <IslandLink href="/dashboard" icon={<LayoutDashboard size={20} />} active={pathname === '/dashboard'} compact={isScrolled} />
          <IslandLink href="/live" icon={<Activity size={20} />} active={pathname === '/live'} compact={isScrolled} />
          
          <div className="mx-2 h-6 w-[2px] bg-duo-gray" />

          {/* USER MINI-PROFILE */}
          <button className="flex items-center gap-2 rounded-full border-2 border-duo-gray bg-gray-50 p-1 pr-3 transition-colors hover:bg-gray-100">
            <div className="h-7 w-7 rounded-full bg-orange-400 border-b-2 border-orange-600 flex items-center justify-center overflow-hidden">
              <User size={14} className="text-white" />
            </div>
            {!isScrolled && <span className="text-xs font-bold text-duo-text uppercase">Ashreek</span>}
          </button>
        </nav>
      </header>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-b-4 border-duo-green-dark bg-duo-green text-white">
        <Zap size={24} fill="currentColor" />
      </div>
      <span className="text-2xl font-black tracking-tighter text-duo-text">GAIT<span className="text-duo-green">MATE</span></span>
    </Link>
  );
}

function IslandLink({ href, icon, active, compact }: any) {
  return (
    <Link 
      href={href}
      className={`flex items-center justify-center rounded-full transition-all duration-300
        ${active ? 'bg-duo-blue/10 text-duo-blue' : 'text-gray-400 hover:bg-gray-100'}
        ${compact ? 'h-10 w-10' : 'gap-2 px-4 py-2'}
      `}
    >
      {icon}
      {!compact && <span className="text-xs font-bold tracking-widest"> {href.replace('/','').toUpperCase()} </span>}
    </Link>
  );
}