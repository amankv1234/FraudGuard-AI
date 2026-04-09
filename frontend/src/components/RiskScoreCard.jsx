import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, ShieldCheck, ShieldAlert } from 'lucide-react';

const RiskScoreCard = ({ score }) => {
  const isFraud = score > 0.6;
  const pct = Math.round(score * 100);
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (circumference * score);

  return (
    <div
      className="glass-card h-full flex flex-col items-center justify-between p-4 transition-all duration-500 relative overflow-hidden"
      style={{ boxShadow: isFraud ? '0 0 0 1px rgba(239,68,68,0.2), 0 4px 24px rgba(239,68,68,0.1)' : '0 0 0 1px rgba(37,99,235,0.1), 0 4px 24px rgba(37,99,235,0.06)' }}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-1.5">
          <Target size={13} className="text-primary" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Risk Score</span>
        </div>
        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${isFraud ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
          {isFraud ? 'CRITICAL' : 'SAFE'}
        </span>
      </div>

      {/* Compact circular gauge */}
      <div className="relative flex items-center justify-center" style={{ width: '100px', height: '100px' }}>
        <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
          <circle cx="60" cy="60" r="52" fill="none" stroke="#f1f5f9" strokeWidth="8" />
          <motion.circle
            cx="60" cy="60" r="52" fill="none"
            stroke={isFraud ? '#ef4444' : '#2563eb'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <motion.span
            key={pct}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-black tabular-nums leading-none"
            style={{ fontSize: '28px', color: isFraud ? '#ef4444' : '#2563eb' }}
          >
            {pct}
          </motion.span>
          <span className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">%</span>
        </div>
      </div>

      <div className="w-full">
        <div className={`text-[9px] font-bold text-center py-1.5 rounded-lg ${isFraud ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
          {isFraud ? (
            <span className="flex items-center gap-1 justify-center"><ShieldAlert size={9} /> Multiple signals compromised</span>
          ) : (
            <span className="flex items-center gap-1 justify-center"><ShieldCheck size={9} /> Behavior aligns baseline</span>
          )}
        </div>
      </div>

      <div className="absolute bottom-2.5 right-3 flex items-center gap-1 opacity-30">
        <Zap size={9} className="text-amber-500 fill-amber-500" />
        <span className="text-[8px] font-bold">Neural Core</span>
      </div>
    </div>
  );
};

export default RiskScoreCard;
