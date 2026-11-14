// Current team rosters for all 32 NFL and 32 NHL franchises
// Updated weekly to reflect depth chart changes, trades, and injury statuses.

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
  simulationWeight: number; // General impact weight
  touchdownWeight?: number; // NFL TD probability weight
  goalWeight?: number;      // NHL Goal probability weight
}

export const NFL_ROSTERS_SEED: Record<string, RawRosterPlayer[]> = {
  KC: [
    { name: "Patrick Mahomes", jerseyNumber: 15, position: "QB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Franchise Starting QB", statsSummary: "2,680 Pass Yds • 22 TD • 8 INT", simulationWeight: 1.0, touchdownWeight: 0.15 },
    { name: "Kareem Hunt", jerseyNumber: 29, position: "RB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Lead Running Back", statsSummary: "625 Rush Yds • 5 TD • 3.9 YPC", simulationWeight: 0.85, touchdownWeight: 0.45 },
    { name: "Isiah Pacheco", jerseyNumber: 10, position: "RB", unit: "OFFENSE", depthOrder: 2, status: "QUESTIONABLE", injuryDetails: "Fibula (Returning to Practice)", roleDescription: "Dynamic Change-of-Pace RB", statsSummary: "189 Rush Yds • 1 TD • 4.3 YPC", simulationWeight: 0.75, touchdownWeight: 0.25 },
    { name: "Travis Kelce", jerseyNumber: 87, position: "TE", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "All-Pro Starting TE", statsSummary: "60 Rec • 540 Yds • 3 TD", simulationWeight: 0.95, touchdownWeight: 0.35 },
    { name: "DeAndre Hopkins", jerseyNumber: 8, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Outside WR1", statsSummary: "48 Rec • 590 Yds • 4 TD", simulationWeight: 0.88, touchdownWeight: 0.30 },
    { name: "Xavier Worthy", jerseyNumber: 1, position: "WR", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Deep Threat Speed WR2", statsSummary: "28 Rec • 350 Yds • 4 TD", simulationWeight: 0.80, touchdownWeight: 0.25 },
    { name: "Justin Watson", jerseyNumber: 84, position: "WR", unit: "OFFENSE", depthOrder: 3, status: "ACTIVE", roleDescription: "Slot / Situational WR", statsSummary: "18 Rec • 210 Yds • 1 TD", simulationWeight: 0.65, touchdownWeight: 0.10 },
    { name: "Harrison Butker", jerseyNumber: 7, position: "K", unit: "SPECIAL_TEAMS", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Placekicker", statsSummary: "18/20 FGs • 90.0% FG", simulationWeight: 0.70, touchdownWeight: 0.0 },
    { name: "Chris Jones", jerseyNumber: 95, position: "DT", unit: "DEFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Defensive Tackle Anchor", statsSummary: "5.5 Sacks • 18 Pressures", simulationWeight: 0.95, touchdownWeight: 0.0 },
  ],
  BUF: [
    { name: "Josh Allen", jerseyNumber: 17, position: "QB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Dual-Threat QB", statsSummary: "2,540 Pass Yds • 21 TD • 5 Rush TD", simulationWeight: 1.0, touchdownWeight: 0.40 },
    { name: "James Cook", jerseyNumber: 4, position: "RB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting RB1", statsSummary: "730 Rush Yds • 8 TD • 4.8 YPC", simulationWeight: 0.88, touchdownWeight: 0.45 },
    { name: "Ray Davis", jerseyNumber: 22, position: "RB", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Power Short-Yardage RB", statsSummary: "280 Rush Yds • 3 TD", simulationWeight: 0.68, touchdownWeight: 0.15 },
    { name: "Khalil Shakir", jerseyNumber: 10, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Slot WR1", statsSummary: "56 Rec • 610 Yds • 3 TD", simulationWeight: 0.85, touchdownWeight: 0.30 },
    { name: "Dalton Kincaid", jerseyNumber: 86, position: "TE", unit: "OFFENSE", depthOrder: 1, status: "QUESTIONABLE", injuryDetails: "Knee - Limited Practice", roleDescription: "Starting Pass-Catching TE", statsSummary: "34 Rec • 356 Yds • 2 TD", simulationWeight: 0.80, touchdownWeight: 0.25 },
    { name: "Keon Coleman", jerseyNumber: 0, position: "WR", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Outside Red-Zone Target WR2", statsSummary: "22 Rec • 417 Yds • 3 TD", simulationWeight: 0.78, touchdownWeight: 0.25 },
    { name: "Tyler Bass", jerseyNumber: 2, position: "K", unit: "SPECIAL_TEAMS", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Placekicker", statsSummary: "17/21 FGs • 61-yd Long", simulationWeight: 0.70, touchdownWeight: 0.0 },
    { name: "Greg Rousseau", jerseyNumber: 50, position: "DE", unit: "DEFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Edge Rusher", statsSummary: "6.0 Sacks • 12 TFL", simulationWeight: 0.88, touchdownWeight: 0.0 },
  ],
  BAL: [
    { name: "Lamar Jackson", jerseyNumber: 8, position: "QB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting MVP Quarterback", statsSummary: "2,876 Pass Yds • 24 TD • 538 Rush Yds", simulationWeight: 1.0, touchdownWeight: 0.35 },
    { name: "Derrick Henry", jerseyNumber: 22, position: "RB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Power Workhorse RB1", statsSummary: "1,120 Rush Yds • 12 TD • 6.1 YPC", simulationWeight: 0.98, touchdownWeight: 0.65 },
    { name: "Justice Hill", jerseyNumber: 43, position: "RB", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "3rd Down Receiving Back", statsSummary: "250 Rec Yds • 2 TD", simulationWeight: 0.65, touchdownWeight: 0.10 },
    { name: "Zay Flowers", jerseyNumber: 4, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting WR1 Playmaker", statsSummary: "54 Rec • 712 Yds • 3 TD", simulationWeight: 0.88, touchdownWeight: 0.35 },
    { name: "Mark Andrews", jerseyNumber: 89, position: "TE", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting All-Pro TE", statsSummary: "32 Rec • 390 Yds • 5 TD", simulationWeight: 0.86, touchdownWeight: 0.35 },
    { name: "Rashod Bateman", jerseyNumber: 7, position: "WR", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Starting Outside WR2", statsSummary: "31 Rec • 510 Yds • 4 TD", simulationWeight: 0.75, touchdownWeight: 0.20 },
    { name: "Justin Tucker", jerseyNumber: 9, position: "K", unit: "SPECIAL_TEAMS", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Placekicker", statsSummary: "16/20 FGs", simulationWeight: 0.75, touchdownWeight: 0.0 },
    { name: "Kyle Hamilton", jerseyNumber: 14, position: "S", unit: "DEFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "All-Pro Safety", statsSummary: "68 Tackles • 2 INT • 7 PBU", simulationWeight: 0.92, touchdownWeight: 0.0 },
  ],
  DET: [
    { name: "Jared Goff", jerseyNumber: 16, position: "QB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Quarterback", statsSummary: "2,490 Pass Yds • 20 TD • 72.8% Comp", simulationWeight: 0.95, touchdownWeight: 0.10 },
    { name: "David Montgomery", jerseyNumber: 5, position: "RB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Power RB1", statsSummary: "680 Rush Yds • 9 TD • 4.5 YPC", simulationWeight: 0.88, touchdownWeight: 0.50 },
    { name: "Jahmyr Gibbs", jerseyNumber: 26, position: "RB", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Explosive Dual RB", statsSummary: "720 Rush Yds • 8 TD • 6.0 YPC", simulationWeight: 0.92, touchdownWeight: 0.45 },
    { name: "Amon-Ra St. Brown", jerseyNumber: 14, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "All-Pro Slot Receiver WR1", statsSummary: "65 Rec • 680 Yds • 7 TD", simulationWeight: 0.95, touchdownWeight: 0.45 },
    { name: "Sam LaPorta", jerseyNumber: 87, position: "TE", unit: "OFFENSE", depthOrder: 1, status: "QUESTIONABLE", injuryDetails: "Shoulder - Day-to-Day", roleDescription: "Starting Pro Bowl TE", statsSummary: "30 Rec • 380 Yds • 3 TD", simulationWeight: 0.82, touchdownWeight: 0.25 },
    { name: "Jameson Williams", jerseyNumber: 9, position: "WR", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Starting Deep Threat WR2", statsSummary: "25 Rec • 490 Yds • 3 TD", simulationWeight: 0.80, touchdownWeight: 0.25 },
    { name: "Jake Bates", jerseyNumber: 39, position: "K", unit: "SPECIAL_TEAMS", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Placekicker", statsSummary: "14/14 FGs • 100% FG", simulationWeight: 0.70, touchdownWeight: 0.0 },
    { name: "Brian Branch", jerseyNumber: 32, position: "S", unit: "DEFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Safety / Nickel", statsSummary: "52 Tackles • 4 INT", simulationWeight: 0.90, touchdownWeight: 0.0 },
  ],
  PHI: [
    { name: "Jalen Hurts", jerseyNumber: 1, position: "QB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Dual-Threat QB", statsSummary: "2,280 Pass Yds • 14 TD • 10 Rush TD", simulationWeight: 0.95, touchdownWeight: 0.40 },
    { name: "Saquon Barkley", jerseyNumber: 26, position: "RB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Workhorse RB1", statsSummary: "1,140 Rush Yds • 10 TD • 5.8 YPC", simulationWeight: 1.0, touchdownWeight: 0.60 },
    { name: "Kenneth Gainwell", jerseyNumber: 14, position: "RB", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Change-of-Pace Backup RB", statsSummary: "180 Rush Yds • 1 TD", simulationWeight: 0.60, touchdownWeight: 0.10 },
    { name: "A.J. Brown", jerseyNumber: 11, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "All-Pro Starting WR1", statsSummary: "42 Rec • 690 Yds • 5 TD", simulationWeight: 0.95, touchdownWeight: 0.45 },
    { name: "DeVonta Smith", jerseyNumber: 6, position: "WR", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Starting WR2 Route Specialist", statsSummary: "45 Rec • 540 Yds • 4 TD", simulationWeight: 0.88, touchdownWeight: 0.35 },
    { name: "Dallas Goedert", jerseyNumber: 88, position: "TE", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting TE1", statsSummary: "28 Rec • 330 Yds • 1 TD", simulationWeight: 0.80, touchdownWeight: 0.20 },
    { name: "Jake Elliott", jerseyNumber: 4, position: "K", unit: "SPECIAL_TEAMS", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Placekicker", statsSummary: "16/19 FGs", simulationWeight: 0.70, touchdownWeight: 0.0 },
    { name: "Jalen Carter", jerseyNumber: 98, position: "DT", unit: "DEFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Interior Defensive Tackle Anchor", statsSummary: "4.5 Sacks • 11 TFL", simulationWeight: 0.92, touchdownWeight: 0.0 },
  ],
  SF: [
    { name: "Brock Purdy", jerseyNumber: 13, position: "QB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Quarterback", statsSummary: "2,610 Pass Yds • 15 TD • 8.6 YPA", simulationWeight: 0.94, touchdownWeight: 0.15 },
    { name: "Christian McCaffrey", jerseyNumber: 23, position: "RB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "All-Pro RB1 Starting Back", statsSummary: "185 Rush Yds • 110 Rec Yds • 1 TD", simulationWeight: 1.0, touchdownWeight: 0.65 },
    { name: "Jordan Mason", jerseyNumber: 24, position: "RB", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Power Backup RB", statsSummary: "685 Rush Yds • 3 TD • 5.1 YPC", simulationWeight: 0.75, touchdownWeight: 0.20 },
    { name: "George Kittle", jerseyNumber: 85, position: "TE", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "All-Pro Starting TE", statsSummary: "48 Rec • 620 Yds • 7 TD", simulationWeight: 0.95, touchdownWeight: 0.40 },
    { name: "Deebo Samuel", jerseyNumber: 1, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Dual WR / Rusher", statsSummary: "38 Rec • 530 Yds • 4 TD", simulationWeight: 0.88, touchdownWeight: 0.30 },
    { name: "Jauan Jennings", jerseyNumber: 15, position: "WR", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Starting Physical WR2", statsSummary: "35 Rec • 480 Yds • 4 TD", simulationWeight: 0.80, touchdownWeight: 0.25 },
    { name: "Nick Bosa", jerseyNumber: 97, position: "DE", unit: "DEFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Defensive Player of Year Rusher", statsSummary: "7.0 Sacks • 14 TFL", simulationWeight: 0.98, touchdownWeight: 0.0 },
  ],
  CIN: [
    { name: "Joe Burrow", jerseyNumber: 9, position: "QB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Quarterback", statsSummary: "2,840 Pass Yds • 24 TD • 4 INT", simulationWeight: 1.0, touchdownWeight: 0.10 },
    { name: "Chase Brown", jerseyNumber: 30, position: "RB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting RB1 Workhorse", statsSummary: "580 Rush Yds • 6 TD • 28 Rec", simulationWeight: 0.85, touchdownWeight: 0.50 },
    { name: "Ja'Marr Chase", jerseyNumber: 1, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Triple Crown WR1 Target", statsSummary: "73 Rec • 1,020 Yds • 11 TD", simulationWeight: 1.0, touchdownWeight: 0.55 },
    { name: "Tee Higgins", jerseyNumber: 5, position: "WR", unit: "OFFENSE", depthOrder: 2, status: "QUESTIONABLE", injuryDetails: "Quad - Limited Practice", roleDescription: "Starting Boundary WR2", statsSummary: "32 Rec • 390 Yds • 3 TD", simulationWeight: 0.85, touchdownWeight: 0.30 },
    { name: "Mike Gesicki", jerseyNumber: 88, position: "TE", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Pass-Catching TE", statsSummary: "34 Rec • 383 Yds • 2 TD", simulationWeight: 0.75, touchdownWeight: 0.20 },
    { name: "Trey Hendrickson", jerseyNumber: 91, position: "DE", unit: "DEFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "NFL Sack Leader DE", statsSummary: "11.0 Sacks • 18 QB Hits", simulationWeight: 0.95, touchdownWeight: 0.0 },
  ],
  HOU: [
    { name: "C.J. Stroud", jerseyNumber: 7, position: "QB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Franchise QB", statsSummary: "2,530 Pass Yds • 14 TD • 6 INT", simulationWeight: 0.95, touchdownWeight: 0.10 },
    { name: "Joe Mixon", jerseyNumber: 28, position: "RB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Lead Running Back", statsSummary: "710 Rush Yds • 8 TD • 4.6 YPC", simulationWeight: 0.92, touchdownWeight: 0.55 },
    { name: "Nico Collins", jerseyNumber: 12, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Dominant Starting WR1", statsSummary: "36 Rec • 620 Yds • 4 TD", simulationWeight: 0.98, touchdownWeight: 0.45 },
    { name: "Tank Dell", jerseyNumber: 3, position: "WR", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Starting Slot WR2", statsSummary: "38 Rec • 440 Yds • 2 TD", simulationWeight: 0.82, touchdownWeight: 0.25 },
    { name: "Dalton Schultz", jerseyNumber: 86, position: "TE", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting TE1", statsSummary: "35 Rec • 360 Yds • 1 TD", simulationWeight: 0.78, touchdownWeight: 0.15 },
    { name: "Will Anderson Jr.", jerseyNumber: 51, position: "DE", unit: "DEFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Edge Rusher Star", statsSummary: "7.5 Sacks • 11 TFL", simulationWeight: 0.92, touchdownWeight: 0.0 },
  ],
  DAL: [
    { name: "Dak Prescott", jerseyNumber: 4, position: "QB", unit: "OFFENSE", depthOrder: 1, status: "IR", injuryDetails: "Hamstring (Out for Season)", roleDescription: "Franchise Starting QB (Injured)", statsSummary: "1,978 Pass Yds • 11 TD", simulationWeight: 0.90, touchdownWeight: 0.10 },
    { name: "Cooper Rush", jerseyNumber: 10, position: "QB", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Current Starting QB", statsSummary: "480 Pass Yds • 2 TD", simulationWeight: 0.70, touchdownWeight: 0.05 },
    { name: "Rico Dowdle", jerseyNumber: 23, position: "RB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting RB1", statsSummary: "450 Rush Yds • 2 TD • 24 Rec", simulationWeight: 0.75, touchdownWeight: 0.40 },
    { name: "CeeDee Lamb", jerseyNumber: 88, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "All-Pro Starting Target WR1", statsSummary: "68 Rec • 780 Yds • 4 TD", simulationWeight: 0.98, touchdownWeight: 0.50 },
    { name: "Jake Ferguson", jerseyNumber: 87, position: "TE", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Pro Bowl TE", statsSummary: "42 Rec • 390 Yds • 1 TD", simulationWeight: 0.80, touchdownWeight: 0.20 },
    { name: "Micah Parsons", jerseyNumber: 11, position: "LB", unit: "DEFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Defensive Game-Changer Pass Rusher", statsSummary: "5.5 Sacks • 14 QB Hits", simulationWeight: 0.98, touchdownWeight: 0.0 },
  ],
  GB: [
    { name: "Jordan Love", jerseyNumber: 10, position: "QB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Quarterback", statsSummary: "2,260 Pass Yds • 17 TD • 9.0 YPA", simulationWeight: 0.92, touchdownWeight: 0.10 },
    { name: "Josh Jacobs", jerseyNumber: 8, position: "RB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Bellcow RB1", statsSummary: "840 Rush Yds • 7 TD • 4.8 YPC", simulationWeight: 0.94, touchdownWeight: 0.60 },
    { name: "Jayden Reed", jerseyNumber: 11, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Playmaker WR1", statsSummary: "44 Rec • 650 Yds • 5 TD", simulationWeight: 0.88, touchdownWeight: 0.35 },
    { name: "Christian Watson", jerseyNumber: 9, position: "WR", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Starting Deep Threat WR2", statsSummary: "24 Rec • 380 Yds • 2 TD", simulationWeight: 0.80, touchdownWeight: 0.25 },
    { name: "Tucker Kraft", jerseyNumber: 85, position: "TE", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting TE1", statsSummary: "32 Rec • 410 Yds • 5 TD", simulationWeight: 0.84, touchdownWeight: 0.30 },
    { name: "Xavier McKinney", jerseyNumber: 29, position: "S", unit: "DEFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "NFL Interception Leader Safety", statsSummary: "6 INT • 45 Tackles", simulationWeight: 0.94, touchdownWeight: 0.0 },
  ],
};

// Generic generator for remaining NFL teams
export function generateGenericNflRoster(teamAbbr: string, teamName: string): RawRosterPlayer[] {
  return [
    { name: `${teamName} QB1`, jerseyNumber: 7, position: "QB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Quarterback", statsSummary: "2,350 Pass Yds • 16 TD • 8 INT", simulationWeight: 0.85, touchdownWeight: 0.10 },
    { name: `${teamName} RB1`, jerseyNumber: 24, position: "RB", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Lead RB", statsSummary: "680 Rush Yds • 6 TD • 4.3 YPC", simulationWeight: 0.85, touchdownWeight: 0.55 },
    { name: `${teamName} RB2`, jerseyNumber: 33, position: "RB", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Change of Pace Backup", statsSummary: "260 Rush Yds • 2 TD", simulationWeight: 0.65, touchdownWeight: 0.15 },
    { name: `${teamName} WR1`, jerseyNumber: 11, position: "WR", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Outside WR Target", statsSummary: "52 Rec • 680 Yds • 5 TD", simulationWeight: 0.85, touchdownWeight: 0.40 },
    { name: `${teamName} WR2`, jerseyNumber: 17, position: "WR", unit: "OFFENSE", depthOrder: 2, status: "ACTIVE", roleDescription: "Starting WR2", statsSummary: "38 Rec • 460 Yds • 3 TD", simulationWeight: 0.75, touchdownWeight: 0.25 },
    { name: `${teamName} TE1`, jerseyNumber: 88, position: "TE", unit: "OFFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Tight End", statsSummary: "34 Rec • 360 Yds • 3 TD", simulationWeight: 0.75, touchdownWeight: 0.20 },
    { name: `${teamName} Kicker`, jerseyNumber: 3, position: "K", unit: "SPECIAL_TEAMS", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Placekicker", statsSummary: "16/18 FGs", simulationWeight: 0.70, touchdownWeight: 0.0 },
    { name: `${teamName} Defensive Anchor`, jerseyNumber: 99, position: "DE", unit: "DEFENSE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Edge Rusher", statsSummary: "6.5 Sacks • 9 TFL", simulationWeight: 0.85, touchdownWeight: 0.0 },
  ];
}

// ------------------- NHL ROSTERS -------------------

export const NHL_ROSTERS_SEED: Record<string, RawRosterPlayer[]> = {
  TOR: [
    { name: "Auston Matthews", jerseyNumber: 34, position: "C", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Line Center • PP1 Sniper", statsSummary: "69 Goals (2023-24) • 14 G, 18 A (Current)", simulationWeight: 1.0, goalWeight: 0.38 },
    { name: "Mitch Marner", jerseyNumber: 16, position: "RW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Line Playmaker • PP1 Flank", statsSummary: "10 G, 24 A • 34 Points", simulationWeight: 0.95, goalWeight: 0.18 },
    { name: "Matthew Knies", jerseyNumber: 23, position: "LW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Line Power Forward", statsSummary: "9 G, 7 A • 16 Points", simulationWeight: 0.78, goalWeight: 0.14 },
    { name: "William Nylander", jerseyNumber: 88, position: "RW", unit: "FORWARD", depthOrder: 2, status: "ACTIVE", roleDescription: "Second Line Star • PP1 Trigger", statsSummary: "15 G, 14 A • 29 Points", simulationWeight: 0.98, goalWeight: 0.32 },
    { name: "John Tavares", jerseyNumber: 91, position: "C", unit: "FORWARD", depthOrder: 2, status: "ACTIVE", roleDescription: "Second Line Center • Net Front PP1", statsSummary: "11 G, 11 A • 22 Points", simulationWeight: 0.88, goalWeight: 0.24 },
    { name: "Morgan Rielly", jerseyNumber: 44, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "First Pairing Defense • PP1 Point", statsSummary: "5 G, 17 A • 23:40 TOI/G", simulationWeight: 0.85, goalWeight: 0.10 },
    { name: "Chris Tanev", jerseyNumber: 8, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Shutdown Defenseman • PK1", statsSummary: "48 Blocked Shots • +8 Plus/Minus", simulationWeight: 0.85, goalWeight: 0.02 },
    { name: "Anthony Stolarz", jerseyNumber: 41, position: "G", unit: "GOALIE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Goaltender", statsSummary: ".926 SV% • 2.18 GAA • 9 Wins", simulationWeight: 0.92, goalWeight: 0.0 },
    { name: "Joseph Woll", jerseyNumber: 60, position: "G", unit: "GOALIE", depthOrder: 2, status: "ACTIVE", roleDescription: "Backup Goaltender", statsSummary: ".910 SV% • 2.65 GAA", simulationWeight: 0.80, goalWeight: 0.0 },
  ],
  EDM: [
    { name: "Connor McDavid", jerseyNumber: 97, position: "C", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Generational Center • PP1 Quarterback", statsSummary: "13 G, 27 A • 40 Points • 1.6 PPG", simulationWeight: 1.0, goalWeight: 0.36 },
    { name: "Zach Hyman", jerseyNumber: 18, position: "LW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Line Power Net-Front • PP1", statsSummary: "54 Goals (2023-24) • 9 G, 8 A (Current)", simulationWeight: 0.90, goalWeight: 0.28 },
    { name: "Ryan Nugent-Hopkins", jerseyNumber: 93, position: "LW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Six Forward • PP1 Half-Wall", statsSummary: "7 G, 18 A • 25 Points", simulationWeight: 0.85, goalWeight: 0.15 },
    { name: "Leon Draisaitl", jerseyNumber: 29, position: "C", unit: "FORWARD", depthOrder: 2, status: "ACTIVE", roleDescription: "Second Line Superstar • PP1 Right Flank", statsSummary: "16 G, 17 A • 33 Points", simulationWeight: 1.0, goalWeight: 0.38 },
    { name: "Viktor Arvidsson", jerseyNumber: 33, position: "RW", unit: "FORWARD", depthOrder: 2, status: "QUESTIONABLE", injuryDetails: "Lower-Body - Day-to-Day", roleDescription: "Second Line Winger", statsSummary: "5 G, 7 A • 12 Points", simulationWeight: 0.78, goalWeight: 0.14 },
    { name: "Evan Bouchard", jerseyNumber: 2, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "First Pairing Defense • PP1 Point Bomb", statsSummary: "7 G, 16 A • 23 Points • 24:10 TOI", simulationWeight: 0.92, goalWeight: 0.16 },
    { name: "Mattias Ekholm", jerseyNumber: 14, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Pairing 2-Way Defenseman", statsSummary: "4 G, 12 A • +11 Plus/Minus", simulationWeight: 0.88, goalWeight: 0.06 },
    { name: "Stuart Skinner", jerseyNumber: 74, position: "G", unit: "GOALIE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Goaltender", statsSummary: ".904 SV% • 2.82 GAA • 11 Wins", simulationWeight: 0.85, goalWeight: 0.0 },
  ],
  COL: [
    { name: "Nathan MacKinnon", jerseyNumber: 29, position: "C", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "MVP Center • PP1 Engine", statsSummary: "12 G, 30 A • 42 Points (NHL Leader)", simulationWeight: 1.0, goalWeight: 0.38 },
    { name: "Mikko Rantanen", jerseyNumber: 96, position: "RW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Line All-Star Winger • PP1", statsSummary: "15 G, 18 A • 33 Points", simulationWeight: 0.98, goalWeight: 0.35 },
    { name: "Cale Makar", jerseyNumber: 8, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "Norris Trophy Defenseman • PP1 Point", statsSummary: "8 G, 23 A • 31 Points • 25:30 TOI", simulationWeight: 1.0, goalWeight: 0.22 },
    { name: "Casey Mittelstadt", jerseyNumber: 37, position: "C", unit: "FORWARD", depthOrder: 2, status: "ACTIVE", roleDescription: "Second Line Center", statsSummary: "8 G, 11 A • 19 Points", simulationWeight: 0.82, goalWeight: 0.16 },
    { name: "Devon Toews", jerseyNumber: 7, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Pairing Two-Way D", statsSummary: "2 G, 12 A • 24:00 TOI", simulationWeight: 0.85, goalWeight: 0.05 },
    { name: "Alexandar Georgiev", jerseyNumber: 40, position: "G", unit: "GOALIE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Goaltender", statsSummary: ".888 SV% • 3.25 GAA", simulationWeight: 0.80, goalWeight: 0.0 },
  ],
  NYR: [
    { name: "Artemi Panarin", jerseyNumber: 10, position: "LW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Superstar Winger • PP1", statsSummary: "12 G, 17 A • 29 Points", simulationWeight: 0.98, goalWeight: 0.35 },
    { name: "Mika Zibanejad", jerseyNumber: 93, position: "C", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Line Center • PP1 One-Timer", statsSummary: "6 G, 14 A • 20 Points", simulationWeight: 0.90, goalWeight: 0.22 },
    { name: "Chris Kreider", jerseyNumber: 20, position: "LW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Line Net-Front • PP1 Screen", statsSummary: "10 G, 3 A • 13 Points", simulationWeight: 0.88, goalWeight: 0.26 },
    { name: "Adam Fox", jerseyNumber: 23, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "Norris Winning Defenseman • PP1 Point", statsSummary: "2 G, 18 A • 20 Points", simulationWeight: 0.95, goalWeight: 0.08 },
    { name: "Alexis Lafrenière", jerseyNumber: 13, position: "RW", unit: "FORWARD", depthOrder: 2, status: "ACTIVE", roleDescription: "Second Line Dynamic Winger", statsSummary: "8 G, 10 A • 18 Points", simulationWeight: 0.84, goalWeight: 0.20 },
    { name: "Igor Shesterkin", jerseyNumber: 31, position: "G", unit: "GOALIE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Vezina Goaltender", statsSummary: ".921 SV% • 2.45 GAA • 10 Wins", simulationWeight: 0.98, goalWeight: 0.0 },
  ],
  BOS: [
    { name: "David Pastrnak", jerseyNumber: 88, position: "RW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Superstar Winger • PP1 Sniper", statsSummary: "10 G, 12 A • 22 Points", simulationWeight: 0.98, goalWeight: 0.38 },
    { name: "Brad Marchand", jerseyNumber: 63, position: "LW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Captain & Top Line Winger • PP1", statsSummary: "7 G, 11 A • 18 Points", simulationWeight: 0.92, goalWeight: 0.24 },
    { name: "Elias Lindholm", jerseyNumber: 28, position: "C", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting 1st Line Center", statsSummary: "4 G, 10 A • 14 Points", simulationWeight: 0.85, goalWeight: 0.16 },
    { name: "Charlie McAvoy", jerseyNumber: 73, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Defense Anchor • PP1", statsSummary: "4 G, 9 A • 23:50 TOI", simulationWeight: 0.92, goalWeight: 0.10 },
    { name: "Jeremy Swayman", jerseyNumber: 1, position: "G", unit: "GOALIE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Goaltender", statsSummary: ".898 SV% • 2.95 GAA", simulationWeight: 0.90, goalWeight: 0.0 },
  ],
  FLA: [
    { name: "Aleksander Barkov", jerseyNumber: 16, position: "C", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Selke Trophy Captain & Center", statsSummary: "6 G, 15 A • 21 Points • +12", simulationWeight: 0.98, goalWeight: 0.26 },
    { name: "Matthew Tkachuk", jerseyNumber: 19, position: "RW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Line Power Winger • PP1", statsSummary: "9 G, 12 A • 21 Points", simulationWeight: 0.96, goalWeight: 0.32 },
    { name: "Sam Reinhart", jerseyNumber: 13, position: "RW", unit: "FORWARD", depthOrder: 2, status: "ACTIVE", roleDescription: "Goal Scoring Star • PP1 Net-Front", statsSummary: "14 G, 14 A • 28 Points", simulationWeight: 0.96, goalWeight: 0.36 },
    { name: "Aaron Ekblad", jerseyNumber: 5, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Top Defenseman", statsSummary: "3 G, 11 A • 23:20 TOI", simulationWeight: 0.88, goalWeight: 0.08 },
    { name: "Sergei Bobrovsky", jerseyNumber: 72, position: "G", unit: "GOALIE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Vezina Goaltender", statsSummary: ".902 SV% • 2.78 GAA • 10 Wins", simulationWeight: 0.92, goalWeight: 0.0 },
  ],
};

// Generic generator for remaining NHL teams
export function generateGenericNhlRoster(teamAbbr: string, teamName: string): RawRosterPlayer[] {
  return [
    { name: `${teamName} Top Center`, jerseyNumber: 19, position: "C", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "1st Line Center • PP1", statsSummary: "9 G, 15 A • 24 Points", simulationWeight: 0.88, goalWeight: 0.28 },
    { name: `${teamName} Top Winger`, jerseyNumber: 88, position: "LW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "1st Line Sniper • PP1", statsSummary: "12 G, 10 A • 22 Points", simulationWeight: 0.88, goalWeight: 0.32 },
    { name: `${teamName} RW Star`, jerseyNumber: 22, position: "RW", unit: "FORWARD", depthOrder: 1, status: "ACTIVE", roleDescription: "1st Line Playmaker", statsSummary: "7 G, 14 A • 21 Points", simulationWeight: 0.82, goalWeight: 0.20 },
    { name: `${teamName} 2nd Line Center`, jerseyNumber: 11, position: "C", unit: "FORWARD", depthOrder: 2, status: "ACTIVE", roleDescription: "2nd Line Center", statsSummary: "6 G, 11 A • 17 Points", simulationWeight: 0.78, goalWeight: 0.16 },
    { name: `${teamName} Top Defenseman`, jerseyNumber: 5, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Pairing D • PP1 Point", statsSummary: "4 G, 14 A • 23:30 TOI", simulationWeight: 0.85, goalWeight: 0.08 },
    { name: `${teamName} Shutdown D`, jerseyNumber: 27, position: "D", unit: "DEFENSEMAN", depthOrder: 1, status: "ACTIVE", roleDescription: "Top Pairing Shutdown D • PK1", statsSummary: "1 G, 7 A • 42 Blocks", simulationWeight: 0.80, goalWeight: 0.02 },
    { name: `${teamName} Starting Goalie`, jerseyNumber: 30, position: "G", unit: "GOALIE", depthOrder: 1, status: "ACTIVE", roleDescription: "Starting Goaltender", statsSummary: ".910 SV% • 2.65 GAA • 8 Wins", simulationWeight: 0.88, goalWeight: 0.0 },
  ];
}
