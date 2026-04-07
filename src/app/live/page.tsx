"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Battery, Play, Square, Moon, Activity, Zap, BrainCircuit, Target, RefreshCcw } from 'lucide-react';
import { useGaitSimulation } from '@/lib/hooks/useGaitSimulation';

export default function ModernGaitDashboard() {
  const [isRunning, setIsRunning] = useState(false);
  const [isSleepMode, setIsSleepMode] = useState(false);
  const gait = useGaitSimulation(isRunning);

  const getStatusColor = (val: number) => {
    if (val > 80) return 'text-gait-success';
    if (val > 60) return 'text-gait-warning';
    return 'text-gait-error';
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-all duration-700 font-sans ${isSleepMode ? 'opacity-20 scale-95 blur-sm' : 'opacity-100'}`}>
      
      {/* HEADER */}
      <header className="glass-panel mb-8 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-teal/10 rounded-full blur-3xl" />
        
        <div className="flex items-center gap-4 z-10">
          <div className="p-3 bg-primary-teal/20 rounded-xl">
            <Zap className="text-primary-teal" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gait Analysis <span className="text-primary-teal">Live</span></h1>
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">MSRIT_DEMO_NODE_01</p>
          </div>
        </div>

        <div className="flex gap-4 z-10">
          <BatteryIndicator label="L" value={gait.battery.L} />
          <BatteryIndicator label="R" value={gait.battery.R} />
          <div className="px-4 py-2 bg-black/40 border border-border-subtle rounded-lg font-mono text-xs text-primary-teal">
            T+{(gait.timestamp / 1000).toFixed(2)}s
          </div>
        </div>
      </header>

      {/* VISUALIZATION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* DIGITAL TWIN */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 min-h-[420px] flex flex-col items-center justify-center relative">
          <div className="absolute top-6 left-6 flex items-center gap-2 text-[10px] text-gray-500 font-mono italic">
            <Activity size={14} className="text-primary-teal animate-pulse" />
            LIVE KINEMATIC STREAM
          </div>
          
          <motion.div 
            animate={{ rotate: isRunning ? gait.angle : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="w-1.5 h-48 bg-primary-teal rounded-full relative shadow-[0_0_30px_rgba(0,180,216,0.4)]"
          >
            <div className="w-8 h-8 bg-primary-teal rounded-full absolute -top-9 -left-3 shadow-lg" />
            <div className="absolute bottom-0 -left-10 w-20 h-2 bg-white/5 rounded-full blur-sm" />
          </motion.div>

          {!isRunning && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-md flex items-center justify-center rounded-3xl z-20">
              <div className="flex flex-col items-center gap-4">
                <RefreshCcw className="text-gray-600 animate-spin-slow" size={32} />
                <span className="text-xs font-mono text-gray-500 tracking-[0.4em] uppercase">Initialize Session</span>
              </div>
            </div>
          )}
        </div>

        {/* PRESSURE HEATMAP */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col">
          <h3 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-10">Pressure Distribution</h3>
          <div className="flex justify-around items-center flex-1">
            <FootHeatmap side="LEFT" data={gait.leftPressure} isActive={isRunning} />
            <div className="w-[1px] h-32 bg-border-subtle/50" />
            <FootHeatmap side="RIGHT" data={gait.rightPressure} isActive={isRunning} />
          </div>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
        <MetricCard label="Symmetry" value={`${gait.symmetry}%`} icon={<Target className="text-primary-teal" />} statusColor={getStatusColor(gait.symmetry)} />
        <MetricCard label="Gait Phase" value={gait.phase} icon={<Activity className="text-accent-violet" />} isUppercase />
        <MetricCard label="Fall Risk" value={gait.fallRisk} sub="AI Confidence: 92%" statusColor={gait.fallRisk === 'Low' ? 'text-gait-success' : 'text-gait-error'} />
        <MetricCard label="Health Score" value="94/100" icon={<BrainCircuit className="text-primary-teal" />} />
      </div>

      {/* BOTTOM CONTROLS */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-fit glass-panel px-6 py-4 rounded-full flex items-center gap-6 shadow-2xl border-primary-teal/20 z-50">
        <button 
          onClick={() => setIsRunning(!isRunning)}
          className={`flex items-center gap-3 px-10 py-3 rounded-full font-bold tracking-tighter transition-all hover:scale-105 active:scale-95 ${
            isRunning ? 'bg-gait-error text-white shadow-lg shadow-red-500/20' : 'bg-primary-teal text-black shadow-lg shadow-cyan-500/20'
          }`}
        >
          {isRunning ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
          {isRunning ? 'STOP ANALYSIS' : 'START LIVE STREAM'}
        </button>

        <div className="h-8 w-[1px] bg-border-subtle" />

        <button onClick={() => setIsSleepMode(!isSleepMode)} className="p-3 hover:bg-white/5 rounded-full text-gray-400 transition-colors">
          <Moon size={20} className={isSleepMode ? 'text-yellow-400' : ''} />
        </button>
      </div>
    </div>
  );
}

// SUB-COMPONENTS
const FootHeatmap = ({ side, data, isActive }: { side: string, data: number[], isActive: boolean }) => (
  <div className="flex flex-col items-center gap-6">
    <span className="text-[9px] font-mono font-bold text-gray-600 tracking-widest">{side}</span>
    <div className="grid grid-cols-2 gap-2 w-20 h-36 bg-black/40 rounded-[40px] p-3 border border-border-subtle/50 relative shadow-inner">
      {data.map((val, i) => (
        <motion.div 
          key={i}
          animate={{ 
            backgroundColor: !isActive ? '#1A1D21' : val > 600 ? '#E74C3C' : val > 300 ? '#F1C40F' : '#00B4D8',
            boxShadow: isActive && val > 300 ? `0 0 15px ${val > 600 ? 'rgba(231,76,60,0.4)' : 'rgba(0,180,216,0.4)'}` : 'none'
          }}
          className="rounded-lg w-full h-full transition-all duration-300"
        />
      ))}
    </div>
  </div>
);

const MetricCard = ({ label, value, icon, sub, statusColor, isUppercase }: any) => (
  <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
      {icon && React.cloneElement(icon as React.ReactElement, { size: 80 })}
    </div>
    <div className="flex justify-between items-start mb-4">
      <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{label}</span>
      {icon}
    </div>
    <p className={`text-2xl font-bold font-mono ${statusColor || 'text-white'} ${isUppercase ? 'uppercase italic text-lg' : ''}`}>
      {value}
    </p>
    {sub && <p className="text-[9px] text-gray-600 mt-1 font-mono">{sub}</p>}
  </div>
);

const BatteryIndicator = ({ label, value }: { label: string, value: number }) => (
  <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg border border-border-subtle">
    <span className="text-[10px] font-bold text-gray-500">{label}</span>
    <Battery size={14} className={value > 20 ? 'text-gait-success' : 'text-gait-error'} />
    <span className="text-xs font-mono">{value.toFixed(0)}%</span>
  </div>
);