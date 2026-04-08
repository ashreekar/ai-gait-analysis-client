"use client";
import { useState } from "react";
import BottomNav from "@/components/Bottomnav";
import { Badge, InfoBox, TabBar, SectionTitle } from "@/components/GaitUI";
import {
  weeklyProgress,
  gctOverSession,
  painVsSymmetry,
} from "@/lib/mockData";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
  Cell,
  Legend,
} from "recharts";

const TABS = [
  { id: "sym", label: "Symmetry" },
  { id: "gct", label: "Stride" },
  { id: "fall", label: "Safety" },
  { id: "pain", label: "Log" },
];

const googleTooltip = {
  contentStyle: {
    background: "#ffffff",
    border: "none",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    fontSize: "10px",
    fontWeight: "bold",
  },
  cursor: { stroke: "#f1f3f4", strokeWidth: 2 },
};

export default function HealthPage() {
  const [activeTab, setActiveTab] = useState("sym");
  const [painSelected, setPainSelected] = useState(3);

  const lrData = [
    { leg: "Left (Op.)", stance: 712 },
    { leg: "Right", stance: 664 },
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-24 font-sans text-[#202124]">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-6">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">Health Analytics</h1>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
          Week 6 Post-Op • Clinical Data
        </p>
      </header>

      <main className="px-4 pt-4">
        <TabBar
          tabs={TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="mb-6"
        />

        {/* ── SYMMETRY TAB ── */}
        {activeTab === "sym" && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Symmetry Index</span>
                <Badge variant="amber">71% • Moderate</Badge>
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
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9aa0a6", fontSize: 10 }} width={25} />
                    <Tooltip {...googleTooltip} />
                    <ReferenceLine y={85} stroke="#34a853" strokeDasharray="4 4" label={{ value: "GOAL", position: "insideRight", fill: "#34a853", fontSize: 10, fontWeight: "bold" }} />
                    <Line type="monotone" dataKey="symmetry" stroke="#1a73e8" strokeWidth={4} dot={{ r: 4, fill: "#1a73e8" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <InfoBox className="mt-6">
                <strong>Symmetry Index (SI):</strong> Measures weight-bearing balance. Recovery goal is &gt;85% to minimize secondary joint strain.
              </InfoBox>
            </div>

            <div className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm">
              <SectionTitle className="mt-0">L vs R Stance Time</SectionTitle>
              <div className="h-40 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={lrData}>
                    <XAxis dataKey="leg" axisLine={false} tickLine={false} tick={{ fill: "#9aa0a6", fontSize: 11, fontWeight: "bold" }} />
                    <YAxis hide domain={[0, 900]} />
                    <Bar dataKey="stance" radius={[12, 12, 12, 12]} barSize={60}>
                      <Cell fill="#1a73e8" />
                      <Cell fill="#dadce0" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ── GCT TAB ── */}
        {activeTab === "gct" && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Ground Contact Time</span>
                <Badge variant="blue">748ms AVG</Badge>
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={gctOverSession}>
                    <CartesianGrid strokeDasharray="6 6" stroke="#f1f3f4" vertical={false} />
                    <XAxis dataKey="stride" hide />
                    <YAxis hide domain={[600, 900]} />
                    <Tooltip {...googleTooltip} />
                    <Line type="stepAfter" dataKey="gct" stroke="#1a73e8" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <InfoBox className="mt-6">
                Elevated GCT on the operated limb (Left) indicates "protective hesitation"—a common neurological response post-surgery.
              </InfoBox>
            </div>
          </div>
        )}

        {/* ── SAFETY TAB ── */}
        {activeTab === "fall" && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm text-center">
               <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Safety Score</div>
               <div className="text-6xl font-bold text-amber-500 tracking-tighter">42</div>
               <div className="text-xs font-bold text-amber-600 bg-amber-50 inline-block px-3 py-1 rounded-full mt-2">Moderate Fall Risk</div>
            </div>
            
            <div className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm">
              <SectionTitle className="mt-0 text-center">Safety Trend</SectionTitle>
              <div className="h-44 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyProgress}>
                    <YAxis hide domain={[0, 100]} />
                    <XAxis dataKey="week" hide />
                    <Line type="monotone" dataKey="fallRisk" stroke="#ea4335" strokeWidth={4} dot={{ r: 6, fill: "#ea4335" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ── PAIN TAB ── */}
        {activeTab === "pain" && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm">
              <SectionTitle className="mt-0">Daily Pain Log</SectionTitle>
              <div className="grid grid-cols-5 gap-2 mt-4">
                {[...Array(11).keys()].map((level) => (
                  <button
                    key={level}
                    onClick={() => setPainSelected(level)}
                    className={`h-12 rounded-2xl font-bold transition-all ${
                      painSelected === level
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-100 scale-105"
                        : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900">Level {painSelected}</span>
                <Badge variant={painSelected <= 3 ? "green" : "amber"}>
                  {painSelected <= 3 ? "Manageable" : "Moderate"}
                </Badge>
              </div>
            </div>

            <div className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm">
              <SectionTitle className="mt-0">Pain vs Stability</SectionTitle>
              <div className="h-44 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <XAxis type="number" dataKey="pain" hide />
                    <YAxis type="number" dataKey="symmetry" hide />
                    <Tooltip {...googleTooltip} />
                    <Scatter data={painVsSymmetry} fill="#1a73e8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}