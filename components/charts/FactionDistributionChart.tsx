"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

// Map faction names to their solid hex values established in globals.css
// Using the #ff1493 fallback for Gigus based on previous project context
const FACTION_COLORS: Record<string, string> = {
  'Crusader': '#ef4444',
  'Summoner': '#eab308',
  'Archon': '#3b82f6',
  'Foxglove': '#22c55e',
  'Chobo': '#ffffff',
  'Athena': '#a855f7',
  'Overseer': '#f97316',
  'Gigus': '#ff1493',
  'Unaffiliated': '#94a3b8', 
};

export default function FactionDistributionChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-textMuted text-sm">
        Not enough data to visualize distribution.
      </div>
    );
  }

  // Aggregate current array data by factionName (using the exact JSON key)
  const distribution = data.reduce((acc: any, curr: any) => {
    // Some entities might return "None" or lack a factionName
    const faction = curr.factionName && curr.factionName !== "None" ? curr.factionName : 'Unaffiliated';
    if (!acc[faction]) acc[faction] = 0;
    acc[faction] += 1;
    return acc;
  }, {});

  const chartData = Object.keys(distribution).map(key => ({
    name: key,
    count: distribution[key]
  })).sort((a, b) => b.count - a.count);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gigusGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-gigus-start)" />
            <stop offset="100%" stopColor="var(--color-gigus-end)" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
        <XAxis 
          dataKey="name" 
          stroke="#94a3b8" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis 
          stroke="#94a3b8" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          allowDecimals={false}
        />
        <Tooltip 
          cursor={{ fill: '#1e293b', opacity: 0.5 }}
          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
          itemStyle={{ color: '#10b981' }}
          formatter={(value: any) => [`${value || 0} Racers`, 'Count']}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={FACTION_COLORS[entry.name] || '#94a3b8'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}