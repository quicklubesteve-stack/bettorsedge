const fs = require("fs");

const newStandingsHtml = `    <div id="tab-standings" class="tab-content">
      <div class="hero">
        <div class="badge" style="color: #34d399; border-color: rgba(16, 185, 129, 0.4); background: rgba(16, 185, 129, 0.1);">Official NFL.com & NHL.com References</div>
        <h1>Complete Official Standings (All 32 Teams)</h1>
        <p>Full 32-team standings direct from <strong>nfl.com/standings</strong> and <strong>nhl.com/standings</strong> with divisional records, point/goal differentials, home/away splits, streaks, and playoff seeds.</p>
      </div>

      <!-- Controls: League Selector, View Mode, Search -->
      <div style="background: rgba(15, 23, 42, 0.95); border: 1px solid var(--card-border); border-radius: 16px; padding: 16px; margin-bottom: 20px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px;">
        <!-- League Toggle -->
        <div style="display: flex; gap: 8px;">
          <button id="standingsLeagueNfl" onclick="setStandingsLeague('NFL')" class="btn" style="background: var(--primary); color: black; font-weight: 800; font-size: 12px; padding: 8px 16px; border-radius: 10px;">🏈 NFL (32 Teams - nfl.com)</button>
          <button id="standingsLeagueNhl" onclick="setStandingsLeague('NHL')" class="btn" style="background: #0f172a; color: #94a3b8; font-weight: 800; font-size: 12px; padding: 8px 16px; border-radius: 10px; border: 1px solid var(--card-border);">🏒 NHL (32 Teams - nhl.com)</button>
        </div>

        <!-- View Mode Buttons -->
        <div style="display: flex; gap: 6px; background: #030712; padding: 4px; border-radius: 10px; border: 1px solid #1e293b;">
          <button id="viewBtnDiv" onclick="setStandingsView('DIVISION')" class="btn" style="background: #1e293b; color: white; font-size: 11px; font-weight: 800; padding: 6px 12px; border-radius: 6px;">Divisional</button>
          <button id="viewBtnConf" onclick="setStandingsView('CONFERENCE')" class="btn" style="background: transparent; color: #94a3b8; font-size: 11px; font-weight: 800; padding: 6px 12px; border-radius: 6px;">Conference (1–16)</button>
          <button id="viewBtnLeague" onclick="setStandingsView('LEAGUE')" class="btn" style="background: transparent; color: #94a3b8; font-size: 11px; font-weight: 800; padding: 6px 12px; border-radius: 6px;">League Overall (1–32)</button>
        </div>

        <!-- Search Input -->
        <div style="min-width: 200px;">
          <input type="text" id="standingsSearch" oninput="renderFullStandings()" placeholder="Search team or division..." style="width: 100%; padding: 8px 12px; border-radius: 8px; background: #030712; border: 1px solid #334155; color: white; font-size: 12px;">
        </div>
      </div>

      <!-- Standings Render Target -->
      <div id="fullStandingsTarget">
        <!-- Rendered live by renderFullStandings() in JS -->
      </div>
    </div>`;

const htmlPath = ".cloudflare-deploy/index.html";
let html = fs.readFileSync(htmlPath, "utf8").replace(/\r\n/g, "\n");

const startStr = '<div id="tab-standings" class="tab-content">';
const endMarker = "</div>\n    </div>\n\n  </div>";

const startIdx = html.indexOf(startStr);
const endIdx = html.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
  const before = html.substring(0, startIdx);
  const after = html.substring(endIdx + "</div>\n    </div>".length);
  html = before + newStandingsHtml + after;
  fs.writeFileSync(htmlPath, html, "utf8");
  console.log("Successfully replaced #tab-standings HTML!");
} else {
  console.error("Could not find start or end index:", startIdx, endIdx);
}
