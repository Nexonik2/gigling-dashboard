'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchGigaverseData } from '../../lib/api';

export default function TestPetFetch() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['testPetFetch'],
    // Fetching your specific Gigling, ID 2349
    queryFn: () => fetchGigaverseData('/pets?ids=2349'), 
  });

  if (isLoading) return <div className="p-8 text-slate-400">Fetching Pet 2349 Data...</div>;
  if (error) return <div className="p-8 text-red-400">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <h1 className="text-2xl font-bold text-emerald-400 mb-4">GET /pets?ids=2349 (Raw Dump)</h1>
      <pre className="text-sm overflow-auto text-slate-300 bg-slate-900 p-4 rounded border border-slate-800">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}