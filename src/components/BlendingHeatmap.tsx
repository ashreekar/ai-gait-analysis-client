"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SENSOR_NAMES: Record<string, string> = {
  T1: "Big Toe", T2: "Toe 2", T3: "Toe 3", T4: "Toe 4", T5: "Toe 5",
  M1: "Met 1", M2: "Met 2", M3: "Met 3", M4: "Met 4", M5: "Met 5",
  MM: "Med Mid", CM: "Cent Mid", LM: "Lat Mid",
  MH: "Med Heel", CH: "Cent Heel", LH: "Lat Heel"
};

/**
 * ── Coordinate Mapping ──
 * These points have been recalibrated to fit your provided 
 * shoe sole asset (390x1024 viewBox).
 */
const COORDS: any = { 
  T1:[270,120], T2:[210,130], T3:[160,150], T4:[110,190], T5:[80,240],
  M1:[250,300], M2:[200,310], M3:[160,320], M4:[120,340], M5:[80,380],
  MM:[220,500], CM:[170,520], LM:[120,540],
  MH:[200,800], CH:[160,820], LH:[120,800]
};

const getClinicalColor = (p: number = 0) => {
  if (p > 750) return "#ef4444"; 
  if (p > 450) return "#f59e0b"; 
  if (p > 150) return "#34a853"; 
  if (p > 30)  return "#3b82f6";  
  return "#f1f3f4"; 
};

export function PressureHeatmap({ side, grid, operated = false }: any) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="relative bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm mx-auto w-full md:max-w-full lg:max-w-[50vw] overflow-hidden group">
      
      {/* ── Fixed Tooltip Display ── */}
      <div className="absolute top-4 left-6 h-12 pointer-events-none">
        <AnimatePresence>
          {hoveredId && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col"
            >
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-none">
                {SENSOR_NAMES[hoveredId]}
              </span>
              <span className="text-sm font-mono font-bold text-gray-900">
                {grid[hoveredId] || 0} PSI
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Symmetry Logic: 
        Your asset is Right Foot. If side is LEFT, flip horizontally (scale-x-[-1]).
      */}
      <div className={`flex flex-col items-center ${side === 'LEFT' ? 'scale-x-[-1]' : ''}`}>
        
        {/* Updated ViewBox to match asset: width="390" height="1024" */}
        <svg viewBox="0 0 390.11722 1024" className="w-full h-auto max-w-[140px] lg:max-w-[160px]">
          <defs>
            <filter id="heatBlur" x="-50%" y="-50%" width="200%" height="200%">
              {/* Higher deviation needed for larger viewBox */}
              <feGaussianBlur stdDeviation="25" />
              <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 20 -10" />
            </filter>
          </defs>
          
          {/* ── Your Shoe Sole Path Integration ── */}
          <path 
            d="M 146.84375,0.03125 C 109.95012,0.87132005 77.804347,24.535814 60.40625,56.84375 15.67886,139.90166 5.98577,236.56291 3.375,329.65625 1.34058,402.19801 43.58049,461.62318 75.34375,522.0625 97.68771,564.57872 87.84918,613.0258 67.75,653.5625 30.56443,728.55959 -13.57902,811.11577 3.96875,897.5 c 13.82366,62.11419 48.25267,128.1125 151.875,126.4688 67.74652,0.3437 119.96317,-56.11548 139.3125,-115.8438 27.55115,-85.04608 30.14629,-176.12225 41.78125,-264.5625 8.17855,-62.16708 29.89316,-120.52663 43.78125,-181.21875 25.60704,-111.90496 -3.40287,-229.29332 -59.125,-327 C 286.49061,73.791691 234.62821,8.642448 158.4375,0.5 154.53002,0.08241078 150.66033,-0.0556538 146.84375,0.03125 z" 
            id="path3277-1" 
            fill="#fcfcfc" // Light Gray Background
            stroke="#dadce0" // Professional Stroke
            strokeWidth="3" 
            className="transition-colors group-hover:stroke-gray-200"
          />

          {/* Heatmap Layer */}
          <g filter="url(#heatBlur)">
            {Object.keys(COORDS).map(id => grid[id] > 40 && (
              <circle 
                key={`h-${id}`} 
                cx={COORDS[id][0]} 
                cy={COORDS[id][1]} 
                r={35 + grid[id]/20} // Larger R needed for 1024 height
                fill={getClinicalColor(grid[id])} 
                fillOpacity="0.5" 
              />
            ))}
          </g>

          {/* Fixed Sensor Points */}
          {Object.keys(COORDS).map(id => (
            <g 
              key={id} 
              onMouseEnter={() => setHoveredId(id)} 
              onMouseLeave={() => setHoveredId(null)}
              className="cursor-crosshair"
            >
              {/* Large hit area for interaction */}
              <circle cx={COORDS[id][0]} cy={COORDS[id][1]} r="40" fill="transparent" />
              
              {/* Data Point */}
              <circle 
                cx={COORDS[id][0]} 
                cy={COORDS[id][1]} 
                r={grid[id] > 40 ? 12 : 8} 
                fill={grid[id] > 40 ? getClinicalColor(grid[id]) : "#fff"} 
                stroke={hoveredId === id ? "#1a73e8" : (grid[id] > 40 ? "white" : "#e8eaed")} 
                strokeWidth={hoveredId === id ? 6 : 3}
                className="transition-all duration-200"
              />
            </g>
          ))}
        </svg>
        
        {/* Foot Label (Flipped back for legibility) */}
        <div className={`mt-6 ${side === 'LEFT' ? 'scale-x-[-1]' : ''}`}>
           <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
             {side} {operated && "(OP)"}
           </span>
        </div>
      </div>
    </div>
  );
}