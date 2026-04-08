"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import BottomNav from "@/components/Bottomnav";
import RadarChart from "@/components/Radarchart";
import {
  Badge,
  LiveDot,
  MetricCard,
  SectionTitle,
  ProgressBar,
  DischargeProgress,
} from "@/components/GaitUI";
import {
  currentMetrics,
  patientProfile,
  radarData,
  weeklyProgress,
  exercises,
} from "@/lib/mockData";
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
} from "recharts";

// --- Clinical Utility ---
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

const googleTooltip = {
  contentStyle: {
    background: "#ffffff",
    border: "none",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    fontSize: "12px",
    padding: "10px 14px",
  },
  itemStyle: { color: "#1a73e8", fontWeight: "bold" },
  cursor: { stroke: "#e8eaed", strokeWidth: 2 },
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [metrics, setMetrics] = useState(currentMetrics);
  const [bleConnected] = useState(true);

  // Live Telemetry Simulation (Symmetry & Speed)
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        symmetryIndex: Math.round(70 + Math.random() * 5),
        walkingSpeed: parseFloat((0.72 + Math.random() * 0.05).toFixed(2)),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const firstName = session?.user?.name?.split(" ")[0] ?? patientProfile.name.split(" ")[0];
  const completedExercises = exercises.filter((e) => e.completed).length;

  // Data for Stance vs Swing Phase Comparison (Graph 6)
  const gaitCycleData = [
    { name: "Left (Op)", stance: metrics.stanceLeft, swing: metrics.swingLeft },
    { name: "Right", stance: metrics.stanceRight, swing: metrics.swingRight },
  ];
  const stepVariance = ((metrics.stepLengthRight - metrics.stepLengthLeft) / metrics.stepLengthRight * 100).toFixed(1);

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-28 font-sans antialiased text-[#202124] w-full">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 px-6 py-6 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
            {patientProfile.initials}
          </div>
          <div>
            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-none mb-1">
              {getGreeting()}
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Hey, {firstName}</h1>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <LiveDot />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${bleConnected ? 'text-green-600' : 'text-red-500'}`}>
              {bleConnected ? "Sensor Active" : "Offline"}
            </span>
          </div>
          <div className="text-[10px] font-medium text-gray-400 mt-1">
            Week {patientProfile.postOpWeek} • {patientProfile.surgeryShort}
          </div>
        </div>
      </header>

      <main className="px-4 pt-6 space-y-6">

        {/* ── Hero: Recovery Score & Radar (Graph 8) ── */}
        <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex justify-between gap-4">
            <div className="space-y-2 flex-1">
              <SectionTitle className="mt-0 ml-0">Recovery Score</SectionTitle>
              <div className="text-7xl font-bold text-blue-600 tracking-tighter">
                {metrics.rehabScore}<span className="text-2xl text-gray-200 font-medium">/100</span>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Badge variant="green">↗ {metrics.rehabTrend} Improved</Badge>
              </div>
            </div>
            <div className="bg-gray-50 rounded-[24px] p-2 flex items-center justify-center">
              <RadarChart data={radarData} size={130} />
            </div>
          </div>
          <div className="mt-8">
            <div className="flex justify-between text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-widest">
              <span>Discharge Readiness</span>
              <span className="text-blue-600">{metrics.rehabScore}%</span>
            </div>
            <ProgressBar value={metrics.rehabScore} color="blue" height={10} />
          </div>
        </div>

        {/* ── Telemetry Grid ── */}
        <SectionTitle>Live Gait Telemetry</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <MetricCard
            label="Symmetry Index"
            value={metrics.symmetryIndex}
            unit="%"
            progress={metrics.symmetryIndex}
            progressColor="blue"
          />
          <MetricCard
            label="Walking Velocity"
            value={metrics.walkingSpeed}
            unit="m/s"
            progress={(metrics.walkingSpeed / 1.2) * 100}
            progressColor="green"
          />
          <MetricCard
            label="Gait Asymmetry"
            value={metrics.asymmetry}
            unit="%"
            progressColor="red"
          />
          <MetricCard
            label="Fall Risk"
            value={metrics.fallRisk}
            badge={{ text: "MODERATE", variant: "yellow" }}
          />

          {/* Daily Step Count Card */}
          <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-bold text-gray-800 tracking-tight">Total Steps</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                  Daily Activity
                </p>
              </div>
              <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-xl">
                👟
              </div>
            </div>

            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-5xl font-black text-gray-900 tracking-tighter">
                {metrics?.dailySteps?.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                / {metrics?.stepGoal?.toLocaleString()}
              </span>
            </div>

            <div className="mt-6">
              <ProgressBar
                value={(metrics.dailySteps / metrics.stepGoal) * 100}
                color="orange"
                height={12}
              />
              <div className="flex justify-between mt-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {((metrics?.dailySteps / metrics?.stepGoal) * 100).toFixed(0)}% of goal reached
                </span>
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">
                  {metrics?.stepGoal - metrics?.dailySteps} left
                </span>
              </div>
            </div>
          </div>

          {/* Pronation / Foot Strike Card */}
          <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="font-bold text-gray-800 tracking-tight">Foot Pronation</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                  Dynamic Eversion Angle
                </p>
              </div>
              <div className="text-right">
                <Badge variant={metrics.pronationLeft > 8 ? "amber" : "green"}>
                  {metrics.pronationLeft > 8 ? "Overpronating" : "Neutral"}
                </Badge>
              </div>
            </div>

            <div className="relative h-24 flex items-end justify-center gap-8 mb-4">
              {/* Left Foot Visualizer */}
              <div className="flex flex-col items-center">
                <div className="relative w-12 h-16 bg-gray-50 rounded-lg border-b-4 border-blue-600 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600" style={{ transform: `rotate(${metrics.pronationLeft}deg)` }}>
                    L
                  </span>
                </div>
                <span className="text-[10px] font-bold mt-2 text-gray-900">{metrics.pronationLeft}°</span>
                <span className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter">Operated</span>
              </div>

              {/* Right Foot Visualizer */}
              <div className="flex flex-col items-center">
                <div className="relative w-12 h-16 bg-gray-50 rounded-lg border-b-4 border-gray-300 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-400" style={{ transform: `rotate(${metrics.pronationRight}deg)` }}>
                    R
                  </span>
                </div>
                <span className="text-[10px] font-bold mt-2 text-gray-900">{metrics.pronationRight}°</span>
                <span className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter">Healthy</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-3">
              <div className="flex justify-between text-[9px] font-bold text-gray-400 mb-1 uppercase">
                <span>Supination</span>
                <span>Neutral</span>
                <span>Pronation</span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 rounded-full relative">
                {/* Indicator for Left Foot */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-sm transition-all duration-700"
                  style={{ left: `${(metrics.pronationLeft / 15) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step Length Analysis Card */}
        <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="font-bold text-gray-800 tracking-tight">Step Length</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                Clinical Goal: {metrics.stepLengthTarget}m
              </p>
            </div>
            <Badge variant={metrics.stepLengthLeft < 0.45 ? "amber" : "green"}>
              {metrics.stepLengthLeft < 0.45 ? "Shortened" : "Normal"}
            </Badge>
          </div>

          <div className="space-y-5">
            {/* Left Leg (Operated) */}
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-blue-600 uppercase">Left (Operated)</span>
                <span className="text-gray-900">{metrics.stepLengthLeft}m</span>
              </div>
              <ProgressBar
                value={(metrics.stepLengthLeft / metrics.stepLengthTarget) * 100}
                color="blue"
                height={8}
              />
            </div>

            {/* Right Leg */}
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-gray-400 uppercase">Right (Healthy)</span>
                <span className="text-gray-900">{metrics.stepLengthRight}m</span>
              </div>
              <ProgressBar
                value={(metrics.stepLengthRight / metrics.stepLengthTarget) * 100}
                color="gray"
                height={8}
              />
            </div>
          </div>



          {/* Technical Tooltip/Insight */}
          <div className="mt-6 pt-4 border-t border-gray-50 flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-[10px]">i</div>
            <p className="text-[10px] text-gray-500 leading-tight">
              Calculated via <b>IMU Double Integration</b>. Target adjusted for height ({patientProfile.height}cm).
            </p>
          </div>
        </div>

        {/* Stride Length Efficiency Card */}
        <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm relative overflow-hidden">
          {/* Background Decorative Element */}
          <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-blue-50 rounded-full opacity-50 z-0" />

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-gray-800 tracking-tight">Stride Length</h4>
              <div className="px-2 py-1 bg-blue-100 rounded-lg text-[10px] font-bold text-blue-700">
                EFFICIENCY
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-gray-900 tracking-tighter">
                {metrics.strideLength}
              </span>
              <span className="text-lg font-bold text-gray-400">meters</span>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                <span>Gait Extension</span>
                <span>Target: {metrics.strideLengthTarget}m</span>
              </div>

              {/* Visual Track */}
              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-blue-600 transition-all duration-1000 ease-out"
                  style={{ width: `${(metrics.strideLength / metrics.strideLengthTarget) * 100}%` }}
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-50 pt-4">
                <div>
                  <div className="text-[9px] font-bold text-gray-400 uppercase">Frequency</div>
                  <div className="text-sm font-bold text-gray-800">{metrics.strideFrequency} strides/min</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold text-gray-400 uppercase">Vs. Baseline</div>
                  <div className="text-sm font-bold text-green-600">+{((metrics.strideLength - 0.85) / 0.85 * 100).toFixed(0)}% Progress</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ground Contact Time (GCT) - The Hesitation Metric */}
<div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm overflow-hidden relative">
  <div className="flex justify-between items-start mb-6">
    <div>
      <h4 className="font-bold text-gray-800 tracking-tight">Ground Contact Time</h4>
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
        Heel Strike to Toe Off
      </p>
    </div>
    <div className="bg-blue-50 px-3 py-1 rounded-full">
       <span className="text-[10px] font-black text-blue-600 uppercase">Winter's Biomechanics</span>
    </div>
  </div>

  <div className="flex items-center justify-between gap-4 mb-8">
    {/* Left Leg Block */}
    <div className="flex-1">
      <div className="text-[10px] font-bold text-blue-600 uppercase mb-1">Left (Op)</div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-black text-gray-900">{metrics.gctLeft}</span>
        <span className="text-xs font-bold text-gray-400">ms</span>
      </div>
      <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600" 
          style={{ width: `${(metrics.gctLeft / 1000) * 100}%` }} 
        />
      </div>
    </div>

    {/* Center "Gap" Indicator */}
    <div className="flex flex-col items-center justify-center px-4 border-x border-gray-50">
      <div className="text-[10px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded">
        +{metrics.gctLeft - metrics.gctRight}ms
      </div>
      <div className="text-[8px] font-bold text-gray-400 uppercase mt-1">Gap</div>
    </div>

    {/* Right Leg Block */}
    <div className="flex-1 text-right">
      <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Right</div>
      <div className="flex items-baseline justify-end gap-1">
        <span className="text-3xl font-black text-gray-900">{metrics.gctRight}</span>
        <span className="text-xs font-bold text-gray-400">ms</span>
      </div>
      <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gray-300 ml-auto" 
          style={{ width: `${(metrics.gctRight / 1000) * 100}%` }} 
        />
      </div>
    </div>
  </div>

  {/* Status & Insight */}
  <div className={`rounded-2xl p-4 flex items-center gap-3 ${metrics.gctLeft > 750 ? 'bg-orange-50' : 'bg-green-50'}`}>
    <div className="text-xl">
      {metrics.gctLeft > 750 ? "⚠️" : "✅"}
    </div>
    <div>
      <div className={`text-[11px] font-bold ${metrics.gctLeft > 750 ? 'text-orange-700' : 'text-green-700'}`}>
        {metrics.gctLeft > 750 ? "Hesitation Detected" : "Efficient Loading"}
      </div>
      <p className="text-[9px] text-gray-500 leading-tight mt-0.5">
        {metrics.gctLeft > 750 
          ? "You're spending 22% more time on your operated leg. Focus on a faster toe-off." 
          : "Your contact time is stabilizing toward the 600-700ms normal range."}
      </p>
    </div>
  </div>
</div>

        {/* Pronation / Foot Strike Card */}
        {/* Pronation Index (Pressure Ratio) */}
        <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-bold text-gray-800 tracking-tight">Pronation Index</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                Medial vs. Lateral Loading
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-blue-600 leading-none">
                {metrics.pronationIndex}%
              </div>
              <div className="text-[9px] font-bold text-gray-400 mt-1 uppercase">Index Value</div>
            </div>
          </div>

          {/* Clinical Classification Bar */}
          <div className="mt-6">
            <div className="h-3 w-full flex rounded-full overflow-hidden bg-gray-100 mb-2">
              {/* Supination Zone <5% */}
              <div className="h-full w-[15%] bg-yellow-400 opacity-30 border-r border-white" />
              {/* Neutral Zone 5-15% */}
              <div className="h-full w-[35%] bg-green-500 opacity-30 border-r border-white" />
              {/* Over-pronation Zone >15% */}
              <div className="h-full flex-1 bg-red-500 opacity-30" />
            </div>

            {/* Dynamic Indicator */}
            <div className="relative w-full h-4">
              <div
                className="absolute top-0 flex flex-col items-center transition-all duration-1000 ease-in-out"
                style={{ left: `${Math.min(metrics.pronationIndex * 2, 100)}%`, transform: 'translateX(-50%)' }}
              >
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-gray-800" />
                <span className="text-[9px] font-black text-gray-800 mt-1">CURRENT</span>
              </div>
            </div>
          </div>

          {/* Classification Tags */}
          <div className="grid grid-cols-3 gap-1 mt-4 text-center">
            <div className={`p-2 rounded-xl border ${metrics.pronationIndex < 5 ? 'bg-yellow-50 border-yellow-200' : 'border-transparent'}`}>
              <div className="text-[8px] font-bold text-gray-400">SUPINATION</div>
              <div className="text-[9px] font-bold text-gray-600">5%</div>
            </div>
            <div className={`p-2 rounded-xl border ${metrics.pronationIndex >= 5 && metrics.pronationIndex <= 15 ? 'bg-green-50 border-green-200' : 'border-transparent'}`}>
              <div className="text-[8px] font-bold text-gray-400">NEUTRAL</div>
              <div className="text-[9px] font-bold text-gray-600">5-15%</div>
            </div>
            <div className={`p-2 rounded-xl border ${metrics.pronationIndex > 15 ? 'bg-red-50 border-red-200' : 'border-transparent'}`}>
              <div className="text-[8px] font-bold text-gray-400">OVER</div>
              <div className="text-[9px] font-bold text-gray-600">15%</div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-50">
            <p className="text-[9px] text-gray-400 leading-tight italic">
              Source: Razeghi & Batt. Index measures medial arch pressure dominance.
            </p>
          </div>
        </div>

        {/* ── Trend Analysis: Symmetry (Graph 1) ── */}
        <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-gray-800 tracking-tight">Symmetry Progress</h4>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Post-Op Timeline</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyProgress}>
                <defs>
                  <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a73e8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1a73e8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f4" />
                <XAxis
                  dataKey="week"
                  tick={{ fill: "#9aa0a6", fontSize: 10, fontWeight: "bold" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `W${v}`}
                />
                <YAxis hide domain={[40, 100]} />
                <Tooltip {...googleTooltip} />
                <ReferenceLine
                  y={85}
                  stroke="#34a853"
                  strokeDasharray="6 6"
                  label={{ value: 'DISCHARGE GOAL', position: 'insideTopRight', fill: '#34a853', fontSize: 9, fontWeight: 'bold' }}
                />
                <Area
                  type="monotone"
                  dataKey="symmetry"
                  stroke="#1a73e8"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorBlue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Stance/Swing Comparison (Graph 6) ── */}
        <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-gray-800 tracking-tight">Gait Cycle Distribution</h4>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Session</span>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gaitCycleData} layout="vertical" barSize={32} margin={{ left: 20 }}>
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} />
                <Tooltip {...googleTooltip} />
                <Bar dataKey="stance" stackId="a" fill="#1a73e8" radius={[4, 0, 0, 4]} />
                <Bar dataKey="swing" stackId="a" fill="#e8f0fe" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2 justify-center">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-600" /> <span className="text-[10px] font-bold text-gray-500">STANCE</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-100" /> <span className="text-[10px] font-bold text-gray-500">SWING</span></div>
          </div>
        </div>

        {/* Interactive Rehab Progress Hero Card - Fixed Visibility */}
<div className="group relative bg-white border border-gray-100 rounded-[40px] p-8 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 cursor-default overflow-hidden">
  
  {/* Background Glow */}
  <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

  <div className="relative z-10">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h3 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em]">Overall Recovery</h3>
        <p className="text-xs text-gray-400 font-bold mt-1">Composite Rehab Index (CRI)</p>
      </div>
      <div className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
        metrics.rehabScore >= 70 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
      }`}>
        {metrics.rehabScore >= 70 ? 'Advanced Phase' : 'Moderate Progress'}
      </div>
    </div>

    <div className="flex items-end gap-6 mb-8">
      <div className="text-8xl font-black text-gray-900 tracking-tighter transition-transform group-hover:scale-105 duration-500">
        {Math.round(metrics.rehabScore)}
      </div>
      <div className="mb-4">
        <div className="text-xl font-bold text-gray-200">/ 100</div>
        <div className="flex items-center gap-1 text-green-600 font-bold text-sm">
          <span>↗ 12%</span>
        </div>
      </div>
    </div>

    {/* Section 2: Component Breakdown (The "Pull-up" Drawer) */}
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Formula Weights</span>
        <div className="flex gap-1.5">
          <div className="h-1.5 w-6 rounded-full bg-blue-600" />
          <div className="h-1.5 w-6 rounded-full bg-blue-400" />
          <div className="h-1.5 w-6 rounded-full bg-blue-300" />
          <div className="h-1.5 w-6 rounded-full bg-blue-200" />
        </div>
      </div>

      {/* Grid with explicit heights to prevent clipping */}
      <div className="grid grid-cols-2 gap-3 transition-all duration-500 ease-in-out">
        {[
          { label: "Symmetry", val: metrics.symmetry, weight: "30%", color: "bg-blue-600" },
          { label: "Stance Ratio", val: metrics.stanceRatio, weight: "20%", color: "bg-blue-400" },
          { label: "Pain Relief", val: metrics.painIndex, weight: "20%", color: "bg-blue-300" },
          { label: "Velocity", val: metrics.speedRatio, weight: "30%", color: "bg-blue-200" },
        ].map((comp) => (
          <div 
            key={comp.label} 
            className="bg-gray-50/50 group-hover:bg-white group-hover:shadow-md group-hover:border-blue-50 border border-transparent rounded-[24px] p-4 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">{comp.label}</span>
              <span className="text-[8px] font-bold text-blue-500">{comp.weight}</span>
            </div>
            <div className="text-xl font-black text-gray-800">{comp.val}%</div>
            <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
               <div 
                 className={`h-full ${comp.color} transition-all duration-1000 delay-300`} 
                 style={{ width: `${comp.val}%` }} 
               />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Interpretation Footer */}
    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-4">
      <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-xl shadow-lg">
        {metrics.rehabScore >= 70 ? '🚀' : '🚶‍♂️'}
      </div>
      <div className="flex-1">
        <div className="text-xs font-bold text-gray-900 uppercase">Status Report</div>
        <p className="text-[10px] text-gray-500 leading-tight mt-1">
          {metrics.rehabScore >= 70 
            ? "Metrics exceed standard recovery thresholds for this week." 
            : "Continue stability drills. Pain index is the current limiting factor."}
        </p>
      </div>
    </div>
  </div>
</div>

        {/* ── Recovery Protocols (Discharge Criteria) ── */}
        <SectionTitle>Discharge Protocols</SectionTitle>
        <div className="grid gap-4">
          <DischargeProgress
            label="Min Walking Speed"
            current={metrics.walkingSpeed}
            target={patientProfile.targetSpeed}
            unit=" m/s"
            color="green"
          />
          <DischargeProgress
            label="Symmetry Index"
            current={metrics.symmetryIndex}
            target={patientProfile.targetSymmetry}
            unit="%"
            color="blue"
          />
        </div>

        {/* ── Daily Exercise Modules ── */}
        <div className="flex justify-between items-center px-2">
          <SectionTitle className="mt-0">Physio Modules</SectionTitle>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
            {completedExercises} OF {exercises.length} COMPLETE
          </span>
        </div>

        <div className="space-y-3">
          {exercises.map((ex) => (
            <div
              key={ex.id}
              className={`flex items-center gap-4 p-5 rounded-[24px] border transition-all ${ex.completed
                ? "bg-green-50 border-green-100"
                : "bg-white border-gray-100 shadow-sm"
                }`}
            >
              <div className={`text-2xl w-12 h-12 flex items-center justify-center rounded-2xl ${ex.completed ? "bg-white" : "bg-gray-50"}`}>
                {ex.icon}
              </div>
              <div className="flex-1">
                <div className={`font-bold ${ex.completed ? "text-green-700" : "text-gray-900"}`}>
                  {ex.name}
                </div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                  {ex.sets} SETS • {ex.target}
                </div>
              </div>
              {ex.completed && (
                <div className="bg-green-500 rounded-full p-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Clinical Timeline ── */}
        <SectionTitle>Clinical Log</SectionTitle>
        <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm mb-6">
          {[
            { label: "Lead Surgeon", value: patientProfile.clinician },
            { label: "Protocol", value: patientProfile.surgeryShort },
            { label: "Pain Level", value: `${metrics.painScore}/10`, color: "text-red-500" },
            { label: "Cadence", value: `${metrics.cadence} steps/min` },
          ].map((row, i, arr) => (
            <div
              key={row.label}
              className={`flex justify-between items-center px-6 py-5 ${i < arr.length - 1 ? "border-b border-gray-50" : ""
                }`}
            >
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                {row.label}
              </span>
              <span className={`text-sm font-bold ${row.color || "text-gray-900"}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}