const fs = require("fs");

const parsed = require("./parsed-nfl-standings.json");

const divMap = [
  { conf: "AFC", div: "East" },
  { conf: "AFC", div: "North" },
  { conf: "AFC", div: "South" },
  { conf: "AFC", div: "West" },
  { conf: "NFC", div: "East" },
  { conf: "NFC", div: "North" },
  { conf: "NFC", div: "South" },
  { conf: "NFC", div: "West" },
];

const teamNameAbbrMap = {
  "Buffalo Bills": "BUF",
  "New England Patriots": "NE",
  "New York Jets": "NYJ",
  "Miami Dolphins": "MIA",
  "Cincinnati Bengals": "CIN",
  "Pittsburgh Steelers": "PIT",
  "Cleveland Browns": "CLE",
  "Baltimore Ravens": "BAL",
  "Jacksonville Jaguars": "JAX",
  "Houston Texans": "HOU",
  "Indianapolis Colts": "IND",
  "Tennessee Titans": "TEN",
  "Kansas City Chiefs": "KC",
  "Denver Broncos": "DEN",
  "Las Vegas Raiders": "LV",
  "Los Angeles Chargers": "LAC",
  "New York Giants": "NYG",
  "Dallas Cowboys": "DAL",
  "Washington Commanders": "WAS",
  "Philadelphia Eagles": "PHI",
  "Detroit Lions": "DET",
  "Minnesota Vikings": "MIN",
  "Chicago Bears": "CHI",
  "Green Bay Packers": "GB",
  "Carolina Panthers": "CAR",
  "Tampa Bay Buccaneers": "TB",
  "New Orleans Saints": "NO",
  "Atlanta Falcons": "ATL",
  "San Francisco 49ers": "SF",
  "Seattle Seahawks": "SEA",
  "Los Angeles Rams": "LAR",
  "Arizona Cardinals": "ARI",
};

const nflStandings = [];

parsed.forEach((t, i) => {
  const divIndex = Math.floor(i / 4);
  const divInfo = divMap[divIndex];
  
  // Clean raw team name: e.g. "Buffalo Bills Bills" -> "Buffalo Bills"
  const rawName = t.cells[0];
  let cleanName = rawName;
  for (const name of Object.keys(teamNameAbbrMap)) {
    if (rawName.startsWith(name)) {
      cleanName = name;
      break;
    }
  }

  const abbr = teamNameAbbrMap[cleanName] || "UNK";
  const w = parseInt(t.cells[1], 10);
  const l = parseInt(t.cells[2], 10);
  const ties = parseInt(t.cells[3], 10);
  const pct = parseFloat(t.cells[4]);
  const pf = parseInt(t.cells[5], 10);
  const pa = parseInt(t.cells[6], 10);
  const net = parseInt(t.cells[7], 10);
  const home = t.cells[8].replace(/\s+/g, "");
  const road = t.cells[9].replace(/\s+/g, "");
  const divRec = t.cells[10].replace(/\s+/g, "");
  const confRec = t.cells[12].replace(/\s+/g, "");
  
  // Format streak: "5W" -> "W5", "2L" -> "L2"
  const rawStrk = t.cells[15] || "";
  const sm = rawStrk.match(/(\d+)([WL])/);
  const strk = sm ? `${sm[2]}${sm[1]}` : rawStrk;

  const last5 = t.cells[16] ? t.cells[16].replace(/\s+/g, "") : "3-2";

  nflStandings.push({
    team: abbr,
    name: cleanName,
    conf: divInfo.conf,
    div: divInfo.div,
    divRank: (i % 4) + 1,
    w,
    l,
    t: ties,
    pct,
    pf,
    pa,
    net,
    home,
    away: road,
    divRec,
    confRec,
    strk,
    l5: last5,
  });
});

console.log("Extracted NFL Standings count:", nflStandings.length);
fs.writeFileSync("scripts/nfl-2026-extracted.json", JSON.stringify(nflStandings, null, 2));
