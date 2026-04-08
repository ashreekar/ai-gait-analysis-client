"use client";
import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  ChevronRight, 
  Filter,
  Clock,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Mock Data for past sessions
const MOCK_SESSIONS = [
  { id: 1, date: "Apr 7, 2026", time: "10:32 AM", duration: "2 min 15 sec", symmetry: 92, trend: "up", risk: "Low" },
  { id: 2, date: "Apr 6, 2026", time: "02:15 PM", duration: "5 min 40 sec", symmetry: 88, trend: "down", risk: "Low" },
  { id: 3, date: "Apr 4, 2026", time: "09:00 AM", duration: "12 min 10 sec", symmetry: 65, trend: "down", risk: "Moderate" },
  { id: 4, date: "Mar 30, 2026", time: "11:20 AM", duration: "8 min 05 sec", symmetry: 95, trend: "up", risk: "Low" },
];

export default function SessionHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState("All");

  const filteredSessions = MOCK_SESSIONS.filter(s => 
    (filterRisk === "All" || s.risk === filterRisk) &&
    (s.date.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#F7F7F7] pt-24 px-6 pb-12">
      <div className="mx-auto max-w-5xl">
        
        {/* HEADER SECTION */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-duo-text tracking-tighter">SESSION HISTORY</h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Review and compare your gait performance</p>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-duo-blue transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Search by date (e.g. Apr 7)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-duo-gray bg-white font-bold text-duo-text focus:border-duo-blue focus:outline-none transition-all shadow-[0_4px_0_0_#e5e5e5]"
            />
          </div>

          <div className="flex gap-2">
            {["All", "Low", "Moderate"].map((risk) => (
              <button
                key={risk}
                onClick={() => setFilterRisk(risk)}
                className={`px-6 h-14 rounded-2xl border-2 font-black tracking-widest text-xs transition-all shadow-[0_4px_0_0_#e5e5e5] active:translate-y-1 active:shadow-none
                  ${filterRisk === risk 
                    ? 'bg-duo-blue border-duo-blue-dark text-white' 
                    : 'bg-white border-duo-gray text-gray-400 hover:bg-gray-50'
                  }`}
              >
                {risk.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* SESSIONS LIST */}
        <div className="space-y-4">
          {filteredSessions.map((session, index) => (
            <SessionRow key={session.id} session={session} index={index} />
          ))}

          {filteredSessions.length === 0 && (
            <div className="duo-card text-center py-20 opacity-50">
              <p className="font-black text-gray-400 tracking-widest uppercase">No sessions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: SESSION ROW ---

function SessionRow({ session, index }: { session: any, index: number }) {
  const getSymmetryColor = (score: number) => {
    if (score > 85) return "bg-duo-green";
    if (score > 70) return "bg-duo-orange";
    return "bg-duo-red";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group cursor-pointer"
    >
       <Link href={"history/1"}>
      <div className="duo-card flex flex-col md:flex-row items-center justify-between gap-6 hover:border-duo-blue transition-colors relative overflow-hidden active:translate-y-1 active:shadow-none">
        
        {/* DATE & TIME */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="h-12 w-12 rounded-2xl bg-gray-50 border-2 border-duo-gray flex items-center justify-center text-duo-blue">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm font-black text-duo-text tracking-tight">{session.date}</p>
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <Clock size={12} /> {session.time}
            </div>
          </div>
        </div>

        {/* DURATION */}
        <div className="hidden lg:block text-center">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Duration</p>
          <p className="text-sm font-black text-duo-text italic">{session.duration}</p>
        </div>

        {/* SYMMETRY SCORE */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start border-t md:border-t-0 pt-4 md:pt-0">
          <div className="text-right md:text-left">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Avg Symmetry</p>
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${getSymmetryColor(session.symmetry)} shadow-[0_0_8px] shadow-current opacity-80`} />
              <span className="text-lg font-black text-duo-text">{session.symmetry}%</span>
            </div>
          </div>
        </div>

        {/* TREND & RISK */}
        <div className="flex items-center gap-8">
          <div className="text-center">
             <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Risk Trend</p>
             {session.trend === 'up' ? (
               <div className="flex items-center text-duo-green gap-1 font-black text-xs">
                 <TrendingUp size={14} /> <ArrowUpRight size={14} />
               </div>
             ) : (
               <div className="flex items-center text-duo-red gap-1 font-black text-xs">
                 <TrendingUp size={14} className="rotate-90" /> <ArrowDownRight size={14} />
               </div>
             )}
          </div>

          <ChevronRight className="text-duo-gray group-hover:text-duo-blue group-hover:translate-x-1 transition-all" size={24} />
        </div>

      </div>
      </Link>
    </motion.div>
  );
}