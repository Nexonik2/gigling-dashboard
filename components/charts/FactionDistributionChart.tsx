"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

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
        <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}