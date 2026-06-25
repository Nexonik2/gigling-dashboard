import Link from 'next/link';
import { formatWei } from '../lib/utils';

export default function RecentRaces({ races }: { races: any[] }) {
  if (!races || races.length === 0) {
    return (
      <div className="w-full bg-panel p-6 rounded-2xl border border-border shadow-lg text-center text-textSubtle">
        No recent track history available.
      </div>
    );
  }

  return (
    <div className="w-full bg-panel p-6 rounded-2xl border border-border shadow-lg overflow-x-auto">
      <h3 className="text-lg font-bold text-textMain mb-6 flex items-center gap-2">
        🏁 Recent Track History
      </h3>
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b border-borderLight text-textMuted text-xs uppercase tracking-wider">
            <th className="pb-3 font-semibold px-4">Date</th>
            <th className="pb-3 font-semibold px-4">Race ID</th>
            <th className="pb-3 font-semibold px-4">Entry Fee</th>
            <th className="pb-3 font-semibold px-4">Placement</th>
            <th className="pb-3 font-semibold px-4 text-right">Payout</th>
          </tr>
        </thead>
        <tbody>
          {races.map((race: any) => {
            // Enforce "Jun 16, 10:48 PM" formatting; browser automatically handles local timezone math
            const dateObj = race.settledAt ? new Date(race.settledAt) : null;
            const date = dateObj 
              ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(dateObj) 
              : 'N/A';
            
            const placement = race.rank !== undefined ? race.rank + 1 : '-';
            
            // Format Wei values and explicitly denote ETH
            const entryFee = race.weiEntry === "0" ? "Free Race" : `${formatWei(race.weiEntry)} ETH`;
            const payout = !race.weiPayout || race.weiPayout === "0" ? "-" : `${formatWei(race.weiPayout)} ETH`;
            
            return (
              <tr key={race.raceId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-4 px-4 text-textMain text-sm whitespace-nowrap">{date}</td>
                <td className="py-4 px-4">
                  <Link href={`/race/${race.raceId}`} className="text-[var(--color-interactive)] hover:brightness-125 font-mono text-sm transition-all duration-300">
                    #{race.raceId}
                  </Link>
                </td>
                <td className="py-4 px-4 text-textMuted text-sm font-mono whitespace-nowrap">{entryFee}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold inline-flex items-center justify-center min-w-[36px] ${
                    placement === 1 ? 'bg-amber-500/20 text-amber-500' : 
                    placement === 2 ? 'bg-slate-300/20 text-slate-300' : 
                    placement === 3 ? 'bg-amber-700/20 text-amber-600' : 
                    'bg-white/5 text-textMuted'
                  }`}>
                    {placement}{placement === 1 ? 'st' : placement === 2 ? 'nd' : placement === 3 ? 'rd' : 'th'}
                  </span>
                </td>
                <td className="py-4 px-4 text-right text-textMain font-mono font-medium text-sm whitespace-nowrap">
                  {payout}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}