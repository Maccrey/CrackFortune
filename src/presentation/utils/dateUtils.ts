/**
 * Returns the current date in the user's local timezone as a string in YYYY-MM-DD format.
 * This resolves issues where UTC-based dates (like toISOString) might return the previous day
 * for users in timezones ahead of UTC (e.g., KST, JST) during morning hours.
 */
export const getLocalDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
