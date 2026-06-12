
/**
 * Core business logic for rental pricing.
 * Centralizes how we calculate days and total cost.
 */
export const calculateRentalEstimation = (
    pricePerDay: number,
    start: string | Date,
    end: string | Date
) => {
    if (!start || !end) return { days: 0, total: 0 };

    const startDate = typeof start === 'string' ? new Date(start) : start;
    const endDate = typeof end === 'string' ? new Date(end) : end;

    // Reset hours to ensure fair daily calculation if inputs vary
    // (Optional based on business rule, but safer for "daily" rates)
    // For now, keeping simple diff as per original logic to respect existing behavior

    const diffMs = Math.abs(endDate.getTime() - startDate.getTime());
    // 86400000 = 1000 * 60 * 60 * 24
    const days = Math.max(1, Math.ceil(diffMs / 86400000));

    return {
        days,
        total: days * pricePerDay
    };
};
