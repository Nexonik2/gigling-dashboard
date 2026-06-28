'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { fetchGigaverseData } from '../../../lib/api';
import RaceFilters from '../../../components/player/RaceFilters';
import RaceHistoryTable from '../../../components/player/RaceHistoryTable';
import PlayerPerformanceCharts from '../../../components/charts/PlayerPerfomanceCharts';
import BackButton from '../../../components/ui/BackButton';

export default function PlayerProfile() {
  const params = useParams();
  const address = params.address as string;

  // --- State for Client-Side Filters & UX ---
  const [hideFreeRaces, setHideFreeRaces] = useState(false);
  const [weatherFilters, setWeatherFilters] = useState<string[]>([]);
  const [lengthFilters, setLengthFilters] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Fetch Abstract Global Wallet identity
  const { data: identityData } = useQuery({
    queryKey: ['playerIdentity', address],
    queryFn: async () => {
      const res = await fetch(`https://backend.portal.abs.xyz/api/user/address/${address}`, {
        headers: {
          "Accept": "application/json"
        }
      });
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 1000 * 60 * 60 * 24, // Aggressive 24-hour cache
    retry: false, // Prevent spamming backend on 404s
  });

  // Fetch recent race history
  const { 
    data: racesData, 
    isLoading: isRacesLoading, 
    error: racesError 
  } = useQuery({
    queryKey: ['playerRaces', address],
    queryFn: () => fetchGigaverseData(`/races/${address}?limit=50`),
  });

  // Fetch accurate unclaimed payouts
  const { 
    data: payoutsData, 
    isLoading: isPayoutsLoading 
  } = useQuery({
    queryKey: ['playerPayouts', address],
    queryFn: () => fetchGigaverseData(`/payouts/${address}`),
  });

  const isLoading = isRacesLoading || isPayoutsLoading;
  
  // 1. Filter out unsettled races early
  const rawRaces = racesData?.races || [];
  const settledRaces = rawRaces.filter((race: any) => race.finalRanking !== null);
  
  // 2. Calculate stats
  const totalRaces = settledRaces.length;
  let wins = 0;
  let podiums = 0;

  settledRaces.forEach((race: any) => {
    let hasWin = false;
    let hasPodium = false;

    race.myPetIds.forEach((petId: number) => {
      const rank = race.finalRanking.indexOf(petId) + 1;
      if (rank === 1) hasWin = true;
      if (rank > 0 && rank <= 3) hasPodium = true;
    });

    if (hasWin) wins++;
    if (hasPodium) podiums++;
  });

  const winRate = totalRaces > 0 ? ((wins / totalRaces) * 100).toFixed(1) : "0.0";

  // Map filters safely
  const availableLengths = Array.from(new Set(settledRaces.map((r: any) => r.trackLength))).sort((a: any, b: any) => a - b) as number[];
  const availableWeathers = Array.from(new Set(settledRaces.map((r: any) => r.raceTemp))) as string[];

  // 3. Apply user UI filters (Updated for Multi-Select)
  const filteredRaces = settledRaces.filter((race: any) => {
    if (hideFreeRaces && race.payout === "0") return false;
    if (weatherFilters.length > 0 && !weatherFilters.includes(race.raceTemp)) return false;
    if (lengthFilters.length > 0 && !lengthFilters.includes(race.trackLength.toString())) return false;
    return true;
  });

  const handleClearFilters = () => {
    setHideFreeRaces(false);
    setLengthFilters([]);
    setWeatherFilters([]);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Evaluate Username Fallback Logic
  const rawName = identityData?.user?.name;
  const hasValidName = rawName && rawName.toLowerCase() !== address.toLowerCase();
  const profileTitle = hasValidName ? rawName : "Player Profile";

  return (
    <main className="max-w-5xl mx-auto pb-12 p-6">
      <div className="mb-8">
        <BackButton />
      </div>

      <h1 className="text-4xl font-extrabold mb-2 text-slate-100 tracking-tight">
        {profileTitle}
      </h1>
      
      <button 
        onClick={handleCopyAddress}
        className="text-slate-400 mb-8 font-mono text-sm break-all bg-slate-900 inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-700 hover:border-slate-500 hover:text-slate-200 transition-colors text-left"
        title="Copy to clipboard"
      >
        Wallet: <span className="text-[var(--color-interactive)]">{address}</span>
        {copied && <span className="text-xs text-emerald-400 ml-2 font-sans font-bold uppercase tracking-wider">Copied!</span>}
      </button>

      {isLoading && (
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-slate-800 rounded-xl border border-slate-700 w-full"></div>
          <div className="h-64 bg-slate-800 rounded-xl border border-slate-700 w-full"></div>
        </div>
      )}

      {racesError && (
        <div className="text-red-400 bg-red-900/20 p-4 rounded-xl border border-red-800 mb-8">
          <strong>Failed to load player data:</strong> {racesError.message}
        </div>
      )}

      {!isLoading && racesData && (
        <div className="space-y-8">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800 p-6 rounded-xl border border-white/5 shadow-md">
              <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                Total Races
              </span>
              <p className="text-3xl text-slate-100 font-bold mt-2">
                {totalRaces}
              </p>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-white/5 shadow-md">
              <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                Win Rate
              </span>
              <p className="text-3xl text-emerald-400 font-bold mt-2">
                {winRate}<span className="text-lg text-slate-500">%</span>
              </p>
            </div>
            
            <div className="bg-slate-800 p-6 rounded-xl border border-white/5 shadow-md">
              <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                Recent Wins
              </span>
              <p className="text-3xl text-slate-100 font-bold mt-2">
                {wins}
              </p>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-white/5 shadow-md">
              <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                Recent Podiums
              </span>
              <p className="text-3xl text-slate-100 font-bold mt-2">
                {podiums}
              </p>
            </div>
          </div>

          <PlayerPerformanceCharts filteredRaces={filteredRaces} />

          <div className="bg-slate-800 rounded-xl border border-white/5 shadow-lg">
            <RaceFilters 
              hideFreeRaces={hideFreeRaces}
              setHideFreeRaces={setHideFreeRaces}
              lengthFilters={lengthFilters}
              setLengthFilters={setLengthFilters}
              weatherFilters={weatherFilters}
              setWeatherFilters={setWeatherFilters}
              availableLengths={availableLengths}
              availableWeathers={availableWeathers}
            />
            <RaceHistoryTable 
              filteredRaces={filteredRaces}
              onClearFilters={handleClearFilters}
            />
          </div>

        </div>
      )}
    </main>
  );
}