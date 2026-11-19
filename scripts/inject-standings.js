const fs = require("fs");

const standingsData = JSON.parse(fs.readFileSync("scripts/all-standings-data.json", "utf8"));

const jsSnippet = `
    // ========================================================
    // FULL OFFICIAL STANDINGS ENGINE (NFL.COM & NHL.COM)
    // ========================================================
    var FULL_STANDINGS_DATA = ${JSON.stringify(standingsData)};

    var currentStandingsLeague = 'NFL';
    var currentStandingsView = 'DIVISION';

    function setStandingsLeague(league) {
      currentStandingsLeague = league;
      var btnNfl = document.getElementById('standingsLeagueNfl');
      var btnNhl = document.getElementById('standingsLeagueNhl');
      if (league === 'NFL') {
        if (btnNfl) { btnNfl.style.background = 'var(--primary)'; btnNfl.style.color = 'black'; }
        if (btnNhl) { btnNhl.style.background = '#0f172a'; btnNhl.style.color = '#94a3b8'; }
      } else {
        if (btnNhl) { btnNhl.style.background = 'var(--primary)'; btnNhl.style.color = 'black'; }
        if (btnNfl) { btnNfl.style.background = '#0f172a'; btnNfl.style.color = '#94a3b8'; }
      }
      renderFullStandings();
    }

    function setStandingsView(view) {
      currentStandingsView = view;
      var views = ['DIV', 'Conf', 'League'];
      var ids = { 'DIVISION': 'viewBtnDiv', 'CONFERENCE': 'viewBtnConf', 'LEAGUE': 'viewBtnLeague' };
      ['viewBtnDiv', 'viewBtnConf', 'viewBtnLeague'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) {
          if (id === ids[view]) {
            el.style.background = '#1e293b';
            el.style.color = 'white';
          } else {
            el.style.background = 'transparent';
            el.style.color = '#94a3b8';
          }
        }
      });
      renderFullStandings();
    }

    function renderFullStandings() {
      var target = document.getElementById('fullStandingsTarget');
      if (!target) return;

      var isNfl = currentStandingsLeague === 'NFL';
      var rawList = isNfl ? FULL_STANDINGS_DATA.nfl : FULL_STANDINGS_DATA.nhl;

      var searchInput = document.getElementById('standingsSearch');
      var q = searchInput ? searchInput.value.toLowerCase().trim() : '';

      var filtered = rawList.filter(function(t) {
        if (!q) return true;
        return t.name.toLowerCase().includes(q) ||
               t.team.toLowerCase().includes(q) ||
               t.div.toLowerCase().includes(q) ||
               t.conf.toLowerCase().includes(q);
      });

      var html = '';

      if (currentStandingsView === 'DIVISION') {
        // Group by Conference and Division
        var nflStructure = {
          'American Football Conference (AFC)': ['East', 'North', 'South', 'West'],
          'National Football Conference (NFC)': ['East', 'North', 'South', 'West']
        };
        var nhlStructure = {
          'Eastern Conference': ['Atlantic', 'Metropolitan'],
          'Western Conference': ['Central', 'Pacific']
        };

        var struct = isNfl ? nflStructure : nhlStructure;

        Object.keys(struct).forEach(function(confHeader) {
          var confKey = isNfl ? (confHeader.includes('AFC') ? 'AFC' : 'NFC') : (confHeader.includes('Eastern') ? 'Eastern' : 'Western');
          var divs = struct[confHeader];

          html += '<div style="margin-bottom: 28px;">';
          html += '  <div style="font-size: 1.15rem; font-weight: 900; color: white; display: flex; align-items: center; gap: 8px; margin-bottom: 14px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">';
          html += '    <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--primary);"></span>';
          html += '    ' + confHeader;
          html += '  </div>';

          html += '  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 14px;">';

          divs.forEach(function(divName) {
            var teamsInDiv = filtered.filter(function(t) {
              return t.conf === confKey && t.div.toLowerCase() === divName.toLowerCase();
            }).sort(function(a, b) { return a.divRank - b.divRank; });

            if (teamsInDiv.length === 0) return;

            html += '    <div class="card" style="padding: 14px;">';
            html += '      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px solid var(--card-border); padding-bottom: 6px;">';
            html += '        <span style="font-weight: 900; font-size: 12px; color: white;">' + (isNfl ? confKey + ' ' + divName : divName + ' Division') + '</span>';
            html += '        <span class="badge-pill badge-green" style="font-size: 9px;">' + (isNfl ? 'NFL.com 2026' : 'NHL.com Nov 18') + '</span>';
            html += '      </div>';

            html += '      <div style="overflow-x: auto;">';
            html += '        <table style="font-size: 11px;">';
            html += '          <thead>';
            html += '            <tr>';
            html += '              <th>#</th>';
            html += '              <th>Team</th>';
            if (isNfl) {
              html += '              <th>W-L-T</th>';
              html += '              <th>PCT</th>';
              html += '              <th>DIFF</th>';
              html += '              <th>HOME</th>';
              html += '              <th>ROAD</th>';
              html += '              <th>DIV</th>';
              html += '              <th>STRK</th>';
            } else {
              html += '              <th>GP</th>';
              html += '              <th>W-L-OTL</th>';
              html += '              <th>PTS</th>';
              html += '              <th>DIFF</th>';
              html += '              <th>HOME</th>';
              html += '              <th>AWAY</th>';
              html += '              <th>STRK</th>';
            }
            html += '            </tr>';
            html += '          </thead>';
            html += '          <tbody>';

            teamsInDiv.forEach(function(t) {
              var isLeader = t.divRank === 1;
              var rankBadge = isLeader
                ? '<span class="badge-pill badge-green" style="font-size: 9px;">#1</span>'
                : '<span style="color: var(--text-muted); font-size: 10px;">#' + t.divRank + '</span>';

              html += '            <tr>';
              html += '              <td>' + rankBadge + '</td>';
              html += '              <td><strong style="color: ' + (isLeader ? '#34d399' : 'white') + ';">' + t.name + '</strong> <span style="color: var(--text-muted); font-size: 9px;">(' + t.team + ')</span></td>';
              if (isNfl) {
                var rec = t.w + '-' + t.l + '-' + t.t;
                html += '              <td><span style="font-family: monospace; font-weight: 700;">' + rec + '</span></td>';
                html += '              <td><span style="font-family: monospace;">' + t.pct.toFixed(3).replace(/^0+/, '') + '</span></td>';
                html += '              <td><span style="font-family: monospace; color: ' + (t.net > 0 ? '#34d399' : t.net < 0 ? '#f87171' : 'white') + ';">' + (t.net > 0 ? '+' : '') + t.net + '</span></td>';
                html += '              <td style="color: var(--text-muted);">' + t.home + '</td>';
                html += '              <td style="color: var(--text-muted);">' + t.away + '</td>';
                html += '              <td style="color: var(--text-muted);">' + t.divRec + '</td>';
                html += '              <td><span class="badge-pill ' + (t.strk.startsWith('W') ? 'badge-green' : 'badge-amber') + '" style="font-size: 9px;">' + t.strk + '</span></td>';
              } else {
                var recNhl = t.w + '-' + t.l + '-' + t.otl;
                html += '              <td>' + t.gp + '</td>';
                html += '              <td><span style="font-family: monospace; font-weight: 700;">' + recNhl + '</span></td>';
                html += '              <td><strong style="color: #34d399; font-size: 12px; font-family: monospace;">' + t.pts + '</strong></td>';
                html += '              <td><span style="font-family: monospace; color: ' + (t.diff > 0 ? '#34d399' : t.diff < 0 ? '#f87171' : 'white') + ';">' + (t.diff > 0 ? '+' : '') + t.diff + '</span></td>';
                html += '              <td style="color: var(--text-muted);">' + t.home + '</td>';
                html += '              <td style="color: var(--text-muted);">' + t.away + '</td>';
                html += '              <td><span class="badge-pill ' + (t.strk.startsWith('W') ? 'badge-green' : 'badge-amber') + '" style="font-size: 9px;">' + t.strk + '</span></td>';
              }
              html += '            </tr>';
            });

            html += '          </tbody>';
            html += '        </table>';
            html += '      </div>';
            html += '    </div>';
          });

          html += '  </div>';
          html += '</div>';
        });

      } else if (currentStandingsView === 'CONFERENCE') {
        // Conference 1-16 Seeds
        var confs = isNfl ? ['AFC', 'NFC'] : ['Eastern', 'Western'];
        var playoffCutoff = isNfl ? 7 : 8;

        confs.forEach(function(confKey) {
          var confTeams = filtered.filter(function(t) { return t.conf === confKey; })
            .sort(function(a, b) { return a.confRank - b.confRank; });

          html += '<div class="card" style="margin-bottom: 24px;">';
          html += '  <div style="font-weight: 900; font-size: 1.1rem; color: white; margin-bottom: 6px;">' + (isNfl ? confKey + ' Conference Postseason Seeds (1–16)' : confKey + ' Conference Playoff Picture') + '</div>';
          html += '  <p style="font-size: 11px; color: var(--text-muted); margin-bottom: 12px;">Top ' + playoffCutoff + ' seeds qualify for the playoffs. Div leaders awarded top seeds.</p>';
          html += '  <div style="overflow-x: auto;">';
          html += '    <table>';
          html += '      <thead>';
          html += '        <tr>';
          html += '          <th>Seed</th>';
          html += '          <th>Team</th>';
          html += '          <th>Division</th>';
          if (isNfl) {
            html += '          <th>W-L-T</th>';
            html += '          <th>PCT</th>';
            html += '          <th>DIFF</th>';
            html += '          <th>CONF</th>';
            html += '          <th>STREAK</th>';
            html += '          <th>Status</th>';
          } else {
            html += '          <th>GP</th>';
            html += '          <th>W-L-OTL</th>';
            html += '          <th>PTS</th>';
            html += '          <th>DIFF</th>';
            html += '          <th>RW</th>';
            html += '          <th>STREAK</th>';
            html += '          <th>Status</th>';
          }
          html += '        </tr>';
          html += '      </thead>';
          html += '      <tbody>';

          confTeams.forEach(function(t) {
            var inPlayoffs = t.confRank <= playoffCutoff;
            var isDivChamp = t.divRank === 1;
            var statusBadge = isDivChamp
              ? '<span class="badge-pill badge-green">Div Leader (Seed #' + t.confRank + ')</span>'
              : (inPlayoffs
                ? '<span class="badge-pill badge-blue">Wild Card #' + (t.confRank - (isNfl ? 4 : 3)) + '</span>'
                : '<span style="color: var(--text-muted); font-size: 10px;">In Hunt</span>');

            html += '        <tr style="' + (t.confRank === playoffCutoff ? 'border-bottom: 2px dashed rgba(16, 185, 129, 0.5);' : '') + '">';
            html += '          <td><strong style="color: ' + (inPlayoffs ? '#34d399' : '#94a3b8') + ';">#' + t.confRank + '</strong></td>';
            html += '          <td><strong>' + t.name + '</strong> <span style="color: var(--text-muted); font-size: 9px;">(' + t.team + ')</span></td>';
            html += '          <td style="color: var(--text-muted);">' + t.div + '</td>';
            if (isNfl) {
              html += '          <td><span style="font-family: monospace; font-weight: 700;">' + t.w + '-' + t.l + '-' + t.t + '</span></td>';
              html += '          <td><span style="font-family: monospace;">' + t.pct.toFixed(3).replace(/^0+/, '') + '</span></td>';
              html += '          <td><span style="font-family: monospace; color: ' + (t.net > 0 ? '#34d399' : '#f87171') + ';">' + (t.net > 0 ? '+' : '') + t.net + '</span></td>';
              html += '          <td style="color: var(--text-muted);">' + t.confRec + '</td>';
              html += '          <td><span class="badge-pill ' + (t.strk.startsWith('W') ? 'badge-green' : 'badge-amber') + '">' + t.strk + '</span></td>';
            } else {
              html += '          <td>' + t.gp + '</td>';
              html += '          <td><span style="font-family: monospace; font-weight: 700;">' + t.w + '-' + t.l + '-' + t.otl + '</span></td>';
              html += '          <td><strong style="color: #34d399; font-size: 12px; font-family: monospace;">' + t.pts + '</strong></td>';
              html += '          <td><span style="font-family: monospace; color: ' + (t.diff > 0 ? '#34d399' : '#f87171') + ';">' + (t.diff > 0 ? '+' : '') + t.diff + '</span></td>';
              html += '          <td>' + t.rw + '</td>';
              html += '          <td><span class="badge-pill ' + (t.strk.startsWith('W') ? 'badge-green' : 'badge-amber') + '">' + t.strk + '</span></td>';
            }
            html += '          <td>' + statusBadge + '</td>';
            html += '        </tr>';
          });

          html += '      </tbody>';
          html += '    </table>';
          html += '  </div>';
          html += '</div>';
        });

      } else {
        // League Overall (1 to 32)
        var allRanked = filtered.slice().sort(function(a, b) {
          return a.leagueRank - b.leagueRank;
        });

        html += '<div class="card">';
        html += '  <div style="font-weight: 900; font-size: 1.1rem; color: white; margin-bottom: 6px;">' + (isNfl ? 'NFL League-Wide Power Standings (1–32)' : 'NHL Presidents Trophy Standings (1–32)') + '</div>';
        html += '  <p style="font-size: 11px; color: var(--text-muted); margin-bottom: 12px;">Full league table ranking all 32 franchises direct from ' + (isNfl ? 'nfl.com/standings' : 'nhl.com/standings') + '.</p>';
        html += '  <div style="overflow-x: auto;">';
        html += '    <table>';
        html += '      <thead>';
        html += '        <tr>';
        html += '          <th>Rank</th>';
        html += '          <th>Team</th>';
        html += '          <th>Conf / Div</th>';
        if (isNfl) {
          html += '          <th>W-L-T</th>';
          html += '          <th>PCT</th>';
          html += '          <th>PF</th>';
          html += '          <th>PA</th>';
          html += '          <th>DIFF</th>';
          html += '          <th>HOME</th>';
          html += '          <th>ROAD</th>';
          html += '          <th>STREAK</th>';
        } else {
          html += '          <th>GP</th>';
          html += '          <th>W-L-OTL</th>';
          html += '          <th>PTS</th>';
          html += '          <th>RW</th>';
          html += '          <th>GF</th>';
          html += '          <th>GA</th>';
          html += '          <th>DIFF</th>';
          html += '          <th>STREAK</th>';
        }
        html += '        </tr>';
        html += '      </thead>';
        html += '      <tbody>';

        allRanked.forEach(function(t) {
          var isTop = t.leagueRank <= 5;
          html += '        <tr>';
          html += '          <td><strong style="color: ' + (isTop ? '#34d399' : '#94a3b8') + ';">#' + t.leagueRank + '</strong></td>';
          html += '          <td><strong>' + t.name + '</strong> <span style="color: var(--text-muted); font-size: 9px;">(' + t.team + ')</span></td>';
          html += '          <td style="color: var(--text-muted);">' + t.conf + ' ' + t.div + '</td>';
          if (isNfl) {
            html += '          <td><span style="font-family: monospace; font-weight: 700;">' + t.w + '-' + t.l + '-' + t.t + '</span></td>';
            html += '          <td><span style="font-family: monospace;">' + t.pct.toFixed(3).replace(/^0+/, '') + '</span></td>';
            html += '          <td>' + t.pf + '</td>';
            html += '          <td>' + t.pa + '</td>';
            html += '          <td><span style="font-family: monospace; color: ' + (t.net > 0 ? '#34d399' : '#f87171') + ';">' + (t.net > 0 ? '+' : '') + t.net + '</span></td>';
            html += '          <td style="color: var(--text-muted);">' + t.home + '</td>';
            html += '          <td style="color: var(--text-muted);">' + t.away + '</td>';
            html += '          <td><span class="badge-pill ' + (t.strk.startsWith('W') ? 'badge-green' : 'badge-amber') + '">' + t.strk + '</span></td>';
          } else {
            html += '          <td>' + t.gp + '</td>';
            html += '          <td><span style="font-family: monospace; font-weight: 700;">' + t.w + '-' + t.l + '-' + t.otl + '</span></td>';
            html += '          <td><strong style="color: #34d399; font-size: 12px; font-family: monospace;">' + t.pts + '</strong></td>';
            html += '          <td>' + t.rw + '</td>';
            html += '          <td>' + t.gf + '</td>';
            html += '          <td>' + t.ga + '</td>';
            html += '          <td><span style="font-family: monospace; color: ' + (t.diff > 0 ? '#34d399' : '#f87171') + ';">' + (t.diff > 0 ? '+' : '') + t.diff + '</span></td>';
            html += '          <td><span class="badge-pill ' + (t.strk.startsWith('W') ? 'badge-green' : 'badge-amber') + '">' + t.strk + '</span></td>';
          }
          html += '        </tr>';
        });

        html += '      </tbody>';
        html += '    </table>';
        html += '  </div>';
        html += '</div>';
      }

      target.innerHTML = html;
    }
`;

// Now read index.html and insert jsSnippet before window.addEventListener('DOMContentLoaded'
const htmlPath = ".cloudflare-deploy/index.html";
let html = fs.readFileSync(htmlPath, "utf8");

// Make sure renderFullStandings is called on DOMContentLoaded
const targetCall = "renderFullStandings();";
if (!html.includes(targetCall)) {
  html = html.replace("renderH2H('BUF_KC');", "renderH2H('BUF_KC');\n      renderFullStandings();");
}

// Replace the previous definition if any, or insert right before // Initial setup on load
const insertMarker = "// Initial setup on load";
if (html.includes(insertMarker)) {
  html = html.replace(insertMarker, jsSnippet + "\n    " + insertMarker);
  fs.writeFileSync(htmlPath, html, "utf8");
  console.log("Successfully injected full standings engine into .cloudflare-deploy/index.html!");
} else {
  console.error("Could not find insertMarker in index.html");
}
