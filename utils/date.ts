
export const parseEndDateFromString = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    
    // Remove parenthetical text like (Qui) or (A definir)
    const cleaned = dateStr.split('(')[0].trim();

    // 1. Try full date format: dd/mm/yyyy
    const datePattern = /(\d{2})\/(\d{2})\/(\d{4})/;
    const matches = cleaned.match(new RegExp(datePattern, 'g'));

    if (matches && matches.length > 0) {
        // The last match is assumed to be the end date in a range
        const lastMatch = matches[matches.length - 1];
        const [day, month, year] = lastMatch.split('/');
        
        // JavaScript months are 0-indexed, so subtract 1
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 23, 59, 59);
    }
    
    // 2. Try range format with year: dd-dd/mm/yyyy
    const dayRangeMatch = cleaned.match(/\d{2}-(\d{2})\/(\d{2})\/(\d{4})/);
    if (dayRangeMatch) {
        const [, day, month, year] = dayRangeMatch;
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 23, 59, 59);
    }

    // 3. Try simple date format without year: dd/mm (Assume current year)
    // Find all occurrences and use the last one (end date logic)
    const shortDateMatches = Array.from(cleaned.matchAll(/(\d{1,2})\/(\d{1,2})/g));
    
    if (shortDateMatches.length > 0) {
        const lastMatch = shortDateMatches[shortDateMatches.length - 1];
        const [, day, month] = lastMatch;
        const currentYear = new Date().getFullYear();
        return new Date(currentYear, parseInt(month) - 1, parseInt(day), 23, 59, 59);
    }

    // Only log warning if it's not a known placeholder text
    if (!dateStr.toLowerCase().includes('definir')) {
        console.warn(`Could not parse a valid end date from string: "${dateStr}"`);
    }
    
    return null;
};

/**
 * Extracts a timestamp for sorting purposes from a date string.
 * It looks for the FIRST occurrence of a date pattern to use as the start date.
 * Supports: "DD/MM/YYYY", "DD/MM - ...", "DD/MM/YYYY (Dia)"
 */
export const getTimestampForSorting = (dateStr: string): number => {
    if (!dateStr) return 9999999999999; // Push undefined dates to the end

    // 1. Try to find a full year first (YYYY) to use as context
    const yearMatch = dateStr.match(/20\d{2}/); 
    const year = yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear(); // Default to current year if not found

    // 2. Try to find the first DD/MM pattern
    // This matches "03/12" in "03/12/2025" or "03/12 - 05/12..."
    const dayMonthMatch = dateStr.match(/(\d{1,2})\/(\d{1,2})/);

    if (dayMonthMatch) {
        const day = parseInt(dayMonthMatch[1]);
        const month = parseInt(dayMonthMatch[2]) - 1; // Month is 0-indexed
        
        // Create date object
        const date = new Date(year, month, day);
        return date.getTime();
    }

    return 9999999999999; // If no pattern matches, put at end
};
