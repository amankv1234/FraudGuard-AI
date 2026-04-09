import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

const SignalRadar = ({ signals }) => {
  // Convert the object `{ 'ml_anomaly': 0.8 }` into chart data
  const data = signals ? [
    { subject: 'ML Anomaly', A: (signals.ml_anomaly * 100).toFixed(0) },
    { subject: 'Vector Sim', A: (signals.vector_sim * 100).toFixed(0) },
    { subject: 'Graph Mule', A: (signals.graph_mule * 100).toFixed(0) },
    { subject: 'Velocity', A: (signals.velocity * 100).toFixed(0) },
    { subject: 'Behavior', A: (signals.behavior_dev * 100).toFixed(0) },
    { subject: 'Time Shift', A: (signals.time_anomaly * 100).toFixed(0) }
  ] : [
    { subject: 'ML Anomaly', A: 0 },
    { subject: 'Vector Sim', A: 0 },
    { subject: 'Graph Mule', A: 0 },
    { subject: 'Velocity', A: 0 },
    { subject: 'Behavior', A: 0 },
    { subject: 'Time Shift', A: 0 }
  ];

  return (
    <div className="glass-card p-5 h-full flex flex-col relative overflow-hidden">
      <div className="flex items-center justify-between mb-2 z-10">
        <div>
          <h3 className="font-bold text-slate-600 text-sm">Threat Topology Graph</h3>
          <p className="text-[10px] text-slate-400">Multidimensional Signal Mapping</p>
        </div>
      </div>
      
      <div className="flex-1 w-full relative z-0 mt-[-10px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#64748b', fontSize: 9, fontWeight: 'bold' }} 
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold' }}
            />
            <Radar
              name="Risk Value"
              dataKey="A"
              stroke="#ef4444"
              strokeWidth={2}
              fill="#ef4444"
              fillOpacity={0.2}
              isAnimationActive={true}
              animationDuration={800}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SignalRadar;
