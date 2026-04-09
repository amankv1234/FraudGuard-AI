import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

const DNATimeline = ({ history }) => {
  // Convert { feature: value } history into chart-friendly format
  const chartData = history.map((weights, index) => ({
    name: `L${index}`,
    ...weights
  }));

  return (
    <div className="glass-card p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-600 text-sm">DNA Evolution Timeline</h3>
          <p className="text-[10px] text-slate-400">Agent weights adaptation via Hindsight Reflection</p>
        </div>
        <div className="px-2 py-0.5 rounded bg-blue-50 text-[10px] font-bold text-primary border border-blue-100 italic">
          v2.0 Adaptive DNA
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" hide />
            <YAxis hide domain={[0, 1.2]} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '9px', fontWeight: 'bold', paddingTop: '10px' }} />
            <Line type="monotone" dataKey="ml_anomaly" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="ML Logic" />
            <Line type="monotone" dataKey="vector_sim" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Vector RAG" />
            <Line type="monotone" dataKey="velocity" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Velocity" />
            <Line type="monotone" dataKey="behavior_dev" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Behavior" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DNATimeline;
