import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Search, ShieldCheck } from 'lucide-react';

const DebatePanel = ({ debate }) => {
  if (!debate) return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#94a3b8', padding: '24px' }}>
      <Scale size={32} style={{ opacity: 0.15 }} />
      <p style={{ fontSize: '11px', fontStyle: 'italic', textAlign: 'center', lineHeight: '1.6' }}>
        Cross-examination panel awaiting analysis.<br />Run "Sense & Decide" to trigger the multi-agent debate.
      </p>
    </div>
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '20px', gap: '16px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <Scale size={15} style={{ color: '#2563eb' }} />
        <span style={{ fontWeight: 800, fontSize: '12px', color: '#334155' }}>Multi-Agent Debate</span>
        <span style={{ marginLeft: 'auto', fontSize: '9px', fontWeight: 700, padding: '2px 8px', background: 'rgba(37,99,235,0.06)', color: '#2563eb', borderRadius: '999px', border: '1px solid rgba(37,99,235,0.12)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Cross-Examination
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
        {/* Detective */}
        <motion.div
          initial={{ x: -16, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ padding: '14px', background: 'rgba(254,242,242,0.7)', borderLeft: '3px solid #ef4444', borderRadius: '0 12px 12px 0', border: '1px solid rgba(239,68,68,0.12)', borderLeft: '3px solid #ef4444' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Search size={10} style={{ color: '#ef4444' }} />
            <span style={{ fontSize: '9px', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.12em' }}>The Detective</span>
          </div>
          <p style={{ fontSize: '11px', color: '#475569', lineHeight: '1.6', margin: 0 }}>{debate.detective}</p>
        </motion.div>

        {/* VS divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(226,232,240,0.8)' }} />
          <span style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8', letterSpacing: '0.2em' }}>VS</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(226,232,240,0.8)' }} />
        </div>

        {/* Defender */}
        <motion.div
          initial={{ x: 16, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ padding: '14px', background: 'rgba(240,253,244,0.7)', borderRadius: '12px 0 0 12px', border: '1px solid rgba(16,185,129,0.12)', borderRight: '3px solid #10b981' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: '9px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.12em' }}>The Defender</span>
            <ShieldCheck size={10} style={{ color: '#10b981' }} />
          </div>
          <p style={{ fontSize: '11px', color: '#475569', lineHeight: '1.6', margin: 0, textAlign: 'right' }}>{debate.defender}</p>
        </motion.div>
      </div>

      <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(226,232,240,0.7)', textAlign: 'center', flexShrink: 0 }}>
        <p style={{ fontSize: '9px', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>"The Hindsight Agent uses historical memory to settle the dispute."</p>
      </div>
    </div>
  );
};

export default DebatePanel;
