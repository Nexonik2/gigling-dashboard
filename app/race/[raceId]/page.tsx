'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchGigaverseData } from '../../../lib/api';
import { formatWei } from '../../../lib/utils';
import RecentRaces from '../../../components/RecentRaces';

export default function RaceDetails() {
  // Extract the dynamic ID from the URL
  const params = useParams();
  const raceId = params.raceId;

  // Fetch the full race state using the /race/{raceId} endpoint
  const { data, error, isLoading } = useQuery({
    queryKey: ['raceDetails', raceId],
    queryFn: () => fetchGigaverseData(`/race/${raceId}`),
  });

  return (
    <main className="max-w-5xl mx-auto pb-12 p-6">
      {/* Back Navigation */}
      <div className="mb-8">
        <Link 
          href="/" 
          className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2 font-medium transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="text-4xl font-extrabold mb-8 text-slate-100 tracking-tight">
        Race Details: <span className="text-emerald-400">#{raceId}</span>
      </h1>

      {/* Loading State */}
      {isLoading && (
        <div className="animate-pulse h-64 bg-slate-800 rounded-xl border border-slate-700 w-full"></div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-red-400 bg-red-900/20 p-4 rounded-xl border border-red-800 mb-8">
          <strong>Failed to load race data:</strong> {error.message}
        </div>
      )}

      {/* Render Data Once Available */}
      {data && (
        <>
          {/* Race Conditions Header */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-md">
              <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">Date & Time</span>
              <p className="text-lg text-slate-100 font-bold mt-1">
                {new Date(data.raceStart * 1000).toLocaleString()}
              </p>
            </div>
            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-md">
              <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">Track</span>
              <p className="text-lg text-slate-100 font-bold mt-1 capitalize">
                {data.trackLength}m • {data.raceTemp}
              </p>
            </div>
            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-md">
              <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">Entry Fee</span>
              <p className="text-lg text-slate-100 font-bold mt-1">
                {formatWei(data.entryFee)} Tokens
              </p>
            </div>
            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-md">
              <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Pool</span>
              <p className="text-lg text-emerald-400 font-bold mt-1">
                {formatWei(data.pool)} Tokens
              </p>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-slate-300 border-collapse">
                <thead className="bg-slate-900 border-b border-slate-700 text-slate-400 text-sm uppercase tracking-wider">
                  <tr>
                    <th className="p-4 font-semibold">Rank</th>
                    <th className="p-4 font-semibold">Gigling</th>
                    <th className="p-4 font-semibold">Owner</th>
                    <th className="p-4 font-semibold">Time</th>
                    <th className="p-4 font-semibold">Prize Cut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {data.finalRanking.map((petId: number, index: number) => {
                    // Match the petId to its entry object for specific details like 'juiced' and 'ownerAddress'
                    const entryData = data.entries.find((e: any) => e.petId === petId);
                    
                    // Finish times correspond directly to the index of finalRanking
                    const timeInSeconds = (data.finishTimes[index] / 1000).toFixed(3);
                    
                    // Payout BPS mapping (Base points to Percentage)
                    const payoutPercent = data.payoutBps[index] ? `${data.payoutBps[index] / 100}%` : '-';
                    
                    // Truncate the wallet address for clean UI
                    const shortAddress = entryData 
                      ? `${entryData.ownerAddress.slice(0, 6)}...${entryData.ownerAddress.slice(-4)}` 
                      : 'Unknown';

                    return (
                      <tr key={petId} className="hover:bg-slate-750 transition-colors">
                        <td className="p-4">
                          <span className={`font-bold text-lg ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-slate-300' : index === 2 ? 'text-amber-600' : 'text-slate-500'}`}>
                            #{index + 1}
                          </span>
                        </td>
                        <td className="p-4">
                          <Link 
                            href={`/gigling/${petId}`} 
                            className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-2 transition-colors"
                          >
                            {petId}
                            {entryData?.juiced && (
                              <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded uppercase tracking-wider border border-yellow-500/30">
                                Juiced
                              </span>
                            )}
                          </Link>
                        </td>
                        <td className="p-4 font-mono text-sm">
                          {entryData ? (
                            <Link 
                              href={`/player/${entryData.ownerAddress}`}
                              className="text-emerald-400 hover:text-emerald-300 transition-colors"
                            >
                              {shortAddress}
                            </Link>
                          ) : (
                            <span className="text-slate-400">Unknown</span>
                          )}
                        </td>
                        <td className="p-4 font-medium">
                          {timeInSeconds}s
                        </td>
                        <td className="p-4 font-bold text-emerald-300">
                          {payoutPercent}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </main>
  );
}