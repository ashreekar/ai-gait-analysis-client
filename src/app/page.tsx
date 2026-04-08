"use client";
import React from 'react';
import { 
  Activity, 
  Cpu, 
  Zap, 
  ArrowRight, 
  Binary, 
  ShieldCheck, 
  Maximize2,
  Database
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-white selection:bg-duo-blue overflow-x-hidden">
      
      {/* HERO SECTION */}
      <header className="relative pt-32 pb-40 border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1CB0F615,transparent_70%)]" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-duo-blue/10 border border-duo-blue/20 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-duo-blue opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-duo-blue"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-duo-blue">Next-Gen Digital Twin</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-none">
              GAIT <span className="text-transparent bg-clip-text bg-gradient-to-r from-duo-blue to-cyan-400">TWIN</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl mb-12 font-medium leading-relaxed">
              A high-fidelity virtual mirror of human locomotion. Fusing 16-point pressure sensing 
              with Edge-AI to provide real-time biomechanical analysis.
            </p>

            <Link href="/login">
              <button className="group relative px-12 py-5 bg-duo-blue rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_6px_0_0_#1899d6] active:translate-y-1 active:shadow-none transition-all">
                <span className="flex items-center gap-3">
                  Enter Clinical Portal <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </Link>
          </motion.div>
        </div>
      </header>

      {/* CORE TECHNOLOGY SECTION */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-4xl font-black mb-8 tracking-tighter uppercase">The Methodology</h2>
              <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="h-12 w-12 shrink-0 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                    <Zap className="text-duo-blue" />
                  </div>
                  <div>
                    <h4 className="font-black text-lg mb-2 uppercase tracking-tight text-white">Wireless Data Fusion</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Real-time synchronization of a 16-point FSR array and 6-axis MEMS IMU for 
                      comprehensive 3D spatial kinematics.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="h-12 w-12 shrink-0 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                    <Cpu className="text-duo-green" />
                  </div>
                  <div>
                    <h4 className="font-black text-lg mb-2 uppercase tracking-tight text-white">Edge-AI Pipeline</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      On-device LSTM neural networks classify gait phases and predict fall risks 
                      with sub-10ms inference latency.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="h-12 w-12 shrink-0 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                    <Binary className="text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-black text-lg mb-2 uppercase tracking-tight text-white">Digital Twin Rendering</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      A continuous virtual model updated at 500Hz, bridging the gap between $20k lab 
                      setups and low-cost home rehab.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-duo-blue/20 blur-3xl rounded-full" />
              <div className="relative aspect-square rounded-[3rem] border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center p-12">
                <div className="text-center">
                  <Activity size={80} className="text-duo-blue mx-auto mb-6 animate-pulse" />
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Live Stream 500Hz</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TECHNICAL SPECS (TABLE) */}
      <section className="py-32 bg-white/5">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black tracking-tighter uppercase mb-4">System Specifications</h2>
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Hardware & Software Integration</p>
          </div>

          <div className="border border-white/10 rounded-[2.5rem] overflow-hidden bg-black/40 backdrop-blur-md">
            {[
              { label: "Processing", value: "STM32 ARM Cortex-M33 (160MHz)", icon: Cpu },
              { label: "Sensing", value: "16-Point FSR Array + 6-Axis IMU", icon: Maximize2 },
              { label: "Machine Learning", value: "CMSIS-NN Optimized LSTM Models", icon: ShieldCheck },
              { label: "Data Pipeline", value: "Structured JSON via 115200 Baud", icon: Database }
            ].map((spec, i) => (
              <div key={i} className="flex items-center justify-between p-8 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <spec.icon size={18} className="text-duo-blue" />
                  <span className="text-xs font-black uppercase tracking-widest text-gray-400">{spec.label}</span>
                </div>
                <span className="text-sm font-bold text-white text-right">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600 mb-8">
            © 2026 Gait Twin Technology
          </p>
          <Link href="/login" className="text-duo-blue hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
            Access Restricted Portal
          </Link>
        </div>
      </footer>

    </div>
  );
}