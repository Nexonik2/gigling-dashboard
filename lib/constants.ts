// lib/constants.ts

export const FACTION_MAP: Record<string, number> = {
  "None": 0,
  "Crusader": 1,
  "Overseer": 2,
  "Athena": 3, 
  "Archon": 4,
  "Foxglove": 5,
  "Summoner": 6,
  "Chobo": 7,
  "Gigus": 8,
};

export const RARITY_MAP: Record<string, number> = {
  "Uncommon": 1,
  "Rare": 2,
  "Epic": 3,
  "Legendary": 4,
  "Relic": 5,
  "Giga": 6,
};

// Exporting arrays for the UI dropdowns directly from the keys
export const FACTIONS = Object.keys(FACTION_MAP).filter(f => f !== "None"); 
export const RARITIES = Object.keys(RARITY_MAP);
export const GENDERS = ["Male", "Female", "Unknown"];