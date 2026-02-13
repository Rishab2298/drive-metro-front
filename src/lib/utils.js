import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Get the available scorecard week and year.
 * Scorecards are released on Wednesday after a week completes.
 * - If today is Thu/Fri/Sat/Sun → last week's scorecard is available (current week - 1)
 * - If today is Mon/Tue/Wed → scorecard from 2 weeks ago is available (current week - 2)
 *
 * @returns {{ week: number, weekPadded: string, year: number }}
 */
export function getAvailableScorecardWeek() {
  const now = new Date();
  const year = now.getFullYear();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Calculate current week number
  const start = new Date(year, 0, 1);
  const diff = now - start;
  const oneWeek = 604800000;
  const currentWeek = Math.ceil(diff / oneWeek);

  // Determine offset based on day of week
  // Mon (1), Tue (2), Wed (3) → offset 2 (scorecard not out yet)
  // Thu (4), Fri (5), Sat (6), Sun (0) → offset 1 (scorecard is out)
  const offset = (dayOfWeek >= 1 && dayOfWeek <= 3) ? 2 : 1;

  let availableWeek = currentWeek - offset;
  let availableYear = year;

  // Handle year boundary (if week goes negative or zero)
  if (availableWeek <= 0) {
    availableYear = year - 1;
    // Get total weeks in previous year (52 or 53)
    const lastDayOfPrevYear = new Date(availableYear, 11, 31);
    const startOfPrevYear = new Date(availableYear, 0, 1);
    const totalWeeksPrevYear = Math.ceil((lastDayOfPrevYear - startOfPrevYear) / oneWeek);
    availableWeek = totalWeeksPrevYear + availableWeek;
  }

  return {
    week: availableWeek,
    weekPadded: String(availableWeek).padStart(2, '0'),
    year: availableYear,
  };
}
