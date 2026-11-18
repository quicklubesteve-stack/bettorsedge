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
    { name: "Isiah Pacheco", jerseyNumber: 10, position: "RB", unit: "OFFENSE", depthOrder: 2, status: "QUESTIONABLE", injuryDetails: "Fibula (Limited in practice)", roleDescription: "Dynamic Change-of-Pace RB", statsSummary: "240 Rush Yds • 2 TD • 4.4 YPC", simulationWeight: 0.78, touchdownWeight: 0.25 },
    { name: "Travis Kelce", jerseyNumber: 87, position: "TE", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "All-Pro Starting TE", statsSummary: "68 Rec • 610 Yds • 4 TD", simulationWeight: 0.95, touchdownWeight: 0.35 },
    { name: "DeAndre Hopkins", jerseyNumber: 8, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Outside WR1", statsSummary: "52 Rec • 640 Yds • 5 TD", simulationWeight: 0.88, touchdownWeight: 0.30 },
    { name: "Xavier Worthy", jerseyNumber: 1, position: "WR", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Deep Threat Speed WR2", statsSummary: "32 Rec • 410 Yds • 5 TD", simulationWeight: 0.82, touchdownWeight: 0.25 },
    { name: "Rashee Rice", jerseyNumber: 4, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "IR", injuryDetails: "Knee Surgery (Injured Reserve)", roleDescription: "Starting WR (IR)", statsSummary: "24 Rec • 288 Yds • 2 TD", simulationWeight: 0.85, touchdownWeight: 0.30 },
    { name: "Harrison Butker", jerseyNumber: 7, position: "K", unit: "SPECIAL_TEAMS", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Placekicker", statsSummary: "21/23 FGs • 91.3% FG", simulationWeight: 0.70, touchdownWeight: 0.0 },
    { name: "Chris Jones", jerseyNumber: 95, position: "DT", unit: "DEFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Defensive Tackle Anchor", statsSummary: "7.0 Sacks • 22 Pressures", simulationWeight: 0.95, touchdownWeight: 0.0 },
  ],
  BUF: [
    { name: "Josh Allen", jerseyNumber: 17, position: "QB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Dual-Threat QB", statsSummary: "2,810 Pass Yds • 24 TD • 6 Rush TD", simulationWeight: 1.0, touchdownWeight: 0.40 },
    { name: "James Cook", jerseyNumber: 4, position: "RB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting RB1", statsSummary: "820 Rush Yds • 9 TD • 4.9 YPC", simulationWeight: 0.90, touchdownWeight: 0.45 },
    { name: "Ray Davis", jerseyNumber: 22, position: "RB", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Power Short-Yardage RB", statsSummary: "310 Rush Yds • 3 TD", simulationWeight: 0.68, touchdownWeight: 0.15 },
    { name: "Khalil Shakir", jerseyNumber: 10, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Slot WR1", statsSummary: "62 Rec • 680 Yds • 4 TD", simulationWeight: 0.86, touchdownWeight: 0.30 },
    { name: "Dalton Kincaid", jerseyNumber: 86, position: "TE", unit: "OFFENSE", depthOrder: 1, status: "QUESTIONABLE", injuryDetails: "Knee (Day-to-day, limited)", roleDescription: "Starting Pass-Catching TE", statsSummary: "38 Rec • 390 Yds • 2 TD", simulationWeight: 0.80, touchdownWeight: 0.25 },
    { name: "Keon Coleman", jerseyNumber: 0, position: "WR", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Outside Red-Zone Target WR2", statsSummary: "26 Rec • 460 Yds • 4 TD", simulationWeight: 0.80, touchdownWeight: 0.25 },
    { name: "Matt Milano", jerseyNumber: 58, position: "LB", unit: "DEFENSE", depthOrder: 1, status: "IR", injuryDetails: "Bicep Tear (Injured Reserve)", roleDescription: "All-Pro Linebacker (IR)", statsSummary: "Pro Bowl LB", simulationWeight: 0.88, touchdownWeight: 0.0 },
    { name: "Tyler Bass", jerseyNumber: 2, position: "K", unit: "SPECIAL_TEAMS", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Placekicker", statsSummary: "19/23 FGs • 61-yd Long", simulationWeight: 0.70, touchdownWeight: 0.0 },
    { name: "Greg Rousseau", jerseyNumber: 50, position: "DE", unit: "DEFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Edge Rusher", statsSummary: "7.5 Sacks • 14 TFL", simulationWeight: 0.88, touchdownWeight: 0.0 },
  ],
  BAL: [
    { name: "Lamar Jackson", jerseyNumber: 8, position: "QB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting MVP Quarterback", statsSummary: "3,120 Pass Yds • 27 TD • 580 Rush Yds", simulationWeight: 1.0, touchdownWeight: 0.35 },
    { name: "Derrick Henry", jerseyNumber: 22, position: "RB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Power Workhorse RB1", statsSummary: "1,260 Rush Yds • 14 TD • 6.0 YPC", simulationWeight: 1.0, touchdownWeight: 0.65 },
    { name: "Justice Hill", jerseyNumber: 43, position: "RB", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "3rd Down Receiving Back", statsSummary: "275 Rec Yds • 2 TD", simulationWeight: 0.65, touchdownWeight: 0.10 },
    { name: "Zay Flowers", jerseyNumber: 4, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting WR1 Playmaker", statsSummary: "60 Rec • 780 Yds • 4 TD", simulationWeight: 0.90, touchdownWeight: 0.35 },
    { name: "Mark Andrews", jerseyNumber: 89, position: "TE", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting All-Pro TE", statsSummary: "38 Rec • 440 Yds • 6 TD", simulationWeight: 0.88, touchdownWeight: 0.35 },
    { name: "Rashod Bateman", jerseyNumber: 7, position: "WR", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Starting Outside WR2", statsSummary: "34 Rec • 550 Yds • 4 TD", simulationWeight: 0.76, touchdownWeight: 0.20 },
    { name: "Justin Tucker", jerseyNumber: 9, position: "K", unit: "SPECIAL_TEAMS", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Placekicker", statsSummary: "18/22 FGs", simulationWeight: 0.75, touchdownWeight: 0.0 },
    { name: "Kyle Hamilton", jerseyNumber: 14, position: "S", unit: "DEFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "All-Pro Safety", statsSummary: "74 Tackles • 2 INT • 8 PBU", simulationWeight: 0.94, touchdownWeight: 0.0 },
  ],
  DET: [
    { name: "Jared Goff", jerseyNumber: 16, position: "QB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Quarterback", statsSummary: "2,740 Pass Yds • 22 TD • 73.1% Comp", simulationWeight: 0.95, touchdownWeight: 0.10 },
    { name: "David Montgomery", jerseyNumber: 5, position: "RB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Power RB1", statsSummary: "760 Rush Yds • 10 TD • 4.6 YPC", simulationWeight: 0.90, touchdownWeight: 0.50 },
    { name: "Jahmyr Gibbs", jerseyNumber: 26, position: "RB", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Explosive Dual RB", statsSummary: "810 Rush Yds • 9 TD • 6.1 YPC", simulationWeight: 0.94, touchdownWeight: 0.45 },
    { name: "Amon-Ra St. Brown", jerseyNumber: 14, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "All-Pro Slot Receiver WR1", statsSummary: "72 Rec • 760 Yds • 8 TD", simulationWeight: 0.96, touchdownWeight: 0.45 },
    { name: "Sam LaPorta", jerseyNumber: 87, position: "TE", unit: "OFFENSE", depthOrder: 1, status: "QUESTIONABLE", injuryDetails: "Shoulder (Limited practice)", roleDescription: "Starting Pro Bowl TE", statsSummary: "34 Rec • 420 Yds • 3 TD", simulationWeight: 0.82, touchdownWeight: 0.25 },
    { name: "Jameson Williams", jerseyNumber: 9, position: "WR", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Starting Deep Threat WR2", statsSummary: "28 Rec • 550 Yds • 4 TD", simulationWeight: 0.82, touchdownWeight: 0.25 },
    { name: "Aidan Hutchinson", jerseyNumber: 97, position: "DE", unit: "DEFENSE", depthOrder: 1, status: "IR", injuryDetails: "Fractured Tibia/Fibula (Injured Reserve)", roleDescription: "Defensive Star Edge (IR)", statsSummary: "7.5 Sacks in 5 games", simulationWeight: 0.95, touchdownWeight: 0.0 },
    { name: "Jake Bates", jerseyNumber: 39, position: "K", unit: "SPECIAL_TEAMS", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Placekicker", statsSummary: "16/16 FGs • 100% FG", simulationWeight: 0.70, touchdownWeight: 0.0 },
    { name: "Brian Branch", jerseyNumber: 32, position: "S", unit: "DEFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Safety / Nickel", statsSummary: "58 Tackles • 4 INT", simulationWeight: 0.90, touchdownWeight: 0.0 },
  ],
  PHI: [
    { name: "Jalen Hurts", jerseyNumber: 1, position: "QB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Dual-Threat QB", statsSummary: "2,490 Pass Yds • 16 TD • 11 Rush TD", simulationWeight: 0.96, touchdownWeight: 0.40 },
    { name: "Saquon Barkley", jerseyNumber: 26, position: "RB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Workhorse RB1", statsSummary: "1,280 Rush Yds • 12 TD • 5.9 YPC", simulationWeight: 1.0, touchdownWeight: 0.60 },
    { name: "Kenneth Gainwell", jerseyNumber: 14, position: "RB", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Change-of-Pace Backup RB", statsSummary: "210 Rush Yds • 1 TD", simulationWeight: 0.60, touchdownWeight: 0.10 },
    { name: "A.J. Brown", jerseyNumber: 11, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "All-Pro Starting WR1", statsSummary: "48 Rec • 780 Yds • 6 TD", simulationWeight: 0.96, touchdownWeight: 0.45 },
    { name: "DeVonta Smith", jerseyNumber: 6, position: "WR", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Starting WR2 Route Specialist", statsSummary: "50 Rec • 600 Yds • 4 TD", simulationWeight: 0.88, touchdownWeight: 0.35 },
    { name: "Dallas Goedert", jerseyNumber: 88, position: "TE", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting TE1", statsSummary: "32 Rec • 370 Yds • 2 TD", simulationWeight: 0.80, touchdownWeight: 0.20 },
    { name: "Jake Elliott", jerseyNumber: 4, position: "K", unit: "SPECIAL_TEAMS", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Placekicker", statsSummary: "18/21 FGs", simulationWeight: 0.70, touchdownWeight: 0.0 },
    { name: "Jalen Carter", jerseyNumber: 98, position: "DT", unit: "DEFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Interior Defensive Tackle Anchor", statsSummary: "5.5 Sacks • 13 TFL", simulationWeight: 0.92, touchdownWeight: 0.0 },
  ],
  SF: [
    { name: "Brock Purdy", jerseyNumber: 13, position: "QB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Quarterback", statsSummary: "2,840 Pass Yds • 17 TD • 8.7 YPA", simulationWeight: 0.94, touchdownWeight: 0.15 },
    { name: "Christian McCaffrey", jerseyNumber: 23, position: "RB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "All-Pro RB1 Starting Back", statsSummary: "245 Rush Yds • 150 Rec Yds • 2 TD", simulationWeight: 1.0, touchdownWeight: 0.65 },
    { name: "Jordan Mason", jerseyNumber: 24, position: "RB", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Power Backup RB", statsSummary: "720 Rush Yds • 3 TD • 5.0 YPC", simulationWeight: 0.75, touchdownWeight: 0.20 },
    { name: "George Kittle", jerseyNumber: 85, position: "TE", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "All-Pro Starting TE", statsSummary: "53 Rec • 690 Yds • 8 TD", simulationWeight: 0.96, touchdownWeight: 0.40 },
    { name: "Deebo Samuel", jerseyNumber: 1, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Dual WR / Rusher", statsSummary: "42 Rec • 590 Yds • 4 TD", simulationWeight: 0.88, touchdownWeight: 0.30 },
    { name: "Jauan Jennings", jerseyNumber: 15, position: "WR", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Starting Physical WR2", statsSummary: "39 Rec • 530 Yds • 4 TD", simulationWeight: 0.80, touchdownWeight: 0.25 },
    { name: "Brandon Aiyuk", jerseyNumber: 11, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "IR", injuryDetails: "Torn ACL/MCL (Injured Reserve)", roleDescription: "Pro Bowl Receiver (IR)", statsSummary: "25 Rec • 374 Yds", simulationWeight: 0.90, touchdownWeight: 0.30 },
    { name: "Nick Bosa", jerseyNumber: 97, position: "DE", unit: "DEFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Defensive Player of Year Rusher", statsSummary: "8.0 Sacks • 16 TFL", simulationWeight: 0.98, touchdownWeight: 0.0 },
  ],
  CIN: [
    { name: "Joe Burrow", jerseyNumber: 9, position: "QB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Quarterback", statsSummary: "3,110 Pass Yds • 27 TD • 4 INT", simulationWeight: 1.0, touchdownWeight: 0.10 },
    { name: "Chase Brown", jerseyNumber: 30, position: "RB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting RB1 Workhorse", statsSummary: "650 Rush Yds • 7 TD • 32 Rec", simulationWeight: 0.86, touchdownWeight: 0.50 },
    { name: "Ja'Marr Chase", jerseyNumber: 1, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Triple Crown WR1 Target", statsSummary: "81 Rec • 1,140 Yds • 12 TD", simulationWeight: 1.0, touchdownWeight: 0.55 },
    { name: "Tee Higgins", jerseyNumber: 5, position: "WR", unit: "OFFENSE", depthOrder: 2, status: "QUESTIONABLE", injuryDetails: "Quad (Limited practice, game-time decision)", roleDescription: "Starting Boundary WR2", statsSummary: "36 Rec • 440 Yds • 4 TD", simulationWeight: 0.86, touchdownWeight: 0.30 },
    { name: "Mike Gesicki", jerseyNumber: 88, position: "TE", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Pass-Catching TE", statsSummary: "37 Rec • 415 Yds • 2 TD", simulationWeight: 0.75, touchdownWeight: 0.20 },
    { name: "Trey Hendrickson", jerseyNumber: 91, position: "DE", unit: "DEFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "NFL Sack Leader DE", statsSummary: "12.0 Sacks • 21 QB Hits", simulationWeight: 0.96, touchdownWeight: 0.0 },
  ],
  HOU: [
    { name: "C.J. Stroud", jerseyNumber: 7, position: "QB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Franchise QB", statsSummary: "2,760 Pass Yds • 16 TD • 6 INT", simulationWeight: 0.95, touchdownWeight: 0.10 },
    { name: "Joe Mixon", jerseyNumber: 28, position: "RB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Lead Running Back", statsSummary: "790 Rush Yds • 9 TD • 4.7 YPC", simulationWeight: 0.92, touchdownWeight: 0.55 },
    { name: "Nico Collins", jerseyNumber: 12, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Dominant Starting WR1", statsSummary: "42 Rec • 710 Yds • 5 TD", simulationWeight: 0.98, touchdownWeight: 0.45 },
    { name: "Tank Dell", jerseyNumber: 3, position: "WR", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Starting Slot WR2", statsSummary: "42 Rec • 490 Yds • 3 TD", simulationWeight: 0.82, touchdownWeight: 0.25 },
    { name: "Stefon Diggs", jerseyNumber: 1, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "IR", injuryDetails: "Torn ACL Knee (Injured Reserve)", roleDescription: "All-Pro WR (IR)", statsSummary: "47 Rec • 496 Yds • 3 TD", simulationWeight: 0.90, touchdownWeight: 0.30 },
    { name: "Dalton Schultz", jerseyNumber: 86, position: "TE", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting TE1", statsSummary: "38 Rec • 390 Yds • 1 TD", simulationWeight: 0.78, touchdownWeight: 0.15 },
    { name: "Will Anderson Jr.", jerseyNumber: 51, position: "DE", unit: "DEFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Edge Rusher Star", statsSummary: "8.5 Sacks • 12 TFL", simulationWeight: 0.92, touchdownWeight: 0.0 },
  ],
  DAL: [
    { name: "Dak Prescott", jerseyNumber: 4, position: "QB", unit: "OFFENSE", depthOrder: 1, status: "IR", injuryDetails: "Hamstring Avulsion (Injured Reserve - Out for Season)", roleDescription: "Franchise Starting QB (IR)", statsSummary: "1,978 Pass Yds • 11 TD", simulationWeight: 0.90, touchdownWeight: 0.10 },
    { name: "Cooper Rush", jerseyNumber: 10, position: "QB", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Current Starting QB", statsSummary: "540 Pass Yds • 3 TD", simulationWeight: 0.70, touchdownWeight: 0.05 },
    { name: "Rico Dowdle", jerseyNumber: 23, position: "RB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting RB1", statsSummary: "490 Rush Yds • 3 TD • 26 Rec", simulationWeight: 0.76, touchdownWeight: 0.40 },
    { name: "CeeDee Lamb", jerseyNumber: 88, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "All-Pro Starting Target WR1", statsSummary: "74 Rec • 860 Yds • 5 TD", simulationWeight: 0.98, touchdownWeight: 0.50 },
    { name: "Brandin Cooks", jerseyNumber: 3, position: "WR", unit: "OFFENSE", depthOrder: 2, status: "IR", injuryDetails: "Knee Infection (Injured Reserve)", roleDescription: "Veteran Outside WR (IR)", statsSummary: "9 Rec • 91 Yds • 1 TD", simulationWeight: 0.75, touchdownWeight: 0.20 },
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
    { name: "Auston Matthews", jerseyNumber: 34, position: "C", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Line Center • PP1 Sniper", statsSummary: "69 Goals (2023-24) • 18 G, 21 A • 39 Pts", simulationWeight: 1.0, goalWeight: 0.36 },
    { name: "Matthew Knies", jerseyNumber: 23, position: "LW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Line Power Forward • PP1 Net-Front", statsSummary: "12 G, 11 A • 23 Points", simulationWeight: 0.82, goalWeight: 0.18 },
    { name: "William Nylander", jerseyNumber: 88, position: "RW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Line Superstar • PP1 Trigger", statsSummary: "21 G, 20 A • 41 Points", simulationWeight: 0.98, goalWeight: 0.34 },
    { name: "John Tavares", jerseyNumber: 91, position: "C", unit: "FORWARD", depthOrder: 2, status: "ACTIVE", roleDescription: "Second Line Center • Net Front PP1", statsSummary: "14 G, 15 A • 29 Points", simulationWeight: 0.88, goalWeight: 0.22 },
    { name: "Max Domi", jerseyNumber: 11, position: "LW", unit: "FORWARD", depthOrder: 2, status: "ACTIVE", roleDescription: "Second Line Playmaker", statsSummary: "5 G, 16 A • 21 Points", simulationWeight: 0.80, goalWeight: 0.12 },
    { name: "Morgan Rielly", jerseyNumber: 44, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "First Pairing Defense • PP1 Point", statsSummary: "6 G, 21 A • 23:50 TOI/G", simulationWeight: 0.88, goalWeight: 0.08 },
    { name: "Chris Tanev", jerseyNumber: 8, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Shutdown Defenseman • PK1", statsSummary: "56 Blocked Shots • +10 Plus/Minus", simulationWeight: 0.85, goalWeight: 0.02 },
    { name: "Anthony Stolarz", jerseyNumber: 41, position: "G", unit: "GOALIE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Goaltender", statsSummary: ".925 SV% • 2.22 GAA • 12 Wins", simulationWeight: 0.92, goalWeight: 0.0 },
    { name: "Joseph Woll", jerseyNumber: 60, position: "G", unit: "GOALIE", depthOrder: 2, status: "ACTIVE", roleDescription: "Backup Goaltender", statsSummary: ".912 SV% • 2.60 GAA", simulationWeight: 0.82, goalWeight: 0.0 },
    { name: "Max Pacioretty", jerseyNumber: 67, position: "LW", unit: "FORWARD", depthOrder: 3, status: "IR", injuryDetails: "Lower Body (Week-to-Week IR)", roleDescription: "Veteran Winger (IR)", statsSummary: "3 G, 4 A in 13 games", simulationWeight: 0.72, goalWeight: 0.12 },
    { name: "Calle Järnkrok", jerseyNumber: 19, position: "RW", unit: "FORWARD", depthOrder: 3, status: "IR", injuryDetails: "Groin/Hernia Surgery (LTIR)", roleDescription: "Two-Way Forward (LTIR)", statsSummary: "On Injured Reserve", simulationWeight: 0.70, goalWeight: 0.10 },
  ],
  VGK: [
    { name: "Mitch Marner", jerseyNumber: 16, position: "RW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Line Superstar Playmaker • PP1 Flank", statsSummary: "18 G, 48 A • 66 Points • +14 Plus/Minus", simulationWeight: 1.0, goalWeight: 0.24 },
    { name: "Jack Eichel", jerseyNumber: 9, position: "C", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Line Franchise Center • PP1 Quarterback", statsSummary: "22 G, 38 A • 60 Points", simulationWeight: 1.0, goalWeight: 0.32 },
    { name: "Mark Stone", jerseyNumber: 61, position: "RW", unit: "FORWARD", depthOrder: 1, status: "QUESTIONABLE", injuryDetails: "Wrist / Upper Body - Day-to-Day", roleDescription: "Captain & 200-ft Winger • PP1 Net-Front", statsSummary: "11 G, 21 A • 32 Points", simulationWeight: 0.92, goalWeight: 0.22 },
    { name: "Tomas Hertl", jerseyNumber: 48, position: "C", unit: "FORWARD", depthOrder: 2, status: "ACTIVE", roleDescription: "Second Line Center • Net Front PP1", statsSummary: "14 G, 18 A • 32 Points", simulationWeight: 0.88, goalWeight: 0.22 },
    { name: "Shea Theodore", jerseyNumber: 27, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "First Pairing Defense • PP1 Point", statsSummary: "6 G, 26 A • 23:15 TOI", simulationWeight: 0.90, goalWeight: 0.10 },
    { name: "Alex Pietrangelo", jerseyNumber: 7, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Pairing Shutdown D • PK1", statsSummary: "3 G, 19 A • +12", simulationWeight: 0.88, goalWeight: 0.05 },
    { name: "Adin Hill", jerseyNumber: 33, position: "G", unit: "GOALIE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Goaltender", statsSummary: ".912 SV% • 2.58 GAA • 14 Wins", simulationWeight: 0.90, goalWeight: 0.0 },
    { name: "Ilya Samsonov", jerseyNumber: 35, position: "G", unit: "GOALIE", depthOrder: 2, status: "ACTIVE", roleDescription: "Backup Goaltender", statsSummary: ".906 SV% • 2.75 GAA", simulationWeight: 0.82, goalWeight: 0.0 },
    { name: "William Karlsson", jerseyNumber: 71, position: "C", unit: "FORWARD", depthOrder: 2, status: "IR", injuryDetails: "Undisclosed Lower-Body (Injured Reserve)", roleDescription: "Shutdown Center (IR)", statsSummary: "7 G, 9 A • 16 Points", simulationWeight: 0.80, goalWeight: 0.15 },
  ],
  EDM: [
    { name: "Connor McDavid", jerseyNumber: 97, position: "C", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Generational Center • PP1 Quarterback", statsSummary: "24 G, 52 A • 76 Points • 1.65 PPG", simulationWeight: 1.0, goalWeight: 0.36 },
    { name: "Zach Hyman", jerseyNumber: 18, position: "LW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Line Power Net-Front • PP1", statsSummary: "54 Goals (2023-24) • 26 G, 15 A (Current)", simulationWeight: 0.92, goalWeight: 0.30 },
    { name: "Ryan Nugent-Hopkins", jerseyNumber: 93, position: "LW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Six Forward • PP1 Half-Wall", statsSummary: "12 G, 28 A • 40 Points", simulationWeight: 0.86, goalWeight: 0.16 },
    { name: "Leon Draisaitl", jerseyNumber: 29, position: "C", unit: "FORWARD", depthOrder: 2, status: "ACTIVE", roleDescription: "Second Line Superstar • PP1 Right Flank", statsSummary: "31 G, 34 A • 65 Points", simulationWeight: 1.0, goalWeight: 0.38 },
    { name: "Viktor Arvidsson", jerseyNumber: 33, position: "RW", unit: "FORWARD", depthOrder: 2, status: "QUESTIONABLE", injuryDetails: "Lower-Body - Day-to-Day", roleDescription: "Second Line Winger", statsSummary: "8 G, 11 A • 19 Points", simulationWeight: 0.78, goalWeight: 0.14 },
    { name: "Evan Bouchard", jerseyNumber: 2, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "First Pairing Defense • PP1 Point Bomb", statsSummary: "11 G, 32 A • 43 Points • 24:30 TOI", simulationWeight: 0.92, goalWeight: 0.16 },
    { name: "Mattias Ekholm", jerseyNumber: 14, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Pairing 2-Way Defenseman", statsSummary: "6 G, 18 A • +18 Plus/Minus", simulationWeight: 0.88, goalWeight: 0.06 },
    { name: "Stuart Skinner", jerseyNumber: 74, position: "G", unit: "GOALIE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Goaltender", statsSummary: ".908 SV% • 2.68 GAA • 18 Wins", simulationWeight: 0.86, goalWeight: 0.0 },
    { name: "Evander Kane", jerseyNumber: 91, position: "LW", unit: "FORWARD", depthOrder: 1, status: "IR", injuryDetails: "Abdominal/Hip Surgery Recovery (LTIR)", roleDescription: "Power Forward (Injured Reserve)", statsSummary: "24 G, 20 A in 2023-24", simulationWeight: 0.82, goalWeight: 0.20 },
  ],
  COL: [
    { name: "Nathan MacKinnon", jerseyNumber: 29, position: "C", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "MVP Center • PP1 Engine", statsSummary: "24 G, 50 A • 74 Points (NHL Leader)", simulationWeight: 1.0, goalWeight: 0.38 },
    { name: "Mikko Rantanen", jerseyNumber: 96, position: "RW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Line All-Star Winger • PP1", statsSummary: "26 G, 31 A • 57 Points", simulationWeight: 0.98, goalWeight: 0.35 },
    { name: "Cale Makar", jerseyNumber: 8, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "Norris Trophy Defenseman • PP1 Point", statsSummary: "14 G, 38 A • 52 Points • 25:40 TOI", simulationWeight: 1.0, goalWeight: 0.22 },
    { name: "Casey Mittelstadt", jerseyNumber: 37, position: "C", unit: "FORWARD", depthOrder: 2, status: "ACTIVE", roleDescription: "Second Line Center", statsSummary: "12 G, 18 A • 30 Points", simulationWeight: 0.82, goalWeight: 0.16 },
    { name: "Devon Toews", jerseyNumber: 7, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Pairing Two-Way D", statsSummary: "4 G, 20 A • 24:15 TOI", simulationWeight: 0.85, goalWeight: 0.05 },
    { name: "Gabriel Landeskog", jerseyNumber: 92, position: "LW", unit: "FORWARD", depthOrder: 1, status: "IR", injuryDetails: "Knee Cartilage Transplant (LTIR)", roleDescription: "Captain & Winger (LTIR)", statsSummary: "On Injured Reserve", simulationWeight: 0.85, goalWeight: 0.25 },
    { name: "Alexandar Georgiev", jerseyNumber: 40, position: "G", unit: "GOALIE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Goaltender", statsSummary: ".898 SV% • 3.05 GAA", simulationWeight: 0.80, goalWeight: 0.0 },
  ],
  NYR: [
    { name: "Artemi Panarin", jerseyNumber: 10, position: "LW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Superstar Winger • PP1", statsSummary: "21 G, 30 A • 51 Points", simulationWeight: 0.98, goalWeight: 0.35 },
    { name: "Mika Zibanejad", jerseyNumber: 93, position: "C", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Line Center • PP1 One-Timer", statsSummary: "12 G, 23 A • 35 Points", simulationWeight: 0.90, goalWeight: 0.22 },
    { name: "Chris Kreider", jerseyNumber: 20, position: "LW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Line Net-Front • PP1 Screen", statsSummary: "18 G, 6 A • 24 Points", simulationWeight: 0.88, goalWeight: 0.26 },
    { name: "Adam Fox", jerseyNumber: 23, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "Norris Winning Defenseman • PP1 Point", statsSummary: "4 G, 31 A • 35 Points", simulationWeight: 0.95, goalWeight: 0.08 },
    { name: "Alexis Lafrenière", jerseyNumber: 13, position: "RW", unit: "FORWARD", depthOrder: 2, status: "ACTIVE", roleDescription: "Second Line Dynamic Winger", statsSummary: "15 G, 18 A • 33 Points", simulationWeight: 0.85, goalWeight: 0.20 },
    { name: "Filip Chytil", jerseyNumber: 72, position: "C", unit: "FORWARD", depthOrder: 2, status: "QUESTIONABLE", injuryDetails: "Upper-Body - Day-to-Day", roleDescription: "Speed Center", statsSummary: "8 G, 8 A • 16 Points", simulationWeight: 0.78, goalWeight: 0.16 },
    { name: "Igor Shesterkin", jerseyNumber: 31, position: "G", unit: "GOALIE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Vezina Goaltender", statsSummary: ".924 SV% • 2.38 GAA • 16 Wins", simulationWeight: 0.98, goalWeight: 0.0 },
  ],
  BOS: [
    { name: "David Pastrnak", jerseyNumber: 88, position: "RW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Superstar Winger • PP1 Sniper", statsSummary: "22 G, 24 A • 46 Points", simulationWeight: 0.98, goalWeight: 0.38 },
    { name: "Brad Marchand", jerseyNumber: 63, position: "LW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Captain & Top Line Winger • PP1", statsSummary: "14 G, 20 A • 34 Points", simulationWeight: 0.92, goalWeight: 0.24 },
    { name: "Elias Lindholm", jerseyNumber: 28, position: "C", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting 1st Line Center", statsSummary: "9 G, 19 A • 28 Points", simulationWeight: 0.85, goalWeight: 0.16 },
    { name: "Charlie McAvoy", jerseyNumber: 73, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Defense Anchor • PP1", statsSummary: "7 G, 18 A • 24:10 TOI", simulationWeight: 0.92, goalWeight: 0.10 },
    { name: "Hampus Lindholm", jerseyNumber: 27, position: "D", unit: "DEFENSEMAN", depthOrder: 2, status: "IR", injuryDetails: "Lower-Body Fractured (Injured Reserve)", roleDescription: "Top 4 Defenseman (IR)", statsSummary: "3 G, 4 A • +3", simulationWeight: 0.82, goalWeight: 0.05 },
    { name: "Jeremy Swayman", jerseyNumber: 1, position: "G", unit: "GOALIE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Goaltender", statsSummary: ".904 SV% • 2.85 GAA", simulationWeight: 0.90, goalWeight: 0.0 },
  ],
  FLA: [
    { name: "Aleksander Barkov", jerseyNumber: 16, position: "C", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Selke Trophy Captain & Center", statsSummary: "12 G, 26 A • 38 Points • +16", simulationWeight: 0.98, goalWeight: 0.26 },
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
