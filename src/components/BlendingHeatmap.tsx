"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Clock } from 'lucide-react';

export const BlendingHeatmap = ({ 
  side, 
  pressureData, 
  isActive, 
  mode = "live", // "live" or "history"
  currentTime = "0:00.00" 
}: any) => {
  const [localPlay, setLocalPlay] = useState(false);

  // Anatomical coordinates
  const coords: any = { 
    T1:[155,60], T2:[125,65], T3:[100,75], T4:[75,95], T5:[50,120],
    M1:[135,145], M2:[110,150], M3:[90,160], M4:[70,175], M5:[50,200],
    MM:[120,240], CM:[95,250], LM:[65,260],
    MH:[115,330], CH:[95,340], LH:[75,330]
  };

  const getDuoColor = (p: number = 0) => {
    if (p > 700) return "#FF4B4B"; // Red
    if (p > 400) return "#FFC800"; // Orange
    if (p > 100) return "#58CC02"; // Green
    return "#1CB0F6"; // Blue
  };

  return (
    <div className="relative group">
      {/* 1. HISTORY OVERLAY: TIMESTAMP & PLAY TOGGLE */}
      {mode === "history" && (
        <div className="absolute -top-12 left-0 w-full flex justify-between items-center px-2 z-30">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-duo-gray shadow-sm">
            <Clock size={12} className="text-duo-blue" />
            <span className="text-[10px] font-black text-duo-text font-mono tracking-tighter">
              {currentTime}s
            </span>
          </div>
          
          <button 
            onClick={() => setLocalPlay(!localPlay)}
            className="h-8 w-8 rounded-full bg-white border-2 border-duo-gray flex items-center justify-center text-duo-text shadow-[0_2px_0_0_#e5e5e5] active:translate-y-0.5 active:shadow-none transition-all"
          >
            {localPlay ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
          </button>
        </div>
      )}

      {/* 2. HEATMAP VISUALIZATION */}
      <div className={side === 'LEFT' ? 'scale-x-[-1]' : ''}>
        <svg viewBox="0 0 200 400" className="w-52 h-auto drop-shadow-xl">
          {/* Anatomical Foot Path */}
          <path 
            d="M100,380 C150,380 160,330 160,300 C160,250 120,220 120,180 C120,140 180,120 180,80 C180,20 140,10 100,10 C60,10 20,20 20,80 C20,120 80,140 80,180 C80,220 40,250 40,300 C40,330 50,380 100,380 Z" 
            fill={mode === 'history' ? "#F8F8F8" : "#FFFFFF"} 
            stroke={mode === 'history' ? "#E5E5E5" : "#58CC02"} 
            strokeWidth="3" 
          />
          
          {/* Sensor Points */}
          {Object.keys(coords).map(id => {
            const pressure = pressureData?.[id] || 0;
            const isPointActive = isActive || localPlay;

            return (
              <g key={id}>
                {/* Outer Glow (Heat Blending) */}
                <motion.circle
                  cx={coords[id][0]}
                  cy={coords[id][1]}
                  initial={{ r: 0 }}
                  animate={{ 
                    r: isPointActive ? 35 : 0,
                    fill: getDuoColor(pressure),
                    fillOpacity: isPointActive ? 0.25 : 0 
                  }}
                  transition={{ type: 'spring', stiffness: 100 }}
                />
                
                {/* Core Sensor Dot */}
                <motion.circle
                  cx={coords[id][0]}
                  cy={coords[id][1]}
                  initial={{ r: 10 }}
                  animate={{ 
                    r: isPointActive ? 14 : 10,
                    fill: isPointActive ? getDuoColor(pressure) : "#FFFFFF",
                    stroke: isPointActive ? "transparent" : "#E5E5E5",
                    fillOpacity: 1,
                    strokeWidth: 2
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Side Label */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
          {side} FOOT
        </span>
      </div>
    </div>
  );
};