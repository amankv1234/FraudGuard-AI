import React from 'react';
import { Shield, Bell, User, ChevronDown, Cpu } from 'lucide-react';

const Navbar = () => {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: '64px', zIndex: 100,
      background: 'rgba(255,255,255,0.92)',
      borderBottom: '1px solid rgba(226,232,240,0.9)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px',
      boxShadow: '0 1px 0 rgba(226,232,240,0.8), 0 2px 8px rgba(0,0,0,0.04)',
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}>
          <Shield size={18} color="white" />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '16px', letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #2563eb, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1 }}>
            FraudGuard AI
          </div>
          <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>v2.0 Adaptive Intelligence</div>
        </div>
      </div>

      {/* Center: platform name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', border: '1px solid rgba(226,232,240,0.8)', borderRadius: '10px', padding: '6px 14px' }}>
        <Cpu size={13} style={{ color: '#64748b' }} />
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', letterSpacing: '0.04em' }}>NEURALCORE — UPI Fraud Detection Engine</span>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Live status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '999px', padding: '4px 12px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', animation: 'pulse 1.5s infinite' }} />
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#059669' }}>Live Secure</span>
        </div>

        <div style={{ width: '1px', height: '28px', background: 'rgba(226,232,240,0.8)' }} />

        <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
          <Bell size={18} />
          <span style={{ position: 'absolute', top: '0', right: '0', width: '14px', height: '14px', background: '#ef4444', borderRadius: '50%', fontSize: '8px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, border: '2px solid white' }}>3</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '4px 8px', borderRadius: '10px', transition: 'background 0.15s' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(37,99,235,0.25)' }}>
            <User size={15} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155', lineHeight: 1.1 }}>Security Lab</div>
            <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 500 }}>Administrator</div>
          </div>
          <ChevronDown size={13} style={{ color: '#94a3b8' }} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
