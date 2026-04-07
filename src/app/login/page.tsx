"use client";
import React, { useState } from 'react';
import { User, Mail, Lock, ArrowRight, Activity, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  return (
    <div className="min-h-[calc(100vh-80px)] bg-white flex flex-col lg:flex-row items-center justify-center p-6 gap-12">
      
      {/* 1. PRODUCT INFORMATION SECTION */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div>
          <h1 className="text-4xl font-black text-duo-text tracking-tighter mb-4">
            GAIT ANALYSER
          </h1>
          <p className="text-lg font-bold text-gray-500 leading-relaxed">
            Precision movement tracking for the next generation of athletic and clinical analysis.
          </p>
        </div>

        <div className="space-y-6">
          <FeatureItem 
            icon={<Zap className="text-duo-orange" size={20} />} 
            title="Real-time Telemetry" 
            desc="16-channel pressure mapping with sub-millisecond latency." 
          />
          <FeatureItem 
            icon={<Activity className="text-duo-blue" size={20} />} 
            title="Gait Symmetry" 
            desc="Automated balance scoring and stance-phase detection." 
          />
          <FeatureItem 
            icon={<ShieldCheck className="text-duo-green" size={20} />} 
            title="Injury Prevention" 
            desc="Predictive fall-risk indicators and posture alerts." 
          />
        </div>
      </motion.div>

      {/* 2. SIGNUP FORM CARD */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md duo-card !p-8"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-black text-duo-text tracking-tight">Login</h2>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">
            Start your live session
          </p>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          {/* NAME */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-duo-blue" size={18} />
              <input 
                type="text"
                placeholder="John Doe"
                className="w-full h-12 pl-12 pr-4 rounded-2xl border-2 border-duo-gray bg-gray-50 font-bold text-duo-text focus:border-duo-blue focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-duo-blue" size={18} />
              <input 
                type="email"
                placeholder="hello@example.com"
                className="w-full h-12 pl-12 pr-4 rounded-2xl border-2 border-duo-gray bg-gray-50 font-bold text-duo-text focus:border-duo-blue focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Security Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-duo-blue" size={18} />
              <input 
                type="password"
                placeholder="••••••••"
                className="w-full h-12 pl-12 pr-4 rounded-2xl border-2 border-duo-gray bg-gray-50 font-bold text-duo-text focus:border-duo-blue focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full h-14 duo-btn-3d bg-duo-green border-duo-green-dark text-white flex items-center justify-center gap-3 mt-4 group"
          >
            <span>GET STARTED</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// Helper component for Gait Analyser features
function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-4 p-4 rounded-2xl border-2 border-transparent hover:border-duo-gray hover:bg-gray-50 transition-all cursor-default group">
      <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-white border-2 border-duo-gray flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <h3 className="font-black text-duo-text text-sm tracking-tight">{title}</h3>
        <p className="text-xs font-bold text-gray-400 leading-tight">{desc}</p>
      </div>
    </div>
  );
}