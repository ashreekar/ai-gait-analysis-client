"use client";
import React from 'react';
import { motion } from 'framer-motion'; // <--- THIS WAS MISSING

// Helper to calculate Hexagon points
const getHexPath = (x: number, y: number, size: number) => {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    points.push(`${x + size * Math.cos(angle)},${y + size * Math.sin(angle)}`);
  }
  return `M${points.join('L')}Z`;
};

export const HexFoot = ({ side, data, regions, isActive, onHoverRegion, activeRegion }: any) => {
  // Hex positions for 16 zones
  const hexMap: any = {
    T1:[120,40], T2:[90,50], T3:[65,70], T4:[45,100], T5:[30,135],
    M1:[110,100], M2:[85,110], M3:[65,130], M4:[45,160], M5:[30,195],
    MM:[100,180], CM:[75,200], LM:[50,230],
    MH:[90,300], CH:[70,330], LH:[50,310]
  };

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 160 380" className={`w-44 h-auto ${side === 'LEFT' ? 'scale-x-[-1]' : ''}`}>
        {regions.map((r: any) => {
          const [x, y] = hexMap[r.id] || [0, 0];
          const isHighlighted = activeRegion === r.id;
          
          return (
            <motion.path
              key={r.id}
              d={getHexPath(x, y, 18)}
              initial={false}
              animate={{ 
                // Fill with region color if pressure > 100, otherwise dark
                fill: isActive ? (data[r.id] > 100 ? r.color : '#1A1D21') : '#111315',
                stroke: isHighlighted ? '#FFF' : '#2A2E35',
                strokeWidth: isHighlighted ? 2 : 1,
                opacity: activeRegion === null || isHighlighted ? 1 : 0.3
              }}
              onMouseEnter={() => onHoverRegion(r.id)}
              className="cursor-pointer transition-colors"
            />
          );
        })}
      </svg>
    </div>
  );
};