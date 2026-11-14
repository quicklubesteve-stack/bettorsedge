# API_PROVIDERS.md — Licensed Sports Data Feeds & Integration Research

This document outlines commercial data provider requirements for live production deployment of SportsEdge AI advanced analytics.

---

## 🏈 NFL Advanced Data Providers

Defensive blitz analysis requires pass-rush participant tracking data. Standard boxscore APIs (e.g., ESPN public endpoints, free RapidAPI feeds) do **not** provide verified blitz indicators.

### 1. Pro Football Focus (PFF) B2B Ultimate API
- **Capabilities**: Industry standard for pass-rush charting. Tracks true blitz calls ($\ge 5$ rushers or non-traditional rushers like DBs/LBs), pass-blocking schemes, QB pressure origin, and time-to-pressure.
- **Suitability for SportsEdge AI**: **Optimal**. Directly provides the boolean blitz flag and pass-rush package attributes required by `/nfl/defense`.
- **Status**: Requires enterprise commercial agreement.

### 2. Sportradar NFL Advanced Pass-Rush API
- **Capabilities**: Real-time play-by-play with defensive alignment metadata, blitz flags in premium enterprise tier, and player tracking.
- **Suitability for SportsEdge AI**: **High**. Supplies official NFL Next Gen Stats (NGS) data feed.
- **Status**: Requires commercial license key.

### 3. SportsDataIO NFL API
- **Capabilities**: Extensive play-by-play and fantasy scoring. Blitz indicators are available on selected premium tiers, though charted differently than PFF.
- **Status**: Requires commercial license.

---

## 🏒 NHL Special Teams Data Providers

### 1. NHL Edge (Official NHL Advanced Stats / Puck & Player Tracking)
- **Capabilities**: Tracks exact power-play and penalty-kill time on ice per player, skating speed, shot location coordinates, and event strength states (5v4, 5v3, 4v5, 4v3).
- **Suitability for SportsEdge AI**: **Optimal** for confirmed PP1/PP2 ice time distributions and shorthanded pair tracking.
- **Status**: Public elements available via official NHL API; raw shift-chart data available through official media partner feeds.

### 2. Sportradar NHL Play-by-Play & Shift Feeds
- **Capabilities**: Real-time event logging, including exact game situation during blocked shots (identifies whether the blocking team was shorthanded, even-strength, or on the power play).
- **Suitability for SportsEdge AI**: Directly powers the shorthanded blocked shots calculation.
- **Status**: Requires commercial license.

### 3. Natural Stat Trick / MoneyPuck B2B
- **Capabilities**: In-depth 5v4 and 4v5 rate statistics, expected goals (xG), and high-danger shot generation.
- **Status**: Available for commercial syndication.

---

## ⚙️ Environment Configuration & Fallback Rules

If no commercial license keys are present in `.env`:
1. `NFL_DATA_API_KEY=""`
2. `NHL_DATA_API_KEY=""`

The system automatically operates in **Development Fixture Mode**:
- Uses validated internal fixtures (`scripts/seed.js`) labeled as `MOCK_FIXTURE`.
- Unverified real snaps display the required compliance notice:
  `"Verified blitz data is unavailable for this game or situation."`
- No real API services or subscriptions will ever be purchased without explicit user approval.
