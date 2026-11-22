// 2025-2026 Team Rosters & Depth Charts for NFL and NHL Franchises
// Updated weekly to reflect depth chart changes, trades, active lines, and injury/IR statuses.
// Reflects 2025-2026 transactions: Mitch Marner on Vegas Golden Knights (VGK), Zach Hyman on Edmonton (EDM).

export interface RawRosterPlayer {
  name: string;
  jerseyNumber: number;
  position: string;
  unit: string;
  depthOrder: number;
  status: "ACTIVE" | "QUESTIONABLE" | "DOUBTFUL" | "OUT" | "IR";
  injuryDetails?: string;
  roleDescription: string;
  statsSummary: string;
  simulationWeight: number; // General impact weight (0.0 - 1.0)
  touchdownWeight?: number; // NFL TD probability weight
  goalWeight?: number;      // NHL Goal probability weight
}

// ------------------- 2025-2026 NFL ROSTERS -------------------
export const NFL_ROSTERS_SEED: Record<string, RawRosterPlayer[]> = {
  KC: [
    { name: "Patrick Mahomes", jerseyNumber: 15, position: "QB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Franchise Starting QB", statsSummary: "2,980 Pass Yds • 25 TD • 8 INT", simulationWeight: 1.0, touchdownWeight: 0.15 },
    { name: "Kareem Hunt", jerseyNumber: 29, position: "RB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Lead Running Back", statsSummary: "685 Rush Yds • 6 TD • 4.0 YPC", simulationWeight: 0.85, touchdownWeight: 0.45 },
    { name: "Isiah Pacheco", jerseyNumber: 10, position: "RB", unit: "OFFENSE", depthOrder: 2, status: "QUESTIONABLE", injuryDetails: "Fibula (Designated to return, limited practice)", roleDescription: "Dynamic Change-of-Pace RB", statsSummary: "240 Rush Yds • 2 TD • 4.4 YPC", simulationWeight: 0.78, touchdownWeight: 0.25 },
    { name: "Travis Kelce", jerseyNumber: 87, position: "TE", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "All-Pro Starting TE", statsSummary: "68 Rec • 610 Yds • 4 TD", simulationWeight: 0.95, touchdownWeight: 0.35 },
    { name: "DeAndre Hopkins", jerseyNumber: 8, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Outside WR1", statsSummary: "52 Rec • 640 Yds • 5 TD", simulationWeight: 0.88, touchdownWeight: 0.30 },
    { name: "Xavier Worthy", jerseyNumber: 1, position: "WR", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Deep Threat Speed WR2", statsSummary: "32 Rec • 410 Yds • 5 TD", simulationWeight: 0.82, touchdownWeight: 0.25 },
    { name: "Marquise Brown", jerseyNumber: 5, position: "WR", unit: "OFFENSE", depthOrder: 3, status: "IR", injuryDetails: "Sternoclavicular Joint (Injured Reserve)", roleDescription: "Speed Outside WR (IR)", statsSummary: "Placed on IR", simulationWeight: 0.80, touchdownWeight: 0.20 },
    { name: "Rashee Rice", jerseyNumber: 4, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "IR", injuryDetails: "Knee LCL Surgery (Injured Reserve - Out for Season)", roleDescription: "Starting WR (IR)", statsSummary: "24 Rec • 288 Yds • 2 TD", simulationWeight: 0.85, touchdownWeight: 0.30 },
    { name: "Harrison Butker", jerseyNumber: 7, position: "K", unit: "SPECIAL_TEAMS", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Placekicker", statsSummary: "21/23 FGs • 91.3% FG", simulationWeight: 0.70, touchdownWeight: 0.0 },
    { name: "Chris Jones", jerseyNumber: 95, position: "DT", unit: "DEFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Defensive Tackle Anchor", statsSummary: "7.0 Sacks • 22 Pressures", simulationWeight: 0.95, touchdownWeight: 0.0 },
    { name: "Trent McDuffie", jerseyNumber: 22, position: "CB", unit: "DEFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "All-Pro Lock Down Corner", statsSummary: "42 Tackles • 6 Pass Deflections", simulationWeight: 0.92, touchdownWeight: 0.0 },
  ],
  BUF: [
    { name: "Josh Allen", jerseyNumber: 17, position: "QB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Dual-Threat QB", statsSummary: "2,810 Pass Yds • 24 TD • 6 Rush TD", simulationWeight: 1.0, touchdownWeight: 0.40 },
    { name: "James Cook", jerseyNumber: 4, position: "RB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting RB1", statsSummary: "820 Rush Yds • 9 TD • 4.9 YPC", simulationWeight: 0.90, touchdownWeight: 0.45 },
    { name: "Ray Davis", jerseyNumber: 22, position: "RB", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Power Short-Yardage RB", statsSummary: "310 Rush Yds • 3 TD", simulationWeight: 0.68, touchdownWeight: 0.15 },
    { name: "Khalil Shakir", jerseyNumber: 10, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Slot WR1", statsSummary: "62 Rec • 680 Yds • 4 TD", simulationWeight: 0.86, touchdownWeight: 0.30 },
    { name: "Dalton Kincaid", jerseyNumber: 86, position: "TE", unit: "OFFENSE", depthOrder: 1, status: "OUT", injuryDetails: "Knee Sprain (Ruled Out)", roleDescription: "Starting Pass-Catching TE", statsSummary: "38 Rec • 390 Yds • 2 TD", simulationWeight: 0.80, touchdownWeight: 0.25 },
    { name: "Keon Coleman", jerseyNumber: 0, position: "WR", unit: "OFFENSE", depthOrder: 2, status: "OUT", injuryDetails: "Wrist Injury (Ruled Out)", roleDescription: "Outside Red-Zone Target WR2", statsSummary: "26 Rec • 460 Yds • 4 TD", simulationWeight: 0.80, touchdownWeight: 0.25 },
    { name: "Matt Milano", jerseyNumber: 58, position: "LB", unit: "DEFENSE", depthOrder: 1, status: "QUESTIONABLE", injuryDetails: "Bicep Tear (Designated to Return, Full Practice)", roleDescription: "All-Pro Linebacker", statsSummary: "Pro Bowl LB", simulationWeight: 0.88, touchdownWeight: 0.0 },
    { name: "Tyler Bass", jerseyNumber: 2, position: "K", unit: "SPECIAL_TEAMS", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Placekicker", statsSummary: "19/23 FGs • 61-yd Long", simulationWeight: 0.70, touchdownWeight: 0.0 },
    { name: "Greg Rousseau", jerseyNumber: 50, position: "DE", unit: "DEFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Edge Rusher", statsSummary: "7.5 Sacks • 14 TFL", simulationWeight: 0.88, touchdownWeight: 0.0 },
  ],
  BAL: [
    { name: "Lamar Jackson", jerseyNumber: 8, position: "QB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "MVP Frontrunner Dual-Threat QB", statsSummary: "3,110 Pass Yds • 28 TD • 620 Rush Yds • 4 Rush TD", simulationWeight: 1.0, touchdownWeight: 0.35 },
    { name: "Derrick Henry", jerseyNumber: 22, position: "RB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Workhorse Hall of Fame RB1", statsSummary: "1,240 Rush Yds • 14 TD • 6.1 YPC", simulationWeight: 0.98, touchdownWeight: 0.75 },
    { name: "Justice Hill", jerseyNumber: 43, position: "RB", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Pass-Catching 3rd Down RB", statsSummary: "34 Rec • 310 Yds • 2 TD", simulationWeight: 0.70, touchdownWeight: 0.15 },
    { name: "Zay Flowers", jerseyNumber: 4, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Dynamic WR1", statsSummary: "64 Rec • 780 Yds • 4 TD", simulationWeight: 0.88, touchdownWeight: 0.35 },
    { name: "Rashod Bateman", jerseyNumber: 7, position: "WR", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Starting Outside WR2", statsSummary: "34 Rec • 550 Yds • 4 TD", simulationWeight: 0.76, touchdownWeight: 0.20 },
    { name: "Mark Andrews", jerseyNumber: 89, position: "TE", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Pro Bowl TE", statsSummary: "36 Rec • 390 Yds • 6 TD", simulationWeight: 0.85, touchdownWeight: 0.40 },
    { name: "Isaiah Likely", jerseyNumber: 80, position: "TE", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Dual-TE Matchup Weapon", statsSummary: "28 Rec • 310 Yds • 3 TD", simulationWeight: 0.78, touchdownWeight: 0.25 },
    { name: "Roquan Smith", jerseyNumber: 0, position: "LB", unit: "DEFENSE", depthOrder: 1, status: "QUESTIONABLE", injuryDetails: "Hamstring (Limited in practice, day-to-day)", roleDescription: "All-Pro Middle Linebacker", statsSummary: "103 Tackles • 1 INT • 4 TFL", simulationWeight: 0.95, touchdownWeight: 0.0 },
    { name: "Kyle Hamilton", jerseyNumber: 14, position: "S", unit: "DEFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "All-Pro Safety", statsSummary: "71 Tackles • 2 INT • 2.0 Sacks", simulationWeight: 0.94, touchdownWeight: 0.0 },
  ],
  DET: [
    { name: "Jared Goff", jerseyNumber: 16, position: "QB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Elite Pocket Passer", statsSummary: "2,740 Pass Yds • 22 TD • 72.8% Comp", simulationWeight: 0.96, touchdownWeight: 0.05 },
    { name: "Jahmyr Gibbs", jerseyNumber: 26, position: "RB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Explosive Starting RB1", statsSummary: "850 Rush Yds • 9 TD • 6.2 YPC", simulationWeight: 0.94, touchdownWeight: 0.55 },
    { name: "David Montgomery", jerseyNumber: 5, position: "RB", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Power Goal-Line RB2", statsSummary: "640 Rush Yds • 11 TD • 4.4 YPC", simulationWeight: 0.90, touchdownWeight: 0.65 },
    { name: "Amon-Ra St. Brown", jerseyNumber: 14, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "All-Pro Slot Receiver WR1", statsSummary: "75 Rec • 785 Yds • 9 TD", simulationWeight: 0.98, touchdownWeight: 0.55 },
    { name: "Jameson Williams", jerseyNumber: 9, position: "WR", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Deep Threat Speed WR2", statsSummary: "24 Rec • 480 Yds • 4 TD • 20.0 YPR", simulationWeight: 0.82, touchdownWeight: 0.30 },
    { name: "Sam LaPorta", jerseyNumber: 87, position: "TE", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", injuryDetails: "AC Joint Sprain - Cleared to Play", roleDescription: "Starting Pro Bowl TE", statsSummary: "25 Rec • 336 Yds • 3 TD", simulationWeight: 0.88, touchdownWeight: 0.30 },
    { name: "Aidan Hutchinson", jerseyNumber: 97, position: "DE", unit: "DEFENSE", depthOrder: 1, status: "IR", injuryDetails: "Fractured Tibia/Fibula (Injured Reserve - Out for Season)", roleDescription: "All-Pro Edge Rusher (IR)", statsSummary: "7.5 Sacks in 5 Games", simulationWeight: 0.96, touchdownWeight: 0.0 },
    { name: "Brian Branch", jerseyNumber: 32, position: "S", unit: "DEFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "All-Pro Safety Playmaker", statsSummary: "4 INT • 55 Tackles", simulationWeight: 0.94, touchdownWeight: 0.0 },
  ],
  PHI: [
    { name: "Jalen Hurts", jerseyNumber: 1, position: "QB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Dual-Threat QB", statsSummary: "2,350 Pass Yds • 14 TD • 11 Rush TD", simulationWeight: 0.96, touchdownWeight: 0.50 },
    { name: "Saquon Barkley", jerseyNumber: 26, position: "RB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Workhorse RB1", statsSummary: "1,280 Rush Yds • 11 TD • 5.8 YPC", simulationWeight: 1.0, touchdownWeight: 0.70 },
    { name: "Kenneth Gainwell", jerseyNumber: 14, position: "RB", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Change-of-Pace 3rd Down RB", statsSummary: "220 Rush Yds • 1 TD", simulationWeight: 0.65, touchdownWeight: 0.10 },
    { name: "A.J. Brown", jerseyNumber: 11, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "All-Pro Outside WR1", statsSummary: "48 Rec • 740 Yds • 5 TD", simulationWeight: 0.98, touchdownWeight: 0.45 },
    { name: "DeVonta Smith", jerseyNumber: 6, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "OUT", injuryDetails: "Hamstring Tightness (Ruled Out)", roleDescription: "Starting WR2 (Out)", statsSummary: "41 Rec • 487 Yds • 4 TD", simulationWeight: 0.88, touchdownWeight: 0.35 },
    { name: "Dallas Goedert", jerseyNumber: 88, position: "TE", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting TE1", statsSummary: "32 Rec • 380 Yds • 1 TD", simulationWeight: 0.82, touchdownWeight: 0.20 },
    { name: "Jalen Carter", jerseyNumber: 98, position: "DT", unit: "DEFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Dominant Interior DT", statsSummary: "5.5 Sacks • 18 Pressures", simulationWeight: 0.92, touchdownWeight: 0.0 },
  ],
  SF: [
    { name: "Brock Purdy", jerseyNumber: 13, position: "QB", unit: "OFFENSE", depthOrder: 1, status: "QUESTIONABLE", injuryDetails: "Right Shoulder Soreness (Limited throwing, day-to-day)", roleDescription: "Starting Quarterback", statsSummary: "2,613 Pass Yds • 14 TD • 8 INT • 267 Rush Yds", simulationWeight: 0.94, touchdownWeight: 0.15 },
    { name: "Christian McCaffrey", jerseyNumber: 23, position: "RB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", injuryDetails: "Achilles Tendinitis (Managed touch count, starting)", roleDescription: "Starting All-Pro RB1", statsSummary: "Active Starter • 79 Scrimmage Yds/G", simulationWeight: 0.98, touchdownWeight: 0.65 },
    { name: "Jordan Mason", jerseyNumber: 24, position: "RB", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Power Backup RB", statsSummary: "705 Rush Yds • 3 TD • 5.1 YPC", simulationWeight: 0.78, touchdownWeight: 0.30 },
    { name: "Deebo Samuel", jerseyNumber: 19, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Dual-Threat Weapon WR1", statsSummary: "38 Rec • 540 Yds • 1 TD • 130 Rush Yds", simulationWeight: 0.90, touchdownWeight: 0.35 },
    { name: "Jauan Jennings", jerseyNumber: 15, position: "WR", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Starting Possession WR2", statsSummary: "42 Rec • 580 Yds • 4 TD", simulationWeight: 0.85, touchdownWeight: 0.30 },
    { name: "Brandon Aiyuk", jerseyNumber: 11, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "IR", injuryDetails: "Torn ACL/MCL (Injured Reserve - Out for Season)", roleDescription: "Star Outside WR (IR)", statsSummary: "25 Rec • 374 Yds", simulationWeight: 0.88, touchdownWeight: 0.30 },
    { name: "George Kittle", jerseyNumber: 85, position: "TE", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "All-Pro Starting TE", statsSummary: "48 Rec • 620 Yds • 7 TD", simulationWeight: 0.96, touchdownWeight: 0.45 },
    { name: "Nick Bosa", jerseyNumber: 97, position: "DE", unit: "DEFENSE", depthOrder: 1, status: "QUESTIONABLE", injuryDetails: "Hip/Oblique Strain (Did not practice, day-to-day)", roleDescription: "All-Pro Defensive End", statsSummary: "7.0 Sacks • 10 TFL • 1 INT", simulationWeight: 0.96, touchdownWeight: 0.0 },
    { name: "Trent Williams", jerseyNumber: 71, position: "OT", unit: "OFFENSE", depthOrder: 1, status: "QUESTIONABLE", injuryDetails: "Ankle Sprain (Game-time decision)", roleDescription: "All-Pro Left Tackle", statsSummary: "First-Team All-Pro Anchor", simulationWeight: 0.96, touchdownWeight: 0.0 },
    { name: "Fred Warner", jerseyNumber: 54, position: "LB", unit: "DEFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "All-Pro Middle Linebacker", statsSummary: "78 Tackles • 2 INT • 4 FF", simulationWeight: 0.98, touchdownWeight: 0.0 },
  ],
  CIN: [
    { name: "Joe Burrow", jerseyNumber: 9, position: "QB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Franchise Starting QB", statsSummary: "3,028 Pass Yds • 27 TD • 4 INT", simulationWeight: 1.0, touchdownWeight: 0.10 },
    { name: "Chase Brown", jerseyNumber: 30, position: "RB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Lead RB1", statsSummary: "620 Rush Yds • 6 TD • 4.5 YPC", simulationWeight: 0.85, touchdownWeight: 0.50 },
    { name: "Ja'Marr Chase", jerseyNumber: 1, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "All-Pro Superstar WR1", statsSummary: "78 Rec • 1,058 Yds • 12 TD", simulationWeight: 1.0, touchdownWeight: 0.65 },
    { name: "Tee Higgins", jerseyNumber: 5, position: "WR", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", injuryDetails: "Quadricep (Cleared from injury report, starting)", roleDescription: "Starting Red-Zone WR2", statsSummary: "29 Rec • 341 Yds • 3 TD", simulationWeight: 0.88, touchdownWeight: 0.40 },
    { name: "Mike Gesicki", jerseyNumber: 88, position: "TE", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Receiving TE", statsSummary: "36 Rec • 390 Yds • 2 TD", simulationWeight: 0.78, touchdownWeight: 0.20 },
    { name: "Trey Hendrickson", jerseyNumber: 91, position: "DE", unit: "DEFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "NFL Sack Leader DE", statsSummary: "11.5 Sacks • 16 TFL", simulationWeight: 0.95, touchdownWeight: 0.0 },
  ],
  HOU: [
    { name: "C.J. Stroud", jerseyNumber: 7, position: "QB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Franchise Starting QB", statsSummary: "2,626 Pass Yds • 14 TD • 6 INT", simulationWeight: 0.94, touchdownWeight: 0.10 },
    { name: "Joe Mixon", jerseyNumber: 28, position: "RB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Workhorse Starting RB1", statsSummary: "840 Rush Yds • 10 TD • 4.4 YPC", simulationWeight: 0.94, touchdownWeight: 0.55 },
    { name: "Nico Collins", jerseyNumber: 12, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", injuryDetails: "Hamstring (Activated from IR, full practice)", roleDescription: "Dominant Starting WR1", statsSummary: "42 Rec • 710 Yds • 5 TD", simulationWeight: 0.98, touchdownWeight: 0.45 },
    { name: "Tank Dell", jerseyNumber: 3, position: "WR", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Starting Slot WR2", statsSummary: "42 Rec • 490 Yds • 3 TD", simulationWeight: 0.82, touchdownWeight: 0.25 },
    { name: "Stefon Diggs", jerseyNumber: 1, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "IR", injuryDetails: "Torn ACL Knee (Injured Reserve - Out for Season)", roleDescription: "All-Pro WR (IR)", statsSummary: "47 Rec • 496 Yds • 3 TD", simulationWeight: 0.90, touchdownWeight: 0.30 },
    { name: "Dalton Schultz", jerseyNumber: 86, position: "TE", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting TE1", statsSummary: "38 Rec • 390 Yds • 1 TD", simulationWeight: 0.78, touchdownWeight: 0.15 },
    { name: "Will Anderson Jr.", jerseyNumber: 51, position: "DE", unit: "DEFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Edge Rusher Star", statsSummary: "8.5 Sacks • 12 TFL", simulationWeight: 0.92, touchdownWeight: 0.0 },
  ],
  DAL: [
    { name: "Dak Prescott", jerseyNumber: 4, position: "QB", unit: "OFFENSE", depthOrder: 1, status: "IR", injuryDetails: "Hamstring Avulsion (Injured Reserve - Out for Season)", roleDescription: "Franchise Starting QB (IR)", statsSummary: "1,978 Pass Yds • 11 TD", simulationWeight: 0.90, touchdownWeight: 0.10 },
    { name: "Cooper Rush", jerseyNumber: 10, position: "QB", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Current Starting QB (replacing injured Prescott)", statsSummary: "540 Pass Yds • 3 TD", simulationWeight: 0.70, touchdownWeight: 0.05 },
    { name: "Rico Dowdle", jerseyNumber: 23, position: "RB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting RB1", statsSummary: "490 Rush Yds • 3 TD • 26 Rec", simulationWeight: 0.76, touchdownWeight: 0.40 },
    { name: "CeeDee Lamb", jerseyNumber: 88, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "QUESTIONABLE", injuryDetails: "Back Spasms / Shoulder (Limited practice, starting)", roleDescription: "All-Pro Starting Target WR1", statsSummary: "74 Rec • 860 Yds • 5 TD", simulationWeight: 0.98, touchdownWeight: 0.50 },
    { name: "Brandin Cooks", jerseyNumber: 3, position: "WR", unit: "OFFENSE", depthOrder: 2, status: "QUESTIONABLE", injuryDetails: "Knee Infection Recovery (Practice window opened)", roleDescription: "Veteran Outside WR", statsSummary: "9 Rec • 91 Yds • 1 TD", simulationWeight: 0.75, touchdownWeight: 0.20 },
    { name: "Jake Ferguson", jerseyNumber: 87, position: "TE", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Pro Bowl TE", statsSummary: "45 Rec • 420 Yds • 1 TD", simulationWeight: 0.80, touchdownWeight: 0.20 },
    { name: "Micah Parsons", jerseyNumber: 11, position: "LB", unit: "DEFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Defensive Game-Changer Pass Rusher", statsSummary: "6.5 Sacks • 16 QB Hits", simulationWeight: 0.98, touchdownWeight: 0.0 },
  ],
  GB: [
    { name: "Jordan Love", jerseyNumber: 10, position: "QB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Quarterback", statsSummary: "2,460 Pass Yds • 19 TD • 8.9 YPA", simulationWeight: 0.92, touchdownWeight: 0.10 },
    { name: "Josh Jacobs", jerseyNumber: 8, position: "RB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Bellcow RB1", statsSummary: "920 Rush Yds • 8 TD • 4.8 YPC", simulationWeight: 0.95, touchdownWeight: 0.60 },
    { name: "Jayden Reed", jerseyNumber: 11, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Playmaker WR1", statsSummary: "48 Rec • 710 Yds • 6 TD", simulationWeight: 0.90, touchdownWeight: 0.35 },
    { name: "Christian Watson", jerseyNumber: 9, position: "WR", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Starting Deep Threat WR2", statsSummary: "27 Rec • 430 Yds • 3 TD", simulationWeight: 0.80, touchdownWeight: 0.25 },
    { name: "Tucker Kraft", jerseyNumber: 85, position: "TE", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting TE1", statsSummary: "35 Rec • 450 Yds • 6 TD", simulationWeight: 0.85, touchdownWeight: 0.30 },
    { name: "Luke Musgrave", jerseyNumber: 88, position: "TE", unit: "OFFENSE", depthOrder: 2, status: "IR", injuryDetails: "Ankle Surgery (Injured Reserve)", roleDescription: "Pass-Catching TE (IR)", statsSummary: "5 Rec • 22 Yds", simulationWeight: 0.70, touchdownWeight: 0.15 },
    { name: "Jaire Alexander", jerseyNumber: 23, position: "CB", unit: "DEFENSE", depthOrder: 1, status: "QUESTIONABLE", injuryDetails: "Knee Injury (Limited in practice)", roleDescription: "Shutdown Cornerback", statsSummary: "2 INT • 16 Tackles", simulationWeight: 0.88, touchdownWeight: 0.0 },
    { name: "Xavier McKinney", jerseyNumber: 29, position: "S", unit: "DEFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "NFL Interception Leader Safety", statsSummary: "7 INT • 50 Tackles", simulationWeight: 0.94, touchdownWeight: 0.0 },
  ],
};

// Generic generator for remaining NFL teams
export function generateGenericNflRoster(teamAbbr: string, teamName: string): RawRosterPlayer[] {
  return [
    { name: `${teamName} QB1`, jerseyNumber: 7, position: "QB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Quarterback", statsSummary: "2,450 Pass Yds • 17 TD • 8 INT", simulationWeight: 0.85, touchdownWeight: 0.10 },
    { name: `${teamName} RB1`, jerseyNumber: 24, position: "RB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Lead RB", statsSummary: "720 Rush Yds • 6 TD • 4.4 YPC", simulationWeight: 0.85, touchdownWeight: 0.55 },
    { name: `${teamName} RB2`, jerseyNumber: 33, position: "RB", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Change of Pace Backup", statsSummary: "290 Rush Yds • 2 TD", simulationWeight: 0.65, touchdownWeight: 0.15 },
    { name: `${teamName} WR1`, jerseyNumber: 11, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Outside WR Target", statsSummary: "56 Rec • 720 Yds • 5 TD", simulationWeight: 0.85, touchdownWeight: 0.40 },
    { name: `${teamName} WR2`, jerseyNumber: 17, position: "WR", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Starting WR2", statsSummary: "41 Rec • 490 Yds • 3 TD", simulationWeight: 0.75, touchdownWeight: 0.25 },
    { name: `${teamName} TE1`, jerseyNumber: 88, position: "TE", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Tight End", statsSummary: "36 Rec • 380 Yds • 3 TD", simulationWeight: 0.75, touchdownWeight: 0.20 },
    { name: `${teamName} Kicker`, jerseyNumber: 3, position: "K", unit: "SPECIAL_TEAMS", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Placekicker", statsSummary: "17/19 FGs", simulationWeight: 0.70, touchdownWeight: 0.0 },
    { name: `${teamName} Defensive Anchor`, jerseyNumber: 99, position: "DE", unit: "DEFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Edge Rusher", statsSummary: "7.0 Sacks • 10 TFL", simulationWeight: 0.85, touchdownWeight: 0.0 },
  ];
}

// ------------------- 2025-2026 NHL ROSTERS -------------------
export const NHL_ROSTERS_SEED: Record<string, RawRosterPlayer[]> = {
  TOR: [
    { name: "Auston Matthews", jerseyNumber: 34, position: "C", unit: "FORWARD", depthOrder: 1, status: "OUT", injuryDetails: "Upper-Body Injury (Specialist clinic treatment in Germany, out day-to-day)", roleDescription: "Top Line Center • PP1 Sniper", statsSummary: "69 Goals (2023-24) • 18 G, 21 A • 39 Pts", simulationWeight: 1.0, goalWeight: 0.36 },
    { name: "Matthew Knies", jerseyNumber: 23, position: "LW", unit: "FORWARD", depthOrder: 1, status: "QUESTIONABLE", injuryDetails: "Upper-Body Collision (Day-to-day)", roleDescription: "Top Line Power Forward • PP1 Net-Front", statsSummary: "12 G, 11 A • 23 Points", simulationWeight: 0.82, goalWeight: 0.18 },
    { name: "William Nylander", jerseyNumber: 88, position: "RW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Line Superstar • PP1 Trigger", statsSummary: "21 G, 20 A • 41 Points", simulationWeight: 0.98, goalWeight: 0.34 },
    { name: "John Tavares", jerseyNumber: 91, position: "C", unit: "FORWARD", depthOrder: 2, status: "ACTIVE", roleDescription: "Second Line Center • Net Front PP1", statsSummary: "14 G, 15 A • 29 Points", simulationWeight: 0.88, goalWeight: 0.22 },
    { name: "Max Domi", jerseyNumber: 11, position: "LW", unit: "FORWARD", depthOrder: 2, status: "ACTIVE", roleDescription: "Second Line Playmaker", statsSummary: "5 G, 16 A • 21 Points", simulationWeight: 0.80, goalWeight: 0.12 },
    { name: "Morgan Rielly", jerseyNumber: 44, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "First Pairing Defense • PP1 Point", statsSummary: "6 G, 21 A • 23:50 TOI/G", simulationWeight: 0.88, goalWeight: 0.08 },
    { name: "Chris Tanev", jerseyNumber: 8, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Shutdown Defenseman • PK1", statsSummary: "56 Blocked Shots • +10 Plus/Minus", simulationWeight: 0.85, goalWeight: 0.02 },
    { name: "Anthony Stolarz", jerseyNumber: 41, position: "G", unit: "GOALIE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Goaltender", statsSummary: ".925 SV% • 2.22 GAA • 12 Wins", simulationWeight: 0.92, goalWeight: 0.0 },
    { name: "Joseph Woll", jerseyNumber: 60, position: "G", unit: "GOALIE", depthOrder: 2, status: "ACTIVE", roleDescription: "Backup Goaltender", statsSummary: ".912 SV% • 2.60 GAA", simulationWeight: 0.82, goalWeight: 0.0 },
    { name: "Max Pacioretty", jerseyNumber: 67, position: "LW", unit: "FORWARD", depthOrder: 3, status: "IR", injuryDetails: "Lower-Body Injury (Week-to-Week IR)", roleDescription: "Veteran Winger (IR)", statsSummary: "3 G, 4 A in 13 games", simulationWeight: 0.72, goalWeight: 0.14 },
    { name: "Calle Järnkrok", jerseyNumber: 19, position: "C", unit: "FORWARD", depthOrder: 3, status: "IR", injuryDetails: "Groin/Hernia Surgery Recovery (LTIR)", roleDescription: "Two-Way Forward (LTIR)", statsSummary: "Out Long Term", simulationWeight: 0.65, goalWeight: 0.08 },
  ],
  VGK: [
    { name: "Mitch Marner", jerseyNumber: 16, position: "RW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "1st Line RW & PP1 Playmaker", statsSummary: "8 Goals • 23 Assists • 31 PTS (+16)", simulationWeight: 1.0, goalWeight: 0.32 },
    { name: "Jack Eichel", jerseyNumber: 9, position: "C", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "1st Line Center • PP1 Trigger", statsSummary: "10 G, 24 A • 34 Points", simulationWeight: 0.98, goalWeight: 0.35 },
    { name: "Ivan Barbashev", jerseyNumber: 49, position: "LW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "1st Line Grinding Finisher", statsSummary: "11 G, 13 A • 24 Points", simulationWeight: 0.85, goalWeight: 0.22 },
    { name: "William Karlsson", jerseyNumber: 71, position: "C", unit: "FORWARD", depthOrder: 2, status: "ACTIVE", roleDescription: "2nd Line Center • PK1 Ace", statsSummary: "5 G, 7 A in 11 games", simulationWeight: 0.88, goalWeight: 0.20 },
    { name: "Pavel Dorofeyev", jerseyNumber: 10, position: "LW", unit: "FORWARD", depthOrder: 2, status: "ACTIVE", roleDescription: "Top 6 Sniper • PP2", statsSummary: "10 G, 5 A • 15 Points", simulationWeight: 0.82, goalWeight: 0.25 },
    { name: "Mark Stone", jerseyNumber: 61, position: "RW", unit: "FORWARD", depthOrder: 1, status: "IR", injuryDetails: "Lower-Body Injury (Injured Reserve)", roleDescription: "Captain & Superstar Winger (IR)", statsSummary: "6 G, 15 A • 21 Points in 13 games", simulationWeight: 0.96, goalWeight: 0.28 },
    { name: "Nicolas Hague", jerseyNumber: 14, position: "D", unit: "DEFENSEMAN", depthOrder: 2, status: "IR", injuryDetails: "Lower-Body Injury (Injured Reserve)", roleDescription: "Top 4 Defenseman (IR)", statsSummary: "1 G, 1 A in 9 GP", simulationWeight: 0.78, goalWeight: 0.03 },
    { name: "Shea Theodore", jerseyNumber: 27, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Defense Anchor • PP1 Point", statsSummary: "3 G, 18 A • 21:50 TOI", simulationWeight: 0.92, goalWeight: 0.08 },
    { name: "Alex Pietrangelo", jerseyNumber: 7, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Pairing Shutdown D • PK1", statsSummary: "2 G, 13 A • 23:15 TOI", simulationWeight: 0.90, goalWeight: 0.06 },
    { name: "Adin Hill", jerseyNumber: 33, position: "G", unit: "GOALIE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Stanley Cup Goalie", statsSummary: ".902 SV% • 2.82 GAA • 11 Wins", simulationWeight: 0.90, goalWeight: 0.0 },
  ],
  EDM: [
    { name: "Connor McDavid", jerseyNumber: 97, position: "C", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Best Player in World • PP1 General", statsSummary: "14 G, 24 A • 38 Points (100% Active)", simulationWeight: 1.0, goalWeight: 0.40 },
    { name: "Zach Hyman", jerseyNumber: 18, position: "LW", unit: "FORWARD", depthOrder: 1, status: "QUESTIONABLE", injuryDetails: "Undisclosed (Maintenance day, expected to play)", roleDescription: "54-Goal Net-Front Star • PP1", statsSummary: "8 G, 8 A • 16 Pts • 72 SOG", simulationWeight: 0.94, goalWeight: 0.38 },
    { name: "Leon Draisaitl", jerseyNumber: 29, position: "C", unit: "FORWARD", depthOrder: 2, status: "ACTIVE", roleDescription: "Superstar MVP Center • PP1 Trigger", statsSummary: "16 G, 19 A • 35 Points", simulationWeight: 0.98, goalWeight: 0.38 },
    { name: "Ryan Nugent-Hopkins", jerseyNumber: 93, position: "LW", unit: "FORWARD", depthOrder: 2, status: "ACTIVE", roleDescription: "Top 6 Two-Way Winger • PP1 Flank", statsSummary: "5 G, 13 A • 18 Points", simulationWeight: 0.86, goalWeight: 0.16 },
    { name: "Jeff Skinner", jerseyNumber: 53, position: "LW", unit: "FORWARD", depthOrder: 3, status: "ACTIVE", roleDescription: "Middle 6 Goal Scorer", statsSummary: "6 G, 5 A • 11 Points", simulationWeight: 0.80, goalWeight: 0.20 },
    { name: "Viktor Arvidsson", jerseyNumber: 33, position: "RW", unit: "FORWARD", depthOrder: 2, status: "IR", injuryDetails: "Undisclosed Lower-Body Injury (Injured Reserve)", roleDescription: "Top 6 Speed Winger (IR)", statsSummary: "2 G, 3 A in 16 games", simulationWeight: 0.80, goalWeight: 0.18 },
    { name: "Evander Kane", jerseyNumber: 91, position: "LW", unit: "FORWARD", depthOrder: 1, status: "IR", injuryDetails: "Abdominal/Hip Surgery Recovery (LTIR)", roleDescription: "Power Forward (LTIR)", statsSummary: "Out Long Term", simulationWeight: 0.82, goalWeight: 0.22 },
    { name: "Evan Bouchard", jerseyNumber: 2, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Offensive D • PP1 Blueline Bomb", statsSummary: "5 G, 17 A • 24:10 TOI", simulationWeight: 0.92, goalWeight: 0.12 },
    { name: "Mattias Ekholm", jerseyNumber: 14, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "Shutdown Blueline Partner", statsSummary: "3 G, 11 A • +11 Plus/Minus", simulationWeight: 0.88, goalWeight: 0.05 },
    { name: "Stuart Skinner", jerseyNumber: 74, position: "G", unit: "GOALIE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Goaltender", statsSummary: ".898 SV% • 2.95 GAA • 10 Wins", simulationWeight: 0.86, goalWeight: 0.0 },
  ],
  COL: [
    { name: "Nathan MacKinnon", jerseyNumber: 29, position: "C", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Hart Trophy Superstar Center • PP1", statsSummary: "11 G, 27 A • 38 Points", simulationWeight: 1.0, goalWeight: 0.38 },
    { name: "Mikko Rantanen", jerseyNumber: 96, position: "RW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "All-Star Power Winger • PP1", statsSummary: "14 G, 18 A • 32 Points", simulationWeight: 0.98, goalWeight: 0.36 },
    { name: "Casey Mittelstadt", jerseyNumber: 37, position: "C", unit: "FORWARD", depthOrder: 2, status: "ACTIVE", roleDescription: "Second Line Center", statsSummary: "7 G, 11 A • 18 Points", simulationWeight: 0.82, goalWeight: 0.18 },
    { name: "Valeri Nichushkin", jerseyNumber: 13, position: "RW", unit: "FORWARD", depthOrder: 2, status: "ACTIVE", injuryDetails: "Reinstated from Player Assistance, 100% Active", roleDescription: "Dominant Power Forward • PP1 Net-Front", statsSummary: "1 G, 1 A in 3 games (Active)", simulationWeight: 0.90, goalWeight: 0.28 },
    { name: "Ross Colton", jerseyNumber: 20, position: "C", unit: "FORWARD", depthOrder: 2, status: "IR", injuryDetails: "Broken Foot (Injured Reserve - 6 to 8 weeks)", roleDescription: "Top 6 Center/Winger (IR)", statsSummary: "8 G, 1 A in 10 GP", simulationWeight: 0.85, goalWeight: 0.30 },
    { name: "Gabriel Landeskog", jerseyNumber: 92, position: "LW", unit: "FORWARD", depthOrder: 1, status: "IR", injuryDetails: "Knee Cartilage Transplant (LTIR)", roleDescription: "Captain (LTIR)", statsSummary: "Out Long Term", simulationWeight: 0.85, goalWeight: 0.20 },
    { name: "Cale Makar", jerseyNumber: 8, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "Generational Defenseman • PP1 QB", statsSummary: "8 G, 23 A • 31 Points • 25:30 TOI", simulationWeight: 1.0, goalWeight: 0.18 },
    { name: "Devon Toews", jerseyNumber: 7, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Pairing Two-Way D", statsSummary: "2 G, 11 A • +12", simulationWeight: 0.88, goalWeight: 0.05 },
    { name: "Alexandar Georgiev", jerseyNumber: 40, position: "G", unit: "GOALIE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Goaltender", statsSummary: ".888 SV% • 3.25 GAA", simulationWeight: 0.82, goalWeight: 0.0 },
  ],
  NYR: [
    { name: "Artemi Panarin", jerseyNumber: 10, position: "LW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Superstar Winger • PP1", statsSummary: "21 G, 30 A • 51 Points", simulationWeight: 0.98, goalWeight: 0.35 },
    { name: "Mika Zibanejad", jerseyNumber: 93, position: "C", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Line Center • PP1 One-Timer", statsSummary: "12 G, 23 A • 35 Points", simulationWeight: 0.90, goalWeight: 0.22 },
    { name: "Chris Kreider", jerseyNumber: 20, position: "LW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Line Net-Front • PP1 Screen", statsSummary: "18 G, 6 A • 24 Points", simulationWeight: 0.88, goalWeight: 0.26 },
    { name: "Adam Fox", jerseyNumber: 23, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "Norris Winning Defenseman • PP1 Point", statsSummary: "4 G, 31 A • 35 Points", simulationWeight: 0.95, goalWeight: 0.08 },
    { name: "Alexis Lafrenière", jerseyNumber: 13, position: "RW", unit: "FORWARD", depthOrder: 2, status: "ACTIVE", roleDescription: "Second Line Dynamic Winger", statsSummary: "15 G, 18 A • 33 Points", simulationWeight: 0.85, goalWeight: 0.20 },
    { name: "Filip Chytil", jerseyNumber: 72, position: "C", unit: "FORWARD", depthOrder: 2, status: "QUESTIONABLE", injuryDetails: "Upper-Body Injury (Day-to-Day)", roleDescription: "Speed Center", statsSummary: "8 G, 8 A • 16 Points", simulationWeight: 0.78, goalWeight: 0.16 },
    { name: "Igor Shesterkin", jerseyNumber: 31, position: "G", unit: "GOALIE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Vezina Goaltender", statsSummary: ".924 SV% • 2.38 GAA • 16 Wins", simulationWeight: 0.98, goalWeight: 0.0 },
  ],
  BOS: [
    { name: "David Pastrnak", jerseyNumber: 88, position: "RW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Superstar Winger • PP1 Sniper", statsSummary: "22 G, 24 A • 46 Points", simulationWeight: 0.98, goalWeight: 0.38 },
    { name: "Brad Marchand", jerseyNumber: 63, position: "LW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Captain & Top Line Winger • PP1", statsSummary: "14 G, 20 A • 34 Points", simulationWeight: 0.92, goalWeight: 0.24 },
    { name: "Elias Lindholm", jerseyNumber: 28, position: "C", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting 1st Line Center", statsSummary: "9 G, 19 A • 28 Points", simulationWeight: 0.85, goalWeight: 0.16 },
    { name: "Charlie McAvoy", jerseyNumber: 73, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Defense Anchor • PP1", statsSummary: "7 G, 18 A • 24:10 TOI", simulationWeight: 0.92, goalWeight: 0.10 },
    { name: "Mark Kastelic", jerseyNumber: 47, position: "C", unit: "FORWARD", depthOrder: 3, status: "OUT", injuryDetails: "Lower-Body Injury (Day-to-day)", roleDescription: "Physical 3rd Line Center", statsSummary: "3 G, 4 A • +6", simulationWeight: 0.74, goalWeight: 0.10 },
    { name: "Hampus Lindholm", jerseyNumber: 27, position: "D", unit: "DEFENSEMAN", depthOrder: 2, status: "IR", injuryDetails: "Fractured Kneecap (Injured Reserve - Out multiple weeks)", roleDescription: "Top 4 Defenseman (IR)", statsSummary: "3 G, 4 A • +3", simulationWeight: 0.82, goalWeight: 0.05 },
    { name: "Jeremy Swayman", jerseyNumber: 1, position: "G", unit: "GOALIE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Goaltender", statsSummary: ".904 SV% • 2.85 GAA", simulationWeight: 0.90, goalWeight: 0.0 },
  ],
  FLA: [
    { name: "Aleksander Barkov", jerseyNumber: 16, position: "C", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Selke Trophy Captain & Center", statsSummary: "12 G, 26 A • 38 Points • +16 (100% active, recovered from ankle sprain)", simulationWeight: 0.98, goalWeight: 0.26 },
    { name: "Matthew Tkachuk", jerseyNumber: 19, position: "RW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Line Power Winger • PP1", statsSummary: "16 G, 22 A • 38 Points", simulationWeight: 0.96, goalWeight: 0.32 },
    { name: "Sam Reinhart", jerseyNumber: 13, position: "RW", unit: "FORWARD", depthOrder: 2, status: "ACTIVE", roleDescription: "Goal Scoring Star • PP1 Net-Front", statsSummary: "24 G, 22 A • 46 Points", simulationWeight: 0.96, goalWeight: 0.36 },
    { name: "Carter Verhaeghe", jerseyNumber: 23, position: "LW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Line Speed Winger", statsSummary: "13 G, 18 A • 31 Points", simulationWeight: 0.88, goalWeight: 0.22 },
    { name: "Aaron Ekblad", jerseyNumber: 5, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Top Defenseman", statsSummary: "5 G, 18 A • 23:35 TOI", simulationWeight: 0.88, goalWeight: 0.08 },
    { name: "Sergei Bobrovsky", jerseyNumber: 72, position: "G", unit: "GOALIE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Vezina Goaltender", statsSummary: ".908 SV% • 2.65 GAA • 16 Wins", simulationWeight: 0.92, goalWeight: 0.0 },
  ],
};

// Generic generator for remaining NHL teams
export function generateGenericNhlRoster(teamAbbr: string, teamName: string): RawRosterPlayer[] {
  return [
    { name: `${teamName} Top Center`, jerseyNumber: 19, position: "C", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "1st Line Center • PP1", statsSummary: "14 G, 25 A • 39 Points", simulationWeight: 0.88, goalWeight: 0.28 },
    { name: `${teamName} Top Winger`, jerseyNumber: 88, position: "LW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "1st Line Sniper • PP1", statsSummary: "18 G, 16 A • 34 Points", simulationWeight: 0.88, goalWeight: 0.32 },
    { name: `${teamName} RW Star`, jerseyNumber: 22, position: "RW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "1st Line Playmaker", statsSummary: "11 G, 22 A • 33 Points", simulationWeight: 0.82, goalWeight: 0.20 },
    { name: `${teamName} 2nd Line Center`, jerseyNumber: 11, position: "C", unit: "FORWARD", depthOrder: 2, status: "ACTIVE", roleDescription: "2nd Line Center", statsSummary: "9 G, 17 A • 26 Points", simulationWeight: 0.78, goalWeight: 0.16 },
    { name: `${teamName} Top Defenseman`, jerseyNumber: 5, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Pairing D • PP1 Point", statsSummary: "6 G, 22 A • 23:45 TOI", simulationWeight: 0.85, goalWeight: 0.08 },
    { name: `${teamName} Shutdown D`, jerseyNumber: 27, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Pairing Shutdown D • PK1", statsSummary: "2 G, 11 A • 62 Blocks", simulationWeight: 0.80, goalWeight: 0.02 },
    { name: `${teamName} Starting Goalie`, jerseyNumber: 30, position: "G", unit: "GOALIE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Goaltender", statsSummary: ".912 SV% • 2.60 GAA • 13 Wins", simulationWeight: 0.88, goalWeight: 0.0 },
  ];
}
