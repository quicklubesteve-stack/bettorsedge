export interface TeamBrand {
  abbr: string;
  name: string;
  city: string;
  nickname: string;
  league: "NFL" | "NHL";
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  conference: string;
  division: string;
}

export const TEAM_BRANDING: Record<string, TeamBrand> = {
  // NFL TEAMS
  ARI: { abbr: "ARI", name: "Arizona Cardinals", city: "Arizona", nickname: "Cardinals", league: "NFL", primaryColor: "#97233F", secondaryColor: "#000000", textColor: "#FFFFFF", conference: "NFC", division: "West" },
  ATL: { abbr: "ATL", name: "Atlanta Falcons", city: "Atlanta", nickname: "Falcons", league: "NFL", primaryColor: "#A71930", secondaryColor: "#000000", textColor: "#FFFFFF", conference: "NFC", division: "South" },
  BAL: { abbr: "BAL", name: "Baltimore Ravens", city: "Baltimore", nickname: "Ravens", league: "NFL", primaryColor: "#241773", secondaryColor: "#9E7C0C", textColor: "#FFFFFF", conference: "AFC", division: "North" },
  BUF: { abbr: "BUF", name: "Buffalo Bills", city: "Buffalo", nickname: "Bills", league: "NFL", primaryColor: "#00338D", secondaryColor: "#C60C30", textColor: "#FFFFFF", conference: "AFC", division: "East" },
  CAR: { abbr: "CAR", name: "Carolina Panthers", city: "Carolina", nickname: "Panthers", league: "NFL", primaryColor: "#0085CA", secondaryColor: "#101820", textColor: "#FFFFFF", conference: "NFC", division: "South" },
  CHI: { abbr: "CHI", name: "Chicago Bears", city: "Chicago", nickname: "Bears", league: "NFL", primaryColor: "#0B162A", secondaryColor: "#C83803", textColor: "#FFFFFF", conference: "NFC", division: "North" },
  CIN: { abbr: "CIN", name: "Cincinnati Bengals", city: "Cincinnati", nickname: "Bengals", league: "NFL", primaryColor: "#FB4F14", secondaryColor: "#000000", textColor: "#FFFFFF", conference: "AFC", division: "North" },
  CLE: { abbr: "CLE", name: "Cleveland Browns", city: "Cleveland", nickname: "Browns", league: "NFL", primaryColor: "#311D00", secondaryColor: "#FF3C00", textColor: "#FFFFFF", conference: "AFC", division: "North" },
  DAL: { abbr: "DAL", name: "Dallas Cowboys", city: "Dallas", nickname: "Cowboys", league: "NFL", primaryColor: "#003594", secondaryColor: "#041E42", textColor: "#FFFFFF", conference: "NFC", division: "East" },
  DEN: { abbr: "DEN", name: "Denver Broncos", city: "Denver", nickname: "Broncos", league: "NFL", primaryColor: "#FB4F14", secondaryColor: "#002244", textColor: "#FFFFFF", conference: "AFC", division: "West" },
  DET: { abbr: "DET", name: "Detroit Lions", city: "Detroit", nickname: "Lions", league: "NFL", primaryColor: "#0076B6", secondaryColor: "#B0B7BC", textColor: "#FFFFFF", conference: "NFC", division: "North" },
  GB: { abbr: "GB", name: "Green Bay Packers", city: "Green Bay", nickname: "Packers", league: "NFL", primaryColor: "#203731", secondaryColor: "#FFB612", textColor: "#FFFFFF", conference: "NFC", division: "North" },
  HOU: { abbr: "HOU", name: "Houston Texans", city: "Houston", nickname: "Texans", league: "NFL", primaryColor: "#03202F", secondaryColor: "#A71930", textColor: "#FFFFFF", conference: "AFC", division: "South" },
  IND: { abbr: "IND", name: "Indianapolis Colts", city: "Indianapolis", nickname: "Colts", league: "NFL", primaryColor: "#002C5F", secondaryColor: "#A2AAAD", textColor: "#FFFFFF", conference: "AFC", division: "South" },
  JAX: { abbr: "JAX", name: "Jacksonville Jaguars", city: "Jacksonville", nickname: "Jaguars", league: "NFL", primaryColor: "#006778", secondaryColor: "#D7A22A", textColor: "#FFFFFF", conference: "AFC", division: "South" },
  KC: { abbr: "KC", name: "Kansas City Chiefs", city: "Kansas City", nickname: "Chiefs", league: "NFL", primaryColor: "#E31837", secondaryColor: "#FFB81C", textColor: "#FFFFFF", conference: "AFC", division: "West" },
  LAC: { abbr: "LAC", name: "Los Angeles Chargers", city: "Los Angeles", nickname: "Chargers", league: "NFL", primaryColor: "#0080C6", secondaryColor: "#FFC20E", textColor: "#FFFFFF", conference: "AFC", division: "West" },
  LAR: { abbr: "LAR", name: "Los Angeles Rams", city: "Los Angeles", nickname: "Rams", league: "NFL", primaryColor: "#003594", secondaryColor: "#FFA300", textColor: "#FFFFFF", conference: "NFC", division: "West" },
  LV: { abbr: "LV", name: "Las Vegas Raiders", city: "Las Vegas", nickname: "Raiders", league: "NFL", primaryColor: "#000000", secondaryColor: "#A5ACAF", textColor: "#FFFFFF", conference: "AFC", division: "West" },
  MIA: { abbr: "MIA", name: "Miami Dolphins", city: "Miami", nickname: "Dolphins", league: "NFL", primaryColor: "#008E97", secondaryColor: "#FC4C02", textColor: "#FFFFFF", conference: "AFC", division: "East" },
  MIN: { abbr: "MIN", name: "Minnesota Vikings", city: "Minnesota", nickname: "Vikings", league: "NFL", primaryColor: "#4F2683", secondaryColor: "#FFC62F", textColor: "#FFFFFF", conference: "NFC", division: "North" },
  NE: { abbr: "NE", name: "New England Patriots", city: "New England", nickname: "Patriots", league: "NFL", primaryColor: "#002244", secondaryColor: "#C60C30", textColor: "#FFFFFF", conference: "AFC", division: "East" },
  NO: { abbr: "NO", name: "New Orleans Saints", city: "New Orleans", nickname: "Saints", league: "NFL", primaryColor: "#D3BC8D", secondaryColor: "#101820", textColor: "#101820", conference: "NFC", division: "South" },
  NYG: { abbr: "NYG", name: "New York Giants", city: "New York", nickname: "Giants", league: "NFL", primaryColor: "#0B2265", secondaryColor: "#A71930", textColor: "#FFFFFF", conference: "NFC", division: "East" },
  NYJ: { abbr: "NYJ", name: "New York Jets", city: "New York", nickname: "Jets", league: "NFL", primaryColor: "#125740", secondaryColor: "#000000", textColor: "#FFFFFF", conference: "AFC", division: "East" },
  PHI: { abbr: "PHI", name: "Philadelphia Eagles", city: "Philadelphia", nickname: "Eagles", league: "NFL", primaryColor: "#004C54", secondaryColor: "#A5ACAF", textColor: "#FFFFFF", conference: "NFC", division: "East" },
  PIT: { abbr: "PIT", name: "Pittsburgh Steelers", city: "Pittsburgh", nickname: "Steelers", league: "NFL", primaryColor: "#101820", secondaryColor: "#FFB612", textColor: "#FFB612", conference: "AFC", division: "North" },
  SEA: { abbr: "SEA", name: "Seattle Seahawks", city: "Seattle", nickname: "Seahawks", league: "NFL", primaryColor: "#002244", secondaryColor: "#69BE28", textColor: "#FFFFFF", conference: "NFC", division: "West" },
  SF: { abbr: "SF", name: "San Francisco 49ers", city: "San Francisco", nickname: "49ers", league: "NFL", primaryColor: "#AA0000", secondaryColor: "#B3995D", textColor: "#FFFFFF", conference: "NFC", division: "West" },
  TB: { abbr: "TB", name: "Tampa Bay Buccaneers", city: "Tampa Bay", nickname: "Buccaneers", league: "NFL", primaryColor: "#D50A0A", secondaryColor: "#0A0A08", textColor: "#FFFFFF", conference: "NFC", division: "South" },
  TEN: { abbr: "TEN", name: "Tennessee Titans", city: "Tennessee", nickname: "Titans", league: "NFL", primaryColor: "#0C2340", secondaryColor: "#4B92DB", textColor: "#FFFFFF", conference: "AFC", division: "South" },
  WAS: { abbr: "WAS", name: "Washington Commanders", city: "Washington", nickname: "Commanders", league: "NFL", primaryColor: "#5A1414", secondaryColor: "#FFB612", textColor: "#FFFFFF", conference: "NFC", division: "East" },

  // NHL TEAMS
  ANA: { abbr: "ANA", name: "Anaheim Ducks", city: "Anaheim", nickname: "Ducks", league: "NHL", primaryColor: "#F47A38", secondaryColor: "#B9975B", textColor: "#FFFFFF", conference: "Western", division: "Pacific" },
  BOS: { abbr: "BOS", name: "Boston Bruins", city: "Boston", nickname: "Bruins", league: "NHL", primaryColor: "#FFB81C", secondaryColor: "#000000", textColor: "#000000", conference: "Eastern", division: "Atlantic" },
  BUF_NHL: { abbr: "BUF", name: "Buffalo Sabres", city: "Buffalo", nickname: "Sabres", league: "NHL", primaryColor: "#002654", secondaryColor: "#FCB514", textColor: "#FFFFFF", conference: "Eastern", division: "Atlantic" },
  CAR_NHL: { abbr: "CAR", name: "Carolina Hurricanes", city: "Carolina", nickname: "Hurricanes", league: "NHL", primaryColor: "#CC0000", secondaryColor: "#000000", textColor: "#FFFFFF", conference: "Eastern", division: "Metropolitan" },
  CBJ: { abbr: "CBJ", name: "Columbus Blue Jackets", city: "Columbus", nickname: "Blue Jackets", league: "NHL", primaryColor: "#002654", secondaryColor: "#CE1126", textColor: "#FFFFFF", conference: "Eastern", division: "Metropolitan" },
  CGY: { abbr: "CGY", name: "Calgary Flames", city: "Calgary", nickname: "Flames", league: "NHL", primaryColor: "#C8102E", secondaryColor: "#F1BE48", textColor: "#FFFFFF", conference: "Western", division: "Pacific" },
  CHI_NHL: { abbr: "CHI", name: "Chicago Blackhawks", city: "Chicago", nickname: "Blackhawks", league: "NHL", primaryColor: "#CF0A2C", secondaryColor: "#000000", textColor: "#FFFFFF", conference: "Western", division: "Central" },
  COL: { abbr: "COL", name: "Colorado Avalanche", city: "Colorado", nickname: "Avalanche", league: "NHL", primaryColor: "#6F263D", secondaryColor: "#236192", textColor: "#FFFFFF", conference: "Western", division: "Central" },
  DAL_NHL: { abbr: "DAL", name: "Dallas Stars", city: "Dallas", nickname: "Stars", league: "NHL", primaryColor: "#006847", secondaryColor: "#8F8F8C", textColor: "#FFFFFF", conference: "Western", division: "Central" },
  DET_NHL: { abbr: "DET", name: "Detroit Red Wings", city: "Detroit", nickname: "Red Wings", league: "NHL", primaryColor: "#CE1126", secondaryColor: "#FFFFFF", textColor: "#FFFFFF", conference: "Eastern", division: "Atlantic" },
  EDM: { abbr: "EDM", name: "Edmonton Oilers", city: "Edmonton", nickname: "Oilers", league: "NHL", primaryColor: "#041E42", secondaryColor: "#FF4C00", textColor: "#FFFFFF", conference: "Western", division: "Pacific" },
  FLA: { abbr: "FLA", name: "Florida Panthers", city: "Florida", nickname: "Panthers", league: "NHL", primaryColor: "#041E42", secondaryColor: "#C8102E", textColor: "#FFFFFF", conference: "Eastern", division: "Atlantic" },
  LAK: { abbr: "LAK", name: "Los Angeles Kings", city: "Los Angeles", nickname: "Kings", league: "NHL", primaryColor: "#111111", secondaryColor: "#A2AAAD", textColor: "#FFFFFF", conference: "Western", division: "Pacific" },
  MIN_NHL: { abbr: "MIN", name: "Minnesota Wild", city: "Minnesota", nickname: "Wild", league: "NHL", primaryColor: "#154734", secondaryColor: "#A6192E", textColor: "#FFFFFF", conference: "Western", division: "Central" },
  MTL: { abbr: "MTL", name: "Montreal Canadiens", city: "Montreal", nickname: "Canadiens", league: "NHL", primaryColor: "#AF1E2D", secondaryColor: "#192168", textColor: "#FFFFFF", conference: "Eastern", division: "Atlantic" },
  NJD: { abbr: "NJD", name: "New Jersey Devils", city: "New Jersey", nickname: "Devils", league: "NHL", primaryColor: "#CE1126", secondaryColor: "#000000", textColor: "#FFFFFF", conference: "Eastern", division: "Metropolitan" },
  NSH: { abbr: "NSH", name: "Nashville Predators", city: "Nashville", nickname: "Predators", league: "NHL", primaryColor: "#FFB81C", secondaryColor: "#041E42", textColor: "#041E42", conference: "Western", division: "Central" },
  NYI: { abbr: "NYI", name: "New York Islanders", city: "New York", nickname: "Islanders", league: "NHL", primaryColor: "#00539B", secondaryColor: "#F47920", textColor: "#FFFFFF", conference: "Eastern", division: "Metropolitan" },
  NYR: { abbr: "NYR", name: "New York Rangers", city: "New York", nickname: "Rangers", league: "NHL", primaryColor: "#0038A8", secondaryColor: "#CE1126", textColor: "#FFFFFF", conference: "Eastern", division: "Metropolitan" },
  OTT: { abbr: "OTT", name: "Ottawa Senators", city: "Ottawa", nickname: "Senators", league: "NHL", primaryColor: "#DA1A32", secondaryColor: "#D69F3D", textColor: "#FFFFFF", conference: "Eastern", division: "Atlantic" },
  PHI_NHL: { abbr: "PHI", name: "Philadelphia Flyers", city: "Philadelphia", nickname: "Flyers", league: "NHL", primaryColor: "#F74902", secondaryColor: "#000000", textColor: "#FFFFFF", conference: "Eastern", division: "Metropolitan" },
  PIT_NHL: { abbr: "PIT", name: "Pittsburgh Penguins", city: "Pittsburgh", nickname: "Penguins", league: "NHL", primaryColor: "#000000", secondaryColor: "#FCB514", textColor: "#FCB514", conference: "Eastern", division: "Metropolitan" },
  SEA_NHL: { abbr: "SEA", name: "Seattle Kraken", city: "Seattle", nickname: "Kraken", league: "NHL", primaryColor: "#001628", secondaryColor: "#99D9D9", textColor: "#99D9D9", conference: "Western", division: "Pacific" },
  SJS: { abbr: "SJS", name: "San Jose Sharks", city: "San Jose", nickname: "Sharks", league: "NHL", primaryColor: "#006D75", secondaryColor: "#EA7200", textColor: "#FFFFFF", conference: "Western", division: "Pacific" },
  STL: { abbr: "STL", name: "St. Louis Blues", city: "St. Louis", nickname: "Blues", league: "NHL", primaryColor: "#002F87", secondaryColor: "#FCB514", textColor: "#FFFFFF", conference: "Western", division: "Central" },
  TBL: { abbr: "TBL", name: "Tampa Bay Lightning", city: "Tampa Bay", nickname: "Lightning", league: "NHL", primaryColor: "#002868", secondaryColor: "#FFFFFF", textColor: "#FFFFFF", conference: "Eastern", division: "Atlantic" },
  TOR: { abbr: "TOR", name: "Toronto Maple Leafs", city: "Toronto", nickname: "Maple Leafs", league: "NHL", primaryColor: "#00205B", secondaryColor: "#FFFFFF", textColor: "#FFFFFF", conference: "Eastern", division: "Atlantic" },
  UTA: { abbr: "UTA", name: "Utah Hockey Club", city: "Utah", nickname: "Hockey Club", league: "NHL", primaryColor: "#7AC142", secondaryColor: "#010101", textColor: "#FFFFFF", conference: "Western", division: "Central" },
  VAN: { abbr: "VAN", name: "Vancouver Canucks", city: "Vancouver", nickname: "Canucks", league: "NHL", primaryColor: "#00205B", secondaryColor: "#00843D", textColor: "#FFFFFF", conference: "Western", division: "Pacific" },
  VGK: { abbr: "VGK", name: "Vegas Golden Knights", city: "Vegas", nickname: "Golden Knights", league: "NHL", primaryColor: "#B4975A", secondaryColor: "#333F48", textColor: "#FFFFFF", conference: "Western", division: "Pacific" },
  WPG: { abbr: "WPG", name: "Winnipeg Jets", city: "Winnipeg", nickname: "Jets", league: "NHL", primaryColor: "#041E42", secondaryColor: "#004C97", textColor: "#FFFFFF", conference: "Western", division: "Central" },
  WSH: { abbr: "WSH", name: "Washington Capitals", city: "Washington", nickname: "Capitals", league: "NHL", primaryColor: "#041E42", secondaryColor: "#C8102E", textColor: "#FFFFFF", conference: "Eastern", division: "Metropolitan" },
};

export function getTeamBrand(abbr: string, league?: "NFL" | "NHL"): TeamBrand {
  if (league === "NHL") {
    if (TEAM_BRANDING[`${abbr}_NHL`]) return TEAM_BRANDING[`${abbr}_NHL`];
  }
  if (TEAM_BRANDING[abbr]) return TEAM_BRANDING[abbr];

  return {
    abbr,
    name: abbr,
    city: abbr,
    nickname: abbr,
    league: league || "NFL",
    primaryColor: "#1E293B",
    secondaryColor: "#10B981",
    textColor: "#FFFFFF",
    conference: "Conf",
    division: "Div",
  };
}
