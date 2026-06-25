import React from 'react';

interface RaceFiltersProps {
  hideFreeRaces: boolean;
  setHideFreeRaces: (val: boolean) => void;
  lengthFilter: string;
  setLengthFilter: (val: string) => void;
  weatherFilter: string;
  setWeatherFilter: (val: string) => void;
  availableLengths: number[];
  availableWeathers: string[];
}

export default function RaceFilters({
  hideFreeRaces,
  setHideFreeRaces,
  lengthFilter,
  setLengthFilter,
  weatherFilter,
  setWeatherFilter,
  availableLengths,
  availableWeathers
}: RaceFiltersProps) {
  return (
    <div className="p-5 border-b border-slate-700 bg-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <h2 className="text-xl font-bold text-slate-100">Race History</h2>
      
      <div className="flex flex-wrap items-center gap-3">
        {/* Hide Free Races Toggle */}
        <button
          onClick={() => setHideFreeRaces(!hideFreeRaces)}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors border ${
            hideFreeRaces 
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' 
              : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-750'
          }`}
        >
          {hideFreeRaces ? 'Show Free Races' : 'Hide Free Races'}
        </button>

        {/* Length Filter */}
        <select 
          value={lengthFilter}
          onChange={(e) => setLengthFilter(e.target.value)}
          className="bg-slate-900 text-slate-200 text-sm rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-emerald-500"
        >
          <option value="All">All Lengths</option>
          {availableLengths.map((len) => (
            <option key={len} value={len.toString()}>{len}m</option>
          ))}
        </select>

        {/* Weather Filter */}
        <select 
          value={weatherFilter}
          onChange={(e) => setWeatherFilter(e.target.value)}
          className="bg-slate-900 text-slate-200 text-sm rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-emerald-500 capitalize"
        >
          <option value="All">All Weather</option>
          {availableWeathers.map((temp) => (
            <option key={temp} value={temp}>{temp}</option>
          ))}
        </select>
      </div>
    </div>
  );
}