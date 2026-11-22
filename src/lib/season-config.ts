/**
 * Season Configuration & Intelligence Scheduling
 * Handles dynamic season transitions (2026-2027 NFL & NHL)
 * and Friday 6:00 PM Eastern Time weekly synchronization cadence.
 */

export interface LeagueSeasonInfo {
  league: "NFL" | "NHL";
  currentSeason: string;
  seasonType: "REGULAR" | "PLAYOFFS" | "OFFSEASON";
  startDate: string;
  endDate: string;
  totalTeams: number;
}

/**
 * Automatically detects current active season for NFL and NHL.
 * Ensures the system does not continue using outdated rosters when a new season begins.
 */
export function getCurrentSeason(league: "NFL" | "NHL", referenceDate: Date = new Date()): string {
  const year = referenceDate.getFullYear(); // e.g. 2026
  const month = referenceDate.getMonth() + 1; // 1-12

  if (league === "NFL") {
    // NFL season runs from August (preseason/week 1 prep) through February (Super Bowl)
    // Month 8-12 is first year, Month 1-2 is playoff wrap-up
    if (month >= 8) {
      return `${year}-${year + 1}`;
    } else if (month <= 2) {
      return `${year - 1}-${year}`;
    } else {
      // Offseason transition (March - July): Prepare for upcoming Fall season
      return `${year}-${year + 1}`;
    }
  } else {
    // NHL season runs from September (preseason/opening) through June (Stanley Cup Finals)
    if (month >= 9) {
      return `${year}-${year + 1}`;
    } else if (month <= 6) {
      return `${year - 1}-${year}`;
    } else {
      // July - August offseason: Prepare for upcoming Fall season
      return `${year}-${year + 1}`;
    }
  }
}

/**
 * Calculates the next Friday at 6:00 PM Eastern Time (18:00 ET).
 * Eastern Time is UTC-5 (EST) or UTC-4 (EDT).
 * In late November, Eastern Time is EST (UTC-5), so 18:00 ET = 23:00 UTC.
 */
export function getNextFriday6pmET(fromDate: Date = new Date()): Date {
  const d = new Date(fromDate);
  
  // Find current day of week (0 = Sunday, 5 = Friday, 6 = Saturday)
  const day = d.getUTCDay();
  // Target: Friday = 5
  let daysUntilFriday = (5 - day + 7) % 7;
  
  // Set date to upcoming Friday
  const target = new Date(d);
  target.setUTCDate(d.getUTCDate() + daysUntilFriday);
  
  // 6:00 PM Eastern Time (EST is UTC-5, so 18:00 EST is 23:00 UTC)
  // Check if target is during Daylight Saving Time (second Sunday in March to first Sunday in Nov)
  const m = target.getUTCMonth() + 1;
  const isEDT = m > 3 && m < 11;
  const utcHours = isEDT ? 22 : 23; // 18:00 + 4 or 5
  
  target.setUTCHours(utcHours, 0, 0, 0);

  // If today is Friday and already past 6:00 PM ET, schedule for next Friday
  if (target.getTime() <= d.getTime()) {
    target.setUTCDate(target.getUTCDate() + 7);
  }

  return target;
}
