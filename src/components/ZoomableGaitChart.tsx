"use client";
import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceArea
} from 'recharts';

export const ZoomableGaitChart = ({ gaitData, footRegions, side }: any) => {
  const [data, setData] = useState(gaitData);
  const [left, setLeft] = useState<string | number>('dataMin');
  const [right, setRight] = useState<string | number>('dataMax');
  const [refAreaLeft, setRefAreaLeft] = useState('');
  const [refAreaRight, setRefAreaRight] = useState('');
  const [top, setTop] = useState<string | number>('dataMax');
  const [bottom, setBottom] = useState<string | number>('dataMin');

  // Zoom Logic: Calculate new boundaries based on drag area
  const zoom = () => {
    if (refAreaLeft === refAreaRight || refAreaRight === '') {
      setRefAreaLeft('');
      setRefAreaRight('');
      return;
    }

    let _left = refAreaLeft;
    let _right = refAreaRight;

    if (refAreaLeft > refAreaRight) {
      _left = refAreaRight;
      _right = refAreaLeft;
    }

    setRefAreaLeft('');
    setRefAreaRight('');
    setLeft(_left);
    setRight(_right);
  };

  const zoomOut = () => {
    setLeft('dataMin');
    setRight('dataMax');
    setTop('dataMax');
    setBottom('dataMin');
  };

  return (
    <div className="lg:col-span-3 duo-card relative group">
      <div className="flex justify-between items-center mb-4">
        <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">
          {side}_FOOT_16CH_TELEMETRY
        </p>
        <button 
          onClick={zoomOut}
          className="text-[10px] font-black text-duo-blue uppercase tracking-widest hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Reset Zoom
        </button>
      </div>

      <div className="h-[400px] w-full cursor-crosshair">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={gaitData}
            onMouseDown={(e) => setRefAreaLeft(e.activeLabel)}
            onMouseMove={(e) => refAreaLeft && setRefAreaRight(e.activeLabel)}
            onMouseUp={zoom}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
            <XAxis 
              dataKey="displayTime" 
              hide={false} 
              domain={[left, right]} 
              type="category"
              allowDataOverflow={true}
              tick={{ fontSize: 10, fontWeight: 900, fill: '#ccc' }}
            />
            <YAxis 
              hide 
              domain={[bottom, top]} 
              allowDataOverflow={true} 
            />
            
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              labelStyle={{ fontWeight: 900, color: '#4B4B4B', fontSize: '12px' }}
            />

            {footRegions.map((r: any) => (
              <Line 
                key={r.id} 
                type="monotone" 
                dataKey={`${r.id}_${side === 'LEFT' ? 'L' : 'R'}`} 
                stroke={r.color} 
                strokeWidth={2} 
                dot={false} 
                isAnimationActive={false} 
                strokeOpacity={0.7} 
              />
            ))}

            {/* The actual selector box visual */}
            {refAreaLeft && refAreaRight ? (
              <ReferenceArea 
                x1={refAreaLeft} 
                x2={refAreaRight} 
                strokeOpacity={0.3} 
                fill="#1CB0F6" 
                fillOpacity={0.1} 
              />
            ) : null}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="absolute bottom-4 right-6 pointer-events-none">
         <p className="text-[8px] font-black text-gray-300 uppercase tracking-tighter">
            Drag to zoom • Double click to reset
         </p>
      </div>
    </div>
  );
};