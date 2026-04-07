"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Square, Save, Moon, Battery, 
  AlertTriangle, ShieldCheck, Zap, Activity 
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';
import { useGaitSimulation } from '@/lib/hooks/useGaitSimulation';
import { BlendingHeatmap } from '@/components/BlendingHeatmap';

const footRegions = [
  // TOES (Duo Green - Action/Primary)
  { id: "T1", name: "Hallux (Big Toe)", color: "#58CC02" },
  { id: "T2", name: "Second Toe", color: "#58CC02" },
  { id: "T3", name: "Third Toe", color: "#58CC02" },
  { id: "T4", name: "Fourth Toe", color: "#58CC02" },
  { id: "T5", name: "Fifth Toe", color: "#58CC02" },

  // METATARSALS / FOREFOOT (Sky Blue - Secondary)
  { id: "M1", name: "1st Metatarsal", color: "#1CB0F6" },
  { id: "M2", name: "2nd Metatarsal", color: "#1CB0F6" },
  { id: "M3", name: "3rd Metatarsal", color: "#1CB0F6" },
  { id: "M4", name: "4th Metatarsal", color: "#1CB0F6" },
  { id: "M5", name: "5th Metatarsal", color: "#1CB0F6" },

  // MIDFOOT / ARCH (Sunset Orange - Caution/Transition)
  { id: "MM", name: "Medial Midfoot", color: "#FFC800" },
  { id: "CM", name: "Central Midfoot", color: "#FFC800" },
  { id: "LM", name: "Lateral Midfoot", color: "#FFC800" },

  // HEEL (Lava Red - High Impact/Alert)
  { id: "MH", name: "Medial Heel", color: "#FF4B4B" },
  { id: "CH", name: "Central Heel", color: "#FF4B4B" },
  { id: "LH", name: "Lateral Heel", color: "#FF4B4B" }
];

export default function LiveSession() {
  const [isRunning, setIsRunning] = useState(false);
  const [isSleep, setIsSleep] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const gait = useGaitSimulation(isRunning);

  return (
    <div className={`min-h-screen bg-[#F7F7F7] p-6 pt-22 transition-all duration-700 ${isSleep ? 'brightness-50 grayscale' : ''}`}>
      
      {/* 1. TOP STATS BAR */}
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* GAIT PHASE & FALL RISK */}
        <div className="duo-card flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Gait Phase</p>
            <p className="text-2xl font-black text-duo-blue uppercase italic">{gait.phase || 'IDLE'}</p>
          </div>
          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border-b-4 ${gait.phase === 'STANCE' ? 'bg-duo-green border-duo-green-dark' : 'bg-duo-blue border-duo-blue-dark'}`}>
             <Zap className="text-white" fill="white" size={20} />
          </div>
        </div>

        {/* SYMMETRY LOADING BAR */}
        <div className="duo-card flex flex-col justify-center">
          <div className="flex justify-between items-end mb-2">
            <p className="text-[10px] font-black text-gray-400 tracking-widest">SYMMETRY SCORE</p>
            <p className="text-xl font-black text-duo-text">{gait.symmetry?.toFixed(0) || 0}%</p>
          </div>
          <div className="h-4 w-full bg-duo-gray rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-duo-green"
              initial={{ width: 0 }}
              animate={{ width: `${gait.symmetry || 0}%` }}
            />
          </div>
        </div>

        {/* FALL RISK BADGE */}
        <div className={`duo-card flex items-center justify-between border-b-4 ${gait.fallRisk === 'Low' ? 'border-duo-green' : 'border-duo-red'}`}>
          <div>
            <p className="text-[10px] font-black text-gray-400 tracking-widest">STABILITY</p>
            <p className={`text-xl font-black ${gait.fallRisk === 'Low' ? 'text-duo-green' : 'text-duo-red'}`}>{gait.fallRisk?.toUpperCase() || 'UNKNOWN'}</p>
          </div>
          {gait.fallRisk === 'Low' ? <ShieldCheck className="text-duo-green" size={32} /> : <AlertTriangle className="text-duo-red animate-bounce" size={32} />}
        </div>
      </div>

      {/* 2. MAIN VISUALIZATION GRID */}
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT FOOT GRAPH */}
        <div className="lg:col-span-3 duo-card">
          <p className="text-[10px] font-black text-gray-400 mb-4 tracking-widest">LEFT TELEMETRY</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gait.history}>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="M1_L" stroke="#1CB0F6" strokeWidth={3} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="MH_L" stroke="#FF4B4B" strokeWidth={3} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CENTER FOOT HEATMAPS */}
        <div className="lg:col-span-6 duo-card flex justify-around items-center relative overflow-hidden">
            {/* Battery Indicators beside feet */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
              <Battery className="text-duo-green" size={18} />
              <span className="text-[10px] font-bold text-gray-400">{gait.battery?.L?.toFixed(0)}%</span>
            </div>

            <BlendingHeatmap side="LEFT" pressureData={gait.leftPressure} isActive={isRunning} regions={footRegions} />
            
            <div className="flex flex-col items-center gap-4">
                <span className="text-[10px] font-black text-duo-gray vertical-text tracking-[0.5em]">PLANTAR_SCAN</span>
                <div className="h-24 w-[2px] bg-duo-gray rounded-full" />
                <span className="text-[10px] font-black text-gray-300 font-mono italic">{(gait.timestamp/1000).toFixed(3)}s</span>
            </div>

            <BlendingHeatmap side="RIGHT" pressureData={gait.rightPressure} isActive={isRunning} regions={footRegions} />

            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
              <Battery className="text-duo-green" size={18} />
              <span className="text-[10px] font-bold text-gray-400">{gait.battery?.R?.toFixed(0)}%</span>
            </div>
        </div>

        {/* RIGHT FOOT GRAPH */}
        <div className="lg:col-span-3 duo-card">
          <p className="text-[10px] font-black text-gray-400 mb-4 tracking-widest">RIGHT TELEMETRY</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gait.history}>
                <Line type="monotone" dataKey="M1_R" stroke="#1CB0F6" strokeWidth={3} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="MH_R" stroke="#FF4B4B" strokeWidth={3} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. DYNAMIC CONTROL ISLAND */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-4 bg-white border-2 border-duo-gray rounded-full p-3 shadow-2xl">
          
          {/* Start / Stop Button */}
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className={`duo-btn-3d flex items-center gap-3 px-8 py-3 text-white 
              ${isRunning ? 'bg-duo-red border-red-700' : 'bg-duo-green border-duo-green-dark'}`}
          >
            {isRunning ? <Square size={18} fill="white" /> : <Play size={18} fill="white" />}
            <span>{isRunning ? 'STOP' : 'START'}</span>
          </button>

          <div className="h-8 w-[2px] bg-duo-gray mx-2" />

          {/* Record Button */}
          <button 
            onClick={() => setIsRecording(!isRecording)}
            className={`p-3 rounded-2xl transition-all ${isRecording ? 'bg-duo-red/10 text-duo-red animate-pulse' : 'text-gray-400 hover:bg-gray-100'}`}
          >
            <Save size={24} />
          </button>

          {/* Sleep Mode Toggle */}
          <button 
            onClick={() => setIsSleep(!isSleep)}
            className={`p-3 rounded-2xl transition-all ${isSleep ? 'bg-duo-orange/20 text-duo-orange' : 'text-gray-400 hover:bg-gray-100'}`}
          >
            <Moon size={24} />
          </button>
        </div>
      </div>

    </div>
  );
}