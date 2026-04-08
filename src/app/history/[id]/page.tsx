"use client";
import { useParams, useRouter } from "next/navigation";
import BottomNav from "@/components/Bottomnav";
import {
  Badge,
  InfoBox,
  PressureHeatmap,
  StanceSwingBar,
  ProgressBar,
  SectionTitle,
} from "@/components/GaitUI";
import {
  sessionHistory,
  pressureGridLeft,
  pressureGridRight,
  gctOverSession,
} from "@/lib/mockData";
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

const googleTooltip = {
  contentStyle: {
    background: "#ffffff",
    border: "none",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    fontSize: "12px",
    padding: "12px",
  },
  itemStyle: { color: "#1a73e8", fontWeight: "bold" },
  cursor: { stroke: "#e8eaed", strokeWidth: 2 },
};

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const session = sessionHistory.find((s) => s.id === sessionId) ?? sessionHistory[0];

  const rehabColor =
    session.rehabScore >= 70 ? "text-green-600" : session.rehabScore >= 40 ? "text-amber-500" : "text-red-500";

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-28 font-sans text-[#202124]">
      
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900">Session Report</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
            {session.dateLabel} • {session.duration}
          </p>
        </div>
      </header>

      <main className="px-4 pt-6 space-y-6">
        
        {/* ── Hero Score Card ── */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Rehab Score</span>
              <div className={`text-7xl font-bold tracking-tighter ${rehabColor} mt-1`}>
                {session.rehabScore}
              </div>
              <p className="text-[10px] font-bold text-gray-300 uppercase mt-2">Target Score: 70+</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{session.symmetry}%</div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Symmetry</span>
              <div className="mt-4">
                <Badge variant={session.fallRisk === "Low" ? "green" : "amber"}>
                  {session.fallRisk} Fall Risk
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Discharge Readiness</span>
              <span className="text-xs font-bold text-blue-600">{Math.round((session.rehabScore / 70) * 100)}%</span>
            </div>
            <ProgressBar value={(session.rehabScore / 70) * 100} color="blue" height={10} />
          </div>
        </div>

        {/* ── Quick Metrics Grid ── */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Velocity", value: `${session.speed}`, unit: "m/s", sub: "Goal: 0.8", ok: session.speed >= 0.8 },
            { label: "Ground Time", value: `${session.gct}`, unit: "ms", sub: "Normal Range", ok: true },
            { label: "Pain Level", value: `${session.pain}`, unit: "/10", sub: session.pain <= 3 ? "Mild" : "Moderate", ok: session.pain <= 4 },
            { label: "Steps Taken", value: session.steps.toLocaleString(), unit: "", sub: "Total count", ok: true },
          ].map((m) => (
            <div key={m.label} className="bg-white rounded-[28px] border border-gray-100 p-5 shadow-sm">
              <div className={`text-2xl font-bold ${m.ok ? "text-gray-900" : "text-amber-500"}`}>
                {m.value}
                <span className="text-sm font-medium text-gray-300 ml-1">{m.unit}</span>
              </div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{m.label}</div>
              <div className="text-[9px] font-bold text-gray-300 mt-2 uppercase">{m.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Plantar Pressure Analysis ── */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm">
          <SectionTitle className="mt-0">Pressure Distribution</SectionTitle>
          <div className="grid grid-cols-2 gap-6 mt-6">
            <PressureHeatmap grid={pressureGridLeft} label="Left (OP)" operated />
            <PressureHeatmap grid={pressureGridRight} label="Right" />
          </div>
          <InfoBox className="mt-6">
            Protective offloading detected on the left lateral border. Continue focusing on full heel-to-toe transition.
          </InfoBox>
        </div>

        {/* ── Stance/Swing Ratio ── */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm">
          <SectionTitle className="mt-0">Phase Ratios</SectionTitle>
          <div className="space-y-6 mt-6">
            <StanceSwingBar stancePct={session.stanceLeft} label="Left Leg (Operated)" color="#1a73e8" />
            <StanceSwingBar stancePct={session.stanceRight} label="Right Leg (Control)" color="#dadce0" />
          </div>
          <p className="text-[10px] text-gray-400 font-medium mt-6 text-center italic">
            Target Asymmetry: &lt; 5% • Current: {Math.abs(session.stanceLeft - session.stanceRight)}%
          </p>
        </div>

        {/* ── GCT Continuous Monitoring ── */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Stride Duration (GCT)</span>
            <Badge variant="gray">{session.gct}ms AVG</Badge>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gctOverSession}>
                <CartesianGrid strokeDasharray="6 6" stroke="#f1f3f4" vertical={false} />
                <XAxis dataKey="stride" hide />
                <YAxis domain={[620, 820]} hide />
                <Tooltip {...googleTooltip} />
                <ReferenceLine y={700} stroke="#34a853" strokeDasharray="8 4" strokeWidth={2} />
                <Line
                  type="monotone"
                  dataKey="gct"
                  stroke="#1a73e8"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Clinician Summary ── */}
        <div className="bg-blue-600 rounded-[32px] p-8 text-white shadow-xl shadow-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest opacity-80">Clinician Notes</span>
          </div>
          <p className="text-sm font-medium leading-relaxed opacity-95">
            Patient demonstrates progressive improvement in symmetry. Recommend increasing single-leg stance duration. Pain response is within expected post-op parameters for Week 6.
          </p>
          <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
             <span className="text-[10px] font-bold uppercase tracking-tighter">Dr. Sara George</span>
             <span className="text-[10px] font-bold uppercase opacity-60">{session.dateLabel}</span>
          </div>
        </div>

      </main>
      <BottomNav />
    </div>
  );
}