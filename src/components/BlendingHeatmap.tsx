"use client";
import { motion } from 'framer-motion';

export const BlendingHeatmap = ({ side, pressureData, isActive, regions }: any) => {
  const sideId = side.toLowerCase();
  
  // Anatomical coordinates (same as before)
  const coords: any = { 
    T1:[155,60], T2:[125,65], T3:[100,75], T4:[75,95], T5:[50,120],
    M1:[135,145], M2:[110,150], M3:[90,160], M4:[70,175], M5:[50,200],
    MM:[120,240], CM:[95,250], LM:[65,260],
    MH:[115,330], CH:[95,340], LH:[75,330]
  };

  const getDuoColor = (p: number) => {
    if (p > 700) return "#FF4B4B"; // Red
    if (p > 400) return "#FFC800"; // Orange
    if (p > 100) return "#58CC02"; // Green
    return "#1CB0F6"; // Blue
  };

  return (
    <div className={side === 'LEFT' ? 'scale-x-[-1]' : ''}>
      <svg viewBox="0 0 200 400" className="w-52 h-auto">
        <path d="M100,380 C150,380 160,330 160,300 C160,250 120,220 120,180 C120,140 180,120 180,80 C180,20 140,10 100,10 C60,10 20,20 20,80 C20,120 80,140 80,180 C80,220 40,250 40,300 C40,330 50,380 100,380 Z" fill="#F0F0F0" stroke="#E5E5E5" strokeWidth="3" />
        
        {Object.keys(coords).map(id => (
          <motion.circle
            key={id}
            cx={coords[id][0]}
            cy={coords[id][1]}
            initial={{ r: 12 }}
            animate={{ 
              r: isActive ? 28 : 12,
              fill: isActive ? getDuoColor(pressureData[id]) : "#FFFFFF",
              stroke: isActive ? "transparent" : "#E5E5E5",
              fillOpacity: isActive ? 0.6 : 1,
              strokeWidth: 2
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          />
        ))}
      </svg>
    </div>
  );
};