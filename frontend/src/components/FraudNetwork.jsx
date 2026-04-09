import React, { useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const FraudNetwork = ({ matches = [], targetTxn }) => {
  const data = useMemo(() => {
    const nodes = [];
    const links = [];
    
    // Target Node
    nodes.push({ id: targetTxn?.vpa || 'Target', group: 1, val: 20 });
    
    if (matches.length === 0) {
        nodes.push({ id: 'Cluster_A', group: 2, val: 10 });
        links.push({ source: targetTxn?.vpa || 'Target', target: 'Cluster_A' });
    } else {
        matches.forEach((m, idx) => {
            const mId = m.txnId || `Hist_${idx}`;
            nodes.push({ id: mId, group: 2, val: 12 });
            links.push({ source: targetTxn?.vpa || 'Target', target: mId });
            
            // Link to a shared device/IP cluster if fraud
            if (m.is_fraud === 1 || m.label === 'fraud') {
                nodes.push({ id: 'Risk_Cluster', group: 3, val: 15 });
                links.push({ source: mId, target: 'Risk_Cluster' });
            }
        });
    }
    
    return { nodes, links };
  }, [matches, targetTxn]);

  return (
    <div className="glass-card p-5 h-full flex flex-col relative overflow-hidden">
      <div className="mb-4">
        <h3 className="font-bold text-slate-600 text-sm">Semantic Pattern Graph</h3>
        <p className="text-[10px] text-slate-400">Recall relationship between entities</p>
      </div>

      <div className="flex-1 rounded-xl overflow-hidden bg-slate-50/50 border border-slate-100">
        <ForceGraph2D
          graphData={data}
          nodeLabel="id"
          nodeAutoColorBy="group"
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.01}
          height={300}
          width={350}
          backgroundColor="rgba(0,0,0,0)"
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.id;
            const fontSize = 12/globalScale;
            ctx.font = `${fontSize}px Inter`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = node.color;
            ctx.beginPath(); ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false); ctx.fill();
            ctx.fillStyle = '#64748b';
            ctx.fillText(label, node.x, node.y + 10);
          }}
        />
      </div>
      <div className="absolute top-2 right-2 flex gap-1">
         <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
         <span className="text-[8px] font-bold text-slate-400 uppercase">Live Mapping</span>
      </div>
    </div>
  );
};

export default FraudNetwork;
