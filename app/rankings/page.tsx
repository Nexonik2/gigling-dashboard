"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGigaverseData } from "../../lib/api";
import { FACTION_MAP, RARITY_MAP, FACTIONS, RARITIES, GENDERS } from "../../lib/constants";
import EloLeaderboard from "../../components/EloLeaderboard";
import FactionDistributionChart from "../../components/charts/FactionDistributionChart";

const ITEMS_PER_PAGE = 20;

export default function RankingsPage() {
  const [page, setPage] = useState(1);
  const [selectedFaction, setSelectedFaction] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("");
  const [selectedGender, setSelectedGender] = useState("");

  const offset = (page - 1) * ITEMS_PER_PAGE;

  // Construct query parameters dynamically based on active filters
  const queryParams = new URLSearchParams({
    limit: ITEMS_PER_PAGE.toString(),
    offset: offset.toString(),
    ...(selectedFaction && { factions: FACTION_MAP[selectedFaction].toString() }),
    ...(selectedRarity && { rarities: RARITY_MAP[selectedRarity].toString() }),
    ...(selectedGender && { genders: selectedGender }), // Gender might still expect a string, but verify if it needs an int too
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["leaderboard", selectedFaction, selectedRarity, selectedGender, page],
    queryFn: () => fetchGigaverseData(`/leaderboard/elo?${queryParams.toString()}`),
  });

  const handleFilterChange = (filterType: string, value: string) => {
    setPage(1); // Reset to first page when changing filters
    if (filterType === "faction") setSelectedFaction(value);
    if (filterType === "rarity") setSelectedRarity(value);
    if (filterType === "gender") setSelectedGender(value);
  };

  // Safely extract the array from the 'entries' object based on the API schema
  const leaderboardArray = Array.isArray(data) ? data : data?.entries || [];
  const hasMore = data?.hasMore || false;

  const startRank = offset + 1;
  const endRank = offset + leaderboardArray.length;
  
  let filterContext = "Global";
  if (selectedFaction || selectedRarity || selectedGender) {
    const parts = [];
    if (selectedFaction) parts.push(selectedFaction);
    if (selectedGender) parts.push(selectedGender);
    if (selectedRarity) parts.push(`(${selectedRarity})`);
    filterContext = parts.join(" ");
  }

  const dynamicTableTitle = `🏆 Ranks ${startRank}–${endRank} | ${filterContext} ELO`;

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-textMain tracking-tight">Global Rankings</h1>
        <p className="text-textMuted mt-1">Analyze competitive ELO standings and metagame distributions.</p>
      </div>

      {/* Control Filters Panel */}
      <div className="bg-cardBg border border-borderSubtle p-4 rounded-lg flex flex-wrap gap-4 items-end shadow-lg">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-textMuted uppercase tracking-wider">Faction</label>
          <select
            value={selectedFaction}
            onChange={(e) => handleFilterChange("faction", e.target.value)}
            className="bg-app border border-borderSubtle text-textMain px-3 py-2 rounded md:w-48 focus:outline-none focus:border-accent"
          >
            <option value="">All Factions</option>
            {FACTIONS.map((faction) => (
              <option key={faction} value={faction}>
                {faction}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-textMuted uppercase tracking-wider">Rarity</label>
          <select
            value={selectedRarity}
            onChange={(e) => handleFilterChange("rarity", e.target.value)}
            className="bg-app border border-borderSubtle text-textMain px-3 py-2 rounded md:w-48 focus:outline-none focus:border-accent"
          >
            <option value="">All Rarities</option>
            {RARITIES.map((rarity) => (
              <option key={rarity} value={rarity}>
                {rarity}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-textMuted uppercase tracking-wider">Gender</label>
          <select
            value={selectedGender}
            onChange={(e) => handleFilterChange("gender", e.target.value)}
            className="bg-app border border-borderSubtle text-textMain px-3 py-2 rounded md:w-48 focus:outline-none focus:border-accent"
          >
            <option value="">All Genders</option>
            {GENDERS.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>

        {(selectedFaction || selectedRarity || selectedGender) && (
          <button
            onClick={() => {
              setSelectedFaction("");
              setSelectedRarity("");
              setSelectedGender("");
              setPage(1);
            }}
            className="text-sm font-medium text-accent hover:underline mb-2.5 ml-auto"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Dashboard Analytics Section */}
      <div className="grid grid-cols-1 gap-8">
        {isLoading ? (
          <div className="h-64 flex items-center justify-center border border-borderSubtle rounded-xl bg-cardBg shadow-lg">
            <span className="text-textMuted text-sm animate-pulse">Loading standings and analytics...</span>
          </div>
        ) : isError ? (
          <div className="h-64 flex items-center justify-center border border-red-500/20 rounded-xl bg-cardBg shadow-lg">
            <span className="text-red-400 text-sm">Failed to load leaderboard data. Please try again.</span>
          </div>
        ) : (
          <>
            {/* Metagame Charts Section */}
            <div className="bg-cardBg border border-borderSubtle p-6 rounded-xl shadow-lg">
              <h2 className="text-lg font-bold text-textMain mb-4">Top 20 Faction Distribution</h2>
              <div className="h-[250px]">
                <FactionDistributionChart data={leaderboardArray} />
              </div>
            </div>

            {/* Leaderboard Component Integration */}
            <div className="flex flex-col gap-4">
              <EloLeaderboard 
                data={leaderboardArray} 
                isLoading={false} 
                title={dynamicTableTitle} // 2. Pass the specific string down
              />
              
              {/* Pagination Controls */}
              <div className="flex items-center justify-between px-6 py-4 bg-cardBg border border-borderSubtle rounded-xl shadow-lg">
                <span className="text-xs text-textMuted">
                  Page {page}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className="px-4 py-2 bg-app border border-borderSubtle rounded text-sm font-medium text-textMain disabled:opacity-40 disabled:cursor-not-allowed hover:bg-borderSubtle transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    disabled={!hasMore || leaderboardArray.length < ITEMS_PER_PAGE}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-4 py-2 bg-app border border-borderSubtle rounded text-sm font-medium text-textMain disabled:opacity-40 disabled:cursor-not-allowed hover:bg-borderSubtle transition-colors"
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