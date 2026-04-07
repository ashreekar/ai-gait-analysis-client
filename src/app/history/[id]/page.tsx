"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, FileText, Download, Play, Pause, 
  RotateCcw, MessageSquare, Calendar, Clock, Activity 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, Tooltip, CartesianGrid } from 'recharts';
import { BlendingHeatmap } from '@/components/BlendingHeatmap';

const footRegions = [
  { id: "T1", name: "Hallux", color: "#58CC02" }, { id: "T2", name: "2nd Toe", color: "#58CC02" },
  { id: "M1", name: "1st Met", color: "#1CB0F6" }, { id: "MH", name: "Heel", color: "#FF4B4B" },
  { id: "MM", name: "Midfoot", color: "#FFC800" }, { id: "LM", name: "Lat Mid", color: "#FFC800" }
];

export default function SessionDetail({ params }: { params: { id: string } }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); 
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Generate Mock Data with 15s intervals and realistic timestamps
  const generateHistory = () => {
    return Array.from({ length: 60 }, (_, i) => {
      const timeInSec = i * 0.25; // 4 points per second
      const minutes = Math.floor(timeInSec / 60);
      const seconds = Math.floor(timeInSec % 60);
      const timestamp = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      const point: any = { time: timestamp, rawTime: timeInSec };
      footRegions.forEach(r => {
        point[`${r.id}_L`] = Math.floor(Math.random() * 600 + 200);
      });
      return point;
    });
  };

  const [historyData] = useState(generateHistory());

  // 2. Synchronize Scroll with Playback
  useEffect(() => {
    if (isPlaying && scrollRef.current) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          const next = prev + 0.5;
          // Auto-scroll logic: move scrollbar as progress increases
          if (scrollRef.current) {
             scrollRef.current.scrollLeft = (next / 100) * scrollRef.current.scrollWidth - 200;
          }
          return next;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-[#F7F7F7] pt-24 px-6 pb-24">
      <div className="mx-auto max-w-7xl">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button className="h-12 w-12 duo-btn-3d bg-white border-duo-gray text-duo-text flex items-center justify-center">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-duo-text tracking-tighter uppercase font-mono">REPLAY_LOG_{params.id || '4072'}</h1>
              <div className="flex gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span className="flex items-center gap-1"><Calendar size={12}/> APR 7, 2026</span>
                <span className="flex items-center gap-1"><Clock size={12}/> 10:32 AM</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="duo-btn-3d bg-white border-duo-gray px-6 py-2 text-xs font-black text-duo-text flex items-center gap-2 tracking-widest">
              <Download size={16} /> CSV
            </button>
            <button className="duo-btn-3d bg-duo-blue border-duo-blue-dark px-6 py-2 text-xs font-black text-white flex items-center gap-2 tracking-widest">
              <FileText size={16} /> REPORT
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: HEATMAP & LOG SCROLLER */}
          <div className="lg:col-span-8 space-y-6">
            <div className="duo-card relative bg-white min-h-[400px] flex items-center justify-center overflow-hidden">
               <div className="absolute top-4 left-6 flex items-center gap-2">
                 <div className="h-2 w-2 rounded-full bg-duo-red animate-pulse" />
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Live Data Sync</span>
               </div>

               <div className="flex gap-16 items-center">
                <BlendingHeatmap side="LEFT" mode="History" pressureData={{}} isActive={isPlaying} regions={footRegions} />
                <div className="h-32 w-[2px] bg-duo-gray opacity-30 rounded-full" />
                <BlendingHeatmap side="RIGHT" mode="History" pressureData={{}} isActive={isPlaying} regions={footRegions} />
              </div>
            </div>

            {/* SCROLLABLE 15s INTERVAL TELEMETRY */}
            <div className="duo-card !p-0 overflow-hidden bg-white">
              <div className="p-4 border-b-2 border-duo-gray flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-duo-blue" />
                  <span className="text-[10px] font-black text-duo-text uppercase tracking-widest">Pressure Timeline (15s Window)</span>
                </div>
                <span className="text-[10px] font-black text-gray-400 font-mono">X-AXIS: T+SECONDS</span>
              </div>

              {/* The Scrollable Container */}
              <div 
                ref={scrollRef}
                className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing p-6"
              >
                <div className="w-[2000px] h-64"> {/* Artificial width for horizontal scrolling */}
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                      <XAxis 
                        dataKey="time" 
                        stroke="#AFAFAF" 
                        fontSize={10} 
                        tickMargin={10}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis hide domain={[0, 1000]} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase' }}
                      />
                      {footRegions.map(r => (
                        <Line 
                          key={r.id} 
                          type="monotone" 
                          dataKey={`${r.id}_L`} 
                          stroke={r.color} 
                          strokeWidth={3} 
                          dot={false} 
                          isAnimationActive={false} 
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* REPLAY SCRUBBER */}
              <div className="p-6 bg-gray-50 border-t-2 border-duo-gray">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => { progress === 100 ? setProgress(0) : setIsPlaying(!isPlaying) }}
                    className="h-12 w-12 flex-shrink-0 bg-duo-blue rounded-2xl flex items-center justify-center text-white shadow-[0_4px_0_0_#1899d6] active:translate-y-1 active:shadow-none transition-all"
                  >
                    {progress === 100 ? <RotateCcw size={20} /> : isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                  </button>
                  <div className="flex-1 relative h-3 bg-duo-gray rounded-full">
                    <motion.div 
                      className="absolute h-full bg-duo-blue rounded-full z-10" 
                      style={{ width: `${progress}%` }} 
                    />
                    <input 
                      type="range" min="0" max="100" value={progress}
                      onChange={(e) => setProgress(parseInt(e.target.value))}
                      className="absolute w-full h-full opacity-0 cursor-pointer z-20"
                    />
                  </div>
                  <div className="text-sm font-black text-duo-text font-mono bg-white px-3 py-1 rounded-lg border-2 border-duo-gray">
                    {Math.floor((progress/100) * 15)}s
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: NOTES & STATS */}
          <div className="lg:col-span-4 space-y-6">
            <div className="duo-card">
               <h3 className="text-sm font-black text-duo-text uppercase tracking-widest mb-4 flex items-center gap-2">
                <MessageSquare size={16} className="text-duo-blue" /> Observational Notes
              </h3>
              <textarea 
                placeholder="Log pain points or gait deviations..."
                className="w-full h-40 p-4 rounded-2xl border-2 border-duo-gray bg-gray-50 font-bold text-duo-text focus:border-duo-blue focus:bg-white focus:outline-none transition-all resize-none text-sm"
              />
            </div>

            <div className="duo-card">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Peak Session Metrics</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                    <span>AVG Symmetry</span>
                    <span className="text-duo-green">94%</span>
                  </div>
                  <div className="h-2 bg-duo-gray rounded-full overflow-hidden">
                    <div className="h-full bg-duo-green w-[94%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                    <span>Impact Intensity</span>
                    <span className="text-duo-orange">Moderate</span>
                  </div>
                  <div className="h-2 bg-duo-gray rounded-full overflow-hidden">
                    <div className="h-full bg-duo-orange w-[60%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}