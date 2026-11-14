# NHL_SPECIAL_TEAMS.md — NHL Power-Play & Penalty-Kill Documentation

This document explains the statistical foundations, player attribution calculations, and tactical comparison models for SportsEdge AI's NHL special teams intelligence.

---

## 1. NHL Power-Play Intelligence (`/nhl/power-play`)

### A. Team Conversion Formula
$$\text{Power-Play Percentage } (\%) = \left(\frac{\text{Power-Play Goals}}{\text{Power-Play Opportunities}}\right) \times 100$$

- All displays present the underlying sample size (e.g. $16\text{ PPG} / 52\text{ Opps} = 30.8\%$) and time frame (Season, Home, Away, L5, L10).

### B. PP1 & PP2 Lineup Classifications
Player lineup cards must always state their confidence level:
- **CONFIRMED**: Verified on official game-day roster or morning skate line rush.
- **REPORTED**: Beat reporter observation during practice.
- **PROJECTED**: Algorithmic projection based on recent power-play ice time.
- **INFERRED**: Deduced from historical usage patterns when official shift logs are pending.
*Projected lineups are never displayed as confirmed.*

### C. Individual Player Contribution Metrics
- **Share of Team PP Goals**:
  $$\text{Share Team PPG } (\%) = \left(\frac{\text{Player PP Goals}}{\text{Team PP Goals}}\right) \times 100$$
- **Share of Team PP Points**:
  $$\text{Share Team PP Points } (\%) = \left(\frac{\text{Player PP Goals} + \text{Player PP Assists}}{\text{Team PP Points}}\right) \times 100$$
- **Disclaimer**: A player's historical goal share reflects past conversion contribution, **not** their exact probability of scoring in the upcoming game.

---

## 2. NHL Penalty-Kill Intelligence (`/nhl/penalty-kill`)

### A. Team Penalty-Kill Formula
$$\text{Penalty-Kill Percentage } (\%) = \left(\frac{\text{Times Shorthanded} - \text{Power-Play Goals Allowed}}{\text{Times Shorthanded}}\right) \times 100$$

### B. Shorthanded Blocked Shots
- **Strict Separation Principle**: All-situation blocked shots include 5-on-5, 4-on-4, and empty net defense. Shorthanded blocked shots isolate events occurring strictly while the team was at a numerical disadvantage.
- **Blocked Shots Per Minute**:
  $$\text{SH Blocks / Min} = \frac{\text{Shorthanded Blocked Shots}}{\text{Total Shorthanded Minutes on Ice}}$$

### C. Tactical Matchup Engine
- Compares Team A PP vs Team B PK.
- **Anti-Pattern Warning**: The engine **never** performs naive rate subtraction ($\text{PP}\% - \text{PK}\%$) to fabricate a goal probability. Goal expectancy depends on penalty generation frequency, referee whistle trends, high-danger unblocked attempts, and key penalty-killer injuries.
