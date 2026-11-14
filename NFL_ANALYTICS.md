# NFL_ANALYTICS.md — NFL Defensive & Offensive Intelligence Documentation

This document explains the mathematical formulas, classification methodology, and data requirements for SportsEdge AI's NFL intelligence engine.

---

## 1. NFL Defensive Intelligence (`/nfl/defense`)

### A. Blitz Rate Formula
$$\text{Blitz Rate } (\%) = \left(\frac{\text{Number of Blitzes}}{\text{Qualifying Defensive Plays}}\right) \times 100$$

- **Qualifying Plays**: Only plays where verified blitz tracking is available (`isVerifiedBlitzData === true` and `isBlitz !== null`).
- **Defensive Classification**: A blitz is defined strictly as a play where 5 or more defenders rushed the passer, or an off-ball defender (linebacker, cornerback, safety) rushed on a non-standard rush scheme.
- **Critical Distinction**: A blitz is **never** inferred from sacks or quarterback pressures alone. Standard 4-man rushes that result in sacks are classified as non-blitz sacks.

### B. Blitz Effectiveness Metrics
To evaluate whether a defense benefits from blitzing, performance is partitioned into:
1. **Completion Percentage Allowed**: $(\text{Completions} / \text{Pass Attempts}) \times 100$ when blitzing vs when not blitzing.
2. **Passing Yards Allowed Per Play**: Total passing yards divided by pass plays in each condition.
3. **Yards Allowed Per Play (All Plays)**: Total yards gained divided by all qualifying snaps.
4. **Disruptions**: Sacks and quarterback pressures recorded per blitz snap.
5. **Vulnerability**: Explosive plays allowed (pass plays $\ge 20$ yards or rushes $\ge 12$ yards) and touchdowns allowed.

### C. Situational Blitz Predictor
- Uses multi-factor historical filtering:
  - Down (1st, 2nd, 3rd, 4th)
  - Distance bracket: Short ($\le 3$ yds), Medium (4–7 yds), Long ($\ge 8$ yds)
  - Field position: Red Zone ($\le 20$ yds), Own Territory ($\ge 50$ yds to goal), Opponent Territory ($< 50$ yds)
  - Score status: Leading ($\text{ScoreDiff} < 0$), Trailing ($\text{ScoreDiff} > 0$), Tied ($\text{ScoreDiff} = 0$)
- **Statistical Confidence Rules**:
  - $n \ge 30$: **HIGH** confidence. Returns validated frequency.
  - $10 \le n < 30$: **MODERATE** confidence.
  - $n < 10$: **LOW / UNCERTAIN**. Does not output an exact probability; returns explicit uncertainty alert to protect bettors from small sample distortion.

---

## 2. NFL Offensive Tendencies (`/nfl/offense`)

### A. Run vs Pass Classification Rules
- **Run Plays**: Designed handoffs, designed quarterback keepers, and quarterback scrambles.
- **Pass Plays**: Completed passes, incomplete passes, sacks, and intercepted attempts.
- **Other / Filterable Plays**: Kneel-downs, spikes, and aborted plays/penalties. The system allows users to select whether kneels/spikes are included or excluded from the denominator.

### B. Opponent Clash Matchup
- Evaluates specific matchup friction points:
  - **3rd-and-Long Clash**: Offense 3rd-and-long pass rate ($n_{\text{off}}$) matched against opponent 3rd-and-long blitz frequency ($n_{\text{def}}$).
  - **Red-Zone Clash**: Offense red-zone run percentage compared to opponent red-zone blitz frequency.
- Always distinguishes correlation from causation and highlights quarterback pressure containment dependencies.
