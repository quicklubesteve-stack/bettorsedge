const fs = require("fs");

const html = fs.readFileSync("scripts/nfl-standings.html", "utf8");

// Extract headers and tables
const divisionHeaders = [];
const headerRegex = /<div class="d3-o-section-sub-title">([\s\S]*?)<\/div>/g;
let m;
while ((m = headerRegex.exec(html)) !== null) {
  divisionHeaders.push(m[1].trim());
}

console.log("Division headers:", divisionHeaders);

// Extract table bodies
const tables = html.match(/<table[\s\S]*?<\/table>/g) || [];

const allTeams = [];

tables.forEach((tableHtml, tableIdx) => {
  const divName = divisionHeaders[tableIdx] || `Division ${tableIdx + 1}`;
  
  // Extract rows
  const rows = tableHtml.match(/<tr[\s\S]*?<\/tr>/g) || [];
  
  // Skip header row
  rows.slice(1).forEach((rowHtml, rowIdx) => {
    // Strip tags from each td / th
    const cells = [];
    const cellRegex = /<(?:td|th)[\s\S]*?>([\s\S]*?)<\/(?:td|th)>/g;
    let cm;
    while ((cm = cellRegex.exec(rowHtml)) !== null) {
      const text = cm[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      cells.push(text);
    }
    
    if (cells.length > 0) {
      allTeams.push({
        division: divName,
        divRank: rowIdx + 1,
        cells,
      });
    }
  });
});

console.log(`Parsed ${allTeams.length} teams across ${tables.length} divisions.`);
console.log("Sample team 0:", allTeams[0]);
console.log("Sample team 1:", allTeams[1]);
fs.writeFileSync("scripts/parsed-nfl-standings.json", JSON.stringify(allTeams, null, 2));
