"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const SENSOR_NAMES: Record<string, string> = {
  T1: "Big Toe", T2: "Toe 2", T3: "Toe 3", T4: "Toe 4", T5: "Toe 5",
  M1: "Met 1", M2: "Met 2", M3: "Met 3", M4: "Met 4", M5: "Met 5",
  MM: "Med Mid", CM: "Cent Mid", LM: "Lat Mid",
  MH: "Med Heel", CH: "Cent Heel", LH: "Lat Heel"
};

export const BlendingHeatmap = ({ side, pressureData, history = [] }: any) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const coords: any = { 
    T1:[155,60], T2:[125,65], T3:[100,75], T4:[75,95], T5:[50,120],
    M1:[135,145], M2:[110,150], M3:[90,160], M4:[70,175], M5:[50,200],
    MM:[120,240], CM:[95,250], LM:[65,260],
    MH:[115,330], CH:[95,340], LH:[75,330]
  };

  const getColor = (p: number = 0) => {
    if (p > 750) return "#FF4B4B"; 
    if (p > 450) return "#FFC800"; 
    if (p > 150) return "#58CC02"; 
    if (p > 30) return "#1CB0F6";  
    return "#E5E5E5"; 
  };

  return (
    <div className="relative p-4 md:p-6 bg-white rounded-[2.5rem] border-2 border-duo-gray shadow-md w-full max-w-[280px] sm:max-w-[320px] mx-auto overflow-hidden">
      <AnimatePresence>
        {focusedId && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm rounded-[2.3rem] p-5 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-[8px] font-black text-duo-blue uppercase tracking-widest">{side} CHAMBER</p>
                <h3 className="text-sm font-black text-duo-text leading-tight">{SENSOR_NAMES[focusedId]}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <Zap size={10} className="text-duo-orange fill-duo-orange"/>
                  <span className="text-[10px] font-mono font-bold text-gray-400">LIVE: {pressureData[focusedId]} PSI</span>
                </div>
              </div>
              <button onClick={() => setFocusedId(null)} className="p-2 bg-gray-100 rounded-full"><X size={14}/></button>
            </div>
            <div className="flex-1 w-full bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <XAxis dataKey="displayTime" hide /><YAxis domain={[0, 1024]} hide />
                  <Area type="monotone" dataKey={`${focusedId}_${side === 'LEFT' ? 'L' : 'R'}`} stroke={getColor(pressureData[focusedId])} strokeWidth={2} fillOpacity={0.1} fill={getColor(pressureData[focusedId])} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`flex justify-center w-full ${side === 'LEFT' ? 'scale-x-[-1]' : ''}`}>
        <svg viewBox="0 0 200 400" className="w-full h-auto max-w-[160px] cursor-pointer" preserveAspectRatio="xMidYMid meet">
          <defs><filter id="heatBlur"><feGaussianBlur stdDeviation="8" /><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -7" /></filter></defs>
          <path d="M100,380 C150,380 160,330 160,300 C160,250 120,220 120,180 C120,140 180,120 180,80 C180,20 140,10 100,10 C60,10 20,20 20,80 C20,120 80,140 80,180 C80,220 40,250 40,300 C40,330 50,380 100,380 Z" fill="#FBFBFB" stroke="#EEE" strokeWidth="2" />
          <g filter="url(#heatBlur)">
            {Object.keys(coords).map(id => pressureData[id] > 40 && (
              <circle key={`h-${id}`} cx={coords[id][0]} cy={coords[id][1]} r={18 + pressureData[id]/60} fill={getColor(pressureData[id])} fillOpacity="0.4" />
            ))}
          </g>
          {Object.keys(coords).map(id => (
            <g key={id} onMouseEnter={() => setHoveredId(id)} onMouseLeave={() => setHoveredId(null)} onClick={() => setFocusedId(id)}>
              <circle cx={coords[id][0]} cy={coords[id][1]} r="18" fill="transparent" />
              <motion.circle cx={coords[id][0]} cy={coords[id][1]} animate={{ r: hoveredId === id || focusedId === id ? 10 : (pressureData[id] > 40 ? 7 : 4), fill: pressureData[id] > 40 ? getColor(pressureData[id]) : "#FFF", stroke: "#DDD", strokeWidth: 1.5 }} />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};