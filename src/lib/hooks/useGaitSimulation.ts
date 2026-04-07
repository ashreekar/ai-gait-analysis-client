"use client";
import { useState, useEffect, useRef } from 'react';

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

  const ids = ["T1","T2","T3","T4","T5","M1","M2","M3","M4","M5","MM","CM","LM","MH","CH","LH"];
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
      
      // Gait Logic: Alternating Stance/Swing every 0.8s
      const isLeftStance = Math.sin(timeSec * 4) > 0;

      const genZones = (active: boolean) => {
        const zones: any = {};
        ids.forEach(id => {
          // Realistic pressure range 0-1024
          zones[id] = active ? Math.floor(200 + Math.random() * 600) : Math.floor(Math.random() * 50);
        });
        return zones;
      };

      const lp = genZones(isLeftStance);
      const rp = genZones(!isLeftStance);

      setData((prev: any) => {
        const historyPoint: any = { 
          time: (elapsed / 1000).toFixed(2),
          displayTime: new Date(elapsed).toISOString().slice(17, 21) // ms tracking
        };
        
        ids.forEach(id => {
          historyPoint[`${id}_L`] = lp[id];
          historyPoint[`${id}_R`] = rp[id];
        });

        const sym = 85 + Math.random() * 12;
        
        return {
          leftPressure: lp,
          rightPressure: rp,
          history: [...prev.history, historyPoint].slice(-40),
          elapsedTime: elapsed,
          phase: isLeftStance ? 'STANCE' : 'SWING',
          symmetry: sym,
          fallRisk: sym > 88 ? 'Low' : 'Moderate',
          battery: { 
            L: Math.max(15, prev.battery.L - 0.001), 
            R: Math.max(12, prev.battery.R - 0.001) 
          }
        };
      });
    }, 500); // High frequency 20Hz update

    return () => clearInterval(interval);
  }, [isActive]);

  return data;
};