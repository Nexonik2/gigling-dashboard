"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGigaverseData } from "../../lib/api";
import { FACTION_MAP, RARITY_MAP, FACTIONS, RARITIES, GENDERS } from "../../lib/constants";
import EloLeaderboard from "../../components/EloLeaderboard";
import FactionDistributionChart from "../../components/charts/FactionDistributionChart";
import BackButton from "../../components/ui/BackButton";
import MultiSelectDropdown from "../../components/ui/MultiSelectDropdown"; // Adjust import path if MultiSelectDropdown is exported separately

const ITEMS_PER_PAGE = 20;

export default function RankingsPage() {
  const [page, setPage] = useState(1);
  const [selectedFactions, setSelectedFactions] = useState<string[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);

  const offset = (page - 1) * ITEMS_PER_PAGE;

  const queryParams = new URLSearchParams({
    limit: ITEMS_PER_PAGE.toString(),
    offset: offset.toString(),
  });

  if (selectedFactions.length > 0) {
    queryParams.append("factions", selectedFactions.map(f => FACTION_MAP[f]).join(","));
  }
  if (selectedRarities.length > 0) {
    queryParams.append("rarities", selectedRarities.map(r => RARITY_MAP[r]).join(","));
  }
  if (selectedGenders.length > 0) {
    queryParams.append("genders", selectedGenders.join(","));
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["leaderboard", selectedFactions, selectedRarities, selectedGenders, page],
    queryFn: () => fetchGigaverseData(`/leaderboard/elo?${queryParams.toString()}`),
  });

  const handleFilterChange = (filterType: string, selectedOptions: string[]) => {
    setPage(1);
    if (filterType === "faction") setSelectedFactions(selectedOptions);
    if (filterType === "rarity") setSelectedRarities(selectedOptions);
    if (filterType === "gender") setSelectedGenders(selectedOptions);
  };

  const leaderboardArray = Array.isArray(data) ? data : data?.entries || [];
  const hasMore = data?.hasMore || false;

  const startRank = offset + 1;
  const endRank = offset + leaderboardArray.length;
  
  let filterContext = "Global";
  if (selectedFactions.length > 0 || selectedRarities.length > 0 || selectedGenders.length > 0) {
    const parts = [];
    if (selectedFactions.length > 0) parts.push(selectedFactions.join("/"));
    if (selectedGenders.length > 0) parts.push(selectedGenders.join("/"));
    if (selectedRarities.length > 0) parts.push(`(${selectedRarities.join("/")})`);
    filterContext = parts.join(" ");
  }

  const dynamicTableTitle = `🏆 Ranks ${startRank}–${endRank} | ${filterContext} ELO`;

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <BackButton />
        <h1 className="text-3xl font-bold text-text-main tracking-tight mt-4">Global Rankings</h1>
      </div>

      {/* Control Filters Panel */}
      <div className="bg-app-surface border border-app-border p-4 rounded-lg flex flex-wrap gap-4 items-end shadow-lg">
        
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Faction</label>
          <MultiSelectDropdown
            label="All Factions"
            options={FACTIONS}
            selectedValues={selectedFactions}
            onChange={(options: string[]) => handleFilterChange("faction", options)}
            getOptionColor={(faction) =>
              faction.toLowerCase() === "gigus" ? "#ff1493" : `var(--color-faction-${faction.toLowerCase()})`
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Rarity</label>
          <MultiSelectDropdown
            label="All Rarities"
            options={RARITIES}
            selectedValues={selectedRarities}
            onChange={(options: string[]) => handleFilterChange("rarity", options)}
            getOptionColor={(rarity) =>
              rarity.toLowerCase() === "giga" ? "#ff1493" : `var(--color-rarity-${rarity.toLowerCase()})`
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Gender</label>
          <MultiSelectDropdown
            label="All Genders"
            options={GENDERS}
            selectedValues={selectedGenders}
            onChange={(options: string[]) => handleFilterChange("gender", options)}
            getOptionColor={(gender) =>
              gender.toLowerCase() === "male" ? "#3b82f6" : 
              gender.toLowerCase() === "female" ? "#ec4899" : 
              "var(--color-text-main)"
            }
          />
        </div>

        {(selectedFactions.length > 0 || selectedRarities.length > 0 || selectedGenders.length > 0) && (
          <button
            onClick={() => {
              setSelectedFactions([]);
              setSelectedRarities([]);
              setSelectedGenders([]);
              setPage(1);
            }}
            className="text-sm font-medium text-interactive border border-interactive px-4 py-2 rounded-lg hover:bg-interactive hover:text-app-bg transition-colors mb-0.5 ml-auto"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Dashboard Analytics Section */}
      <div className="grid grid-cols-1 gap-8">
        {isLoading ? (
          <div className="h-64 flex items-center justify-center border border-app-border rounded-xl bg-app-surface shadow-lg">
            <span className="text-text-muted text-sm animate-pulse">Loading standings and analytics...</span>
          </div>
        ) : isError ? (
          <div className="h-64 flex items-center justify-center border border-red-500/20 rounded-xl bg-app-surface shadow-lg">
            <span className="text-red-400 text-sm">Failed to load leaderboard data. Please try again.</span>
          </div>
        ) : (
          <>
            <div className="bg-app-surface border border-app-border p-6 rounded-xl shadow-lg">
              <h2 className="text-lg font-bold text-text-main mb-4">Top 20 Faction Distribution</h2>
              <div className="h-[250px]">
                <FactionDistributionChart data={leaderboardArray} />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <EloLeaderboard 
                data={leaderboardArray} 
                isLoading={false} 
                title={dynamicTableTitle} 
              />
              
              <div className="flex items-center justify-between px-6 py-4 bg-app-surface border border-app-border rounded-xl shadow-lg">
                <span className="text-xs text-text-muted">
                  Page {page}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className="px-4 py-2 bg-app-bg border border-app-border rounded text-sm font-medium text-text-main disabled:opacity-40 disabled:cursor-not-allowed hover:bg-app-border transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    disabled={!hasMore || leaderboardArray.length < ITEMS_PER_PAGE}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-4 py-2 bg-app-bg border border-app-border rounded text-sm font-medium text-text-main disabled:opacity-40 disabled:cursor-not-allowed hover:bg-app-border transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}