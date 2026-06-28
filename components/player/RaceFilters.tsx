import React from 'react';
import MultiSelectDropdown from '../ui/MultiSelectDropdown';

interface RaceFiltersProps {
  hideFreeRaces: boolean;
  setHideFreeRaces: (val: boolean) => void;
  lengthFilters: string[];
  setLengthFilters: (val: string[]) => void;
  weatherFilters: string[];
  setWeatherFilters: (val: string[]) => void;
  availableLengths: number[];
  availableWeathers: string[];
}

export default function RaceFilters({
  hideFreeRaces,
  setHideFreeRaces,
  lengthFilters,
  setLengthFilters,
  weatherFilters,
  setWeatherFilters,
  availableLengths,
  availableWeathers
}: RaceFiltersProps) {
  return (
    <div className="p-5 border-b border-app-border bg-app-surface flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-t-xl">
      <h2 className="text-xl font-bold text-text-main">Race History</h2>
      
      <div className="flex flex-wrap items-center gap-3">
        {/* Hide Free Races Toggle */}
        <button
          onClick={() => setHideFreeRaces(!hideFreeRaces)}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors border ${
            hideFreeRaces 
              ? 'bg-interactive/20 text-interactive border-interactive/50' 
              : 'bg-app-bg text-text-muted border-app-border hover:bg-app-surface'
          }`}
        >
          {hideFreeRaces ? 'Show Free Races' : 'Hide Free Races'}
        </button>

        {/* Multi-Select: Length Filters */}
        <MultiSelectDropdown
          label="Length"
          options={availableLengths.map(String)}
          selectedValues={lengthFilters}
          onChange={setLengthFilters}
          formatOption={(val) => `${val}m`}
        />

        {/* Multi-Select: Weather Filters */}
        <MultiSelectDropdown
          label="Weather"
          options={availableWeathers}
          selectedValues={weatherFilters}
          onChange={setWeatherFilters}
        />
      </div>
    </div>
  );
}