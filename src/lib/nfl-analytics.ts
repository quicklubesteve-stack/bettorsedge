export interface NflPlayRecord {
  id: string;
  gameId: string;
  season: number;
  week: number;
  possessionTeam: string;
  defensiveTeam: string;
  down: number;
  yardsToGo: number;
  yardline100: number;
  quarter: number;
  timeRemainingSeconds: number;
  scoreDiff: number; // possessionTeam - defensiveTeam
  playType: "RUN" | "PASS" | "SACK" | "SCRAMBLE" | "KNEEL" | "SPIKE" | "NO_PLAY";
  yardsGained: number;
  isFirstDown: boolean;
  isTouchdown: boolean;
  isTurnover: boolean;
  isRedZone: boolean;
  isGoalLine: boolean;
  isTwoMinuteDrill: boolean;
  driveNumber: number;
  isFirstDrive: boolean;
  afterTurnover: boolean;
  afterPenalty: boolean;
  personnel?: string | null;
  formation?: string | null;
  isBlitz: boolean | null; // null if unverified
  isPressure: boolean;
  isSack: boolean;
  isCompletion: boolean | null;
  passingYards: number | null;
  isExplosivePlay: boolean;
  dataProvider: string;
  isVerifiedBlitzData: boolean;
}

export interface MetricCategory {
  category: string;
  qualifyingPlays: number;
  blitzes: number;
  blitzRate: number | null; // null if no verified blitz data
  hasVerifiedData: boolean;
}

export interface BlitzEffectivenessMetrics {
  blitzPlays: number;
  nonBlitzPlays: number;
  hasVerifiedData: boolean;
  // Blitz stats
  blitzCompletionPct: number | null;
  blitzPassYardsPerPlay: number | null;
  blitzSacks: number;
  blitzPressures: number;
  blitzTouchdownsAllowed: number;
  blitzExplosivePlaysAllowed: number;
  blitzFirstDownsAllowed: number;
  blitzYardsPerPlay: number | null;
  // Non-blitz stats
  nonBlitzCompletionPct: number | null;
  nonBlitzPassYardsPerPlay: number | null;
  nonBlitzSacks: number;
  nonBlitzPressures: number;
  nonBlitzTouchdownsAllowed: number;
  nonBlitzExplosivePlaysAllowed: number;
  nonBlitzFirstDownsAllowed: number;
  nonBlitzYardsPerPlay: number | null;
}

export function calculateBlitzRate(blitzes: number, eligiblePlays: number): number | null {
  if (eligiblePlays === 0) return null;
  return Number(((blitzes / eligiblePlays) * 100).toFixed(1));
}

export function filterPlaysByCategory(plays: NflPlayRecord[]) {
  // Only evaluate plays where verified blitz data exists
  const verifiedPlays = plays.filter((p) => p.isVerifiedBlitzData && p.isBlitz !== null);
  const hasVerifiedData = verifiedPlays.length > 0;

  const targetPlays = hasVerifiedData ? verifiedPlays : [];

  const getCategoryStats = (
    name: string,
    filterFn: (p: NflPlayRecord) => boolean
  ): MetricCategory => {
    const subset = targetPlays.filter(filterFn);
    const qualifying = subset.length;
    const blitzes = subset.filter((p) => p.isBlitz === true).length;
    return {
      category: name,
      qualifyingPlays: qualifying,
      blitzes,
      blitzRate: hasVerifiedData ? calculateBlitzRate(blitzes, qualifying) : null,
      hasVerifiedData,
    };
  };

  return {
    hasVerifiedData,
    totalVerifiedPlays: targetPlays.length,
    overall: getCategoryStats("Overall Defensive Plays", () => true),
    firstDown: getCategoryStats("1st Down", (p) => p.down === 1),
    secondDown: getCategoryStats("2nd Down", (p) => p.down === 2),
    thirdDown: getCategoryStats("3rd Down", (p) => p.down === 3),
    fourthDown: getCategoryStats("4th Down", (p) => p.down === 4),
    shortYardage: getCategoryStats("Short Yardage (≤ 3 yds)", (p) => p.yardsToGo <= 3),
    mediumYardage: getCategoryStats("Medium Yardage (4–7 yds)", (p) => p.yardsToGo >= 4 && p.yardsToGo <= 7),
    longYardage: getCategoryStats("Long Yardage (≥ 8 yds)", (p) => p.yardsToGo >= 8),
    redZone: getCategoryStats("Red Zone (≤ 20 yds to goal)", (p) => p.isRedZone),
    inside10: getCategoryStats("Inside Opponent 10-Yard Line", (p) => p.yardline100 <= 10),
    goalLine: getCategoryStats("Near Goal Line (≤ 5 yds)", (p) => p.isGoalLine),
    twoMinute: getCategoryStats("Two-Minute Situation", (p) => p.isTwoMinuteDrill),
    leading: getCategoryStats("When Leading (Defensive Lead)", (p) => p.scoreDiff < 0),
    trailing: getCategoryStats("When Trailing (Defensive Deficit)", (p) => p.scoreDiff > 0),
    tied: getCategoryStats("When Tied", (p) => p.scoreDiff === 0),
    q1: getCategoryStats("1st Quarter", (p) => p.quarter === 1),
    q2: getCategoryStats("2nd Quarter", (p) => p.quarter === 2),
    q3: getCategoryStats("3rd Quarter", (p) => p.quarter === 3),
    q4: getCategoryStats("4th Quarter", (p) => p.quarter === 4),
    ot: getCategoryStats("Overtime", (p) => p.quarter >= 5),
    firstDrive: getCategoryStats("Opening Drive", (p) => p.isFirstDrive),
    laterDrives: getCategoryStats("Later Drives", (p) => !p.isFirstDrive),
    afterTurnover: getCategoryStats("Following Turnover", (p) => p.afterTurnover),
  };
}

export function calculateBlitzEffectiveness(plays: NflPlayRecord[]): BlitzEffectivenessMetrics {
  const verifiedPlays = plays.filter((p) => p.isVerifiedBlitzData && p.isBlitz !== null);
  const hasVerifiedData = verifiedPlays.length > 0;

  if (!hasVerifiedData) {
    return {
      blitzPlays: 0,
      nonBlitzPlays: 0,
      hasVerifiedData: false,
      blitzCompletionPct: null,
      blitzPassYardsPerPlay: null,
      blitzSacks: 0,
      blitzPressures: 0,
      blitzTouchdownsAllowed: 0,
      blitzExplosivePlaysAllowed: 0,
      blitzFirstDownsAllowed: 0,
      blitzYardsPerPlay: null,
      nonBlitzCompletionPct: null,
      nonBlitzPassYardsPerPlay: null,
      nonBlitzSacks: 0,
      nonBlitzPressures: 0,
      nonBlitzTouchdownsAllowed: 0,
      nonBlitzExplosivePlaysAllowed: 0,
      nonBlitzFirstDownsAllowed: 0,
      nonBlitzYardsPerPlay: null,
    };
  }

  const blitzes = verifiedPlays.filter((p) => p.isBlitz === true);
  const nonBlitzes = verifiedPlays.filter((p) => p.isBlitz === false);

  const calcStats = (subset: NflPlayRecord[]) => {
    const total = subset.length;
    if (total === 0) {
      return {
        count: 0,
        completionPct: null,
        passYardsPerPlay: null,
        sacks: 0,
        pressures: 0,
        touchdowns: 0,
        explosivePlays: 0,
        firstDowns: 0,
        yardsPerPlay: null,
      };
    }

    const passAttempts = subset.filter((p) => p.isCompletion !== null);
    const completions = passAttempts.filter((p) => p.isCompletion === true).length;
    const completionPct =
      passAttempts.length > 0
        ? Number(((completions / passAttempts.length) * 100).toFixed(1))
        : null;

    const totalPassYards = passAttempts.reduce((acc, p) => acc + (p.passingYards || 0), 0);
    const passYardsPerPlay =
      passAttempts.length > 0 ? Number((totalPassYards / passAttempts.length).toFixed(1)) : null;

    const totalYards = subset.reduce((acc, p) => acc + p.yardsGained, 0);
    const yardsPerPlay = Number((totalYards / total).toFixed(1));

    return {
      count: total,
      completionPct,
      passYardsPerPlay,
      sacks: subset.filter((p) => p.isSack).length,
      pressures: subset.filter((p) => p.isPressure).length,
      touchdowns: subset.filter((p) => p.isTouchdown).length,
      explosivePlays: subset.filter((p) => p.isExplosivePlay).length,
      firstDowns: subset.filter((p) => p.isFirstDown).length,
      yardsPerPlay,
    };
  };

  const bStats = calcStats(blitzes);
  const nbStats = calcStats(nonBlitzes);

  return {
    blitzPlays: bStats.count,
    nonBlitzPlays: nbStats.count,
    hasVerifiedData: true,
    blitzCompletionPct: bStats.completionPct,
    blitzPassYardsPerPlay: bStats.passYardsPerPlay,
    blitzSacks: bStats.sacks,
    blitzPressures: bStats.pressures,
    blitzTouchdownsAllowed: bStats.touchdowns,
    blitzExplosivePlaysAllowed: bStats.explosivePlays,
    blitzFirstDownsAllowed: bStats.firstDowns,
    blitzYardsPerPlay: bStats.yardsPerPlay,
    nonBlitzCompletionPct: nbStats.completionPct,
    nonBlitzPassYardsPerPlay: nbStats.passYardsPerPlay,
    nonBlitzSacks: nbStats.sacks,
    nonBlitzPressures: nbStats.pressures,
    nonBlitzTouchdownsAllowed: nbStats.touchdowns,
    nonBlitzExplosivePlaysAllowed: nbStats.explosivePlays,
    nonBlitzFirstDownsAllowed: nbStats.firstDowns,
    nonBlitzYardsPerPlay: nbStats.yardsPerPlay,
  };
}

export interface SituationalPredictorQuery {
  down?: number;
  distanceBracket?: "SHORT" | "MEDIUM" | "LONG";
  yardlineBracket?: "RED_ZONE" | "OWN_TERRITORY" | "OPPONENT_TERRITORY";
  quarter?: number;
  scoreStatus?: "LEADING" | "TRAILING" | "TIED";
}

export function predictSituationalBlitz(
  plays: NflPlayRecord[],
  query: SituationalPredictorQuery
) {
  const verifiedPlays = plays.filter((p) => p.isVerifiedBlitzData && p.isBlitz !== null);
  if (verifiedPlays.length === 0) {
    return {
      hasVerifiedData: false,
      sampleSize: 0,
      historicalBlitzFrequency: null,
      statisticalEstimate: null,
      confidence: "UNAVAILABLE",
      notes: "Verified blitz data is unavailable for this game or situation.",
    };
  }

  const matching = verifiedPlays.filter((p) => {
    if (query.down && p.down !== query.down) return false;
    if (query.distanceBracket === "SHORT" && p.yardsToGo > 3) return false;
    if (query.distanceBracket === "MEDIUM" && (p.yardsToGo < 4 || p.yardsToGo > 7)) return false;
    if (query.distanceBracket === "LONG" && p.yardsToGo < 8) return false;
    if (query.yardlineBracket === "RED_ZONE" && !p.isRedZone) return false;
    if (query.yardlineBracket === "OWN_TERRITORY" && p.yardline100 < 50) return false;
    if (query.yardlineBracket === "OPPONENT_TERRITORY" && p.yardline100 >= 50) return false;
    if (query.quarter && p.quarter !== query.quarter) return false;
    if (query.scoreStatus === "LEADING" && p.scoreDiff >= 0) return false; // defensive leading means scoreDiff < 0
    if (query.scoreStatus === "TRAILING" && p.scoreDiff <= 0) return false;
    if (query.scoreStatus === "TIED" && p.scoreDiff !== 0) return false;
    return true;
  });

  const sampleSize = matching.length;
  if (sampleSize === 0) {
    return {
      hasVerifiedData: true,
      sampleSize: 0,
      historicalBlitzFrequency: null,
      statisticalEstimate: null,
      confidence: "INSUFFICIENT_SAMPLE",
      notes: "No qualifying historical plays found for this exact situation.",
    };
  }

  const blitzCount = matching.filter((p) => p.isBlitz === true).length;
  const historicalBlitzFrequency = Number(((blitzCount / sampleSize) * 100).toFixed(1));

  // Determine statistical confidence based on validated sample size (no manufactured probabilities)
  let confidence: "HIGH" | "MODERATE" | "LOW_UNCERTAIN" = "LOW_UNCERTAIN";
  let statisticalEstimate: number | null = null;

  if (sampleSize >= 30) {
    confidence = "HIGH";
    statisticalEstimate = historicalBlitzFrequency;
  } else if (sampleSize >= 10) {
    confidence = "MODERATE";
    statisticalEstimate = historicalBlitzFrequency;
  } else {
    confidence = "LOW_UNCERTAIN";
    statisticalEstimate = null; // Do not manufacture exact statistical estimate on small samples
  }

  return {
    hasVerifiedData: true,
    sampleSize,
    blitzCount,
    historicalBlitzFrequency,
    statisticalEstimate,
    confidence,
    notes:
      confidence === "LOW_UNCERTAIN"
        ? `Sample size (n=${sampleSize}) is too small to provide a validated statistical estimate. Exercise caution.`
        : `Based on ${sampleSize} comparable situational snaps.`,
  };
}

// ----------------- FEATURE 2: NFL OFFENSIVE TENDENCIES -----------------

export interface OffensiveTendencyCategory {
  category: string;
  totalPlays: number;
  runs: number;
  passes: number;
  runPercentage: number;
  passPercentage: number;
  avgYardsGained: number;
  firstDownConversionRate: number;
}

export function classifyOffensivePlay(play: NflPlayRecord): "RUN" | "PASS" | "OTHER" {
  if (play.playType === "RUN" || play.playType === "SCRAMBLE") return "RUN";
  if (play.playType === "PASS" || play.playType === "SACK") return "PASS";
  return "OTHER"; // KNEEL, SPIKE, NO_PLAY
}

export function calculateOffensiveTendencies(
  plays: NflPlayRecord[],
  excludeKneelsAndSpikes = true
) {
  const eligible = plays.filter((p) => {
    if (excludeKneelsAndSpikes && (p.playType === "KNEEL" || p.playType === "SPIKE" || p.playType === "NO_PLAY")) {
      return false;
    }
    return true;
  });

  const getStats = (name: string, filterFn: (p: NflPlayRecord) => boolean): OffensiveTendencyCategory => {
    const subset = eligible.filter(filterFn);
    const total = subset.length;
    if (total === 0) {
      return {
        category: name,
        totalPlays: 0,
        runs: 0,
        passes: 0,
        runPercentage: 0,
        passPercentage: 0,
        avgYardsGained: 0,
        firstDownConversionRate: 0,
      };
    }

    const runs = subset.filter((p) => classifyOffensivePlay(p) === "RUN").length;
    const passes = subset.filter((p) => classifyOffensivePlay(p) === "PASS").length;
    const standardTotal = runs + passes > 0 ? runs + passes : total;

    const totalYards = subset.reduce((acc, p) => acc + p.yardsGained, 0);
    const firstDowns = subset.filter((p) => p.isFirstDown).length;

    return {
      category: name,
      totalPlays: total,
      runs,
      passes,
      runPercentage: Number(((runs / standardTotal) * 100).toFixed(1)),
      passPercentage: Number(((passes / standardTotal) * 100).toFixed(1)),
      avgYardsGained: Number((totalYards / total).toFixed(1)),
      firstDownConversionRate: Number(((firstDowns / total) * 100).toFixed(1)),
    };
  };

  return {
    totalEligiblePlays: eligible.length,
    overall: getStats("Overall Tendencies", () => true),
    firstDown: getStats("1st Down", (p) => p.down === 1),
    secondDown: getStats("2nd Down", (p) => p.down === 2),
    thirdDown: getStats("3rd Down", (p) => p.down === 3),
    fourthDown: getStats("4th Down", (p) => p.down === 4),
    shortYardage: getStats("Short Yardage (≤ 3 yds)", (p) => p.yardsToGo <= 3),
    mediumYardage: getStats("Medium Yardage (4–7 yds)", (p) => p.yardsToGo >= 4 && p.yardsToGo <= 7),
    longYardage: getStats("Long Yardage (≥ 8 yds)", (p) => p.yardsToGo >= 8),
    redZone: getStats("Red Zone (≤ 20 yds to goal)", (p) => p.isRedZone),
    goalLine: getStats("Goal Line (≤ 5 yds)", (p) => p.isGoalLine),
    firstDrive: getStats("Opening Drive", (p) => p.isFirstDrive),
    openingPlay: getStats("Opening Play of Game", (p) => p.isFirstDrive && p.down === 1 && p.yardsToGo === 10),
    twoMinute: getStats("Two-Minute Drill", (p) => p.isTwoMinuteDrill),
    leading: getStats("When Leading", (p) => p.scoreDiff > 0),
    trailing: getStats("When Trailing", (p) => p.scoreDiff < 0),
    tied: getStats("When Tied", (p) => p.scoreDiff === 0),
    q1: getStats("1st Quarter", (p) => p.quarter === 1),
    q2: getStats("2nd Quarter", (p) => p.quarter === 2),
    q3: getStats("3rd Quarter", (p) => p.quarter === 3),
    q4: getStats("4th Quarter", (p) => p.quarter === 4),
    afterTurnover: getStats("Following Turnover", (p) => p.afterTurnover),
    afterPenalty: getStats("Following Penalty", (p) => p.afterPenalty),
  };
}

export function analyzeSituationalOffense(
  plays: NflPlayRecord[],
  criteria: {
    down?: number;
    yardsToGoMin?: number;
    yardsToGoMax?: number;
    yardline100Min?: number;
    yardline100Max?: number;
    quarter?: number;
    scoreDiffMin?: number;
    scoreDiffMax?: number;
  }
) {
  const matching = plays.filter((p) => {
    if (criteria.down && p.down !== criteria.down) return false;
    if (criteria.yardsToGoMin !== undefined && p.yardsToGo < criteria.yardsToGoMin) return false;
    if (criteria.yardsToGoMax !== undefined && p.yardsToGo > criteria.yardsToGoMax) return false;
    if (criteria.yardline100Min !== undefined && p.yardline100 < criteria.yardline100Min) return false;
    if (criteria.yardline100Max !== undefined && p.yardline100 > criteria.yardline100Max) return false;
    if (criteria.quarter && p.quarter !== criteria.quarter) return false;
    if (criteria.scoreDiffMin !== undefined && p.scoreDiff < criteria.scoreDiffMin) return false;
    if (criteria.scoreDiffMax !== undefined && p.scoreDiff > criteria.scoreDiffMax) return false;
    return true;
  });

  const total = matching.length;
  if (total === 0) {
    return {
      qualifyingPlays: 0,
      runs: 0,
      passes: 0,
      runPercentage: 0,
      passPercentage: 0,
      averageYardsGained: 0,
      firstDownConversionRate: 0,
      historicalTrends: "No matching plays found in historical dataset.",
    };
  }

  const runs = matching.filter((p) => classifyOffensivePlay(p) === "RUN").length;
  const passes = matching.filter((p) => classifyOffensivePlay(p) === "PASS").length;
  const validDenominator = runs + passes > 0 ? runs + passes : total;
  const totalYards = matching.reduce((acc, p) => acc + p.yardsGained, 0);
  const firstDowns = matching.filter((p) => p.isFirstDown).length;

  return {
    qualifyingPlays: total,
    runs,
    passes,
    runPercentage: Number(((runs / validDenominator) * 100).toFixed(1)),
    passPercentage: Number(((passes / validDenominator) * 100).toFixed(1)),
    averageYardsGained: Number((totalYards / total).toFixed(1)),
    firstDownConversionRate: Number(((firstDowns / total) * 100).toFixed(1)),
    historicalTrends: `Analyzed ${total} historical snaps. Teams passed ${passes} times (${((passes/validDenominator)*100).toFixed(0)}%) with ${firstDowns} first downs converted.`,
  };
}

export function compareOffenseVsDefenseMatchup(
  offensePlays: NflPlayRecord[],
  defensePlays: NflPlayRecord[],
  offenseTeamName: string,
  defenseTeamName: string
) {
  // Compare 3rd-and-long tendencies
  const off3rdLong = offensePlays.filter((p) => p.down === 3 && p.yardsToGo >= 7);
  const def3rdLong = defensePlays.filter((p) => p.down === 3 && p.yardsToGo >= 7 && p.isVerifiedBlitzData);

  const offPassCount = off3rdLong.filter((p) => classifyOffensivePlay(p) === "PASS").length;
  const offPassPct = off3rdLong.length > 0 ? Number(((offPassCount / off3rdLong.length) * 100).toFixed(1)) : null;

  const defBlitzCount = def3rdLong.filter((p) => p.isBlitz === true).length;
  const defBlitzPct = def3rdLong.length > 0 ? Number(((defBlitzCount / def3rdLong.length) * 100).toFixed(1)) : null;

  // Red zone tendencies
  const offRedZone = offensePlays.filter((p) => p.isRedZone);
  const defRedZone = defensePlays.filter((p) => p.isRedZone && p.isVerifiedBlitzData);

  const offRzRun = offRedZone.filter((p) => classifyOffensivePlay(p) === "RUN").length;
  const offRzRunPct = offRedZone.length > 0 ? Number(((offRzRun / offRedZone.length) * 100).toFixed(1)) : null;

  const defRzBlitz = defRedZone.filter((p) => p.isBlitz === true).length;
  const defRzBlitzPct = defRedZone.length > 0 ? Number(((defRzBlitz / defRedZone.length) * 100).toFixed(1)) : null;

  return {
    offenseTeam: offenseTeamName,
    defenseTeam: defenseTeamName,
    thirdAndLong: {
      offenseSampleSize: off3rdLong.length,
      offensePassRate: offPassPct,
      defenseSampleSize: def3rdLong.length,
      defenseBlitzRate: defBlitzPct,
      analysis:
        offPassPct !== null && defBlitzPct !== null
          ? `${offenseTeamName} passes ${offPassPct}% of the time on 3rd-and-long (n=${off3rdLong.length}), while ${defenseTeamName} blitzes on ${defBlitzPct}% of 3rd-and-long defensive snaps (n=${def3rdLong.length}). Note: Correlation between play frequency and outcome depends on quarterback pressure containment.`
          : "Insufficient verified sample data for 3rd-and-long matchup.",
    },
    redZone: {
      offenseSampleSize: offRedZone.length,
      offenseRunRate: offRzRunPct,
      defenseSampleSize: defRedZone.length,
      defenseBlitzRate: defRzBlitzPct,
      analysis:
        offRzRunPct !== null && defRzBlitzPct !== null
          ? `${offenseTeamName} runs the ball ${offRzRunPct}% of the time in the red zone, against ${defenseTeamName}'s red-zone blitz rate of ${defRzBlitzPct}%.`
          : "Insufficient verified sample data for red zone matchup.",
    },
  };
}
