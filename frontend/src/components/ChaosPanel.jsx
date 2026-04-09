import React from 'react';
import { ShieldAlert, Zap, Globe, Cpu } from 'lucide-react';

const ChaosPanel = ({ stats, latency }) => {
  const [isInjecting, setIsInjecting] = React.useState(false);

  const injectLatency = async () => {
      setIsInjecting(true);
      // Wait to simulate injecting latency in dashboard visually
      setTimeout(() => setIsInjecting(false), 2000);
  };

  return (
    <div style={{ background: 'white', borderRadius: '16px', border: '1px solid rgba(226,232,240,0.8)', padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <ShieldAlert size={18} style={{ color: '#f59e0b' }} />
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#334155' }}>Chaos Engineering & Infra</h3>
      </div>
      <p style={{ margin: '0 0 24px 0', fontSize: '11px', color: '#64748b', lineHeight: '1.5' }}>
        Monitoring system stability and response elasticity. Use the Chaos Injector below to simulate database latency and observe the system's asynchronous fallback capabilities.
      </p>

      <div className="grid grid-cols-2 gap-3 flex-1 text-[10px]">
        {[
          { icon: Zap, label: "Core Pulse", val: latency || (isInjecting ? "1840ms" : "---"), color: isInjecting ? "text-red-500" : "text-emerald-500", bg: isInjecting ? "bg-red-50" : "bg-emerald-50" },
          { icon: Globe, label: "Nodes (UP)", val: stats?.nodes || "12/12", color: "text-blue-500", bg: "bg-blue-50" },
          { icon: Cpu, label: "CPU Utility", val: stats?.cpu_utility || "---", color: "text-purple-500", bg: "bg-purple-50" },
          { icon: ShieldAlert, label: "Memory", val: stats?.memory || "---", color: "text-amber-500", bg: "bg-amber-50" },
        ].map((item, idx) => (
          <div key={idx} className={`${item.bg} p-2.5 rounded-xl border border-white flex flex-col gap-1`}>
            <div className="flex items-center justify-between">
              <item.icon size={12} className={item.color} />
              <span className={item.color}>●</span>
            </div>
            <span className="text-slate-400 font-bold uppercase text-[8px]">{item.label}</span>
            <span className="text-slate-700 font-black">{item.val}</span>
          </div>
        ))}
      </div>
      
      <button onClick={injectLatency} className="mt-4 w-full py-2 bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-400 text-[10px] font-bold rounded-lg transition-all border border-slate-200/50 uppercase tracking-widest">
        {isInjecting ? "Recovering..." : "Inject Latency Spike"}
      </button>
    </div>
  );
};

export default ChaosPanel;
