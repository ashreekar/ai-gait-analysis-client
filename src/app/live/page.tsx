"use client";
import { useState, useEffect } from "react";
import { useGaitSimulation } from "@/lib/hooks/useGaitSimulation"; // Path to your hook
import BottomNav from "@/components/Bottomnav";
import { LiveDot, ProgressBar, Badge, StanceSwingBar } from "@/components/GaitUI";
import { PressureHeatmap } from "@/components/BlendingHeatmap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid
} from "recharts";
import FootstrikeVisualizer from "@/components/Footvisualiser";

export default function LivePage() {
  const [isActive, setIsActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionData, setSessionData] = useState<any[]>([]);
  
  // Using your provided simulation hook
  const liveData = useGaitSimulation(isActive);

  // Capture data points only when recording is active
  useEffect(() => {
    if (isRecording && liveData.history.length > 0) {
      setSessionData(prev => [...prev, liveData.history[liveData.history.length - 1]]);
    }
  }, [liveData.history, isRecording]);

  const handleToggleSession = () => {
    if (!isActive) {
      setIsActive(true);
    } else {
      setIsActive(false);
      setIsRecording(false);
    }
  };

  const handleSaveSession = () => {
    alert(`Session Saved! Recorded ${sessionData.length} data frames.`);
    setIsRecording(false);
    setSessionData([]);
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-24 font-sans text-[#202124]">
      
      {/* ── Dynamic Header ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative">
             <LiveDot/>
             {isActive && <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />}
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight uppercase">
              {isRecording ? "Recording..." : isActive ? "Live Stream" : "Ready to Start"}
            </h1>
            {isRecording && (
              <div className="text-[10px] text-red-500 font-black animate-pulse">
                REC: {(liveData.elapsedTime / 1000).toFixed(1)}s
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          {!isActive ? (
            <button
              onClick={handleToggleSession}
              className="px-6 py-2 bg-blue-600 text-white rounded-full text-xs font-bold shadow-lg shadow-blue-100"
            >
              START SENSORS
            </button>
          ) : (
            <>
              {!isRecording ? (
                <button
                  onClick={() => setIsRecording(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-full text-[10px] font-black tracking-widest"
                >
                  START RECORDING
                </button>
              ) : (
                <button
                  onClick={handleSaveSession}
                  className="px-4 py-2 bg-gray-900 text-white rounded-full text-[10px] font-black tracking-widest"
                >
                  STOP & SAVE
                </button>
              )}
              <button onClick={handleToggleSession} className="p-2 bg-gray-100 rounded-full text-xs">✕</button>
            </>
          )}
        </div>
      </header>

      <main className="px-4 pt-6 space-y-4">
        
        {/* ── Live Telemetry Cards ── */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[32px] p-5 shadow-sm border border-gray-50">
             <div className="text-[9px] font-black text-gray-400 uppercase mb-2">Battery Status</div>
             <div className="flex justify-between items-end gap-4">
                <div className="flex-1">
                  <div className="text-xs font-bold">L: {Math.round(liveData.battery.L)}%</div>
                  <div className="h-1 w-full bg-gray-100 rounded-full mt-1">
                    <div className="h-full bg-green-500 rounded-full" style={{width: `${liveData.battery.L}%`}} />
                  </div>
                </div>
                <div className="flex-1 text-right">
                  <div className="text-xs font-bold">R: {Math.round(liveData.battery.R)}%</div>
                  <div className="h-1 w-full bg-gray-100 rounded-full mt-1">
                    <div className="h-full bg-green-500 rounded-full" style={{width: `${liveData.battery.R}%`}} />
                  </div>
                </div>
             </div>
          </div>
          
          <div className="bg-white rounded-[32px] p-5 shadow-sm border border-gray-50 flex flex-col justify-center items-center">
             <div className="text-[9px] font-black text-gray-400 uppercase mb-1">Active Phase</div>
             <Badge variant={liveData.phase.includes('LEFT') ? 'blue' : 'gray'} className="animate-pulse">
               {liveData.phase}
             </Badge>
          </div>
        </div>

        {/* ── Plantar Heatmap Grid ── */}
        <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm">
          <div className="grid grid-cols-2 gap-12 items-end">
            <PressureHeatmap side="LEFT" grid={liveData.leftPressure} operated={true} />
            <PressureHeatmap side="RIGHT" grid={liveData.rightPressure} />
          </div>
        </div>

        {/* ── Real-time Pressure Stream (Graph) ── */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-gray-800 text-sm">Pressure Distribution (M1)</h4>
            <div className="flex gap-3">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-600"/><span className="text-[10px] font-bold">L</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gray-300"/><span className="text-[10px] font-bold">R</span></div>
            </div>
          </div>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={liveData.history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f4" />
                <YAxis domain={[0, 1024]} hide />
                <Line
                  type="monotone"
                  dataKey="M1_L"
                  stroke="#1a73e8"
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="M1_R"
                  stroke="#dadce0"
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <FootstrikeVisualizer/>
        
        {/* ── Live Performance Indicators ── */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm">
           <div className="flex justify-between items-end mb-4">
              <div>
                 <div className="text-3xl font-black text-gray-900">{Math.round(liveData.symmetry)}%</div>
                 <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Real-time Symmetry</div>
              </div>
              <div className="text-right">
                 <Badge variant="green">OPTIMAL</Badge>
              </div>
           </div>
           <ProgressBar value={liveData.symmetry} color="blue" height={10} />
        </div>

      </main>
      <BottomNav />
    </div>
  );
}