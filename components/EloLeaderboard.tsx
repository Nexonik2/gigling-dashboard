import Link from 'next/link';

interface OwnerSummary {
  username?: string;
}

export interface LeaderboardEntry {
  rank?: number;
  petId: number;
  ownerAddress: string;
  ownerSummary?: OwnerSummary;
  elo: number;
  factionName?: string;
  rarityName?: string;
  wins?: number;
  racesRun?: number;
}

interface EloLeaderboardProps {
  data: LeaderboardEntry[];
  isLoading?: boolean;
  title?: string; 
}

const getRarityClass = (rarity?: string) => {
  const map: Record<string, string> = {
    Uncommon: "text-rarity-uncommon",
    Rare: "text-rarity-rare",
    Epic: "text-rarity-epic",
    Legendary: "text-rarity-legendary",
    Relic: "text-rarity-relic",
    Giga: "text-rarity-giga",
  };
  return map[rarity || ""] || "text-text-muted";
};

const getFactionClass = (faction?: string) => {
  const map: Record<string, string> = {
    Crusader: "text-faction-crusader",
    Summoner: "text-faction-summoner",
    Archon: "text-faction-archon",
    Foxglove: "text-faction-foxglove",
    Chobo: "text-faction-chobo",
    Athena: "text-faction-athena",
    Overseer: "text-faction-overseer",
    Gigus: "text-faction-gigus",
  };
  return map[faction || ""] || "text-text-muted";
};

export default function EloLeaderboard({ data = [], isLoading, title }: EloLeaderboardProps) {
  if (isLoading) {
    return (
      <div className="w-full bg-app-surface p-8 rounded-xl border border-app-border shadow-xl mt-8 text-center animate-pulse text-text-muted font-sans">
        Fetching the current track kings...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full bg-app-surface p-8 rounded-xl border border-app-border shadow-xl mt-8 text-center text-text-muted font-sans">
        No racers match the current criteria.
      </div>
    );
  }

  const displayTitle = title || `TOP ${data.length} GLOBAL ELO`;

  return (
    <div className="w-full bg-app-surface rounded-xl border border-app-border shadow-xl mt-8 overflow-hidden">
      <div className="bg-app-bg/50 p-6 border-b border-app-border">
        <h2 className="text-lg md:text-xl font-retro text-text-main flex items-center gap-2">
          {displayTitle}
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm font-sans whitespace-nowrap">
          <thead>
            <tr className="bg-app-bg/80 text-text-muted border-b border-app-border text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold w-16 text-center">Rank</th>
              <th className="p-4 font-semibold">Gigling</th>
              <th className="p-4 font-semibold">Owner</th>
              <th className="p-4 font-semibold text-right">Win Rate</th>
              <th className="p-4 font-semibold text-right">ELO Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-app-border">
            {data.map((entry, index) => {
              const winRate = entry.racesRun && entry.racesRun > 0 
                ? Math.round(((entry.wins || 0) / entry.racesRun) * 100) 
                : 0;
              
              const displayName = entry.ownerSummary?.username 
                ? `@${entry.ownerSummary.username}` 
                : `${entry.ownerAddress.substring(0, 6)}...${entry.ownerAddress.substring(entry.ownerAddress.length - 4)}`;

              const currentRank = entry.rank || index + 1;

              let rankColor = "text-text-muted";
              if (currentRank === 1) rankColor = "text-accent-gold font-bold text-xl";
              if (currentRank === 2) rankColor = "text-slate-300 font-bold text-xl";
              if (currentRank === 3) rankColor = "text-amber-600 font-bold text-xl";

              return (
                <tr key={`${entry.petId}-${index}`} className="hover:bg-app-bg/30 transition-colors">
                  <td className={`p-4 text-center font-retro text-sm md:text-base ${rankColor}`}>
                    #{currentRank}
                  </td>
                  <td className="p-4">
                    <Link href={`/gigling/${entry.petId}`} className="text-interactive hover:opacity-80 font-bold text-base transition-opacity">
                      #{entry.petId}
                    </Link>
                    <div className="text-xs mt-1 flex gap-1">
                      <span className={`${getRarityClass(entry.rarityName)} font-medium`}>
                        {entry.rarityName || "Unknown"}
                      </span>
                      <span className="text-text-muted">•</span>
                      <span className={`${getFactionClass(entry.factionName)} font-medium`}>
                        {entry.factionName || "Unknown"}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Link href={`/player/${entry.ownerAddress}`} className="text-interactive hover:opacity-80 transition-opacity">
                      {displayName}
                    </Link>
                  </td>
                  <td className="p-4 text-right text-text-main">
                    {winRate}% <span className="text-xs text-text-muted ml-1">({entry.wins || 0}/{entry.racesRun || 0})</span>
                  </td>
                  <td className="p-4 text-right font-retro text-accent-gold text-base md:text-lg">
                    {entry.elo}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}