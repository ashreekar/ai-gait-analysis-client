"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { AreaChart, Area, YAxis, ResponsiveContainer } from 'recharts';

const SENSOR_NAMES: Record<string, string> = {
  T1: "Big Toe", T2: "Toe 2", T3: "Toe 3", T4: "Toe 4", T5: "Toe 5",
  M1: "Met 1", M2: "Met 2", M3: "Met 3", M4: "Met 4", M5: "Met 5",
  MM: "Med Mid", CM: "Cent Mid", LM: "Lat Mid",
  MH: "Med Heel", CH: "Cent Heel", LH: "Lat Heel"
};

// Precisely adjusted coordinates to fit the new insole shape
const COORDS: any = { 
  T1:[80,45],  T2:[105,40], T3:[130,50], T4:[155,70], T5:[165,100],
  M1:[85,115], M2:[110,115], M3:[135,125], M4:[155,140], M5:[165,165],
  MM:[90,210], CM:[115,220], LM:[145,230],
  MH:[75,320], CH:[100,340], LH:[125,320]
};

const getClinicalColor = (p: number = 0) => {
  if (p > 750) return "#ef4444"; 
  if (p > 450) return "#f59e0b"; 
  if (p > 150) return "#34a853"; 
  if (p > 30)  return "#3b82f6"; 
  return "#f1f3f4";              
};

export const PressureHeatmap = ({ side, grid, history = [], operated = false }: any) => {
  const [focusedId, setFocusedId] = useState<string | null>(null);

  // Target exit point for the wiring ribbon on the medial arch
  const WIRING_EXIT_X = 40;
  const WIRING_EXIT_Y = 275;

  return (
    <div className="relative bg-white rounded-3xl overflow-hidden group p-4 border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[450px]">
      <AnimatePresence>
        {focusedId && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 10 }}
            className="absolute inset-0 z-30 bg-white/95 backdrop-blur-sm p-4 flex flex-col"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                  {side} • {focusedId}
                </p>
                <h3 className="text-sm font-bold text-gray-900">{SENSOR_NAMES[focusedId]}</h3>
                <p className="text-[11px] font-mono font-bold text-gray-400 mt-0.5">
                  {grid[focusedId] || 0} PSI
                </p>
              </div>
              <button 
                onClick={() => setFocusedId(null)} 
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X size={14} className="text-gray-500" />
              </button>
            </div>
            
            <div className="flex-1 bg-gray-50/50 rounded-2xl border border-gray-100 overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history.length > 0 ? history : [{v:0},{v:400},{v:200},{v:grid[focusedId]}]}>
                  <YAxis domain={[0, 1024]} hide />
                  <Area 
                    type="monotone" 
                    dataKey={focusedId} 
                    stroke={getClinicalColor(grid[focusedId])} 
                    fill={getClinicalColor(grid[focusedId])} 
                    fillOpacity={0.1} 
                    strokeWidth={2} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Foot Visualization ── */}
      <div className={`flex flex-col items-center w-full ${side === 'LEFT' ? 'scale-x-[-1]' : ''}`}>
        <svg viewBox="0 0 200 400" className="w-full h-auto max-w-[160px] transition-transform duration-500 group-hover:scale-[1.02] overflow-visible">
          <defs>
            <filter id="heatBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="9" />
              <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -7" />
            </filter>
          </defs>
          
          {/* Ribbon Cable Exit Lines (Underneath Insole) */}
          <path d={`M ${WIRING_EXIT_X} 265 L -20 265`} stroke="#e5e7eb" strokeWidth="2" fill="none" />
          <path d={`M ${WIRING_EXIT_X} 275 L -20 275`} stroke="#e5e7eb" strokeWidth="2" fill="none" />
          <path d={`M ${WIRING_EXIT_X} 285 L -20 285`} stroke="#e5e7eb" strokeWidth="2" fill="none" />

          {/* Improved Insole Outline to match Reference Image */}
          <path 
            d="M100,20 
               C160,20 185,60 185,120 
               C185,180 160,230 155,290 
               C150,350 135,385 100,385 
               C65,385 45,350 45,290 
               C45,230 85,190 85,130 
               C85,70 40,20 100,20 Z" 
            fill="#fefefe" 
            stroke="#d1d5db" 
            strokeWidth="2.5" 
          />

          {/* Wiring/Vein Layer */}
          <g stroke="#e5e7eb" strokeWidth="1" fill="none" opacity="0.8">
            {Object.keys(COORDS).map(id => {
              // Create smooth curved lines from each sensor to the ribbon exit
              const startX = COORDS[id][0];
              const startY = COORDS[id][1];
              // Calculate a control point to give the wires a nice swoop
              const ctrlX = (startX + WIRING_EXIT_X) / 2 + (startX > 120 ? 20 : 0);
              const ctrlY = (startY + WIRING_EXIT_Y) / 2 - 10;
              return (
                <path 
                  key={`wire-${id}`} 
                  d={`M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${WIRING_EXIT_X} ${WIRING_EXIT_Y}`} 
                />
              );
            })}
          </g>

          {/* Heatmap Layer */}
          <g filter="url(#heatBlur)">
            {Object.keys(COORDS).map(id => grid[id] > 40 && (
              <circle 
                key={`h-${id}`} 
                cx={COORDS[id][0]} 
                cy={COORDS[id][1]} 
                r={14 + grid[id]/60} 
                fill={getClinicalColor(grid[id])} 
                fillOpacity="0.55" 
              />
            ))}
          </g>

          {/* Interactive Sensor Nodes */}
          {Object.keys(COORDS).map(id => (
            <g key={id} onClick={() => setFocusedId(id)} className="cursor-pointer group/node">
              {/* Hitbox */}
              <circle cx={COORDS[id][0]} cy={COORDS[id][1]} r="16" fill="transparent" />
              {/* Visible Node */}
              <circle 
                cx={COORDS[id][0]} cy={COORDS[id][1]} 
                r={focusedId === id ? 8 : (grid[id] > 40 ? 6 : 4)} 
                fill={grid[id] > 40 ? getClinicalColor(grid[id]) : "#f9fafb"} 
                stroke={grid[id] > 40 ? "white" : "#cbd5e1"} 
                strokeWidth={grid[id] > 40 ? 2 : 1.5}
                className="transition-all duration-300 group-hover/node:scale-125"
              />
            </g>
          ))}
        </svg>
        
        {/* Label (Flipped back so text isn't mirrored) */}
        <div className={`mt-6 ${side === 'LEFT' ? 'scale-x-[-1]' : ''}`}>
           <span className="text-[11px] font-black text-gray-500 uppercase tracking-[0.25em]">
             {side} {operated && <span className="text-blue-500">• OP</span>}
           </span>
        </div>
      </div>
    </div>
  );
};