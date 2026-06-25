/**
 * Formats a Wei string (18 decimals) into a readable token amount.
 */
export const formatWei = (weiString: string | number): string => {
  if (!weiString || weiString === "0") return "0";
  // Convert string to Number and divide by 1e18, keeping 4 decimal places
  const tokenAmount = Number(weiString) / 1e18;
  return tokenAmount.toLocaleString(undefined, { maximumFractionDigits: 4 });
};