"use client";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/Bottomnav";
import { Badge, Toggle, SectionTitle } from "@/components/GaitUI";
import { patientProfile, glossary } from "@/lib/mockData";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [bleEnabled, setBleEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [clinicianAccess, setClinicianAccess] = useState(true);
  const [expandedGlossary, setExpandedGlossary] = useState<string | null>(null);

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-28 font-sans text-[#202124]">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-6">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">Settings</h1>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
          {session?.user?.email ?? "Patient Profile"} • App v1.2
        </p>
      </header>

      <main className="px-4 pt-6 space-y-6">
        {/* ── Patient Profile Card ── */}
        <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
          <div className="p-6 flex items-center gap-5 border-b border-gray-50">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-100">
              {patientProfile.initials}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{patientProfile.name}</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-tight mt-0.5">
                {patientProfile.age}y • {patientProfile.height}cm • {patientProfile.weight}kg
              </p>
            </div>
          </div>
          
          <div className="p-2">
            {[
              { label: "Surgery", value: patientProfile.surgery },
              { label: "Recovery", value: `Week ${patientProfile.postOpWeek}` },
              { label: "Clinician", value: patientProfile.clinician },
              { label: "Speed Goal", value: `${patientProfile.targetSpeed} m/s` },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center px-4 py-3 hover:bg-gray-50 rounded-2xl transition-colors">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{row.label}</span>
                <span className="text-sm font-bold text-gray-800">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Connectivity Tile Grid ── */}
        <SectionTitle>Sensors & Hardware</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          {["Left Insole", "Right Insole"].map((shoe, i) => (
            <div 
              key={shoe} 
              className={`p-5 rounded-[28px] border transition-all duration-300 ${
                bleEnabled ? "bg-white border-gray-100 shadow-sm" : "bg-gray-50 border-transparent opacity-60"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-3 h-3 rounded-full ${bleEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                <span className="text-[9px] font-bold text-gray-300 uppercase italic">BLE 5.0</span>
              </div>
              <p className="text-sm font-bold text-gray-900">{shoe}</p>
              <p className="text-[10px] font-bold text-blue-600 mt-1">
                {bleEnabled ? (i === 0 ? "82% Battery" : "76% Battery") : "Offline"}
              </p>
            </div>
          ))}
        </div>

        {/* ── Preferences List ── */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-2 shadow-sm">
          {[
            { label: "Real-time Sync", sub: "Cloud data backup", val: bleEnabled, set: setBleEnabled },
            { label: "Push Alerts", sub: "Reminders & milestones", val: notifications, set: setNotifications },
            { label: "Doctor Access", sub: "Remote portal sharing", val: clinicianAccess, set: setClinicianAccess },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-bold text-gray-900">{item.label}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{item.sub}</p>
              </div>
              <Toggle on={item.val} onChange={item.set} />
            </div>
          ))}
        </div>

        {/* ── Clinical Glossary (Accordion) ── */}
        <SectionTitle>Medical Glossary</SectionTitle>
        <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
          {glossary.map((item) => {
            const isOpen = expandedGlossary === item.term;
            return (
              <div key={item.term} className="border-b border-gray-50 last:border-0">
                <button
                  onClick={() => setExpandedGlossary(isOpen ? null : item.term)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left"
                >
                  <span className="text-sm font-bold text-gray-800 tracking-tight">{item.term}</span>
                  <motion.svg 
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dadce0" strokeWidth="2.5"
                  >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6 text-xs leading-relaxed text-gray-500 font-medium"
                    >
                      {item.def}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* ── Formula Cards (Horizontal Scroll) ── */}
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {[
            { name: "Symmetry Index", eq: "|L-R| / (0.5*(L+R))" },
            { name: "Cadence", eq: "Steps / (Time/60)" },
            { name: "Rehab Score", eq: "Σ(Metrics) * Weights" },
          ].map((f) => (
            <div key={f.name} className="bg-blue-600 rounded-3xl p-5 min-w-[200px] shadow-lg shadow-blue-100">
              <p className="text-[9px] font-bold text-blue-200 uppercase tracking-widest">{f.name}</p>
              <p className="text-xs font-mono text-white mt-2 font-bold">{f.eq}</p>
            </div>
          ))}
        </div>

        {/* ── Sign Out ── */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full py-5 rounded-[28px] bg-red-50 text-red-500 text-sm font-bold flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Sign Out of Account
        </button>

        <p className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest pb-4">
          Gait Twin Research v1.0 • Clinical Protocol
        </p>
      </main>

      <BottomNav />
    </div>
  );
}