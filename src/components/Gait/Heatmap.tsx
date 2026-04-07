// components/Gait/Heatmap.tsx
import { motion } from 'framer-motion';

const getPressureColor = (val: number) => {
  if (val < 250) return 'bg-blue-500';
  if (val < 600) return 'bg-yellow-500';
  return 'bg-red-500';
};

export const Heatmap = ({ zones, label }: { zones: number[], label: string }) => (
  <div className="flex flex-col items-center p-4 bg-gray-900 rounded-2xl">
    <span className="text-sm font-mono mb-2">{label}</span>
    <div className="grid grid-cols-2 gap-2 w-24 h-40">
      {zones.map((p, i) => (
        <motion.div
          key={i}
          animate={{ backgroundColor: p > 600 ? '#E74C3C' : p > 250 ? '#F1C40F' : '#3498DB' }}
          className="w-full h-full rounded-md opacity-80"
        />
      ))}
    </div>
  </div>
);