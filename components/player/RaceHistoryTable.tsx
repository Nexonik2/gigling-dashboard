import React from 'react';
import Link from 'next/link';
import { formatWei } from '../../lib/utils';

interface RaceHistoryTableProps {
  filteredRaces: any[];
  onClearFilters: () => void;
}

// Helper function to format placement ranks
function getOrdinalRank(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function RaceHistoryTable({ filteredRaces, onClearFilters }: RaceHistoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-slate-300 border-collapse">
        <thead className="bg-slate-900 border-b border-slate-700 text-slate-400 text-sm uppercase tracking-wider">
          <tr>
            <th className="p-4 font-semibold">Date</th>
            <th className="p-4 font-semibold">Race ID</th>
            <th className="p-4 font-semibold">Length</th>
            <th className="p-4 font-semibold">Weather</th>
            <th className="p-4 font-semibold">Entries & Placements</th>
            <th className="p-4 font-semibold text-right">Total Payout</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {filteredRaces.length > 0 ? (
            filteredRaces.map((race: any) => {
              const sortedPetIds = [...race.myPetIds].sort((a, b) => {
                return race.finalRanking.indexOf(a) - race.finalRanking.indexOf(b);
              });

              return (
                <tr key={race.raceId} className="hover:bg-slate-750 transition-colors">
                  <td className="p-4 whitespace-nowrap">
                    {new Date(race.raceStart * 1000).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="p-4 font-bold">
                    <Link 
                      href={`/race/${race.raceId}`}
                      className="text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      #{race.raceId}
                    </Link>
                  </td>
                  <td className="p-4 text-sm">
                    {race.trackLength}m
                  </td>
                  <td className="p-4 capitalize text-sm">
                    {race.raceTemp}
                  </td>
                  <td className="p-4">
                    <div className="space-y-1.5">
                      {sortedPetIds.map((petId: number) => {
                        const rank = race.finalRanking.indexOf(petId) + 1;
                        let rankColor = 'text-slate-500';
                        let linkColor = 'text-emerald-400 hover:text-emerald-300';
                        let isPodium = false;

                        if (rank === 1) {
                          rankColor = 'text-yellow-400';
                          linkColor = 'text-yellow-400 hover:text-yellow-300';
                          isPodium = true;
                        } else if (rank === 2) {
                          rankColor = 'text-slate-300';
                          linkColor = 'text-slate-300 hover:text-slate-200';
                          isPodium = true;
                        } else if (rank === 3) {
                          rankColor = 'text-amber-600';
                          linkColor = 'text-amber-600 hover:text-amber-500';
                          isPodium = true;
                        }
                        
                        return (
                          <div key={petId} className="flex items-center gap-2 text-sm">
                            <span className={`w-8 font-bold ${rankColor}`}>
                              {getOrdinalRank(rank)}
                            </span>
                            <Link 
                              href={`/gigling/${petId}`}
                              className={`font-mono transition-colors ${linkColor} ${isPodium ? 'font-bold' : 'font-medium'}`}
                            >
                              #{petId}
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-right">
                    {race.payout === "0" ? (
                      <span className="text-slate-500 text-xs tracking-wider uppercase">Free Race</span>
                    ) : (
                      <span className="text-emerald-300">{formatWei(race.payout)}</span>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6} className="p-12 text-center">
                <div className="text-slate-500 mb-2">No races match your current filters.</div>
                <button 
                  onClick={onClearFilters}
                  className="text-emerald-400 text-sm hover:underline"
                >
                  Clear Filters
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}