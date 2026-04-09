import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TransactionFeed from './components/TransactionFeed';
import ControlPanel from './components/ControlPanel';
import RiskScoreCard from './components/RiskScoreCard';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Database, Brain, Terminal, History, ShieldAlert, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

const PAGE_TABS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard Page' },
  { id: 'memory', icon: Database, label: 'Memory Page' },
  { id: 'analysis', icon: Brain, label: 'Agent Analysis Page' },
  { id: 'simulation', icon: Terminal, label: 'Simulation Page' },
  { id: 'learning', icon: History, label: 'Learning Page' }
];

const MOCK_DATA = [
  { txnId: "TX-101", vpa: "user_09@okaxis", amount: 45000, city: "Mumbai", timestamp: new Date().toISOString(), txnType: "QR_PUSH", riskScore: 0.12 },
  { txnId: "TX-103", vpa: "merch_88@merchant", amount: 98000, city: "Chennai", timestamp: new Date().toISOString(), txnType: "QR_PUSH", riskScore: 0.88 },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState(MOCK_DATA);
  const [currentScore, setCurrentScore] = useState(0.88);
  const [currentTxn, setCurrentTxn] = useState(MOCK_DATA[1]);
  const [agentOutputs, setAgentOutputs] = useState(null);
  const [memoryLogs, setMemoryLogs] = useState([]);
  const [learningStatus, setLearningStatus] = useState("");

  const fetchMemoryLogs = async () => {
    try {
      const res = await fetch('http://localhost:8000/memory_logs');
      const data = await res.json();
      setMemoryLogs(data.logs || []);
    } catch (e) { /* silent */ }
  };

  useEffect(() => {
    fetchMemoryLogs();

    // Connect to Live SSE Stream
    const eventSource = new EventSource('http://localhost:8000/stream');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Update Real-time State
      setTransactions(prev => [data, ...prev].slice(0, 15));
      setCurrentScore(data.riskScore);
      setCurrentTxn(data);

      // If it's high risk, auto-update the memory bank
      fetchMemoryLogs();
    };

    eventSource.onerror = () => {
      console.log("SSE Connection lost. Retrying...");
      eventSource.close();
    };

    const t = setInterval(fetchMemoryLogs, 15000);
    return () => {
      clearInterval(t);
      eventSource.close();
    };
  }, []);

  const handleAnalyze = async (manualData) => {
    try {
      setLearningStatus("Processing via Multi-Agent System...");
      setActiveTab('simulation');

      const payload = {
        txnId: 'TX-' + Math.floor(Math.random() * 9000 + 1000),
        amount: manualData.amount,
        vpa: manualData.vpa,
        city: manualData.city
      };

      const response = await fetch('http://localhost:8000/analyze_transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      const newTxn = {
        ...payload,
        timestamp: new Date().toISOString(),
        riskScore: result.risk_score,
        txnType: 'MANUAL',
        decision: result.decision
      };

      setCurrentScore(result.risk_score);
      setAgentOutputs(result.agents);
      setCurrentTxn(newTxn);
      setTransactions(prev => [newTxn, ...prev].slice(0, 15));
      fetchMemoryLogs();
      setLearningStatus("");
      setActiveTab('analysis'); // Auto switch to show agent breakdown
    } catch (error) {
      setLearningStatus("Backend disconnected. Start server.py");
      setTimeout(() => setLearningStatus(""), 3000);
    }
  };

  const handleFeedback = async (label) => {
    if (!currentTxn?.txnId) return;
    try {
      setLearningStatus(`Triggering Hindsight reflect()...`);
      const response = await fetch('http://localhost:8000/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txnId: currentTxn.txnId, label })
      });
      if (response.ok) {
        setLearningStatus("Pattern updated in Memory Bank!");
        fetchMemoryLogs();
      }
      setTimeout(() => setLearningStatus(""), 4000);
    } catch (error) { setLearningStatus(""); }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f0f4f8' }}>
      <Navbar />

      <div style={{ flex: 1, display: 'flex', paddingTop: '64px', overflow: 'hidden' }}>

        {/* === MAIN CONTENT === */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Tab Navigation */}
          <div style={{ display: 'flex', alignItems: 'stretch', background: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(226,232,240,0.9)', paddingLeft: '24px', height: '52px' }}>
            {PAGE_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '0 20px',
                  fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em',
                  color: activeTab === tab.id ? '#2563EB' : '#94a3b8',
                  background: activeTab === tab.id ? 'rgba(37,99,235,0.04)' : 'transparent',
                  borderBottom: activeTab === tab.id ? '2px solid #2563EB' : '2px solid transparent',
                  cursor: 'pointer', borderTop: 'none', borderLeft: 'none', borderRight: 'none', outline: 'none',
                  transition: 'all 0.2s'
                }}
              >
                <tab.icon size={15} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* PAGE ROUTING */}
          <div style={{ flex: 1, padding: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <AnimatePresence mode="wait">

              {/* 1. DASHBOARD PAGE */}
              {activeTab === 'dashboard' && (
                <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '24px', height: '100%' }}>
                  <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, marginBottom: '12px' }}>Live Transaction Stream</div>
                    <div style={{ flex: 1, overflow: 'auto' }}><TransactionFeed transactions={transactions} /></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '24px' }}>
                    <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <RiskScoreCard score={currentScore} />
                    </div>
                    <div style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', borderRadius: '16px', color: 'white', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 900 }}>FraudGuard AI v2.0</h2>
                      <p style={{ opacity: 0.8, fontSize: '14px', marginTop: '8px' }}>Hindsight Memory Engine Active. System is evaluating {transactions.length} live streams via multi-agent topology.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 2. MEMORY PAGE */}
              {activeTab === 'memory' && (
                <motion.div key="memory" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ height: '100%', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Database style={{ color: '#8b5cf6' }} />
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Vector Hindsight Experience Bank</h3>
                  </div>
                  <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    {memoryLogs.length === 0 ? <p>No memory retained yet.</p> : (
                      <div style={{ display: 'grid', gap: '12px' }}>
                        {memoryLogs.map((log, i) => (
                          <div key={i} style={{ padding: '16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <span style={{ fontWeight: 800 }}>ID: {log.txnId}</span>
                              <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', background: log.decision === 'FRAUD' ? '#fee2e2' : '#d1fae5', color: log.decision === 'FRAUD' ? '#ef4444' : '#10b981' }}>{log.decision}</span>
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                              <span>Amount: ₹{log.amount}</span>
                              <span>City: {log.city}</span>
                              <span>VPA: {log.vpa}</span>
                              <span>Feedback: {log.feedback}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* 3. AGENT ANALYSIS PAGE */}
              {activeTab === 'analysis' && (
                <motion.div key="analysis" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ height: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                  {agentOutputs ? (
                    <>
                      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
                        <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', fontWeight: 800 }}>👮 Risk Agent</h3>
                        <div style={{ fontSize: '32px', fontWeight: 900, color: '#2563eb', margin: '16px 0' }}>{(agentOutputs.risk_agent.score * 100).toFixed(0)}%</div>
                        <ul style={{ fontSize: '12px', color: '#64748b', paddingLeft: '16px' }}>
                          {agentOutputs.risk_agent.reasons.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      </div>
                      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
                        <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', fontWeight: 800 }}>📉 Behavior Agent</h3>
                        <div style={{ fontSize: '32px', fontWeight: 900, color: '#8b5cf6', margin: '16px 0' }}>{(agentOutputs.behavior_agent.score * 100).toFixed(0)}%</div>
                        <ul style={{ fontSize: '12px', color: '#64748b', paddingLeft: '16px' }}>
                          {agentOutputs.behavior_agent.reasons.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      </div>
                      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
                        <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', fontWeight: 800 }}>🧠 Memory Agent (Hindsight)</h3>
                        <div style={{ fontSize: '32px', fontWeight: 900, color: '#f59e0b', margin: '16px 0' }}>{(agentOutputs.memory_agent.score * 100).toFixed(0)}%</div>
                        <ul style={{ fontSize: '12px', color: '#64748b', paddingLeft: '16px' }}>
                          {agentOutputs.memory_agent.reasons.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <div style={{ gridColumn: '1 / -1', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', fontStyle: 'italic', color: '#94a3b8' }}>
                      Run a simulation first to see Agent Outputs.
                    </div>
                  )}
                </motion.div>
              )}

              {/* 4. SIMULATION PAGE */}
              {activeTab === 'simulation' && (
                <motion.div key="simulation" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '400px', background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 800 }}>Manual Simulation Trigger</h3>
                    <ControlPanel onAnalyze={handleAnalyze} onFeedback={handleFeedback} />
                    {learningStatus && <div style={{ marginTop: '16px', fontSize: '11px', color: '#2563eb', fontWeight: 700, textAlign: 'center' }}>{learningStatus}</div>}
                  </div>
                </motion.div>
              )}

              {/* 5. LEARNING PAGE */}
              {activeTab === 'learning' && (
                <motion.div key="learning" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ height: '100%', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', overflowY: 'auto' }}>
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: 800 }}>Agent Feedback Loop & Learning Logs</h3>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '24px' }}>Clicking "Mark as Fraud" or "Mark as Safe" on the Simulation page triggers reflect() on the Hindsight agent, updating its memory network.</p>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {memoryLogs.filter(L => L.feedback !== 'pending').length > 0 ? (
                      memoryLogs.filter(L => L.feedback !== 'pending').map((log, i) => (
                        <div key={i} style={{ padding: '12px', background: '#f8fafc', borderLeft: '3px solid #8b5cf6', borderRadius: '0 8px 8px 0' }}>
                          <span style={{ fontWeight: 800, fontSize: '11px' }}>{log.txnId} Reflected: </span>
                          <span style={{ fontSize: '11px', color: '#475569' }}>Ground truth confirmed as {log.feedback.toUpperCase()}. Weights adjusted via Hindsight.</span>
                        </div>
                      ))
                    ) : (
                      <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>No manual learning feedback processed yet. Trigger feedback in the Simulation page.</div>
                    )}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
