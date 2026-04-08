"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/Bottomnav";
import { Badge, SectionTitle } from "@/components/GaitUI";
import { sessionHistory, weeklyProgress } from "@/lib/mockData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
} from "recharts";

// --- Google Style Tooltip ---
const googleTooltip = {
  contentStyle: {
    background: "#ffffff",
    border: "none",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    fontSize: "12px",
    padding: "12px",
  },
  itemStyle: { color: "#1a73e8", fontWeight: "bold" },
  cursor: { stroke: "#e8eaed", strokeWidth: 2 },
};

function FallRiskBadge({ risk }: { risk: string }) {
  if (risk === "Low") return <Badge variant="green">{risk} Risk</Badge>;
  if (risk === "High") return <Badge variant="red">{risk} Risk</Badge>;
  return <Badge variant="amber">{risk} Risk</Badge>;
}

export default function HistoryPage() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-28 font-sans text-[#202124]">
      {/* ── Google Style Header ── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-6">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">Recovery Journey</h1>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
          Week 6 Post-Op • Progression Log
        </p>
      </header>

      <main className="px-4 pt-6 space-y-6">
        
        {/* ── Recovery Trend Card ── */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Walking Velocity
            </span>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
              ↑ 12% Improvement
            </span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="6 6" stroke="#f1f3f4" vertical={false} />
                <XAxis 
                  dataKey="week" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#9aa0a6", fontSize: 10, fontWeight: "bold" }}
                  tickFormatter={(v) => `W${v}`} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#9aa0a6", fontSize: 10 }}
                  domain={[0.4, 1.0]}
                  width={25}
                />
                <Tooltip {...googleTooltip} />
                <ReferenceLine 
                  y={0.8} 
                  stroke="#dadce0" 
                  strokeDasharray="4 4" 
                  label={{ value: "GOAL", position: "insideRight", fill: "#dadce0", fontSize: 10, fontWeight: "bold" }} 
                />
                <Line
                  type="monotone"
                  dataKey="speed"
                  stroke="#1a73e8"
                  strokeWidth={4}
                  dot={{ r: 6, fill: "#1a73e8", strokeWidth: 3, stroke: "#fff" }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Weekly Pill Carousel ── */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {weeklyProgress.map((wp) => (
            <div
              key={wp.week}
              className="bg-white min-w-[100px] rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col items-center"
            >
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Week {wp.week}</span>
              <span className={`text-xl font-bold mt-1 ${wp.symmetry >= 80 ? 'text-blue-600' : 'text-gray-900'}`}>
                {wp.symmetry}%
              </span>
              <span className="text-[8px] font-bold text-gray-300 uppercase">Symmetry</span>
            </div>
          ))}
        </div>

        {/* ── Session List ── */}
        <SectionTitle>Recent Activity</SectionTitle>

        <div className="space-y-3">
          {sessionHistory.map((session) => {
            const isExpanded = expandedId === session.id;
            return (
              <div
                key={session.id}
                className={`bg-white rounded-[24px] border transition-all duration-300 ${
                  isExpanded ? "border-blue-200 shadow-lg shadow-blue-50" : "border-gray-100 shadow-sm"
                }`}
                onClick={() => setExpandedId(isExpanded ? null : session.id)}
              >
                {/* Header Row */}
                <div className="p-5 flex justify-between items-center cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2">
                        <path d="M12 2v20M17 5H7M17 19H7M2 12h20" strokeOpacity="0.2"/>
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{session.dateLabel}</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                        {session.duration} • {session.steps} steps
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <div className="text-lg font-bold text-gray-900">{session.symmetry}%</div>
                      <div className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter">Symmetry</div>
                    </div>
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dadce0" strokeWidth="3">
                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.div>
                  </div>
                </div>

                {/* Badges Row */}
                <div className="flex gap-2 px-5 pb-5 overflow-x-auto scrollbar-hide">
                  <FallRiskBadge risk={session.fallRisk} />
                  <Badge variant="blue">{session.speed} m/s</Badge>
                  <Badge variant="gray">Pain {session.pain}/10</Badge>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-gray-50 bg-gray-50/30 rounded-b-[24px]"
                    >
                      <div className="p-6 grid grid-cols-2 gap-6">
                        {[
                          { label: "Stability Score", value: `${session.rehabScore}/100` },
                          { label: "Ground Contact", value: `${session.gct} ms` },
                          { label: "Left Stance", value: `${session.stanceLeft}%` },
                          { label: "Right Stance", value: `${session.stanceRight}%` },
                        ].map((item) => (
                          <div key={item.label}>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                            <p className="text-sm font-bold text-gray-800">{item.value}</p>
                          </div>
                        ))}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/history/${session.id}`);
                          }}
                          className="col-span-2 w-full py-3 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-100 active:scale-95 transition-transform"
                        >
                          View Full Biometric Report
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}