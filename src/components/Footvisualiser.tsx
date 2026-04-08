"use client";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { Badge } from '@/components/GaitUI';

const data = [
  {
    side: 'Left (OP)',
    rearfoot: 65,
    midfoot: 25,
    forefoot: 10,
  },
  {
    side: 'Right',
    rearfoot: 45,
    midfoot: 35,
    forefoot: 20,
  },
];

export default function FootstrikeVisualizer() {
  return (
    <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-sm font-black uppercase tracking-tight text-gray-900">Footstrike Distribution</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Initial Contact Analysis</p>
        </div>
        {data[0].rearfoot > 60 && (
          <Badge variant="amber">Knee Protection Detected</Badge>
        )}
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            barSize={32}
          >
            <XAxis type="number" hide domain={[0, 100]} />
            <YAxis 
              dataKey="side" 
              type="category" 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 800, fill: '#202124' }}
            />
            {/* Rearfoot - Often high in post-op to keep knee straight */}
            <Bar dataKey="rearfoot" stackId="a" fill="#1a73e8" radius={[4, 0, 0, 4]} /> 
            {/* Midfoot - The target for efficient walking */}
            <Bar dataKey="midfoot" stackId="a" fill="#8ab4f8" />
            {/* Forefoot - Pushing off */}
            <Bar dataKey="forefoot" stackId="a" fill="#e8eaed" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Summary */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#1a73e8]" />
            <span className="text-[10px] font-bold text-gray-500">HEEL</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#8ab4f8]" />
            <span className="text-[10px] font-bold text-gray-500">MID</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#e8eaed]" />
            <span className="text-[10px] font-bold text-gray-500">TOE</span>
          </div>
        </div>
        <div className="text-[10px] font-black text-blue-600">
          +20% HEEL STRIKE ON L
        </div>
      </div>
    </div>
  );
}