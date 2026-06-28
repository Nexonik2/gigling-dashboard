// components/charts/PlayerPerformanceCharts.tsx
'use client';

import React from 'react';
import { 
  AreaChart, Area, 
  ScatterChart, Scatter, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { transformTrajectoryAndEarnings, transformConditionsPerformance } from '../../lib/chartTransformers';

interface PlayerPerformanceChartsProps {
  filteredRaces: any[];
}

export default function PlayerPerformanceCharts({ filteredRaces }: PlayerPerformanceChartsProps) {
  if (!filteredRaces || filteredRaces.length === 0) {
    return null;
  }

  const { trajectoryData, allFree, noPaidWins } = transformTrajectoryAndEarnings(filteredRaces);
  const conditionsData = transformConditionsPerformance(filteredRaces);

  return (
    <div className="space-y-6">
      
      {/* Chart 1: Placement Trajectory */}
      <details className="group bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-md" open>
        <summary className="cursor-pointer text-slate-100 font-bold mb-2 list-none flex justify-between items-center">
          Placement Trajectory
          <span className="text-slate-400 group-open:rotate-180 transition-transform duration-200">▼</span>
        </summary>
        <div className="h-64 mt-2 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey="date" 
                type="category"
                stroke="#94a3b8" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                dataKey="bestPlacement"
                type="number"
                domain={[1, 8]} 
                ticks={[1, 3, 5, 7]}
                stroke="#94a3b8" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                reversed={true}
                padding={{ top: 15, bottom: 15 }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Scatter name="Final Placement" data={trajectoryData}>
                {trajectoryData.map((entry, index) => {
                  let dotColor = '#34d399'; 
                  if (entry.bestPlacement === 1) dotColor = '#eab308';
                  else if (entry.bestPlacement === 2) dotColor = '#94a3b8';
                  else if (entry.bestPlacement === 3) dotColor = '#d97706';
                  
                  return <Cell key={`cell-${index}`} fill={dotColor} />;
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </details>

      {/* Chart 2: Cumulative ROI */}
      <details className="group bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-md flex flex-col" open>
        <summary className="cursor-pointer text-slate-100 font-bold mb-2 list-none flex justify-between items-center">
          Cumulative Earnings
          <span className="text-slate-400 group-open:rotate-180 transition-transform duration-200">▼</span>
        </summary>
        <div className="h-64 mt-2 w-full flex-grow">
          {allFree ? (
            <div className="h-full w-full flex items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-800/50">
              <p className="text-slate-400 text-sm italic">Earnings momentum unavailable: Only free races played.</p>
            </div>
          ) : noPaidWins ? (
            <div className="h-full w-full flex items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-800/50">
              <p className="text-slate-400 text-sm italic">Player didn't win any paid games.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trajectoryData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#34d399' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="cumulativeEarnings" 
                  name="Tokens Won (ETH)"
                  stroke="#34d399" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorEarnings)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </details>

      {/* Chart 3: Condition Performance */}
      <details className="group bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-md" open>
        <summary className="cursor-pointer text-slate-100 font-bold mb-2 list-none flex justify-between items-center">
          Average Finish by Track Condition
          <span className="text-slate-400 group-open:rotate-180 transition-transform duration-200">▼</span>
        </summary>
        <div className="h-64 mt-2 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey="label" 
                type="category" 
                stroke="#94a3b8" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                dataKey="averageRank"
                type="number" 
                name="Avg Placement"
                domain={[1, 8]} 
                ticks={[1, 3, 5, 7]}
                stroke="#94a3b8" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                reversed={true} 
                padding={{ top: 15, bottom: 15 }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                itemStyle={{ color: '#f8fafc' }}
                formatter={(value: any, name: any, props: any) => [value, `Avg Finish (${props.payload?.tempName ?? 'N/A'})`]}
              />
              <Scatter name="Conditions" data={conditionsData}>
                {conditionsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </details>

    </div>
  );
}