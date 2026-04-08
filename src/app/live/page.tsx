"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Square, Save, Moon, Battery, ShieldCheck, Timer, Activity, Zap, AlertTriangle } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, CartesianGrid } from 'recharts';
import { useGaitSimulation } from '@/lib/hooks/useGaitSimulation';
import { BlendingHeatmap } from '@/components/BlendingHeatmap';

const footRegions = [ { id: "T1", name: "Hallux", color: "#58CC02" }, { id: "T2", name: "Toe 2", color: "#58CC02" }, { id: "T3", name: "Toe 3", color: "#58CC02" }, { id: "T4", name: "Toe 4", color: "#58CC02" }, { id: "T5", name: "Toe 5", color: "#58CC02" }, { id: "M1", name: "Met 1", color: "#1CB0F6" }, { id: "M2", name: "Met 2", color: "#1CB0F6" }, { id: "M3", name: "Met 3", color: "#1CB0F6" }, { id: "M4", name: "Met 4", color: "#1CB0F6" }, { id: "M5", name: "Met 5", color: "#1CB0F6" }, { id: "MM", name: "Med Mid", color: "#FFC800" }, { id: "CM", name: "Cent Mid", color: "#FFC800" }, { id: "LM", name: "Lat Mid", color: "#FFC800" }, { id: "MH", name: "Med Heel", color: "#FF4B4B" }, { id: "CH", name: "Cent Heel", color: "#FF4B4B" }, { id: "LH", name: "Lat Heel", color: "#FF4B4B" } ];

export default function LiveSession() {
  const [isRunning, setIsRunning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSleep, setIsSleep] = useState(false);
  const gait = useGaitSimulation(isRunning);

  const formatTime = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const mmm = ms % 1000;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${mmm.toString().padStart(3, '0')}`;
  };

  return (
    <div className={`min-h-screen bg-[#F8F9FA] px-3 md:px-8 pt-20 pb-32 transition-all duration-700 overflow-x-hidden ${isSleep ? 'brightness-50 grayscale scale-[0.99]' : ''}`}>
      
      {/* 1. STATUS HEADER */}
      <div className="mx-auto max-w-6xl grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="duo-card flex items-center gap-3 p-4 bg-white">
          <div className="bg-duo-blue/10 p-2 rounded-xl text-duo-blue"><Timer size={20}/></div>
          <div>
            <p className="text-[8px] font-black text-gray-400 uppercase">Session Time</p>
            <p className="text-sm md:text-lg font-black font-mono leading-none">{formatTime(gait.elapsedTime)}</p>
          </div>
        </div>

        <div className="duo-card flex items-center justify-between p-4 bg-white">
          <div className="truncate">
            <p className="text-[8px] font-black text-gray-400 uppercase">Gait Phase</p>
            <p className="text-xs md:text-sm font-black text-duo-blue italic uppercase">{gait.phase}</p>
          </div>
          <Zap size={16} className={isRunning ? "text-duo-orange fill-duo-orange animate-pulse" : "text-gray-200"} />
        </div>

        <div className="duo-card p-4 bg-white hidden sm:block">
          <div className="flex justify-between text-[9px] font-black mb-1 text-gray-400"><span>SYMMETRY</span><span>{gait.symmetry.toFixed(1)}%</span></div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
             <motion.div animate={{ width: `${gait.symmetry}%` }} className="h-full bg-duo-green" />
          </div>
        </div>

        <div className={`duo-card flex items-center justify-between p-4 bg-white border-b-4 ${gait.fallRisk === 'Low' ? 'border-duo-green' : 'border-duo-red'}`}>
          <span className={`font-black text-[10px] ${gait.fallRisk === 'Low' ? 'text-duo-green' : 'text-duo-red'}`}>
            {gait.fallRisk.toUpperCase()} RISK
          </span>
          {gait.fallRisk === 'Low' ? <ShieldCheck size={18} className="text-duo-green"/> : <AlertTriangle size={18} className="text-duo-red"/>}
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-6">
        {/* 2. HEATMAP SECTION */}
        <div className="duo-card bg-white p-4 md:p-12 shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row justify-center items-center gap-10 lg:gap-20">
            <div className="w-full max-w-[280px] lg:w-auto">
              <div className="flex justify-center items-center gap-2 mb-2"><Battery className="text-duo-green" size={14}/><span className="text-[10px] font-black text-gray-400">{gait.battery.L.toFixed(0)}%</span></div>
              <BlendingHeatmap side="LEFT" pressureData={gait.leftPressure} history={gait.history} />
            </div>
            <div className="hidden lg:block h-64 w-[1px] bg-gray-100" />
            <div className="w-full max-w-[280px] lg:w-auto">
              <div className="flex justify-center items-center gap-2 mb-2"><Battery className="text-duo-green" size={14}/><span className="text-[10px] font-black text-gray-400">{gait.battery.R.toFixed(0)}%</span></div>
              <BlendingHeatmap side="RIGHT" pressureData={gait.rightPressure} history={gait.history} />
            </div>
          </div>
        </div>

        {/* 3. TELEMETRY GRAPHS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['LEFT', 'RIGHT'].map((side) => (
            <div key={side} className={`h-[260px] md:h-[340px] duo-card !p-0 overflow-hidden flex flex-col bg-white border-t-4 ${side === 'LEFT' ? 'border-duo-blue' : 'border-duo-orange'}`}>
              <div className="pt-4 px-5 flex justify-between items-center">
                <p className="text-[9px] font-black text-gray-400 tracking-widest uppercase">{side}_FOOT_STREAM</p>
                <Activity size={12} className="text-gray-300" />
              </div>
              <div className="flex-1 w-full -ml-6 md:-ml-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={gait.history} margin={{ top: 15, right: 15, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F5" />
                    <XAxis dataKey="displayTime" hide />
                    <YAxis domain={[0, 1024]} axisLine={false} tickLine={false} tick={{ fontSize: 8, fontWeight: 900, fill: '#CCC' }} />
                    {footRegions.map(r => (
                      <Line key={r.id} type="monotone" dataKey={`${r.id}_${side === 'LEFT' ? 'L' : 'R'}`} stroke={r.color} strokeWidth={2} dot={false} isAnimationActive={false} strokeOpacity={0.6} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. DYNAMIC CONTROL ISLAND */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-4 bg-white/95 backdrop-blur-md border-2 border-duo-gray rounded-full p-2 shadow-xl z-50 w-[92%] max-w-fit">
        <button 
          onClick={() => setIsRunning(!isRunning)} 
          className={`duo-btn-3d flex items-center gap-3 px-6 md:px-12 py-3 text-white font-black transition-all ${isRunning ? 'bg-duo-red border-red-700' : 'bg-duo-green border-duo-green-dark'}`}
        >
          {isRunning ? <Square size={16} fill="white"/> : <Play size={16} fill="white"/>}
          <span className="text-xs md:text-sm uppercase">{isRunning ? 'Stop' : 'Start'}</span>
        </button>

        <div className="h-8 w-[1px] bg-gray-200 mx-1 hidden md:block" />

        <button 
          onClick={() => setIsRecording(!isRecording)} 
          className={`p-3 rounded-2xl transition-all ${isRecording ? 'bg-duo-blue text-white shadow-inner animate-pulse' : 'text-gray-400 hover:bg-gray-100'}`}
        >
          <Save size={20} fill={isRecording ? "white" : "none"} />
        </button>

        <button 
          onClick={() => setIsSleep(!isSleep)} 
          className="p-3 text-gray-400 hover:text-duo-blue shrink-0"
        >
          <Moon size={22} fill={isSleep ? "currentColor" : "none"}/>
        </button>
      </div>

    </div>
  );
}