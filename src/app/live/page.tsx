"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, Square, Save, Moon, Battery, 
  ShieldCheck, AlertTriangle, Timer, Activity, Zap 
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip, XAxis, CartesianGrid } from 'recharts';
import { useGaitSimulation } from '@/lib/hooks/useGaitSimulation';
import { BlendingHeatmap } from '@/components/BlendingHeatmap';

const footRegions = [
  { id: "T1", name: "Hallux", color: "#58CC02" }, { id: "T2", name: "Toe 2", color: "#58CC02" },
  { id: "T3", name: "Toe 3", color: "#58CC02" }, { id: "T4", name: "Toe 4", color: "#58CC02" },
  { id: "T5", name: "Toe 5", color: "#58CC02" }, { id: "M1", name: "Met 1", color: "#1CB0F6" },
  { id: "M2", name: "Met 2", color: "#1CB0F6" }, { id: "M3", name: "Met 3", color: "#1CB0F6" },
  { id: "M4", name: "Met 4", color: "#1CB0F6" }, { id: "M5", name: "Met 5", color: "#1CB0F6" },
  { id: "MM", name: "Med Mid", color: "#FFC800" }, { id: "CM", name: "Cent Mid", color: "#FFC800" },
  { id: "LM", name: "Lat Mid", color: "#FFC800" }, { id: "MH", name: "Med Heel", color: "#FF4B4B" },
  { id: "CH", name: "Cent Heel", color: "#FF4B4B" }, { id: "LH", name: "Lat Heel", color: "#FF4B4B" }
];

export default function LiveSession() {
  const [isRunning, setIsRunning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSleep, setIsSleep] = useState(false);
  const gait = useGaitSimulation(isRunning);

  // Format milliseconds to MM:SS:mmm
  const formatTime = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const mmm = ms % 1000;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${mmm.toString().padStart(3, '0')}`;
  };

  return (
    <div className={`min-h-screen bg-[#F7F7F7] p-6 pt-22 transition-all duration-1000 ${isSleep ? 'brightness-50 grayscale scale-[0.98]' : ''}`}>
      
      {/* 1. STATUS HEADER */}
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="duo-card flex items-center gap-4">
           <div className="bg-duo-blue/10 p-3 rounded-2xl text-duo-blue"><Timer size={24}/></div>
           <div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Session Time</p>
             <p className="text-xl font-black text-duo-text font-mono">{formatTime(gait.elapsedTime)}</p>
           </div>
        </div>

        <div className="duo-card flex items-center justify-between">
           <div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gait Phase</p>
             <p className="text-xl font-black text-duo-blue italic uppercase">{gait.phase}</p>
           </div>
           <Zap className={isRunning ? "text-duo-orange fill-duo-orange animate-pulse" : "text-gray-200"} />
        </div>

        <div className="duo-card flex flex-col justify-center">
           <div className="flex justify-between text-[10px] font-black text-gray-400 mb-1">
             <span>SYMMETRY</span>
             <span>{gait.symmetry?.toFixed(1)}%</span>
           </div>
           <div className="h-3 w-full bg-duo-gray rounded-full overflow-hidden">
             <motion.div animate={{ width: `${gait.symmetry}%` }} className="h-full bg-duo-green" />
           </div>
        </div>

        <div className={`duo-card flex items-center justify-between border-b-4 ${gait.fallRisk === 'Low' ? 'border-duo-green' : 'border-duo-red'}`}>
           <p className={`font-black tracking-widest text-xs ${gait.fallRisk === 'Low' ? 'text-duo-green' : 'text-duo-red'}`}>
             {gait.fallRisk?.toUpperCase()} RISK
           </p>
           {gait.fallRisk === 'Low' ? <ShieldCheck className="text-duo-green"/> : <AlertTriangle className="text-duo-red"/>}
        </div>
      </div>

      {/* 2. ANALYTICS GRID */}
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT GRAPH */}
        <div className="h-[400px] lg:col-span-3 duo-card overflow-hidden flex flex-col">
          {/* Header: Internalized to the card padding */}
          <div className="pt-4 px-4 flex justify-between items-end">
            <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">
              Left_Foot_16CH_PSI
            </p>
          </div>

          {/* Graph Container: Fills the remaining space with zero extra padding */}
          <div className="flex-1 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={gait.history}
                /* Crucial: Negative left margin hides the dead space. 
                   Bottom 5 margin ensures the X-axis timestamps aren't cut off.
                */
                margin={{ top: 10, right: 0, left: -25, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F0F0F0"
                />

                <XAxis
                  dataKey="displayTime"
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                  /* dy={-15} keeps the time inside the grid area */
                  tick={{ fontSize: 9, fontWeight: 900, fill: '#CCC', fontFamily: 'monospace' }}
                // dy={-15} 
                />

                <YAxis
                  domain={[0, 1024]}
                  axisLine={false}
                  tickLine={false}
                  /* dx={40} pushes the PSI numbers inside the grid lines */
                  tick={{ fontSize: 9, fontWeight: 900, fill: '#CCC', fontFamily: 'monospace' }}
                // dx={40} 
                />

                {footRegions.map(r => (
                  <Line
                    key={r.id}
                    type="monotone"
                    dataKey={`${r.id}_L`}
                    stroke={r.color}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                    strokeOpacity={0.8}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CENTER HEATMAP */}
        <div className="lg:col-span-6 duo-card flex flex-col items-center justify-center relative bg-white">
           <div className="flex justify-around w-full items-center">
              <div className="flex flex-col items-center gap-2">
                <Battery className="text-duo-green" size={20}/>
                <span className="text-[10px] font-bold text-gray-400">{gait.battery.L.toFixed(0)}%</span>
                <BlendingHeatmap side="LEFT" pressureData={gait.leftPressure} isActive={isRunning} regions={footRegions} />
              </div>

              <div className="h-48 w-[2px] bg-duo-gray rounded-full opacity-50" />

              <div className="flex flex-col items-center gap-2">
                <Battery className="text-duo-green" size={20}/>
                <span className="text-[10px] font-bold text-gray-400">{gait.battery.R.toFixed(0)}%</span>
                <BlendingHeatmap side="RIGHT" pressureData={gait.rightPressure} isActive={isRunning} regions={footRegions} />
              </div>
           </div>
        </div>

        {/* RIGHT GRAPH */}
        <div className="h-[400px] lg:col-span-3 duo-card overflow-hidden flex flex-col">
          {/* Header: Internalized to the card padding */}
          <div className="pt-4 px-4 flex justify-between items-end">
            <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">
              RIGHT_FOOT_16CH
            </p>
          </div>

          {/* Graph Container: Fills the remaining space with zero extra padding */}
          <div className="flex-1 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={gait.history}
                /* Crucial: Negative left margin hides the dead space. 
                   Bottom 5 margin ensures the X-axis timestamps aren't cut off.
                */
                margin={{ top: 10, right: 0, left: -25, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F0F0F0"
                />

                <XAxis
                  dataKey="displayTime"
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                  /* dy={-15} keeps the time inside the grid area */
                  tick={{ fontSize: 9, fontWeight: 900, fill: '#CCC', fontFamily: 'monospace' }}
                // dy={-15} 
                />

                <YAxis
                  domain={[0, 1024]}
                  axisLine={false}
                  tickLine={false}
                  /* dx={40} pushes the PSI numbers inside the grid lines */
                  tick={{ fontSize: 9, fontWeight: 900, fill: '#CCC', fontFamily: 'monospace' }}
                // dx={40} 
                />

                {footRegions.map(r => (
                  <Line
                    key={r.id}
                    type="monotone"
                    dataKey={`${r.id}_R`}
                    stroke={r.color}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                    strokeOpacity={0.8}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. DYNAMIC CONTROL ISLAND */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
         <div className="flex items-center gap-4 bg-white border-2 border-duo-gray rounded-full p-3 shadow-2xl">
            <button 
              onClick={() => setIsRunning(!isRunning)}
              className={`duo-btn-3d flex items-center gap-3 px-10 py-3 text-white transition-all
                ${isRunning ? 'bg-duo-red border-red-700' : 'bg-duo-green border-duo-green-dark'}`}
            >
              {isRunning ? <Square size={18} fill="white"/> : <Play size={18} fill="white"/>}
              <span>{isRunning ? 'STOP' : 'START'}</span>
            </button>

            <div className="h-8 w-[2px] bg-duo-gray mx-1" />

            <button 
              onClick={() => setIsRecording(!isRecording)}
              className={`p-3 rounded-2xl transition-all ${isRecording ? 'bg-duo-blue text-white border-b-4 border-duo-blue-dark animate-pulse' : 'text-gray-400 hover:bg-gray-100'}`}
            >
              <Save size={24} />
            </button>

            <button 
              onClick={() => setIsSleep(!isSleep)}
              className="p-3 rounded-2xl text-gray-400 hover:bg-gray-100"
            >
              <Moon size={24} fill={isSleep ? "currentColor" : "none"} />
            </button>
         </div>
      </div>

    </div>
  );
}