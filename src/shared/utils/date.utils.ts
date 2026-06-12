
/**
 * Calculates the number of rental days between two dates.
 * Always returns at least 1 day.
 * 
 * @param start - Start date object
 * @param end - End date object
 * @returns Number of days (integer >= 1)
 */
export const calculateRentalDays = (start: Date, end: Date): number => {
    const diffMs = Math.abs(end.getTime() - start.getTime());
    // Use 24h as divisor (1000 * 60 * 60 * 24)
    const days = Math.ceil(diffMs / 86400000);
    return Math.max(1, days);
};
