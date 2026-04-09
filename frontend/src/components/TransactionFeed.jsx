import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IndianRupee, MapPin, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';

const TransactionFeed = ({ transactions }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={14} style={{ color: '#2563eb' }} />
          <span style={{ fontWeight: 800, fontSize: '12px', color: '#334155' }}>Intelligence Feed</span>
        </div>
        <span style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {transactions.length} events
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', paddingRight: '2px' }}>
        <AnimatePresence initial={false}>
          {transactions.map((txn) => {
            const isFraud = txn.riskScore > 0.6;
            return (
              <motion.div
                key={txn.txnId}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  padding: '10px 12px',
                  borderRadius: '12px',
                  background: isFraud ? 'rgba(254,242,242,0.8)' : 'rgba(248,250,252,0.9)',
                  border: `1px solid ${isFraud ? 'rgba(239,68,68,0.18)' : 'rgba(226,232,240,0.8)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '8px', flexShrink: 0,
                      background: isFraud ? 'rgba(239,68,68,0.1)' : 'rgba(37,99,235,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {isFraud
                        ? <AlertTriangle size={12} style={{ color: '#ef4444' }} />
                        : <CheckCircle2 size={12} style={{ color: '#2563eb' }} />
                      }
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#334155', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {txn.vpa}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>
                      <IndianRupee size={10} strokeWidth={2.5} />
                      {txn.amount.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 500 }}>
                      {new Date(txn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '9px', color: '#64748b', fontWeight: 500 }}>
                    <MapPin size={9} />
                    {txn.city}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '8px', fontWeight: 700, padding: '1px 6px', borderRadius: '4px', background: '#f1f5f9', color: '#64748b', border: '1px solid rgba(226,232,240,0.8)', letterSpacing: '0.05em' }}>
                      {txn.txnType}
                    </span>
                    <span style={{
                      fontSize: '8px', fontWeight: 800, padding: '1px 7px', borderRadius: '999px',
                      background: isFraud ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                      color: isFraud ? '#dc2626' : '#059669',
                      border: `1px solid ${isFraud ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`
                    }}>
                      {Math.round(txn.riskScore * 100)}%
                    </span>
                  </div>
                </div>

                {isFraud && (
                  <div style={{ marginTop: '7px', height: '3px', background: 'rgba(239,68,68,0.12)', borderRadius: '999px', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${txn.riskScore * 100}%` }}
                      style={{ height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #f97316, #ef4444)' }}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TransactionFeed;
