"use client";
import React from "react";
import { motion } from "framer-motion";

// --- Google Brand Palette ---
const googleColors = {
  blue: { bg: "#e8f0fe", text: "#1a73e8", icon: "#1a73e8", progress: "#1a73e8" },
  green: { bg: "#e6f4ea", text: "#1e8e3e", icon: "#1e8e3e", progress: "#34a853" },
  red: { bg: "#fce8e6", text: "#d93025", icon: "#d93025", progress: "#ea4335" },
  yellow: { bg: "#fef7e0", text: "#f9ab00", icon: "#f9ab00", progress: "#fbbc04" },
  pink: { bg: "#fef0f7", text: "#d01884", icon: "#d01884", progress: "#e84393" },
  gray: { bg: "#f1f3f4", text: "#5f6368", icon: "#5f6368", progress: "#9aa0a6" },
};

type Variant = keyof typeof googleColors;

// ─── PressureHeatmap (Clean Clinical Grid) ───────────────────────────────────
interface PressureHeatmapProps {
  grid: number[][];
  label: string;
  operated?: boolean;
}

export function PressureHeatmap({ grid, label, operated = false }: PressureHeatmapProps) {
  // Google-style tonal mapping: White -> Light Blue -> Deep Blue
  const getColor = (val: number) => {
    if (val < 20) return "#f8f9fa"; // Neutral Gray
    if (val < 40) return "#e8f0fe"; // Light Google Blue
    if (val < 60) return "#d2e3fc"; // Soft Blue
    if (val < 80) return "#8ab4f8"; // Tonal Blue
    return "#1a73e8"; // Product Blue
  };

  return (
    <div className="bg-white border border-gray-100 rounded-[24px] p-5 shadow-sm">
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          {label}
        </span>
        {operated && (
          <span className="px-1.5 py-0.5 rounded text-[8px] bg-blue-600 text-white font-bold">
            OP.
          </span>
        )}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {grid.flat().map((val, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{ backgroundColor: getColor(val) }}
            className="aspect-square rounded-lg border border-gray-50 transition-colors duration-500"
          />
        ))}
      </div>
    </div>
  );
}

// ─── StanceSwingBar (Tonal Ratio) ───────────────────────────────────────────
interface StanceSwingBarProps {
  stancePct: number;
  label?: string;
  color?: string;
}

export function StanceSwingBar({
  stancePct,
  label = "Gait Phase Ratio",
  color = "#1a73e8",
}: StanceSwingBarProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-[24px] p-5 shadow-sm">
      <div className="flex justify-between items-end mb-3">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          {label}
        </span>
        <div className="text-xs font-bold text-blue-600">
          {stancePct}% <span className="text-[10px] text-gray-300">STANCE</span>
        </div>
      </div>
      
      <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${stancePct}%` }}
          className="h-full"
          style={{ backgroundColor: color }}
        />
      </div>
      
      <div className="flex justify-between mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-600" />
          <span className="text-[9px] font-bold text-gray-400 uppercase">Stance</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-gray-200" />
          <span className="text-[9px] font-bold text-gray-400 uppercase">Swing</span>
        </div>
      </div>
    </div>
  );
}

// ─── TabBar (Google Material Pill) ──────────────────────────────────────────
interface Tab {
  id: string;
  label: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function TabBar({ tabs, activeTab, onChange, className = "" }: TabBarProps) {
  return (
    <div className={`bg-gray-100 p-1 rounded-[20px] flex gap-1 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="relative flex-1 py-2 px-4 rounded-[16px] text-xs font-bold transition-all duration-300 outline-none"
          >
            {/* Active Sliding Background */}
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white shadow-sm rounded-[16px]"
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}
            
            <span className={`relative z-10 ${isActive ? "text-blue-600" : "text-gray-500"}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Badge (Pill Style) ──────────────────────────────────────────────────────
interface BadgeProps {
  children: React.ReactNode;
  variant?: "blue" | "green" | "red" | "amber" | "gray";
  className?: string;
}

export function Badge({ children, variant = "gray", className = "" }: BadgeProps) {
  const themes = {
    blue: { bg: "#e8f0fe", text: "#1a73e8" },
    green: { bg: "#e6f4ea", text: "#1e8e3e" },
    red: { bg: "#fce8e6", text: "#d93025" },
    amber: { bg: "#fef7e0", text: "#b45309" }, // Improved amber for legibility
    gray: { bg: "#f1f3f4", text: "#5f6368" },
  };

  // Fallback to 'gray' if the variant is undefined or missing
  const theme = themes[variant] || themes.gray;

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase inline-flex items-center transition-colors ${className}`}
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      {children}
    </span>
  );
}

// ─── MetricCard (Soft Elevation) ─────────────────────────────────────────────
export function MetricCard({
  label,
  value,
  unit,
  progress,
  progressColor = "blue",
  badge,
  className = "",
  onClick,
}: any) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-white border border-gray-200 rounded-[28px] p-6 flex flex-col justify-between min-h-[160px] transition-shadow hover:shadow-lg hover:border-transparent cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest font-sans">
          {label}
        </div>
        {badge && <Badge variant={badge.variant}>{badge.text}</Badge>}
      </div>

      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-gray-900 tracking-tight font-sans">
            {value}
          </span>
          {unit && <span className="text-xs font-bold text-gray-400 uppercase">{unit}</span>}
        </div>

        {progress !== undefined && (
          <div className="mt-5">
            <ProgressBar value={progress} color={progressColor} height={6} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── SectionTitle (Clean & Bold) ─────────────────────────────────────────────
export function SectionTitle({ children, className = "" }: any) {
  return (
    <h3 className={`text-[12px] font-extrabold text-gray-500 uppercase tracking-[0.2em] px-2 mt-8 mb-4 ${className}`}>
      {children}
    </h3>
  );
}

// ─── ProgressBar (Tonal Fill) ────────────────────────────────────────────────
export function ProgressBar({ value, color = "blue", height = 8 }: any) {
  const theme = googleColors[color as Variant] || googleColors.blue;
  return (
    <div className="w-full bg-gray-100 rounded-full overflow-hidden" style={{ height }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(value, 100)}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ backgroundColor: theme.progress }}
      />
    </div>
  );
}

// ─── InfoBox (Callout Style) ─────────────────────────────────────────────────
export function InfoBox({ children }: any) {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-[20px] p-5 mt-4">
      <div className="flex gap-4">
        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
          i
        </div>
        <p className="text-[14px] leading-relaxed text-blue-900 font-medium">
          {children}
        </p>
      </div>
    </div>
  );
}

// ─── DischargeProgress (Goal Tracker) ────────────────────────────────────────
export function DischargeProgress({ label, current, target, unit, color = "green" }: any) {
  const pct = Math.min((current / target) * 100, 100);
  const achieved = current >= target;
  const theme = googleColors[color as Variant] || googleColors.green;

  return (
    <div className="bg-white border border-gray-200 rounded-[32px] p-6 transition-all hover:border-blue-200">
      <div className="flex justify-between items-center mb-5">
        <span className="font-sans font-bold text-gray-800 text-lg tracking-tight">{label}</span>
        {achieved ? (
          <Badge variant="green">Complete</Badge>
        ) : (
          <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
            Target: {target}{unit}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 mb-5">
        <span className="text-5xl font-bold text-gray-900 tracking-tighter">{current}</span>
        <span className="text-sm font-bold text-gray-400 self-end mb-2">{unit}</span>
      </div>

      <ProgressBar value={pct} color={color} height={10} />
      
      <div className="flex justify-between mt-4">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Readiness</span>
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: theme.text }}>
          {Math.round(pct)}%
        </span>
      </div>
    </div>
  );
}

// --- Status Components ---
export const LiveDot = () => (
  <span className="relative flex h-3 w-3">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
  </span>
);

export const Toggle = ({ on, onChange }: any) => (
  <button 
    onClick={() => onChange(!on)}
    className={`w-12 h-7 rounded-full transition-colors duration-300 relative flex items-center px-1 ${on ? 'bg-blue-600' : 'bg-gray-300'}`}
  >
    <motion.div 
      animate={{ x: on ? 20 : 0 }}
      className="w-5 h-5 bg-white rounded-full shadow-sm"
    />
  </button>
);

export const Divider = () => <div className="h-[1px] w-full bg-gray-100 my-6" />;