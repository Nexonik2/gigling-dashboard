// lib/chartTransformers.ts

/**
 * Transforms race data for Time-Series Charts.
 * Sorts chronologically, calculates cumulative earnings, best placements, and checks if all races were free.
 */
// lib/chartTransformers.ts

export function transformTrajectoryAndEarnings(races: any[]) {
  const chronologicalRaces = [...races].sort((a, b) => a.raceStart - b.raceStart);
  
  let cumulativeEarnings = 0;
  let allFree = true;
  let totalWinnings = 0;

  const trajectoryData = chronologicalRaces.map((race, index) => {
    const bestPlacement = Math.min(
      ...race.myPetIds.map((petId: number) => race.finalRanking.indexOf(petId) + 1)
    );

    // Evaluate entry fees
    const entryFee = Number(race.entryFee || race.weiEntry || 0);
    if (entryFee > 0) allFree = false;

    const rawPayout = race.weiPayout || race.weiWon || race.payout || 0;
    const payoutETH = Number(rawPayout) / 1e18;
    totalWinnings += payoutETH;

    // Track Gross Earnings to match the UI tables, rather than Net ROI
    cumulativeEarnings += payoutETH;

    return {
      index: index + 1,
      name: `Race ${index + 1}`,
      date: new Date(race.raceStart * 1000).toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric' 
      }),
      bestPlacement: bestPlacement,
      earnings: payoutETH,
      cumulativeEarnings: Number(cumulativeEarnings.toFixed(4))
    };
  });

  const noPaidWins = !allFree && totalWinnings === 0;

  return { trajectoryData, allFree, noPaidWins };
}

export function transformConditionsPerformance(races: any[]) {
  const grouped: Record<string, { cold: number[]; normal: number[]; hot: number[] }> = {};

  races.forEach(race => {
    if (!race.finalRanking || !race.myPetIds) return;

    const length = race.trackLength.toString();
    
    let temp = 'normal';
    if (race.raceTemp !== undefined && race.raceTemp !== null) {
      temp = race.raceTemp.toString().toLowerCase();
    }

    const bestPlacement = Math.min(
      ...race.myPetIds.map((petId: number) => race.finalRanking.indexOf(petId) + 1)
    );

    if (!grouped[length]) {
      grouped[length] = { cold: [], normal: [], hot: [] };
    }

    if (temp === 'cold' || temp === '0') grouped[length].cold.push(bestPlacement);
    else if (temp === 'hot' || temp === '2') grouped[length].hot.push(bestPlacement);
    else grouped[length].normal.push(bestPlacement);
  });

  const conditionsData: any[] = [];

  Object.entries(grouped)
    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
    .forEach(([length, temps]) => {
      if (temps.cold.length > 0) {
        conditionsData.push({
          label: `${length}m ❄️`,
          averageRank: Number((temps.cold.reduce((a, b) => a + b, 0) / temps.cold.length).toFixed(2)),
          color: '#60a5fa', 
          tempName: 'Cold'
        });
      }
      if (temps.normal.length > 0) {
        conditionsData.push({
          label: `${length}m ☁️`,
          averageRank: Number((temps.normal.reduce((a, b) => a + b, 0) / temps.normal.length).toFixed(2)),
          color: '#ffffff', 
          tempName: 'Normal'
        });
      }
      if (temps.hot.length > 0) {
        conditionsData.push({
          label: `${length}m ☀️`,
          averageRank: Number((temps.hot.reduce((a, b) => a + b, 0) / temps.hot.length).toFixed(2)),
          color: '#f59e0b', 
          tempName: 'Hot'
        });
      }
    });

  return conditionsData;
}