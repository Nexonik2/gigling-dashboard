/**
 * Core utility for fetching data from the Gigaverse API.
 */
export const fetchGigaverseData = async (endpoint: string) => {
  // Updated to the official Gigaverse REST base
  const BASE_URL = 'https://gigaverse.io/api/racing'; 
  
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GIGAVERSE_API_KEY}` // Keep commented out if auth isn't required for this endpoint
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
};