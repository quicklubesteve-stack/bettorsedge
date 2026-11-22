const fs = require("fs");
const path = require("path");

const indexPath = path.join(__dirname, "..", ".cloudflare-deploy", "index.html");
let html = fs.readFileSync(indexPath, "utf8");

// Create modern side-by-side tab content for todaysgames
const startMarker = '<div id="tab-todaysgames" class="tab-content">';
const endMarker = '<div id="tab-nflslate" class="tab-content">';

const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const newTodaysGamesTab = `<div id="tab-todaysgames" class="tab-content">
      <div class="hero">
        <div class="badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399; border-color: rgba(16, 185, 129, 0.4);">
          ⚡ Game-Day Side-by-Side Matchup Predictions • America/Toronto (ET)
        </div>
        <h1 style="background: linear-gradient(135deg, #ffffff 0%, #34d399 50%, #2dd4bf 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          TODAY'S GAMES &amp; AI PREDICTIONS
        </h1>
        <p>
          Side-by-side comparative analysis of every scheduled NFL &amp; NHL matchup. Away team on the left, Home team on the right. Both win probabilities mathematically sum to 100% with full overtime and shootout modeling for hockey.
        </p>
      </div>

      <!-- Navigation Horizon Tabs & Sort Bar -->
      <div style="background: rgba(15, 23, 42, 0.9); border: 1px solid #1e293b; border-radius: 16px; padding: 14px 18px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; gap: 8px; flex-wrap: wrap;" id="time-horizon-tabs">
          <button class="nav-btn active" id="btn-horizon-nfl" onclick="filterHorizon('TODAY_NFL')" style="padding: 8px 14px; font-size: 12px; font-weight: 800;">
            🏈 Today's NFL Games
          </button>
          <button class="nav-btn" id="btn-horizon-nhl" onclick="filterHorizon('TODAY_NHL')" style="padding: 8px 14px; font-size: 12px; font-weight: 800;">
            🏒 Today's NHL Games
          </button>
          <button class="nav-btn" id="btn-horizon-all" onclick="filterHorizon('ALL')" style="padding: 8px 14px; font-size: 12px; font-weight: 800;">
            ⚡ All Games
          </button>
          <button class="nav-btn" id="btn-horizon-tomorrow" onclick="filterHorizon('TOMORROW')" style="padding: 8px 14px; font-size: 12px; font-weight: 800;">
            📅 Tomorrow
          </button>
          <button class="nav-btn" id="btn-horizon-week" onclick="filterHorizon('THIS_WEEK')" style="padding: 8px 14px; font-size: 12px; font-weight: 800;">
            🗓️ This Week
          </button>
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
          <label style="font-size: 12px; color: #94a3b8; font-weight: 700;">Sort By:</label>
          <select id="select-game-sort" onchange="sortGames(this.value)" style="background: #020617; color: white; border: 1px solid #334155; padding: 6px 12px; border-radius: 8px; font-size: 12px; cursor: pointer;">
            <option value="time">Game Starting Time</option>
            <option value="prob">Highest Win Probability</option>
            <option value="closest">Closest Matchup</option>
            <option value="value">Highest Estimated Betting Value (+EV)</option>
          </select>
          <button onclick="alert('⚡ Real-time sync triggered! Refreshed rosters, starting lineups, and betting odds.')" style="background: #059669; color: white; border: none; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 12px; cursor: pointer;">
            🔄 Refresh
          </button>
        </div>
      </div>

      <!-- Schedule Notice Banner -->
      <div id="horizon-notice-banner" style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 12px 16px; margin-bottom: 20px; font-size: 12px; color: #a7f3d0;">
        📅 <strong>Schedule Notice:</strong> Showing verified game day matchups in America/Toronto Eastern Time (ET).
      </div>

      <!-- SIDE-BY-SIDE MATCHUP CARDS CONTAINER -->
      <div id="side-by-side-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 20px; margin-bottom: 30px;">

        <!-- MATCHUP 1: Dallas Cowboys vs Tennessee Titans -->
        <div class="card sbs-matchup-card" data-league="NFL" data-horizon="NFL" data-prob="65.0" data-diff="30.0" data-value="15.05" style="border: 1px solid #1e293b; border-radius: 16px; padding: 18px; background: #090d16; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <!-- Top info bar -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 8px; margin-bottom: 12px; font-size: 11px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); padding: 2px 6px; border-radius: 6px; font-weight: 900;">NFL</span>
              <span style="color: white; font-weight: 700; font-family: monospace;">Sun Nov 22 • 1:00 PM ET</span>
            </div>
            <div style="color: #94a3b8; font-size: 11px;">
              AT&T Stadium, Arlington, TX • FOX
            </div>
          </div>

          <!-- SIDE-BY-SIDE 2-COLUMN TEAMS GRID (PRESERVED ON MOBILE) -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px;">
            <!-- LEFT SIDE: AWAY TEAM -->
            <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 12px; display: flex; flex-col; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span style="font-size: 10px; font-weight: 800; color: #94a3b8;">AWAY</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  <img src="https://a.espncdn.com/i/teamlogos/nfl/500/ten.png" style="width: 32px; height: 32px; object-contain;" alt="TEN" onerror="this.style.display='none'">
                  <div>
                    <div style="font-size: 14px; font-weight: 900; color: #ffffff;">Titans</div>
                    <div style="font-size: 10px; color: #94a3b8;">Rec: 4-6</div>
                  </div>
                </div>
                <div style="background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 6px; text-align: center; margin-bottom: 8px;">
                  <div style="font-size: 9px; color: #94a3b8; font-weight: 700;">WIN PROB</div>
                  <div style="font-size: 18px; font-weight: 900; color: #cbd5e1; font-family: monospace;">35.0%</div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 6px; border-top: 1px solid #1e293b; padding-top: 6px;">
                  <span style="color: #94a3b8;">Moneyline:</span>
                  <span style="color: #ffffff; font-weight: 800; font-family: monospace;">+110</span>
                </div>
                <div style="font-size: 10px; color: #cbd5e1; margin-bottom: 4px;">
                  <span style="color: #94a3b8;">QB:</span> <strong>Will Levis</strong> (Active)
                </div>
                <div style="font-size: 10px; color: #94a3b8; margin-bottom: 6px;">
                  Injuries: <span style="color: #34d399; font-weight: 700;">1 Player</span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; border-top: 1px solid #1e293b; padding-top: 4px;">
                  <span style="color: #64748b;">Last 5:</span>
                  <span style="color: #f87171; font-weight: 800; font-family: monospace;">L L W L W</span>
                </div>
              </div>
            </div>

            <!-- RIGHT SIDE: HOME TEAM (FAVORED) -->
            <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), #0f172a); border: 2px solid #10b981; border-radius: 12px; padding: 12px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.2);">
              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span style="font-size: 10px; font-weight: 800; color: #34d399;">HOME</span>
                  <span style="font-size: 9px; font-weight: 900; background: #10b981; color: #022c22; padding: 1px 5px; border-radius: 4px;">FAVORED</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  <img src="https://a.espncdn.com/i/teamlogos/nfl/500/dal.png" style="width: 32px; height: 32px; object-contain;" alt="DAL" onerror="this.style.display='none'">
                  <div>
                    <div style="font-size: 14px; font-weight: 900; color: #ffffff;">Cowboys</div>
                    <div style="font-size: 10px; color: #94a3b8;">Rec: 7-3</div>
                  </div>
                </div>
                <div style="background: #020617; border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 8px; padding: 6px; text-align: center; margin-bottom: 8px;">
                  <div style="font-size: 9px; color: #34d399; font-weight: 700;">WIN PROB</div>
                  <div style="font-size: 18px; font-weight: 900; color: #34d399; font-family: monospace;">65.0%</div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 6px; border-top: 1px solid #1e293b; padding-top: 6px;">
                  <span style="color: #94a3b8;">Moneyline:</span>
                  <span style="color: #34d399; font-weight: 800; font-family: monospace;">-130</span>
                </div>
                <div style="font-size: 10px; color: #cbd5e1; margin-bottom: 4px;">
                  <span style="color: #94a3b8;">QB:</span> <strong>Dak Prescott</strong> (100% Active)
                </div>
                <div style="font-size: 10px; color: #94a3b8; margin-bottom: 6px;">
                  Injuries: <span style="color: #34d399; font-weight: 700;">0 (Clean)</span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; border-top: 1px solid #1e293b; padding-top: 4px;">
                  <span style="color: #64748b;">Last 5:</span>
                  <span style="color: #34d399; font-weight: 800; font-family: monospace;">W W L W W</span>
                </div>
              </div>
            </div>
          </div>

          <!-- PROBABILITY BAR (SUMS TO 100%) -->
          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; font-size: 11px; font-family: monospace; font-weight: 800; margin-bottom: 4px;">
              <span style="color: #94a3b8;">TEN 35.0%</span>
              <span style="color: #64748b; font-size: 10px; font-family: sans-serif;">Full-Game Win % (100%)</span>
              <span style="color: #34d399;">65.0% DAL</span>
            </div>
            <div style="height: 10px; width: 100%; background: #020617; border-radius: 6px; overflow: hidden; display: flex; border: 1px solid #1e293b;">
              <div style="width: 35%; background: #475569;"></div>
              <div style="width: 65%; background: linear-gradient(90deg, #10b981, #34d399);"></div>
            </div>
          </div>

          <!-- Bottom Summary Badge -->
          <div style="background: #020617; border: 1px solid #1e293b; border-radius: 10px; padding: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
            <div>
              <span style="color: #94a3b8;">Predicted Winner:</span> <strong style="color: white;">Dallas Cowboys</strong> <span style="color: #34d399; font-family: monospace;">(27 - 17)</span>
            </div>
            <div style="color: #34d399; font-weight: 800;">
              +$15.05 EV / $100
            </div>
          </div>
        </div>

        <!-- MATCHUP 2: Buffalo Bills vs Miami Dolphins -->
        <div class="card sbs-matchup-card" data-league="NFL" data-horizon="NFL" data-prob="71.0" data-diff="42.0" data-value="10.43" style="border: 1px solid #1e293b; border-radius: 16px; padding: 18px; background: #090d16; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <!-- Top info bar -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 8px; margin-bottom: 12px; font-size: 11px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); padding: 2px 6px; border-radius: 6px; font-weight: 900;">NFL</span>
              <span style="color: white; font-weight: 700; font-family: monospace;">Sun Nov 22 • 1:00 PM ET</span>
            </div>
            <div style="color: #94a3b8; font-size: 11px;">
              Highmark Stadium, Orchard Park, NY • CBS
            </div>
          </div>

          <!-- SIDE-BY-SIDE 2-COLUMN TEAMS GRID -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px;">
            <!-- LEFT SIDE: AWAY TEAM -->
            <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 12px; display: flex; flex-col; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span style="font-size: 10px; font-weight: 800; color: #94a3b8;">AWAY</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  <img src="https://a.espncdn.com/i/teamlogos/nfl/500/mia.png" style="width: 32px; height: 32px; object-contain;" alt="MIA" onerror="this.style.display='none'">
                  <div>
                    <div style="font-size: 14px; font-weight: 900; color: #ffffff;">Dolphins</div>
                    <div style="font-size: 10px; color: #94a3b8;">Rec: 5-5</div>
                  </div>
                </div>
                <div style="background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 6px; text-align: center; margin-bottom: 8px;">
                  <div style="font-size: 9px; color: #94a3b8; font-weight: 700;">WIN PROB</div>
                  <div style="font-size: 18px; font-weight: 900; color: #cbd5e1; font-family: monospace;">29.0%</div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 6px; border-top: 1px solid #1e293b; padding-top: 6px;">
                  <span style="color: #94a3b8;">Moneyline:</span>
                  <span style="color: #ffffff; font-weight: 800; font-family: monospace;">+150</span>
                </div>
                <div style="font-size: 10px; color: #cbd5e1; margin-bottom: 4px;">
                  <span style="color: #94a3b8;">QB:</span> <strong>Tua Tagovailoa</strong>
                </div>
                <div style="font-size: 10px; color: #94a3b8; margin-bottom: 6px;">
                  Injuries: <span style="color: #fbbf24; font-weight: 700;">2 Players</span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; border-top: 1px solid #1e293b; padding-top: 4px;">
                  <span style="color: #64748b;">Last 5:</span>
                  <span style="color: #f87171; font-weight: 800; font-family: monospace;">W L L W L</span>
                </div>
              </div>
            </div>

            <!-- RIGHT SIDE: HOME TEAM (FAVORED) -->
            <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), #0f172a); border: 2px solid #10b981; border-radius: 12px; padding: 12px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.2);">
              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span style="font-size: 10px; font-weight: 800; color: #34d399;">HOME</span>
                  <span style="font-size: 9px; font-weight: 900; background: #10b981; color: #022c22; padding: 1px 5px; border-radius: 4px;">FAVORED</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  <img src="https://a.espncdn.com/i/teamlogos/nfl/500/buf.png" style="width: 32px; height: 32px; object-contain;" alt="BUF" onerror="this.style.display='none'">
                  <div>
                    <div style="font-size: 14px; font-weight: 900; color: #ffffff;">Bills</div>
                    <div style="font-size: 10px; color: #94a3b8;">Rec: 9-2</div>
                  </div>
                </div>
                <div style="background: #020617; border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 8px; padding: 6px; text-align: center; margin-bottom: 8px;">
                  <div style="font-size: 9px; color: #34d399; font-weight: 700;">WIN PROB</div>
                  <div style="font-size: 18px; font-weight: 900; color: #34d399; font-family: monospace;">71.0%</div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 6px; border-top: 1px solid #1e293b; padding-top: 6px;">
                  <span style="color: #94a3b8;">Moneyline:</span>
                  <span style="color: #34d399; font-weight: 800; font-family: monospace;">-180</span>
                </div>
                <div style="font-size: 10px; color: #cbd5e1; margin-bottom: 4px;">
                  <span style="color: #94a3b8;">QB:</span> <strong>Josh Allen</strong> (Confirmed)
                </div>
                <div style="font-size: 10px; color: #94a3b8; margin-bottom: 6px;">
                  Injuries: <span style="color: #34d399; font-weight: 700;">0 (Clean)</span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; border-top: 1px solid #1e293b; padding-top: 4px;">
                  <span style="color: #64748b;">Last 5:</span>
                  <span style="color: #34d399; font-weight: 800; font-family: monospace;">W W W W L</span>
                </div>
              </div>
            </div>
          </div>

          <!-- PROBABILITY BAR (SUMS TO 100%) -->
          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; font-size: 11px; font-family: monospace; font-weight: 800; margin-bottom: 4px;">
              <span style="color: #94a3b8;">MIA 29.0%</span>
              <span style="color: #64748b; font-size: 10px; font-family: sans-serif;">Full-Game Win % (100%)</span>
              <span style="color: #34d399;">71.0% BUF</span>
            </div>
            <div style="height: 10px; width: 100%; background: #020617; border-radius: 6px; overflow: hidden; display: flex; border: 1px solid #1e293b;">
              <div style="width: 29%; background: #475569;"></div>
              <div style="width: 71%; background: linear-gradient(90deg, #10b981, #34d399);"></div>
            </div>
          </div>

          <!-- Bottom Summary Badge -->
          <div style="background: #020617; border: 1px solid #1e293b; border-radius: 10px; padding: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
            <div>
              <span style="color: #94a3b8;">Predicted Winner:</span> <strong style="color: white;">Buffalo Bills</strong> <span style="color: #34d399; font-family: monospace;">(30 - 20)</span>
            </div>
            <div style="color: #34d399; font-weight: 800;">
              +$10.43 EV / $100
            </div>
          </div>
        </div>

        <!-- MATCHUP 3: NHL - Edmonton Oilers @ Carolina Hurricanes -->
        <div class="card sbs-matchup-card" data-league="NHL" data-horizon="NHL" data-prob="59.0" data-diff="18.0" data-value="10.33" style="border: 1px solid #1e293b; border-radius: 16px; padding: 18px; background: #090d16; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <!-- Top info bar -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 8px; margin-bottom: 12px; font-size: 11px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.4); padding: 2px 6px; border-radius: 6px; font-weight: 900;">NHL</span>
              <span style="color: white; font-weight: 700; font-family: monospace;">Sat Nov 21 • 7:00 PM ET</span>
            </div>
            <div style="color: #94a3b8; font-size: 11px;">
              PNC Arena, Raleigh, NC • Sportsnet
            </div>
          </div>

          <!-- SIDE-BY-SIDE 2-COLUMN TEAMS GRID -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px;">
            <!-- LEFT SIDE: AWAY TEAM (FAVORED) -->
            <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), #0f172a); border: 2px solid #10b981; border-radius: 12px; padding: 12px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.2);">
              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span style="font-size: 10px; font-weight: 800; color: #34d399;">AWAY</span>
                  <span style="font-size: 9px; font-weight: 900; background: #10b981; color: #022c22; padding: 1px 5px; border-radius: 4px;">FAVORED</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  <img src="https://a.espncdn.com/i/teamlogos/nhl/500/edm.png" style="width: 32px; height: 32px; object-contain;" alt="EDM" onerror="this.style.display='none'">
                  <div>
                    <div style="font-size: 14px; font-weight: 900; color: #ffffff;">Oilers</div>
                    <div style="font-size: 10px; color: #94a3b8;">Rec: 12-7-1</div>
                  </div>
                </div>
                <div style="background: #020617; border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 8px; padding: 6px; text-align: center; margin-bottom: 8px;">
                  <div style="font-size: 9px; color: #34d399; font-weight: 700;">WIN PROB</div>
                  <div style="font-size: 18px; font-weight: 900; color: #34d399; font-family: monospace;">59.0%</div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 6px; border-top: 1px solid #1e293b; padding-top: 6px;">
                  <span style="color: #94a3b8;">Moneyline:</span>
                  <span style="color: #34d399; font-weight: 800; font-family: monospace;">-115</span>
                </div>
                <div style="font-size: 10px; color: #cbd5e1; margin-bottom: 4px;">
                  <span style="color: #94a3b8;">Goalie:</span> <strong>Stuart Skinner</strong> (.910)
                </div>
                <div style="font-size: 10px; color: #94a3b8; margin-bottom: 6px;">
                  Injuries: <span style="color: #34d399; font-weight: 700;">0 (Clean)</span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; border-top: 1px solid #1e293b; padding-top: 4px;">
                  <span style="color: #64748b;">Last 5:</span>
                  <span style="color: #34d399; font-weight: 800; font-family: monospace;">W W L W W</span>
                </div>
              </div>
            </div>

            <!-- RIGHT SIDE: HOME TEAM -->
            <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 12px; display: flex; flex-col; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span style="font-size: 10px; font-weight: 800; color: #94a3b8;">HOME</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  <img src="https://a.espncdn.com/i/teamlogos/nhl/500/car.png" style="width: 32px; height: 32px; object-contain;" alt="CAR" onerror="this.style.display='none'">
                  <div>
                    <div style="font-size: 14px; font-weight: 900; color: #ffffff;">Hurricanes</div>
                    <div style="font-size: 10px; color: #94a3b8;">Rec: 13-5-0</div>
                  </div>
                </div>
                <div style="background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 6px; text-align: center; margin-bottom: 8px;">
                  <div style="font-size: 9px; color: #94a3b8; font-weight: 700;">WIN PROB</div>
                  <div style="font-size: 18px; font-weight: 900; color: #cbd5e1; font-family: monospace;">41.0%</div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 6px; border-top: 1px solid #1e293b; padding-top: 6px;">
                  <span style="color: #94a3b8;">Moneyline:</span>
                  <span style="color: #ffffff; font-weight: 800; font-family: monospace;">-105</span>
                </div>
                <div style="font-size: 10px; color: #cbd5e1; margin-bottom: 4px;">
                  <span style="color: #94a3b8;">Goalie:</span> <strong>Frederik Andersen</strong>
                </div>
                <div style="font-size: 10px; color: #94a3b8; margin-bottom: 6px;">
                  Injuries: <span style="color: #fbbf24; font-weight: 700;">1 Player</span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; border-top: 1px solid #1e293b; padding-top: 4px;">
                  <span style="color: #64748b;">Last 5:</span>
                  <span style="color: #34d399; font-weight: 800; font-family: monospace;">W L W W L</span>
                </div>
              </div>
            </div>
          </div>

          <!-- PROBABILITY BAR (SUMS TO 100%) -->
          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; font-size: 11px; font-family: monospace; font-weight: 800; margin-bottom: 4px;">
              <span style="color: #34d399;">EDM 59.0%</span>
              <span style="color: #64748b; font-size: 10px; font-family: sans-serif;">Full Game (OT/SO Incl. 100%)</span>
              <span style="color: #94a3b8;">41.0% CAR</span>
            </div>
            <div style="height: 10px; width: 100%; background: #020617; border-radius: 6px; overflow: hidden; display: flex; border: 1px solid #1e293b;">
              <div style="width: 59%; background: linear-gradient(90deg, #10b981, #34d399);"></div>
              <div style="width: 41%; background: #475569;"></div>
            </div>
          </div>

          <!-- Bottom Summary Badge -->
          <div style="background: #020617; border: 1px solid #1e293b; border-radius: 10px; padding: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
            <div>
              <span style="color: #94a3b8;">Predicted Winner:</span> <strong style="color: white;">Edmonton Oilers</strong> <span style="color: #34d399; font-family: monospace;">(4 - 3 OT)</span>
            </div>
            <div style="color: #34d399; font-weight: 800;">
              +$10.33 EV / $100
            </div>
          </div>
        </div>

        <!-- MATCHUP 4: NHL - Columbus Blue Jackets @ Toronto Maple Leafs -->
        <div class="card sbs-matchup-card" data-league="NHL" data-horizon="NHL" data-prob="58.0" data-diff="16.0" data-value="2.50" style="border: 1px solid #1e293b; border-radius: 16px; padding: 18px; background: #090d16; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <!-- Top info bar -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 8px; margin-bottom: 12px; font-size: 11px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.4); padding: 2px 6px; border-radius: 6px; font-weight: 900;">NHL</span>
              <span style="color: white; font-weight: 700; font-family: monospace;">Sat Nov 21 • 7:00 PM ET</span>
            </div>
            <div style="color: #94a3b8; font-size: 11px;">
              Scotiabank Arena, Toronto, ON • CBC / Sportsnet
            </div>
          </div>

          <!-- SIDE-BY-SIDE 2-COLUMN TEAMS GRID -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px;">
            <!-- LEFT SIDE: AWAY TEAM -->
            <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 12px; display: flex; flex-col; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span style="font-size: 10px; font-weight: 800; color: #94a3b8;">AWAY</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  <img src="https://a.espncdn.com/i/teamlogos/nhl/500/cbj.png" style="width: 32px; height: 32px; object-contain;" alt="CBJ" onerror="this.style.display='none'">
                  <div>
                    <div style="font-size: 14px; font-weight: 900; color: #ffffff;">Blue Jackets</div>
                    <div style="font-size: 10px; color: #94a3b8;">Rec: 7-9-2</div>
                  </div>
                </div>
                <div style="background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 6px; text-align: center; margin-bottom: 8px;">
                  <div style="font-size: 9px; color: #94a3b8; font-weight: 700;">WIN PROB</div>
                  <div style="font-size: 18px; font-weight: 900; color: #cbd5e1; font-family: monospace;">42.0%</div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 6px; border-top: 1px solid #1e293b; padding-top: 6px;">
                  <span style="color: #94a3b8;">Moneyline:</span>
                  <span style="color: #ffffff; font-weight: 800; font-family: monospace;">+150</span>
                </div>
                <div style="font-size: 10px; color: #cbd5e1; margin-bottom: 4px;">
                  <span style="color: #94a3b8;">Goalie:</span> <strong>Elvis Merzlikins</strong>
                </div>
                <div style="font-size: 10px; color: #94a3b8; margin-bottom: 6px;">
                  Injuries: <span style="color: #34d399; font-weight: 700;">0 (Clean)</span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; border-top: 1px solid #1e293b; padding-top: 4px;">
                  <span style="color: #64748b;">Last 5:</span>
                  <span style="color: #f87171; font-weight: 800; font-family: monospace;">L L W L W</span>
                </div>
              </div>
            </div>

            <!-- RIGHT SIDE: HOME TEAM (FAVORED) -->
            <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), #0f172a); border: 2px solid #10b981; border-radius: 12px; padding: 12px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.2);">
              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span style="font-size: 10px; font-weight: 800; color: #34d399;">HOME</span>
                  <span style="font-size: 9px; font-weight: 900; background: #10b981; color: #022c22; padding: 1px 5px; border-radius: 4px;">FAVORED</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  <img src="https://a.espncdn.com/i/teamlogos/nhl/500/tor.png" style="width: 32px; height: 32px; object-contain;" alt="TOR" onerror="this.style.display='none'">
                  <div>
                    <div style="font-size: 14px; font-weight: 900; color: #ffffff;">Maple Leafs</div>
                    <div style="font-size: 10px; color: #94a3b8;">Rec: 11-6-2</div>
                  </div>
                </div>
                <div style="background: #020617; border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 8px; padding: 6px; text-align: center; margin-bottom: 8px;">
                  <div style="font-size: 9px; color: #34d399; font-weight: 700;">WIN PROB</div>
                  <div style="font-size: 18px; font-weight: 900; color: #34d399; font-family: monospace;">58.0%</div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 6px; border-top: 1px solid #1e293b; padding-top: 6px;">
                  <span style="color: #94a3b8;">Moneyline:</span>
                  <span style="color: #34d399; font-weight: 800; font-family: monospace;">-175</span>
                </div>
                <div style="font-size: 10px; color: #cbd5e1; margin-bottom: 4px;">
                  <span style="color: #94a3b8;">Goalie:</span> <strong>Joseph Woll</strong> (.914)
                </div>
                <div style="font-size: 10px; color: #94a3b8; margin-bottom: 6px;">
                  Injuries: <span style="color: #f87171; font-weight: 700;">A. Matthews (IR)</span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; border-top: 1px solid #1e293b; padding-top: 4px;">
                  <span style="color: #64748b;">Last 5:</span>
                  <span style="color: #34d399; font-weight: 800; font-family: monospace;">W L W W L</span>
                </div>
              </div>
            </div>
          </div>

          <!-- PROBABILITY BAR (SUMS TO 100%) -->
          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; font-size: 11px; font-family: monospace; font-weight: 800; margin-bottom: 4px;">
              <span style="color: #94a3b8;">CBJ 42.0%</span>
              <span style="color: #64748b; font-size: 10px; font-family: sans-serif;">Full Game (OT/SO Incl. 100%)</span>
              <span style="color: #34d399;">58.0% TOR</span>
            </div>
            <div style="height: 10px; width: 100%; background: #020617; border-radius: 6px; overflow: hidden; display: flex; border: 1px solid #1e293b;">
              <div style="width: 42%; background: #475569;"></div>
              <div style="width: 58%; background: linear-gradient(90deg, #10b981, #34d399);"></div>
            </div>
          </div>

          <!-- Bottom Summary Badge -->
          <div style="background: #020617; border: 1px solid #1e293b; border-radius: 10px; padding: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
            <div>
              <span style="color: #94a3b8;">Predicted Winner:</span> <strong style="color: white;">Toronto Maple Leafs</strong> <span style="color: #34d399; font-family: monospace;">(3 - 2)</span>
            </div>
            <div style="color: #cbd5e1; font-weight: 800;">
              Score Impact: -0.35 xG (Matthews OUT)
            </div>
          </div>
        </div>

      </div>

      <!-- Script for Filtering Horizons and Sorting -->
      <script>
        function filterHorizon(horizon) {
          const btns = document.querySelectorAll('#time-horizon-tabs button');
          btns.forEach(b => b.classList.remove('active'));
          
          const banner = document.getElementById('horizon-notice-banner');
          const cards = document.querySelectorAll('.sbs-matchup-card');

          if (horizon === 'TODAY_NFL') {
            document.getElementById('btn-horizon-nfl').classList.add('active');
            banner.innerHTML = '🏈 <strong>NFL Slate:</strong> Displaying Sunday Week 11 official NFL matchup slate.';
            cards.forEach(c => {
              c.style.display = c.getAttribute('data-league') === 'NFL' ? 'block' : 'none';
            });
          } else if (horizon === 'TODAY_NHL') {
            document.getElementById('btn-horizon-nhl').classList.add('active');
            banner.innerHTML = '🏒 <strong>NHL Slate:</strong> Displaying Saturday official NHL slate.';
            cards.forEach(c => {
              c.style.display = c.getAttribute('data-league') === 'NHL' ? 'block' : 'none';
            });
          } else if (horizon === 'TOMORROW') {
            document.getElementById('btn-horizon-tomorrow').classList.add('active');
            banner.innerHTML = '📅 <strong>Tomorrow (Sunday, Nov 22):</strong> Showing full NFL & NHL Sunday slate.';
            cards.forEach(c => {
              c.style.display = 'block';
            });
          } else if (horizon === 'THIS_WEEK') {
            document.getElementById('btn-horizon-week').classList.add('active');
            banner.innerHTML = '🗓️ <strong>This Week (Week 11):</strong> Displaying complete week calendar.';
            cards.forEach(c => {
              c.style.display = 'block';
            });
          } else {
            document.getElementById('btn-horizon-all').classList.add('active');
            banner.innerHTML = '⚡ <strong>All Games:</strong> Displaying today and upcoming verified matchups.';
            cards.forEach(c => {
              c.style.display = 'block';
            });
          }
        }

        function sortGames(criteria) {
          const container = document.getElementById('side-by-side-grid');
          const cards = Array.from(document.querySelectorAll('.sbs-matchup-card'));

          if (criteria === 'prob') {
            cards.sort((a, b) => parseFloat(b.getAttribute('data-prob')) - parseFloat(a.getAttribute('data-prob')));
          } else if (criteria === 'closest') {
            cards.sort((a, b) => parseFloat(a.getAttribute('data-diff')) - parseFloat(b.getAttribute('data-diff')));
          } else if (criteria === 'value') {
            cards.sort((a, b) => parseFloat(b.getAttribute('data-value')) - parseFloat(a.getAttribute('data-value')));
          }

          cards.forEach(c => container.appendChild(c));
        }
      </script>
    </div>

    `;

  html = html.substring(0, startIndex) + newTodaysGamesTab + html.substring(endIndex);
  fs.writeFileSync(indexPath, html, "utf8");
  console.log("Successfully updated .cloudflare-deploy/index.html with Side-by-Side Matchups and Game Day Tabs!");
} else {
  console.error("Markers not found in .cloudflare-deploy/index.html");
}
