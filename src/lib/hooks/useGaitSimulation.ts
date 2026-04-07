"use client";
import { useState, useEffect, useRef } from 'react';

export const useGaitSimulation = (isActive: boolean) => {
  const [data, setData] = useState({
    leftPressure: [0, 0, 0, 0],
    rightPressure: [0, 0, 0, 0],
    symmetry: 100,
    phase: 'Stance',
    angle: 0,
    battery: { L: 85, R: 82 },
    timestamp: 0,
    fallRisk: 'Low' as 'Low' | 'Moderate' | 'High'
  });

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

      // Leg angle follows a sine wave (Walking speed)
      const currentAngle = Math.sin(timeSec * 4) * 25; 
      const isLeftStance = currentAngle < 0;

      const generatePressure = (isStance: boolean) => {
        if (!isStance) return [0, 0, 0, 0];
        // Simulate high pressure with slight random flicker
        return [
          600 + Math.random() * 200, 
          500 + Math.random() * 200, 
          300 + Math.random() * 100, 
          100 + Math.random() * 100
        ];
      };

      setData(prev => {
        const sym = 88 + Math.floor(Math.random() * 8);
        return {
          ...prev,
          angle: currentAngle,
          phase: isLeftStance ? 'Stance (L)' : 'Swing (L)',
          leftPressure: generatePressure(isLeftStance),
          rightPressure: generatePressure(!isLeftStance),
          symmetry: sym,
          fallRisk: sym > 85 ? 'Low' : 'Moderate',
          timestamp: elapsed,
          battery: { 
            L: Math.max(0, prev.battery.L - 0.001), 
            R: Math.max(0, prev.battery.R - 0.001) 
          }
        };
      });
    }, 50); // 20Hz for smooth UI

    return () => clearInterval(interval);
  }, [isActive]);

  return data;
};