'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchForm() {
  const [searchInput, setSearchInput] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const input = searchInput.trim();
    if (!input) return;

    if (input.startsWith('0x')) {
      router.push(`/player/${input}`);
    } else if (!isNaN(Number(input))) {
      router.push(`/gigling/${input}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl mx-auto">
      <input
        type="text"
        placeholder="Enter Gigling ID or Wallet Address (0x...)"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="flex-1 bg-app-bg text-text-main font-sans px-4 py-3 rounded-xl border border-app-border focus:outline-none focus:border-interactive transition-colors"
      />
      <button
        type="submit"
        className="text-interactive border border-interactive hover:bg-interactive hover:text-app-bg font-retro text-xs px-8 py-4 rounded-xl transition-all whitespace-nowrap"
      >
        SEARCH
      </button>
    </form>
  );
}