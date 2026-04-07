"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  ArrowLeft, Bluetooth, User, Clock, 
  Wifi, ShieldCheck, HelpCircle, RefreshCw, 
  Signal, Battery, Info, Save, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function SettingsScreen() {
  const { data: session, update } = useSession();
  const router = useRouter();
  
  const [isScanning, setIsScanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Local state for form fields
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    sleepTimeout: '5 Min',
    syncMode: 'Wi-Fi Only'
  });

  // Sync session data to local state on load
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        age: (session.user as any).age || '',
        weight: (session.user as any).weight || '',
        sleepTimeout: (session.user as any).sleepTimeout || '5 Min',
        syncMode: (session.user as any).syncMode || 'Wi-Fi Only'
      });
    }
  }, [session]);

  const handleSave = async () => {
    setIsSaving(true);
    // Here you would typically make an API call to update the MongoDB user
    // e.g., await axios.patch('/api/user/update', formData);
    
    setTimeout(() => {
      setIsSaving(false);
      // Optional: show a success toast or update session
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] pt-24 px-6 pb-24">
      <div className="mx-auto max-w-4xl">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="h-12 w-12 duo-btn-3d bg-white border-duo-gray text-duo-text flex items-center justify-center hover:bg-gray-50"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-duo-text tracking-tighter italic uppercase">Settings</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">System Configuration & Analytics</p>
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="duo-btn-3d bg-duo-blue border-duo-blue-dark text-white px-6 py-3 flex items-center gap-2"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span className="text-[10px] font-black tracking-widest uppercase">Save Changes</span>
          </button>
        </div>

        <div className="space-y-8">
          
          {/* DEVICE PAIRING SECTION */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-sm font-black text-duo-text uppercase tracking-widest flex items-center gap-2">
                <Bluetooth size={18} className="text-duo-blue" /> Hardware Pairing
              </h2>
              <button 
                onClick={() => {
                  setIsScanning(true);
                  setTimeout(() => setIsScanning(false), 3000);
                }}
                className="text-[10px] font-black text-duo-blue uppercase tracking-widest flex items-center gap-1 hover:underline"
              >
                <RefreshCw size={12} className={isScanning ? "animate-spin" : ""} /> Scan for Insoles
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DeviceCard side="LEFT" status="connected" rssi="-62 dBm" battery={88} />
              <DeviceCard side="RIGHT" status={isScanning ? "scanning" : "disconnected"} rssi={null} battery={null} />
            </div>
          </section>

          {/* PATIENT PARAMETERS */}
          <section className="duo-card">
            <h2 className="text-sm font-black text-duo-text uppercase tracking-widest mb-6 flex items-center gap-2">
              <User size={18} className="text-duo-green" /> Biometric Calibration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputGroup 
                label="Display Name" 
                value={formData.name}
                onChange={(v: string) => setFormData({...formData, name: v})}
              />
              <InputGroup 
                label="Age" 
                type="number"
                value={formData.age}
                onChange={(v: string) => setFormData({...formData, age: v})}
              />
              <InputGroup 
                label="Weight (kg)" 
                type="number"
                value={formData.weight}
                onChange={(v: string) => setFormData({...formData, weight: v})}
              />
            </div>
            <p className="mt-4 text-[10px] font-bold text-gray-400 italic">
              *Weight is mandatory for Ground Reaction Force (GRF) accuracy.
            </p>
          </section>

          {/* SYSTEM PREFERENCES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="duo-card">
              <h2 className="text-sm font-black text-duo-text uppercase tracking-widest mb-4 flex items-center gap-2">
                <Clock size={18} className="text-duo-orange" /> Sleep Timeout
              </h2>
              <div className="flex gap-2">
                {['1 Min', '5 Min', 'Never'].map((opt) => (
                  <button 
                    key={opt} 
                    onClick={() => setFormData({...formData, sleepTimeout: opt})}
                    className={`flex-1 duo-btn-3d py-2 text-[10px] font-black tracking-widest transition-all
                      ${formData.sleepTimeout === opt 
                        ? 'bg-duo-orange border-orange-600 text-white' 
                        : 'bg-white border-duo-gray text-duo-text'}`}
                  >
                    {opt.toUpperCase()}
                  </button>
                ))}
              </div>
            </section>

            <section className="duo-card">
              <h2 className="text-sm font-black text-duo-text uppercase tracking-widest mb-4 flex items-center gap-2">
                <Wifi size={18} className="text-duo-blue" /> Data Sync
              </h2>
              <select 
                value={formData.syncMode}
                onChange={(e) => setFormData({...formData, syncMode: e.target.value})}
                className="w-full h-12 rounded-2xl border-2 border-duo-gray bg-white px-4 font-black text-[10px] uppercase text-duo-text focus:border-duo-blue outline-none cursor-pointer"
              >
                <option>Wi-Fi Only</option>
                <option>Mobile Data</option>
                <option>Offline (Local Storage)</option>
              </select>
            </section>
          </div>

          {/* ABOUT */}
          <section className="space-y-4">
            <h2 className="text-sm font-black text-duo-text uppercase tracking-widest flex items-center gap-2">
              <HelpCircle size={18} className="text-gray-400" /> Support & Info
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <HelpAction icon={<ShieldCheck />} label="Calibration Tutorial" />
              <HelpAction icon={<Info />} label="v2.4.0-Stable" sub="Up to date" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function DeviceCard({ side, status, rssi, battery }: any) {
  const isConnected = status === 'connected';
  const isScanning = status === 'scanning';
  
  return (
    <div className={`duo-card border-l-8 transition-all ${isConnected ? 'border-l-duo-green' : 'border-l-duo-orange'} ${isScanning ? 'animate-pulse' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{side} INSOLE</p>
          <h3 className="text-lg font-black text-duo-text">
            {isConnected ? 'GAIT_PRO_X1' : isScanning ? 'SCANNING...' : 'DISCONNECTED'}
          </h3>
        </div>
        {isConnected && (
          <div className="flex gap-3">
             <div className="flex flex-col items-end">
               <Signal size={16} className="text-duo-green" />
               <span className="text-[8px] font-bold text-gray-400 mt-1">{rssi}</span>
             </div>
             <div className="flex flex-col items-end">
               <Battery size={16} className="text-duo-green" />
               <span className="text-[8px] font-bold text-gray-400 mt-1">{battery}%</span>
             </div>
          </div>
        )}
      </div>
      <button className={`w-full py-2 rounded-xl border-2 font-black text-[10px] tracking-widest uppercase transition-all
        ${isConnected ? 'bg-white border-duo-red text-duo-red' : 'bg-duo-blue border-duo-blue-dark text-white shadow-[0_4px_0_0_#1899d6]'}
      `}>
        {isConnected ? 'TERMINATE PAIR' : 'INITIATE PAIR'}
      </button>
    </div>
  );
}

function InputGroup({ label, value, onChange, type = "text" }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <input 
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 rounded-2xl border-2 border-duo-gray bg-gray-50 px-4 font-bold text-duo-text focus:border-duo-green focus:bg-white outline-none transition-all"
      />
    </div>
  );
}

function HelpAction({ icon, label, sub }: any) {
  return (
    <button className="duo-card flex items-center justify-between hover:border-duo-blue transition-colors text-left group bg-white">
      <div className="flex items-center gap-4">
        <div className="text-gray-400 group-hover:text-duo-blue transition-colors">{icon}</div>
        <div>
          <p className="text-xs font-black text-duo-text uppercase tracking-tight">{label}</p>
          {sub && <p className="text-[8px] font-bold text-gray-400 uppercase">{sub}</p>}
        </div>
      </div>
      <RefreshCw size={14} className="text-gray-300" />
    </button>
  );
}