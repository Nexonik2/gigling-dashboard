import { formatWei } from '../lib/utils';

export default function StatCards({ stats }: { stats: any }) {
  const winRate = stats?.totalRaces > 0 
    ? ((stats.wins / stats.totalRaces) * 100).toFixed(1) 
    : '0.0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
        <p className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Total Races</p>
        <p className="text-3xl font-bold text-slate-100">{stats.totalRaces}</p>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
        <p className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Win Rate</p>
        <p className="text-3xl font-bold text-emerald-400">{winRate}%</p>
        <p className="text-xs text-slate-500 mt-1">{stats.wins} Wins / {stats.podiums} Podiums</p>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
        <p className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Jackpots</p>
        <p className="text-3xl font-bold text-amber-400">{stats.jackpotWins}</p>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
        <p className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Net Earnings</p>
        <p className="text-2xl font-bold text-slate-100 truncate" title={`${stats.weiNet} Wei`}>
          {formatWei(stats.weiNet)} <span className="text-sm text-slate-400 font-normal">Tokens</span>
        </p>
      </div>
    </div>
  );
}