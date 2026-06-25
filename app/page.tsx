"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { fetchGigaverseData } from "../lib/api";
import SearchForm from "../components/SearchForm";
import GlobalStats from "../components/GlobalStats";
import EloLeaderboard from "../components/EloLeaderboard";

export default function Home() {
  const { data: leaderboardData, isLoading: isLeaderboardLoading } = useQuery({
    queryKey: ['globalElo'],
    queryFn: () => fetchGigaverseData('/leaderboard/elo?limit=10'),
  });

  const top10Array = Array.isArray(leaderboardData) 
    ? leaderboardData 
    : leaderboardData?.entries || [];

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <div className="text-center mb-12 mt-8">
        <h1 className="text-3xl md:text-5xl font-retro text-text-main mb-4 tracking-tight leading-relaxed">
          GIGAVERSE <span className="text-accent-gold block mt-4">RACING DASHBOARD</span>
        </h1>
      </div>

      {/* Global Statistics */}
      <div className="w-full mb-8">
        <GlobalStats />
      </div>

      {/* Search Functionality */}
      <div className="w-full bg-app-surface p-8 rounded-xl border border-app-border shadow-xl mb-12">
        <p className="text-text-muted mb-6 text-center font-sans text-sm md:text-base">
          Enter a Gigling ID or Wallet Address below to analyze performance metrics.
        </p>
        <SearchForm />
      </div>

      {/* Data-Driven Leaderboard Preview */}
      <div className="w-full flex flex-col items-center mb-12">
        <EloLeaderboard data={top10Array} isLoading={isLeaderboardLoading} />
        
        {/* Full Rankings Call-to-Action */}
        <Link 
          href="/rankings" 
          className="mt-6 px-6 py-3 border border-interactive text-interactive hover:bg-interactive hover:text-app-bg font-retro text-sm rounded-xl transition-all"
        >
          VIEW FULL RANKINGS →
        </Link>
      </div>
    </div>
  );
}