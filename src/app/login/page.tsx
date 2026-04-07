"use client";
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Activity, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setError(result.error || "Authentication failed");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("A network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-white flex flex-col lg:flex-row items-center justify-center p-6 gap-12">
      
      {/* 1. PRODUCT INFORMATION SECTION */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div>
          <h1 className="text-4xl font-black text-duo-text tracking-tighter mb-4 italic uppercase">
            Gait Analyser
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

      {/* 2. LOGIN FORM CARD */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md duo-card !p-8 bg-white"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-black text-duo-text tracking-tight uppercase">Access Portal</h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
            New users will be registered automatically
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          
          {/* ERROR DISPLAY */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-red-50 border-2 border-duo-red/20 rounded-xl p-3"
              >
                <p className="text-[10px] font-black text-duo-red uppercase tracking-widest">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* EMAIL */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-duo-blue" size={18} />
              <input 
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="doctor@gait.com"
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
                required
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
                className="w-full h-12 pl-12 pr-4 rounded-2xl border-2 border-duo-gray bg-gray-50 font-bold text-duo-text focus:border-duo-blue focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <button 
            disabled={loading}
            type="submit"
            className={`w-full h-14 duo-btn-3d flex items-center justify-center gap-3 mt-4 group transition-all
              ${loading ? 'bg-gray-200 border-gray-300 cursor-not-allowed' : 'bg-duo-green border-duo-green-dark text-white'}`}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span className="font-black tracking-widest">ENTER SYSTEM</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

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