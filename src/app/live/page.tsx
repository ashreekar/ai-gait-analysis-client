"use client";
import { useEffect, useState } from "react";
import BottomNav from "@/components/Bottomnav";
import {
  LiveDot,
  StanceSwingBar,
  ProgressBar,
  Badge,
} from "@/components/GaitUI";
import { pressureGridLeft, pressureGridRight } from "@/lib/mockData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
} from "recharts";
import {PressureHeatmap} from "@/components/BlendingHeatmap"

// --- Google Style Tooltip ---
const googleTooltip = {
  contentStyle: {
    background: "#ffffff",
    border: "none",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    fontSize: "10px",
    fontWeight: "bold",
  },
  cursor: { stroke: "#e8eaed", strokeWidth: 2 },
};

export default function LivePage() {
  const [running, setRunning] = useState(true);
  const [sym, setSym] = useState(68);
  const [speed, setSpeed] = useState(0.71);
  const [stanceL, setStanceL] = useState(712);
  const [stanceR, setStanceR] = useState(664);
  const [stancePct, setStancePct] = useState(68);
  const [gctHistory, setGctHistory] = useState<{ stride: number; gct: number }[]>([]);
  const [hmLeft, setHmLeft] = useState(pressureGridLeft);
  const [hmRight, setHmRight] = useState(pressureGridRight);
  const [steps, setSteps] = useState(0);

  // Live Simulation Logic
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSym(Math.round(62 + Math.random() * 14));
      setSpeed(parseFloat((0.65 + Math.random() * 0.13).toFixed(2)));
      setStanceL(Math.round(700 + Math.random() * 80));
      setStanceR(Math.round(640 + Math.random() * 60));
      setStancePct(Math.round(65 + Math.random() * 7));
      setHmLeft(generateHeatmap(true));
      setHmRight(generateHeatmap(false));
      setSteps((s) => s + 1);
    }, 1500);
    return () => clearInterval(id);
  }, [running]);

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-24 font-sans text-[#202124]">
      
      {/* ── Google Style Live Header ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative">
             <LiveDot />
             <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
          </div>
          <h1 className="text-lg font-bold tracking-tight">Active Session</h1>
        </div>
        <button
          onClick={() => setRunning(!running)}
          className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
            running 
              ? "bg-red-50 text-red-600 border border-red-100" 
              : "bg-green-600 text-white shadow-lg shadow-green-100"
          }`}
        >
          {running ? "PAUSE" : "RESUME"}
        </button>
      </header>

      <main className="px-4 pt-6 space-y-4">
        
        {/* ── Status Bar ── */}
        <div className="flex items-center justify-between px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            {steps} Total Steps
          </div>
          <div>Right TKR • Day 42</div>
        </div>

        {/* ── Digital Twin Heatmaps ── */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-8 text-center">
    Clinical Plantar Pressure Analysis
  </div>
  
  <div className="grid grid-cols-2 gap-8 items-end">
    {/* hmLeft and hmRight should be objects with keys T1, T2...MH, LH */}
    <PressureHeatmap side="LEFT" grid={hmLeft} operated={true} />
    <PressureHeatmap side="RIGHT" grid={hmRight} />
  </div>

  {/* Legend */}
  <div className="mt-10 pt-6 border-t border-gray-50">
    <div className="flex items-center gap-3">
       <span className="text-[9px] font-bold text-gray-400 uppercase">Min</span>
       <div className="flex-1 h-1.5 rounded-full bg-gradient-to-r from-blue-500 via-green-500 via-amber-500 to-red-500" />
       <span className="text-[9px] font-bold text-gray-400 uppercase">Peak</span>
    </div>
    <p className="text-[10px] text-gray-400 text-center mt-4 italic font-medium">
      Tap any sensor node to view live PSI history
    </p>
  </div>
</div>

        {/* ── Symmetry Grid ── */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[28px] border border-gray-100 p-5 shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-1">{sym}%</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Symmetry Index</div>
            <div className="mt-3">
              <ProgressBar value={sym} color="blue" height={6} />
            </div>
          </div>
          <div className="bg-white rounded-[28px] border border-gray-100 p-5 shadow-sm">
            <div className={`text-3xl font-bold mb-1 ${100-sym > 15 ? 'text-red-500' : 'text-gray-900'}`}>
              {100 - sym}%
            </div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Asymmetry</div>
            {100-sym > 15 && <Badge variant="red" className="mt-2 text-[8px]">ADJUST GAIT</Badge>}
          </div>
        </div>

        {/* ── Ground Contact Time (Real-time Stream) ── */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">GCT Telemetry</span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">AVG: {stanceL}ms</span>
          </div>
          <div className="h-28 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gctHistory}>
                <YAxis domain={[600, 900]} hide />
                <Tooltip {...googleTooltip} />
                <ReferenceLine y={720} stroke="#e8eaed" strokeWidth={2} />
                <Line
                  type="stepAfter"
                  dataKey="gct"
                  stroke="#1a73e8"
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Stance/Swing Ratios ── */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm">
           <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Phase Distribution</div>
           <div className="space-y-4">
              <StanceSwingBar stancePct={stancePct} label="Left (Operated)" color="#1a73e8" />
              <StanceSwingBar stancePct={61} label="Right (Control)" color="#dadce0" />
           </div>
           <div className="mt-5 p-3 bg-blue-50/50 rounded-2xl border border-blue-100/50 text-[10px] text-blue-700 leading-relaxed font-medium">
              Operated leg is showing <span className="font-bold">protective extension</span>. Aim for a 62% stance threshold.
           </div>
        </div>

        {/* ── Speed Tracking ── */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold text-gray-900 tracking-tighter">
                {speed} <span className="text-sm font-medium text-gray-300">m/s</span>
              </div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Walking Speed</div>
            </div>
            <div className="w-24">
              <ProgressBar value={(speed/1.2)*100} color="green" height={8} />
              <div className="text-[8px] font-bold text-gray-300 mt-2 text-center uppercase tracking-tighter">Target 0.8 m/s</div>
            </div>
          </div>
        </div>

      </main>
      <BottomNav />
    </div>
  );
}

// Helper for live heatmap variance
function generateHeatmap(operated: boolean) {
  const base = operated ? 20 : 60;
  return Array.from({ length: 4 }, () => 
    Array.from({ length: 4 }, () => Math.round(base + Math.random() * 30))
  );
}