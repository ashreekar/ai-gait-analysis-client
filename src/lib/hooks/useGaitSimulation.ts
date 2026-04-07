"use client";
import { useState, useEffect, useRef } from 'react';

// Anatomical pressure distribution (0.0 to 1.0 multiplier)
const FOOT_MAP: Record<string, number> = {
  // Toes: Medium pressure during toe-off
  T1: 0.7, T2: 0.4, T3: 0.3, T4: 0.3, T5: 0.3,
  // Metatarsals: Highest weight-bearing zone
  M1: 0.9, M2: 1.0, M3: 0.8, M4: 0.7, M5: 0.6,
  // Midfoot: Low pressure (arch area)
  MM: 0.2, CM: 0.1, LM: 0.2,
  // Heel: High pressure during initial contact
  MH: 0.9, CH: 1.0, LH: 0.9
};

export const useGaitSimulation = (isActive: boolean) => {
  const [data, setData] = useState<any>({
    leftPressure: {},
    rightPressure: {},
    history: [],
    elapsedTime: 0,
    phase: 'IDLE',
    symmetry: 0,
    fallRisk: 'Low',
    battery: { L: 100, R: 100 }
  });

  const ids = Object.keys(FOOT_MAP);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) {
      startRef.current = null;
      return;
    }
    
    if (startRef.current === null) startRef.current = Date.now();

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startRef.current!;
      const timeSec = elapsed / 1000;
      
      // Cycle: Heel Strike -> Midstance -> Toe Off -> Swing
      // Using a sine wave to determine the "Weight Transfer"
      const cyclePos = (timeSec * 1.25) % 2; // 0 to 2 (1 cycle per foot)
      
      const getPressureForFoot = (isLeft: boolean) => {
        const offset = isLeft ? 0 : 1;
        const footPos = (cyclePos + offset) % 2; 
        
        const isStance = footPos < 1.0; // First half of cycle is touching ground
        const zones: any = {};

        ids.forEach(id => {
          if (!isStance) {
            // SWING PHASE: Residual micro-pressure
            zones[id] = Math.floor(Math.random() * 15);
          } else {
            // STANCE PHASE: Calculate based on anatomical map + cycle timing
            const base = FOOT_MAP[id];
            let phaseMultiplier = 1;

            // Simulate the "Heel-to-Toe" roll
            if (id.includes('H')) { // Heel
              phaseMultiplier = footPos < 0.4 ? 1.2 : 0.3; 
            } else if (id.includes('M')) { // Mid/Metatarsal
              phaseMultiplier = footPos > 0.3 && footPos < 0.7 ? 1.1 : 0.4;
            } else if (id.includes('T')) { // Toes
              phaseMultiplier = footPos > 0.6 ? 1.3 : 0.1;
            }

            const intensity = 800 * base * phaseMultiplier;
            const jitter = Math.random() * 50;
            zones[id] = Math.min(1024, Math.floor(intensity + jitter));
          }
        });
        return { zones, isStance };
      };

      const left = getPressureForFoot(true);
      const right = getPressureForFoot(false);

      setData((prev: any) => {
        const historyPoint: any = { 
          time: timeSec.toFixed(2),
          displayTime: new Date(elapsed).toISOString().slice(17, 21) 
        };
        
        ids.forEach(id => {
          historyPoint[`${id}_L`] = left.zones[id];
          historyPoint[`${id}_R`] = right.zones[id];
        });

        return {
          leftPressure: left.zones,
          rightPressure: right.zones,
          history: [...prev.history, historyPoint].slice(-40),
          elapsedTime: elapsed,
          phase: left.isStance ? 'LEFT_STANCE' : 'RIGHT_STANCE',
          symmetry: 92 + Math.random() * 4,
          fallRisk: 'Low',
          battery: { 
            L: Math.max(15, prev.battery.L - 0.0001), 
            R: Math.max(12, prev.battery.R - 0.0001) 
          }
        };
      });
    }, 100); // 10Hz update for smooth visual transitions

    return () => clearInterval(interval);
  }, [isActive]);

  return data;
};