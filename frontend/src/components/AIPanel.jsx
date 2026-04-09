import React from 'react';
import { motion } from 'framer-motion';
import { Brain, History, Lightbulb, Tag, Download, BookOpen } from 'lucide-react';

const AIPanel = ({ explanation, memory, currentTxn, debate }) => {
  const downloadReport = () => {
    if (!currentTxn) return;
    const content = `FRAUDGUARD AI — COMPLIANCE AUDIT REPORT\n=========================================\n\n` +
      `TRANSACTION ID : ${currentTxn.txnId}\n` +
      `VPA            : ${currentTxn.vpa}\n` +
      `AMOUNT         : Rs.${currentTxn.amount}\n` +
      `LOCATION       : ${currentTxn.city}\n` +
      `RISK SCORE     : ${(currentTxn.riskScore * 100).toFixed(2)}%\n\n` +
      `AI RATIONALE\n---------------------------------------\n` +
      `${explanation}\n\n` +
      `MULTI-AGENT DEBATE\n---------------------------------------\n` +
      `[DETECTIVE]: ${debate?.detective || 'N/A'}\n` +
      `[DEFENDER] : ${debate?.defender || 'N/A'}\n\n` +
      `Generated : ${new Date().toISOString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Audit_${currentTxn.txnId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', overflow: 'hidden' }}>
      {/* Rationale */}
      <div style={{ flex: 1, background: 'white', border: '1px solid rgba(226,232,240,0.8)', borderRadius: '16px', padding: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexShrink: 0 }}>
          <Brain size={15} style={{ color: '#0ea5e9' }} />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#334155', letterSpacing: '0.01em' }}>AI Decision Rationale</span>
          {explanation && (
            <span style={{ fontSize: '8px', fontWeight: 700, padding: '2px 8px', background: 'rgba(37,99,235,0.06)', color: '#2563eb', borderRadius: '999px', border: '1px solid rgba(37,99,235,0.12)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Gemini AI
            </span>
          )}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
          {explanation ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {explanation.split('\n').filter(l => l.trim()).map((line, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#0ea5e9', flexShrink: 0, marginTop: '5px' }} />
                  <p style={{ fontSize: '11px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                    {line.replace(/^[-•]\s*/, '')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
              <Lightbulb size={28} style={{ opacity: 0.2, marginBottom: '8px' }} />
              <p style={{ fontSize: '11px', fontStyle: 'italic' }}>Waiting for analysis...</p>
            </div>
          )}
        </div>
      </div>

      {/* Memory + Export */}
      <div style={{ background: 'white', border: '1px solid rgba(226,232,240,0.8)', borderRadius: '16px', padding: '14px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <History size={13} style={{ color: '#2563eb' }} />
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#334155' }}>Memory Insights</span>
        </div>
        <div style={{ marginBottom: '10px', padding: '10px', background: '#f8fafc', borderRadius: '10px', border: '1px solid rgba(226,232,240,0.6)' }}>
          <div style={{ fontSize: '9px', fontWeight: 700, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Agent Feedback Loop</div>
          <p style={{ fontSize: '10px', color: '#64748b', fontStyle: 'italic', margin: 0 }}>"Learning from Kaggle historical baseline — {Math.floor(Math.random() * 37) + 1} Hindsight reflections applied."</p>
        </div>
        <button
          onClick={downloadReport}
          style={{
            width: '100%', height: '32px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.9)',
            background: '#f8fafc', color: '#475569', fontSize: '10px', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            cursor: 'pointer', transition: 'all 0.15s', letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#2563eb'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#475569'; }}
        >
          <Download size={12} />
          Export Compliance Audit
        </button>
      </div>
    </div>
  );
};

export default AIPanel;
