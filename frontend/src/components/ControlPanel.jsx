import React from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, XCircle, Terminal, Cpu } from 'lucide-react';

const ControlPanel = ({ onAnalyze, onFeedback }) => {
  return (
    <div style={{
      background: 'white',
      border: '1px solid rgba(226,232,240,0.9)',
      borderRadius: '16px',
      padding: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <Cpu size={13} style={{ color: '#2563eb' }} />
        <span style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Agent Controller
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          {[
            { id: 'amt', type: 'number', placeholder: 'Amount', label: 'Amount (₹)' },
            { id: 'vpa', type: 'text', placeholder: 'user@upi', label: 'VPA' },
            { id: 'loc', type: 'text', placeholder: 'Mumbai', label: 'City' },
          ].map(field => (
            <div key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <label htmlFor={field.id} style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{field.label}</label>
              <input
                type={field.type}
                id={field.id}
                placeholder={field.placeholder}
                style={{
                  height: '34px', borderRadius: '10px', border: '1px solid rgba(226,232,240,0.9)',
                  padding: '0 10px', fontSize: '12px', fontWeight: 600, color: '#334155',
                  background: '#f8fafc', outline: 'none', width: '100%', boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              const data = {
                amount: parseFloat(document.getElementById('amt').value) || 50000,
                vpa: document.getElementById('vpa').value || 'test@user',
                city: document.getElementById('loc').value || 'Mumbai'
              };
              onAnalyze(data);
            }}
            style={{
              flex: 1, height: '36px', borderRadius: '10px', border: 'none',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: 'white', fontWeight: 700, fontSize: '11px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
            }}
          >
            <Search size={13} />
            Sense & Decide
          </motion.button>

          {[
            { label: 'Mark as Safe', color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', feedbackVal: 'legit' },
            { label: 'Mark as Fraud', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', feedbackVal: 'fraud' },
          ].map(btn => (
            <motion.button
              key={btn.feedbackVal}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              title={`Teach the Agent that this transaction is ${btn.label.toLowerCase()}`}
              onClick={() => onFeedback(btn.feedbackVal)}
              style={{
                height: '36px', padding: '0 12px', borderRadius: '10px',
                background: btn.bg, border: `1px solid ${btn.border}`,
                color: btn.color, fontWeight: 700, fontSize: '10px',
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              {btn.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
