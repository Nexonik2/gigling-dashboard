'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchGigaverseData } from '../lib/api';
import { formatWei } from '../lib/utils';

export default function GlobalStats() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['globalStats'],
    queryFn: () => fetchGigaverseData('/stats'),
  });

  if (isLoading) {
    return (
      <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-app-surface p-6 rounded-xl border border-app-border animate-pulse h-28"></div>
        ))}
      </div>
    );
  }

  if (error || !data?.success) {
    return null; 
  }

  const stats = data.data;

  return (
    <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-app-surface p-6 rounded-xl border border-app-border shadow-lg text-center flex flex-col justify-center overflow-hidden">
        <p className="text-text-muted text-xs font-sans uppercase tracking-wider mb-3">Total Races</p>
        <p className="text-lg md:text-xl font-retro text-text-main truncate w-full" title={stats.totalRacesCreated.toString()}>
          {stats.totalRacesCreated.toLocaleString()}
        </p>
      </div>
      
      <div className="bg-app-surface p-6 rounded-xl border border-app-border shadow-lg text-center flex flex-col justify-center overflow-hidden">
        <p className="text-text-muted text-xs font-sans uppercase tracking-wider mb-3">Total Entries</p>
        <p className="text-lg md:text-xl font-retro text-text-main truncate w-full" title={stats.totalEntries.toString()}>
          {stats.totalEntries.toLocaleString()}
        </p>
      </div>

      <div className="bg-app-surface p-6 rounded-xl border border-app-border shadow-lg text-center flex flex-col justify-center overflow-hidden">
        <p className="text-text-muted text-xs font-sans uppercase tracking-wider mb-3">Active Racers</p>
        <p className="text-lg md:text-xl font-retro text-text-main truncate w-full" title={stats.uniqueRacers.toString()}>
          {stats.uniqueRacers.toLocaleString()}
        </p>
      </div>

      <div className="bg-app-surface p-6 rounded-xl border border-app-border shadow-lg text-center flex flex-col justify-center overflow-hidden">
        <p className="text-text-muted text-xs font-sans uppercase tracking-wider mb-3">Total Volume</p>
        <p className="text-lg md:text-xl font-retro text-accent-gold truncate w-full" title={formatWei(stats.totalVolumeWei)}>
          {formatWei(stats.totalEntryFeeVolumeWei)} ETH
        </p>
      </div>
    </div>
  );
}