"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, FileText, Download, Play, Pause, 
  RotateCcw, MessageSquare, Calendar, Clock, Activity 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, Tooltip, CartesianGrid } from 'recharts';
import { BlendingHeatmap } from '@/components/BlendingHeatmap';
import { useParams, useRouter } from 'next/navigation';

const footRegions = [
  { id: "T1", name: "Hallux", color: "#58CC02" }, { id: "T2", name: "Toe 2", color: "#58CC02" },
  { id: "T3", name: "Toe 3", color: "#58CC02" }, { id: "T4", name: "Toe 4", color: "#58CC02" },
  { id: "T5", name: "Toe 5", color: "#58CC02" }, { id: "M1", name: "Met 1", color: "#1CB0F6" },
  { id: "M2", name: "Met 2", color: "#1CB0F6" }, { id: "M3", name: "Met 3", color: "#1CB0F6" },
  { id: "M4", name: "Met 4", color: "#1CB0F6" }, { id: "M5", name: "Met 5", color: "#1CB0F6" },
  { id: "MM", name: "Med Mid", color: "#FFC800" }, { id: "CM", name: "Cent Mid", color: "#FFC800" },
  { id: "LM", name: "Lat Mid", color: "#FFC800" }, { id: "MH", name: "Med Heel", color: "#FF4B4B" },
  { id: "CH", name: "Cent Heel", color: "#FF4B4B" }, { id: "LH", name: "Lat Heel", color: "#FF4B4B" }
];

export default function SessionDetail() {
  const params = useParams();
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); 
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Generate Static History Data (Simulating a saved session)
  const [historyData] = useState(() => {
    return Array.from({ length: 80 }, (_, i) => {
      const timeInSec = i * 0.25; 
      const minutes = Math.floor(timeInSec / 60);
      const seconds = Math.floor(timeInSec % 60);
      const timestamp = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      const point: any = { time: timestamp, rawTime: timeInSec };
      footRegions.forEach(r => {
        // Create a walking-like wave pattern for the replay
        const wave = Math.sin((timeInSec * 2) + (r.id.charCodeAt(0) * 0.5));
        point[`${r.id}_L`] = Math.max(0, Math.floor(400 + (wave * 300) + Math.random() * 50));
        point[`${r.id}_R`] = Math.max(0, Math.floor(400 - (wave * 300) + Math.random() * 50));
      });
      return point;
    });
  });

  // 2. Derive current frame data for the Heatmaps based on progress
  const currentFrameIndex = Math.floor((progress / 100) * (historyData.length - 1));
  const currentData = historyData[currentFrameIndex];

  const getPressureMap = (side: 'L' | 'R') => {
    const map: any = {};
    footRegions.forEach(r => {
      map[r.id] = currentData[`${r.id}_${side}`];
    });
    return map;
  };

  // 3. Playback Logic
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          const next = prev + 0.4;
          // Auto-scroll the timeline chart
          if (scrollRef.current) {
            scrollRef.current.scrollLeft = (next / 100) * scrollRef.current.scrollWidth - 300;
          }
          return next;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-[#F7F7F7] pt-24 px-4 md:px-8 pb-24 overflow-x-hidden">
      <div className="mx-auto max-w-7xl">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="h-12 w-12 duo-btn-3d bg-white border-duo-gray text-duo-text flex items-center justify-center"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-duo-text tracking-tighter uppercase font-mono">
                REPLAY_LOG_{params.id || '4072'}
              </h1>
              <div className="flex gap-4 text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span className="flex items-center gap-1"><Calendar size={12}/> APR 7, 2026</span>
                <span className="flex items-center gap-1"><Clock size={12}/> 10:32 AM</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="duo-btn-3d bg-white border-duo-gray px-4 py-2 text-[10px] font-black text-duo-text flex items-center gap-2 tracking-widest uppercase">
              <Download size={14} /> CSV
            </button>
            <button className="duo-btn-3d bg-duo-blue border-duo-blue-dark px-4 py-2 text-[10px] font-black text-white flex items-center gap-2 tracking-widest uppercase">
              <FileText size={14} /> Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: HEATMAPS & TIMELINE */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Synchronized Heatmaps */}
            <div className="duo-card relative bg-white py-12 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 overflow-hidden">
               <div className="absolute top-4 left-6 flex items-center gap-2">
                 <div className={`h-2 w-2 rounded-full ${isPlaying ? 'bg-duo-green animate-pulse' : 'bg-gray-300'}`} />
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                   {isPlaying ? 'Replaying Motion' : 'Paused'}
                 </span>
               </div>

               <div className="w-full max-w-[240px]">
                 <p className="text-center text-[9px] font-black text-gray-300 mb-4 tracking-widest uppercase">Left Foot</p>
                 <BlendingHeatmap side="LEFT" pressureData={getPressureMap('L')} history={historyData} />
               </div>
               
               <div className="hidden md:block h-32 w-[2px] bg-duo-gray opacity-30 rounded-full" />
               
               <div className="w-full max-w-[240px]">
                 <p className="text-center text-[9px] font-black text-gray-300 mb-4 tracking-widest uppercase">Right Foot</p>
                 <BlendingHeatmap side="RIGHT" pressureData={getPressureMap('R')} history={historyData} />
               </div>
            </div>

            {/* Scrollable Timeline */}
            <div className="duo-card !p-0 overflow-hidden bg-white shadow-sm">
              <div className="p-4 border-b-2 border-duo-gray flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-duo-blue" />
                  <span className="text-[10px] font-black text-duo-text uppercase tracking-widest">Full Session Telemetry</span>
                </div>
                <span className="text-[9px] font-black text-gray-400 font-mono">UNIT: PSI / SEC</span>
              </div>

              <div 
                ref={scrollRef}
                className="overflow-x-auto scrollbar-hide p-6 select-none"
              >
                <div className="w-[1800px] h-56"> 
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                      <XAxis dataKey="time" stroke="#CCC" fontSize={10} tickMargin={10} axisLine={false} tickLine={false} />
                      <YAxis hide domain={[0, 1000]} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase' }}
                      />
                      {footRegions.filter(f => ["T1", "M1", "MM", "MH"].includes(f.id)).map(r => (
                        <Line key={r.id} type="monotone" dataKey={`${r.id}_L`} stroke={r.color} strokeWidth={3} dot={false} isAnimationActive={false} strokeOpacity={0.5} />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* REPLAY CONTROLS */}
              <div className="p-6 bg-gray-50 border-t-2 border-duo-gray">
                <div className="flex items-center gap-4 md:gap-6">
                  <button 
                    onClick={() => { progress >= 100 ? setProgress(0) : setIsPlaying(!isPlaying) }}
                    className="h-12 w-12 flex-shrink-0 bg-duo-blue rounded-2xl flex items-center justify-center text-white shadow-[0_4px_0_0_#1899d6] active:translate-y-1 active:shadow-none transition-all"
                  >
                    {progress >= 100 ? <RotateCcw size={20} /> : isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                  </button>
                  
                  <div className="flex-1 relative h-3 bg-duo-gray rounded-full">
                    <div 
                      className="absolute h-full bg-duo-blue rounded-full z-10 transition-all duration-100" 
                      style={{ width: `${progress}%` }} 
                    />
                    <input 
                      type="range" min="0" max="100" step="0.1" value={progress}
                      onChange={(e) => {
                        setProgress(parseFloat(e.target.value));
                        setIsPlaying(false);
                      }}
                      className="absolute w-full h-full opacity-0 cursor-pointer z-20"
                    />
                  </div>

                  <div className="text-xs font-black text-duo-text font-mono bg-white px-3 py-1.5 rounded-xl border-2 border-duo-gray shadow-sm">
                    {currentData?.time}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ANALYSIS */}
          <div className="lg:col-span-4 space-y-6">
            <div className="duo-card bg-white">
               <h3 className="text-xs font-black text-duo-text uppercase tracking-widest mb-4 flex items-center gap-2">
                <MessageSquare size={16} className="text-duo-blue" /> Clinical Notes
              </h3>
              <textarea 
                placeholder="Type observations here..."
                className="w-full h-32 md:h-48 p-4 rounded-2xl border-2 border-duo-gray bg-gray-50 font-bold text-duo-text focus:border-duo-blue focus:bg-white focus:outline-none transition-all resize-none text-sm"
              />
              <button className="w-full mt-4 duo-btn-3d bg-white border-duo-gray py-3 text-[10px] font-black uppercase text-gray-400">
                Save Observations
              </button>
            </div>

            <div className="duo-card bg-white border-b-8 border-duo-green">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 text-center">Snapshot Analysis</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                    <span>Symmetry Score</span>
                    <span className="text-duo-green">94%</span>
                  </div>
                  <div className="h-2.5 bg-duo-gray rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '94%' }} className="h-full bg-duo-green" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                    <span>Heel Strike Impact</span>
                    <span className="text-duo-orange">High</span>
                  </div>
                  <div className="h-2.5 bg-duo-gray rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '78%' }} className="h-full bg-duo-orange" />
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-dashed border-gray-200">
                <p className="text-[9px] font-bold text-gray-400 text-center leading-relaxed italic">
                  "Slight pronation detected in the mid-stance phase between 0:04 and 0:08."
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}