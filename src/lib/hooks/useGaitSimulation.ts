"use client";
import { useState, useEffect, useRef } from 'react';

export const useGaitSimulation = (isActive: boolean) => {
  const [data, setData] = useState<any>({
    leftPressure: {},
    rightPressure: {},
    history: [],
    timestamp: 0,
    phase: 'IDLE',
    angle: 0,
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
      const elapsed = Date.now() - startRef.current!;
      const timeSec = elapsed / 1000;
      const isLeftStance = Math.sin(timeSec * 4) < 0;

      const genZones = (active: boolean) => {
        const zones: any = {};
        ids.forEach(id => zones[id] = active ? 200 + Math.random() * 800 : 0);
        return zones;
      };

      const lp = genZones(isLeftStance);
      const rp = genZones(!isLeftStance);

      setData((prev: any) => {
        const historyPoint: any = { time: timeSec.toFixed(1) };
        ids.forEach(id => {
          historyPoint[`${id}_L`] = lp[id];
          historyPoint[`${id}_R`] = rp[id];
        });

        const sym = 85 + Math.random() * 10;
        return {
          leftPressure: lp,
          rightPressure: rp,
          history: [...prev.history, historyPoint].slice(-30),
          timestamp: elapsed,
          phase: isLeftStance ? 'STANCE' : 'SWING',
          angle: Math.sin(timeSec * 4) * 25,
          symmetry: sym,
          fallRisk: sym > 88 ? 'Low' : 'Moderate',
          battery: { L: Math.max(0, prev.battery.L - 0.01), R: Math.max(0, prev.battery.R - 0.01) }
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive]);

  return data;
};