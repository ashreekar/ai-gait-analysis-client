"use client";
import React, { useState } from 'react';
import { 
  ArrowLeft, Bluetooth, User, Clock, 
  Wifi, ShieldCheck, HelpCircle, RefreshCw, 
  Signal, Battery, Info
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [pairingStatus, setPairingStatus] = useState({ left: 'connected', right: 'scanning' });
  const [syncMode, setSyncMode] = useState('Wi-Fi Only');

  return (
    <div className="min-h-screen bg-[#F7F7F7] pt-24 px-6 pb-24">
      <div className="mx-auto max-w-4xl">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <button className="h-12 w-12 duo-btn-3d bg-white border-duo-gray text-duo-text flex items-center justify-center">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-duo-text tracking-tighter">SETTINGS</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">System Configuration & Hardware</p>
          </div>
        </div>

        <div className="space-y-8">
          
          {/* DEVICE PAIRING SECTION */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-sm font-black text-duo-text uppercase tracking-widest flex items-center gap-2">
                <Bluetooth size={18} className="text-duo-blue" /> Device Pairing
              </h2>
              <button 
                onClick={() => setIsScanning(true)}
                className="text-[10px] font-black text-duo-blue uppercase tracking-widest flex items-center gap-1 hover:underline"
              >
                <RefreshCw size={12} className={isScanning ? "animate-spin" : ""} /> Scan for Devices
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DeviceCard side="LEFT" status={pairingStatus.left} rssi="-62 dBm" battery={88} />
              <DeviceCard side="RIGHT" status={pairingStatus.right} rssi={null} battery={null} />
            </div>
          </section>

          {/* PATIENT INFO (Algorithm Parameters) */}
          <section className="duo-card">
            <h2 className="text-sm font-black text-duo-text uppercase tracking-widest mb-6 flex items-center gap-2">
              <User size={18} className="text-duo-green" /> Patient Parameters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputGroup label="Full Name" placeholder="Ashreek A R" />
              <InputGroup label="Age" placeholder="22" type="number" />
              <InputGroup label="Weight (kg)" placeholder="70" type="number" />
            </div>
            <p className="mt-4 text-[10px] font-bold text-gray-400 italic">
              *Weight is used to calibrate pressure sensor sensitivity and gait impact force.
            </p>
          </section>

          {/* SYSTEM PREFERENCES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sleep Timeout */}
            <section className="duo-card">
              <h2 className="text-sm font-black text-duo-text uppercase tracking-widest mb-4 flex items-center gap-2">
                <Clock size={18} className="text-duo-orange" /> Sleep Timeout
              </h2>
              <div className="flex gap-2">
                {['1 Min', '5 Min', 'Never'].map((opt) => (
                  <button key={opt} className="flex-1 duo-btn-3d bg-white border-duo-gray py-2 text-[10px] font-black text-duo-text hover:border-duo-orange">
                    {opt.toUpperCase()}
                  </button>
                ))}
              </div>
            </section>

            {/* Data Sync */}
            <section className="duo-card">
              <h2 className="text-sm font-black text-duo-text uppercase tracking-widest mb-4 flex items-center gap-2">
                <Wifi size={18} className="text-duo-blue" /> Data Sync
              </h2>
              <select 
                value={syncMode}
                onChange={(e) => setSyncMode(e.target.value)}
                className="w-full h-12 rounded-2xl border-2 border-duo-gray bg-white px-4 font-bold text-duo-text focus:border-duo-blue outline-none"
              >
                <option>Wi-Fi Only</option>
                <option>Mobile Data</option>
                <option>Offline (Local Storage)</option>
              </select>
            </section>
          </div>

          {/* ABOUT / HELP */}
          <section className="space-y-4">
            <h2 className="text-sm font-black text-duo-text uppercase tracking-widest flex items-center gap-2">
              <HelpCircle size={18} className="text-gray-400" /> Support
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <HelpAction icon={<ShieldCheck />} label="Calibration Tutorial" />
              <HelpAction icon={<Info />} label="Version 2.4.0-Stable" sub="Check for Updates" />
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
  
  return (
    <div className={`duo-card border-l-8 ${isConnected ? 'border-l-duo-green' : 'border-l-duo-orange animate-pulse'}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{side} INSOLE</p>
          <h3 className="text-lg font-black text-duo-text">{isConnected ? 'GAIT_PRO_X1' : 'SEARCHING...'}</h3>
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
        {isConnected ? 'DISCONNECT' : 'PAIR DEVICE'}
      </button>
    </div>
  );
}

function InputGroup({ label, placeholder, type = "text" }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
      <input 
        type={type}
        placeholder={placeholder}
        className="w-full h-12 rounded-2xl border-2 border-duo-gray bg-gray-50 px-4 font-bold text-duo-text focus:border-duo-green focus:bg-white outline-none transition-all"
      />
    </div>
  );
}

function HelpAction({ icon, label, sub }: any) {
  return (
    <button className="duo-card flex items-center justify-between hover:border-duo-blue transition-colors text-left group">
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