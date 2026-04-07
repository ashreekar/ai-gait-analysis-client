"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';

const SENSOR_NAMES: Record<string, string> = {
  T1: "Big Toe", T2: "Second Toe", T3: "Middle Toe", T4: "Fourth Toe", T5: "Pinky Toe",
  M1: "First Metatarsal", M2: "Second Metatarsal", M3: "Third Metatarsal", M4: "Fourth Metatarsal", M5: "Fifth Metatarsal",
  MM: "Medial Midfoot", CM: "Central Midfoot", LM: "Lateral Midfoot",
  MH: "Medial Heel", CH: "Central Heel", LH: "Lateral Heel"
};

export const BlendingHeatmap = ({ side, pressureData, history = [], isActive }: any) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const coords: any = { 
    T1:[155,60], T2:[125,65], T3:[100,75], T4:[75,95], T5:[50,120],
    M1:[135,145], M2:[110,150], M3:[90,160], M4:[70,175], M5:[50,200],
    MM:[120,240], CM:[95,250], LM:[65,260],
    MH:[115,330], CH:[95,340], LH:[75,330]
  };

  const getDuoColor = (p: number = 0) => {
    if (p > 800) return "#FF4B4B"; 
    if (p > 500) return "#FFC800"; 
    if (p > 200) return "#58CC02"; 
    if (p > 50) return "#1CB0F6";  
    return "#E5E5E5"; 
  };

  const sensorKey = `${focusedId}_${side === 'LEFT' ? 'L' : 'R'}`;

  return (
    <div className="relative p-8 bg-white rounded-[3rem] border-4 border-duo-gray shadow-xl group">
      
      {/* 1. HOVER TOOLTIP */}
      <AnimatePresence>
        {hoveredId && !focusedId && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
          >
            <div className="bg-duo-text text-white px-4 py-2 rounded-2xl shadow-2xl flex flex-col items-center">
              <span className="text-[8px] font-black uppercase text-duo-blue">{side} {hoveredId}</span>
              <span className="text-sm font-black">{SENSOR_NAMES[hoveredId]}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. SENSOR DETAIL OVERLAY (ON CLICK) */}
      <AnimatePresence>
        {focusedId && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md rounded-[2.8rem] p-6 flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-black text-duo-blue uppercase tracking-widest">{side} CHAMBER</span>
                <h3 className="text-xl font-black text-duo-text leading-tight">{SENSOR_NAMES[focusedId]}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Zap size={12} className="text-duo-orange fill-duo-orange" />
                  <span className="text-xs font-mono font-bold text-gray-400">LIVE: {pressureData[focusedId]} PSI</span>
                </div>
              </div>
              <button onClick={() => setFocusedId(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="flex-1 min-h-0 w-full bg-gray-50 rounded-3xl p-2 border-2 border-dashed border-gray-200">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="colorP" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={getDuoColor(pressureData[focusedId])} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={getDuoColor(pressureData[focusedId])} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                  <XAxis dataKey="displayTime" hide />
                  <YAxis domain={[0, 1024]} hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', fontWeight: 'bold' }} 
                    itemStyle={{ color: getDuoColor(pressureData[focusedId]) }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey={sensorKey} 
                    stroke={getDuoColor(pressureData[focusedId])} 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorP)" 
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[8px] font-black text-center mt-4 text-gray-300 tracking-widest uppercase">Real-time Telemetry • {focusedId}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. HEATMAP SVG */}
      <div className={side === 'LEFT' ? 'scale-x-[-1]' : ''}>
        <svg viewBox="0 0 200 400" className="w-56 h-auto cursor-crosshair">
          <defs>
            <filter id="heatBlur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" />
            </filter>
          </defs>

          <path d="M100,380 C150,380 160,330 160,300 C160,250 120,220 120,180 C120,140 180,120 180,80 C180,20 140,10 100,10 C60,10 20,20 20,80 C20,120 80,140 80,180 C80,220 40,250 40,300 C40,330 50,380 100,380 Z" fill="#FBFBFB" stroke="#E5E5E5" strokeWidth="2" />
          
          <g filter="url(#heatBlur)">
            {Object.keys(coords).map(id => {
              const p = pressureData?.[id] || 0;
              return p > 50 && <circle key={`h-${id}`} cx={coords[id][0]} cy={coords[id][1]} r={20 + (p/50)} fill={getDuoColor(p)} fillOpacity="0.4" />;
            })}
          </g>

          {Object.keys(coords).map(id => {
            const p = pressureData?.[id] || 0;
            const isHovered = hoveredId === id;
            const isFocused = focusedId === id;

            return (
              <g key={id} onMouseEnter={() => setHoveredId(id)} onMouseLeave={() => setHoveredId(null)} onClick={() => setFocusedId(id)} className="cursor-pointer">
                <circle cx={coords[id][0]} cy={coords[id][1]} r="18" fill="transparent" />
                <motion.circle
                  cx={coords[id][0]} cy={coords[id][1]}
                  animate={{ 
                    r: isHovered || isFocused ? 12 : (p > 50 ? 8 : 5),
                    fill: p > 50 ? getDuoColor(p) : "#FFFFFF",
                    stroke: isFocused ? "#1CB0F6" : (isHovered ? "#000" : "#E5E5E5"),
                    strokeWidth: isFocused || isHovered ? 3 : 2
                  }}
                />
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 text-center">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">{side} CHAMBER</span>
      </div>
    </div>
  );
};