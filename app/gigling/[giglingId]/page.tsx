'use client';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchGigaverseData } from '../../../lib/api';
import RecentRaces from '../../../components/RecentRaces';
import BackButton from '../../../components/ui/BackButton';

export default function GiglingProfile() {
  const params = useParams();
  const router = useRouter();
  const giglingId = params.giglingId as string;

  const { data: profileData, isLoading: isLoadingProfile, error: profileError } = useQuery({
    queryKey: ['giglingProfile', giglingId],
    queryFn: () => fetchGigaverseData(`/pets?ids=${giglingId}`),
  });

  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['giglingStats', giglingId],
    queryFn: () => fetchGigaverseData(`/pets/${giglingId}/stats`),
  });

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-app p-8 flex justify-center items-center">
        <div className="text-textMuted animate-pulse text-xl">Loading Asset #{giglingId} On-Chain Data...</div>
      </div>
    );
  }

  if (profileError || !profileData?.pets || profileData.pets.length === 0) {
    return (
      <div className="min-h-screen bg-app p-8 flex justify-center items-center">
        <div className="bg-red-900/20 text-red-400 p-8 rounded-xl border border-red-800/50">
          Failed to locate Gigling #{giglingId}. It may not exist or the API is syncing.
        </div>
      </div>
    );
  }

  const pet = profileData.pets[0];
  const stats = pet.racePublic;
  const winRate = stats.eloRaceCount > 0 ? Math.round((stats.wins / stats.eloRaceCount) * 100) : 0;
  
  const recentRacesList = statsData?.stats?.recent || [];

  const isGigaRarity = pet.rarityName?.toLowerCase() === 'giga';
  const isGigusFaction = pet.factionName?.toLowerCase() === 'gigus';
  const headerOpacityColor = isGigaRarity ? '#ff4500' : pet.rarityColor;

  return (
    <main className="min-h-screen bg-app p-8 flex flex-col items-center">
      <div className="max-w-5xl w-full">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN */}
          <div className="col-span-1 flex flex-col gap-6">
            
            {/* Navigation Breadcrumb (Moved inside column to align layouts) */}
            <div className="mb-6">
              <BackButton />
            </div>

            {/* Core Identity Card */}
            <div className="bg-panel rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col">
              <div 
                className="h-28 w-full flex items-center justify-center opacity-80"
                style={{ background: `linear-gradient(to bottom, ${headerOpacityColor}40, transparent)` }}
              >
                <h1 className="text-3xl font-black text-textMain tracking-tighter drop-shadow-md mt-4">
                  {pet.name}
                </h1>
              </div>
              
              <div className="flex-grow flex flex-col items-center p-6 pt-2">
                <img 
                  src={pet.imgUrl} 
                  alt={`Gigling ${pet.name}`} 
                  className="w-48 h-48 object-contain drop-shadow-2xl z-10 hover:scale-105 transition-transform duration-300"
                />
                
                <div className="flex gap-2 mt-4 w-full justify-center">
                  <span 
                    className={`px-3 py-1 rounded-full text-xs font-bold text-app shadow-sm ${isGigaRarity ? 'bg-rarity-giga' : ''}`}
                    style={!isGigaRarity ? { background: pet.rarityColor } : {}}
                  >
                    {pet.rarityName}
                  </span>
                  <span 
                    className={`px-3 py-1 rounded-full text-xs font-bold text-app shadow-sm ${isGigusFaction ? 'bg-faction-gigus' : ''}`}
                    style={!isGigusFaction ? { background: pet.factionColor } : {}}
                  >
                    {pet.factionName}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-app border border-border text-textMain shadow-sm">
                    {pet.gender}
                  </span>
                </div>
              </div>
            </div>

            {/* Current Owner Card */}
            <div className="w-full p-5 bg-panel rounded-2xl border border-border shadow-lg text-center">
              <p className="text-xs text-textSubtle uppercase tracking-wider mb-3">Current Owner</p>
              <Link 
                href={`/player/${pet.ownerAddress}`} 
                className="text-[var(--color-interactive)] font-mono text-sm break-all transition-all duration-300 bg-transparent py-2 px-4 rounded-lg border border-[var(--color-interactive)]/30 inline-block w-full hover:bg-[var(--color-interactive)]/10 hover:border-[var(--color-interactive)]"
              >
                {pet.ownerAddress.substring(0, 8)}...{pet.ownerAddress.substring(pet.ownerAddress.length - 6)}
              </Link>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-panel p-6 rounded-2xl border border-border shadow-lg text-center flex flex-col justify-center">
                <p className="text-textMuted text-xs font-semibold uppercase tracking-wider mb-1">ELO Rating</p>
                <p className="text-3xl font-bold text-brand-hover">{stats.elo}</p>
              </div>
              <div className="bg-panel p-6 rounded-2xl border border-border shadow-lg text-center flex flex-col justify-center">
                <p className="text-textMuted text-xs font-semibold uppercase tracking-wider mb-1">Win Rate</p>
                <p className="text-3xl font-bold text-textMain">{winRate}%</p>
              </div>
              <div className="bg-panel p-6 rounded-2xl border border-border shadow-lg text-center flex flex-col justify-center">
                <p className="text-textMuted text-xs font-semibold uppercase tracking-wider mb-2 leading-tight">
                  Total Races <br/> 
                  <span className="text-[10px] text-textSubtle font-medium tracking-normal">(Won / Run)</span>
                </p>
                <p className="text-3xl font-bold text-textMain">
                  {stats.wins} <span className="text-lg text-textSubtle font-medium">/ {stats.eloRaceCount}</span>
                </p>
              </div>
            </div>

            <div className="bg-panel p-6 rounded-2xl border border-border shadow-lg">
              <h3 className="text-lg font-bold text-textMain mb-6 flex items-center gap-2">
                📊 Discovered Stat Ranges
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                {[
                  { label: 'Start', range: stats.startRange, reveals: stats.revealsPerStat?.start ?? 0 },
                  { label: 'Speed', range: stats.speedRange, reveals: stats.revealsPerStat?.speed ?? 0 },
                  { label: 'Stamina', range: stats.staminaRange, reveals: stats.revealsPerStat?.stamina ?? 0 },
                  { label: 'Finish', range: stats.finishRange, reveals: stats.revealsPerStat?.finish ?? 0 },
                ].map((stat) => {
                  const min = stat.range?.min ?? 0;
                  const max = stat.range?.max ?? 0;
                  const width = Math.max(max - min, 2);

                  return (
                    <div key={stat.label}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-textMain font-semibold">{stat.label}</span>
                        <span className="text-textMuted text-xs">Reveals: {stat.reveals}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-8 text-right font-mono text-textMuted text-sm">{min}</div>
                        
                        <div className="flex-1 h-3 bg-borderLight/30 rounded-full overflow-hidden relative">
                          <div 
                            className={`absolute h-full rounded-full transition-all duration-500 ${isGigaRarity ? 'bg-rarity-giga' : ''}`}
                            style={Object.assign(
                              { left: `${min}%`, width: `${width}%` },
                              !isGigaRarity ? { background: pet.rarityColor || '#4f46e5' } : {}
                            )}
                          />
                        </div>
                        
                        <div className="w-8 text-left font-mono text-textMain font-bold text-sm">{max}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-panel p-6 rounded-2xl border border-border shadow-lg">
              <h3 className="text-lg font-bold text-textMain mb-4 flex items-center gap-2">
                🧬 Active Traits
              </h3>
              <div className="flex flex-wrap gap-3">
                {stats.traits && stats.traits.length > 0 ? (
                  stats.traits.map((trait: any) => (
                    <div key={trait.id} className="bg-app border border-borderLight px-4 py-2 rounded-lg flex items-center gap-2">
                      <span className="text-textMain font-medium">{trait.name}</span>
                      {trait.tier && (
                        <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-0.5 rounded font-bold">
                          T{trait.tier}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-textSubtle italic">No traits discovered yet.</p>
                )}
              </div>
            </div>

          </div>
        </div>

        <div className="mt-8">
          {isLoadingStats ? (
            <div className="w-full bg-panel p-6 rounded-2xl border border-border shadow-lg text-center text-textMuted animate-pulse">
              Pulling track history...
            </div>
          ) : (
            <RecentRaces races={recentRacesList} />
          )}
        </div>

      </div>
    </main>
  );
}