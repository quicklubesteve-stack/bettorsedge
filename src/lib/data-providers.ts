export interface ProviderStatus {
  service: "NFL_DEFENSE" | "NFL_OFFENSE" | "NHL_POWER_PLAY" | "NHL_PENALTY_KILL";
  providerName: string;
  hasLicenseKey: boolean;
  isLiveFeedConfigured: boolean;
  status: "ACTIVE_LICENSED" | "DEVELOPMENT_FIXTURE" | "UNAVAILABLE";
  blitzTrackingCapable: boolean;
  notes: string;
}

export function getProviderStatus(): Record<string, ProviderStatus> {
  const nflKey = process.env.NFL_DATA_API_KEY;
  const nflProvider = process.env.NFL_DATA_PROVIDER || "mock_fixture";
  const nhlKey = process.env.NHL_DATA_API_KEY;
  const nhlProvider = process.env.NHL_DATA_PROVIDER || "mock_fixture";

  const isNflConfigured = Boolean(nflKey && nflKey.trim() !== "");
  const isNhlConfigured = Boolean(nhlKey && nhlKey.trim() !== "");

  return {
    nflDefense: {
      service: "NFL_DEFENSE",
      providerName: isNflConfigured ? nflProvider.toUpperCase() : "PFF / Sportradar (Not Configured)",
      hasLicenseKey: isNflConfigured,
      isLiveFeedConfigured: isNflConfigured,
      status: isNflConfigured
        ? "ACTIVE_LICENSED"
        : process.env.NODE_ENV === "development"
        ? "DEVELOPMENT_FIXTURE"
        : "UNAVAILABLE",
      blitzTrackingCapable: true,
      notes: isNflConfigured
        ? "Connected to licensed pass-rush tracking provider."
        : "Verified defensive blitz indicators require a licensed commercial data feed (e.g., PFF Ultimate or Sportradar Advanced). Running in Development Fixture mode.",
    },
    nflOffense: {
      service: "NFL_OFFENSE",
      providerName: isNflConfigured ? nflProvider.toUpperCase() : "NFL Official Play-by-Play (Not Configured)",
      hasLicenseKey: isNflConfigured,
      isLiveFeedConfigured: isNflConfigured,
      status: isNflConfigured
        ? "ACTIVE_LICENSED"
        : process.env.NODE_ENV === "development"
        ? "DEVELOPMENT_FIXTURE"
        : "UNAVAILABLE",
      blitzTrackingCapable: false,
      notes: isNflConfigured
        ? "Connected to play-by-play stream."
        : "Running in Development Fixture mode with validated down-and-distance situational classifications.",
    },
    nhlPowerPlay: {
      service: "NHL_POWER_PLAY",
      providerName: isNhlConfigured ? nhlProvider.toUpperCase() : "NHL Edge / Sportradar (Not Configured)",
      hasLicenseKey: isNhlConfigured,
      isLiveFeedConfigured: isNhlConfigured,
      status: isNhlConfigured
        ? "ACTIVE_LICENSED"
        : process.env.NODE_ENV === "development"
        ? "DEVELOPMENT_FIXTURE"
        : "UNAVAILABLE",
      blitzTrackingCapable: false,
      notes: isNhlConfigured
        ? "Connected to official NHL special-teams tracking."
        : "Development Fixture mode active. Lineups clearly flagged as Confirmed, Reported, Projected, or Inferred.",
    },
    nhlPenaltyKill: {
      service: "NHL_PENALTY_KILL",
      providerName: isNhlConfigured ? nhlProvider.toUpperCase() : "NHL Edge / Sportradar (Not Configured)",
      hasLicenseKey: isNhlConfigured,
      isLiveFeedConfigured: isNhlConfigured,
      status: isNhlConfigured
        ? "ACTIVE_LICENSED"
        : process.env.NODE_ENV === "development"
        ? "DEVELOPMENT_FIXTURE"
        : "UNAVAILABLE",
      blitzTrackingCapable: false,
      notes: isNhlConfigured
        ? "Connected to official NHL special-teams tracking."
        : "Development Fixture mode active. Shorthanded blocked shots rigorously separated from all-situation blocked shots.",
    },
  };
}
