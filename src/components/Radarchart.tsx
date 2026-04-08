"use client";
import React from "react";
import { motion } from "framer-motion";

interface RadarChartProps {
  data: {
    symmetry: number;
    pronation: number;
    balance: number;
    gct: number;
    speed: number;
    load: number;
  };
  size?: number;
}

export default function RadarChart({ data, size = 200 }: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.35;

  // 6 axes: top, top-right, bot-right, bot, bot-left, top-left
  const angles = [-90, -30, 30, 90, 150, 210].map((d) => (d * Math.PI) / 180);
  const values = [
    data.symmetry / 100,
    data.pronation / 100,
    data.balance / 100,
    data.gct / 100,
    data.speed / 100,
    data.load / 100,
  ];
  const labels = ["SYM", "PRO", "BAL", "GCT", "SPD", "LOD"];

  const getPoint = (angle: number, radius: number) => ({
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  });

  // Data polygon points
  const dataPoints = angles.map((a, i) => getPoint(a, r * values[i]));

  const toSVGPoints = (pts: { x: number; y: number }[]) =>
    pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  return (
    <div className="flex items-center justify-center p-2">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="overflow-visible"
        role="img"
        aria-label="Biometric Performance Radar"
      >
        {/* Soft Google-style Concentric Circles (Target Aesthetic) */}
        {[1, 0.75, 0.5, 0.25].map((factor, idx) => (
          <circle
            key={idx}
            cx={cx}
            cy={cy}
            r={r * factor}
            fill={idx % 2 === 0 ? "#f8f9fa" : "#ffffff"}
            stroke="#e8eaed"
            strokeWidth="1"
          />
        ))}

        {/* Axis Spoke Lines (Faded Blueprint style) */}
        {angles.map((angle, i) => {
          const pt = getPoint(angle, r);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={pt.x}
              y2={pt.y}
              stroke="#e8eaed"
              strokeWidth="1"
            />
          );
        })}

        {/* Data Polygon with Tonal Blue Fill */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          points={toSVGPoints(dataPoints)}
          fill="rgba(26, 115, 232, 0.15)"
          stroke="#1a73e8"
          strokeWidth="3"
          strokeLinejoin="round"
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* Intersection Data Points (White dots with blue stroke) */}
        {dataPoints.map((pt, i) => (
          <motion.circle
            initial={{ r: 0 }}
            animate={{ r: 4 }}
            key={i}
            cx={pt.x}
            cy={pt.y}
            fill="white"
            stroke="#1a73e8"
            strokeWidth="2.5"
            transition={{ delay: 0.5 + i * 0.1 }}
          />
        ))}

        {/* Modern Minimalist Labels */}
        {angles.map((angle, i) => {
          const labelR = r + 24;
          const { x, y } = getPoint(angle, labelR);
          
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-sans font-bold text-[10px] fill-gray-400 tracking-widest"
              style={{ textTransform: "uppercase" }}
            >
              {labels[i]}
            </text>
          );
        })}
      </svg>
    </div>
  );
}