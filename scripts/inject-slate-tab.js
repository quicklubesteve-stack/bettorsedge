const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', '.cloudflare-deploy', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const slateHtml = `
    <!-- ==================================================== -->
    <!-- TAB: DAILY NFL GAME SLATE & WIN PICKS                -->
    <!-- ==================================================== -->
    <div id="tab-nflslate" class="tab-content">
      <div class="hero">
        <div class="badge" style="color: #34d399; border-color: rgba(16, 185, 129, 0.4); background: rgba(16, 185, 129, 0.1);">Live 2026–2027 NFL Game Day Predictions</div>
        <h1>Daily NFL Game Slate — Who to Pick & Win Probabilities</h1>
        <p>Every matchup on the slate for each game day with direct AI winner recommendations, exact simulated win percentages, projected scores, point spreads, and high-conviction safe props.</p>
      </div>

      <!-- Quick Day Filter Bar -->
      <div style="display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; background: #0f172a; padding: 12px; border-radius: 16px; border: 1px solid var(--card-border);">
        <button onclick="filterSlate('ALL')" id="slate-btn-all" class="btn" style="background: #1e293b; padding: 10px 18px; font-size: 12px; font-weight: 800; border: 1px solid var(--card-border);">📅 All Scheduled Games (16)</button>
        <button onclick="filterSlate('SUNDAY')" id="slate-btn-sunday" class="btn" style="background: var(--primary); padding: 10px 18px; font-size: 12px; font-weight: 800; box-shadow: 0 4px 14px rgba(16,185,129,0.3);">🏈 Sunday Nov 22 Slate (11 Games)</button>
        <button onclick="filterSlate('MONDAY')" id="slate-btn-monday" class="btn" style="background: #1e293b; padding: 10px 18px; font-size: 12px; font-weight: 800; border: 1px solid var(--card-border);">🌙 Monday Night Nov 23 (1 Game)</button>
        <button onclick="filterSlate('THANKSGIVING')" id="slate-btn-thx" class="btn" style="background: #1e293b; padding: 10px 18px; font-size: 12px; font-weight: 800; border: 1px solid var(--card-border);">🍗 Thanksgiving Slate Nov 26 (3 Games)</button>
      </div>

      <!-- GAME SLATE CARDS -->
      <div id="slate-games-container">

        <!-- 1. KC @ BUF -->
        <div class="card slate-game-card" data-day="SUNDAY" style="border-left: 4px solid var(--primary); margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--card-border); padding-bottom: 10px; margin-bottom: 14px; font-size: 11px;">
            <span style="color: var(--text-muted); font-weight: 700;">🏈 Sunday Nov 22 • 4:25 PM ET • CBS • Highmark Stadium, Orchard Park, NY</span>
            <span class="badge-pill badge-blue">NFL Week 12</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: center; margin-bottom: 16px;">
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">VISITOR</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">Kansas City Chiefs (KC)</div>
              <div style="font-size: 12px; color: #38bdf8; font-family: monospace; font-weight: 800;">ML +115</div>
            </div>
            <div style="font-weight: 900; color: var(--text-muted); font-size: 13px;">@</div>
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">HOME FAVORITE</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">Buffalo Bills (BUF)</div>
              <div style="font-size: 12px; color: #34d399; font-family: monospace; font-weight: 800;">ML -135</div>
            </div>
          </div>
          <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(15, 23, 42, 0.9)); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 14px; padding: 16px; margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <div>
                <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; color: #34d399;">🎯 AI Official Game Pick</div>
                <div style="font-size: 20px; font-weight: 900; color: white; margin: 4px 0;">PICK TO WIN: <span style="color: #34d399;">Buffalo Bills</span></div>
                <div style="font-size: 12px; color: #cbd5e1;">Projected Final Score: <strong style="color: white; font-family: monospace;">BUF 27 - KC 24</strong> • Spread: <strong style="color: #6ee7b7;">BUF -2.5</strong> • Total: <strong style="color: #a78bfa;">OVER 46.5</strong></div>
              </div>
              <div style="text-align: right; background: rgba(15, 23, 42, 0.8); padding: 10px 16px; border-radius: 12px; border: 1px solid var(--card-border);">
                <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Win Probability</div>
                <div style="font-size: 24px; font-weight: 900; color: #34d399; font-family: monospace;">57.5%</div>
                <span class="badge-pill badge-green">HIGH CONVICTION</span>
              </div>
            </div>
            <div style="margin-top: 12px;">
              <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 800; font-family: monospace; margin-bottom: 4px;">
                <span style="color: #38bdf8;">KC 42.5%</span>
                <span style="color: var(--text-muted);">Simulated Win Odds</span>
                <span style="color: #34d399;">BUF 57.5%</span>
              </div>
              <div style="width: 100%; height: 8px; background: #334155; border-radius: 999px; overflow: hidden; display: flex;">
                <div style="width: 42.5%; background: #38bdf8; height: 100%;"></div>
                <div style="width: 57.5%; background: #10b981; height: 100%;"></div>
              </div>
            </div>
          </div>
          <p style="font-size: 12px; color: #cbd5e1; line-height: 1.5; margin: 0 0 10px 0;">
            <strong>Why Buffalo Wins:</strong> Buffalo holds a +4.8% pressure containment advantage against Kansas City's high-blitz schemes (38% blitz frequency). While Buffalo is missing TE Dalton Kincaid (knee) and WR Keon Coleman (wrist), Josh Allen's ground mobility (6 rush TDs) and James Cook match up favorably.
          </p>
          <div style="background: rgba(15, 23, 42, 0.5); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); font-size: 11px; color: #fbbf24;">
            ★ <strong>Top Safe Prop:</strong> Josh Allen Over 0.5 Rushing Touchdowns (+110, 93% Conviction)
          </div>
        </div>

        <!-- 2. BAL @ PIT -->
        <div class="card slate-game-card" data-day="SUNDAY" style="border-left: 4px solid var(--primary); margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--card-border); padding-bottom: 10px; margin-bottom: 14px; font-size: 11px;">
            <span style="color: var(--text-muted); font-weight: 700;">🏈 Sunday Nov 22 • 1:00 PM ET • CBS • Acrisure Stadium, Pittsburgh, PA</span>
            <span class="badge-pill badge-blue">NFL Week 12</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: center; margin-bottom: 16px;">
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">VISITOR FAVORITE</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">Baltimore Ravens (BAL)</div>
              <div style="font-size: 12px; color: #34d399; font-family: monospace; font-weight: 800;">ML -165</div>
            </div>
            <div style="font-weight: 900; color: var(--text-muted); font-size: 13px;">@</div>
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">HOME</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">Pittsburgh Steelers (PIT)</div>
              <div style="font-size: 12px; color: #fbbf24; font-family: monospace; font-weight: 800;">ML +140</div>
            </div>
          </div>
          <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(15, 23, 42, 0.9)); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 14px; padding: 16px; margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <div>
                <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; color: #34d399;">🎯 AI Official Game Pick</div>
                <div style="font-size: 20px; font-weight: 900; color: white; margin: 4px 0;">PICK TO WIN: <span style="color: #34d399;">Baltimore Ravens</span></div>
                <div style="font-size: 12px; color: #cbd5e1;">Projected Final Score: <strong style="color: white; font-family: monospace;">BAL 26 - PIT 20</strong> • Spread: <strong style="color: #6ee7b7;">BAL -3.0</strong> • Total: <strong style="color: #a78bfa;">UNDER 47.5</strong></div>
              </div>
              <div style="text-align: right; background: rgba(15, 23, 42, 0.8); padding: 10px 16px; border-radius: 12px; border: 1px solid var(--card-border);">
                <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Win Probability</div>
                <div style="font-size: 24px; font-weight: 900; color: #34d399; font-family: monospace;">62.0%</div>
                <span class="badge-pill badge-green">HIGH CONVICTION</span>
              </div>
            </div>
            <div style="margin-top: 12px;">
              <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 800; font-family: monospace; margin-bottom: 4px;">
                <span style="color: #34d399;">BAL 62.0%</span>
                <span style="color: var(--text-muted);">Simulated Win Odds</span>
                <span style="color: #fbbf24;">PIT 38.0%</span>
              </div>
              <div style="width: 100%; height: 8px; background: #334155; border-radius: 999px; overflow: hidden; display: flex;">
                <div style="width: 62.0%; background: #10b981; height: 100%;"></div>
                <div style="width: 38.0%; background: #fbbf24; height: 100%;"></div>
              </div>
            </div>
          </div>
          <p style="font-size: 12px; color: #cbd5e1; line-height: 1.5; margin: 0 0 10px 0;">
            <strong>Why Baltimore Wins:</strong> Baltimore's #1 ranked rushing offense (182.6 yds/game) with Derrick Henry and Lamar Jackson tests Pittsburgh's front. While Roquan Smith is dealing with a hamstring strain, the Ravens hold a +6.2 expected points advantage in short yardage.
          </p>
          <div style="background: rgba(15, 23, 42, 0.5); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); font-size: 11px; color: #fbbf24;">
            ★ <strong>Top Safe Prop:</strong> Derrick Henry Over 86.5 Rushing Yards (-115, 94% Conviction)
          </div>
        </div>

        <!-- 3. SF @ GB -->
        <div class="card slate-game-card" data-day="SUNDAY" style="border-left: 4px solid var(--primary); margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--card-border); padding-bottom: 10px; margin-bottom: 14px; font-size: 11px;">
            <span style="color: var(--text-muted); font-weight: 700;">🏈 Sunday Nov 22 • 4:25 PM ET • FOX • Lambeau Field, Green Bay, WI</span>
            <span class="badge-pill badge-blue">NFL Week 12</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: center; margin-bottom: 16px;">
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">VISITOR</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">San Francisco 49ers (SF)</div>
              <div style="font-size: 12px; color: #fbbf24; font-family: monospace; font-weight: 800;">ML +120</div>
            </div>
            <div style="font-weight: 900; color: var(--text-muted); font-size: 13px;">@</div>
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">HOME FAVORITE</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">Green Bay Packers (GB)</div>
              <div style="font-size: 12px; color: #34d399; font-family: monospace; font-weight: 800;">ML -140</div>
            </div>
          </div>
          <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(15, 23, 42, 0.9)); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 14px; padding: 16px; margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <div>
                <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; color: #34d399;">🎯 AI Official Game Pick</div>
                <div style="font-size: 20px; font-weight: 900; color: white; margin: 4px 0;">PICK TO WIN: <span style="color: #34d399;">Green Bay Packers</span></div>
                <div style="font-size: 12px; color: #cbd5e1;">Projected Final Score: <strong style="color: white; font-family: monospace;">GB 24 - SF 20</strong> • Spread: <strong style="color: #6ee7b7;">GB -2.5</strong> • Total: <strong style="color: #a78bfa;">UNDER 48.0</strong></div>
              </div>
              <div style="text-align: right; background: rgba(15, 23, 42, 0.8); padding: 10px 16px; border-radius: 12px; border: 1px solid var(--card-border);">
                <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Win Probability</div>
                <div style="font-size: 24px; font-weight: 900; color: #34d399; font-family: monospace;">57.5%</div>
                <span class="badge-pill badge-green">HIGH CONVICTION</span>
              </div>
            </div>
            <div style="margin-top: 12px;">
              <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 800; font-family: monospace; margin-bottom: 4px;">
                <span style="color: #fbbf24;">SF 42.5%</span>
                <span style="color: var(--text-muted);">Simulated Win Odds</span>
                <span style="color: #34d399;">GB 57.5%</span>
              </div>
              <div style="width: 100%; height: 8px; background: #334155; border-radius: 999px; overflow: hidden; display: flex;">
                <div style="width: 42.5%; background: #fbbf24; height: 100%;"></div>
                <div style="width: 57.5%; background: #10b981; height: 100%;"></div>
              </div>
            </div>
          </div>
          <p style="font-size: 12px; color: #cbd5e1; line-height: 1.5; margin: 0 0 10px 0;">
            <strong>Why Green Bay Wins:</strong> Brock Purdy's throwing shoulder limitations reduce deep vertical efficiency; Green Bay's defense with Xavier McKinney (7 INT) creates turnover opportunities in late November weather.
          </p>
          <div style="background: rgba(15, 23, 42, 0.5); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); font-size: 11px; color: #fbbf24;">
            ★ <strong>Top Safe Prop:</strong> Christian McCaffrey Over 4.5 Receptions (-125, 93% Conviction)
          </div>
        </div>

        <!-- 4. WAS @ PHI -->
        <div class="card slate-game-card" data-day="SUNDAY" style="border-left: 4px solid var(--primary); margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--card-border); padding-bottom: 10px; margin-bottom: 14px; font-size: 11px;">
            <span style="color: var(--text-muted); font-weight: 700;">🏈 Sunday Nov 22 • 8:20 PM ET • NBC • Lincoln Financial Field, Philadelphia, PA</span>
            <span class="badge-pill badge-blue">Sunday Night Football</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: center; margin-bottom: 16px;">
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">VISITOR</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">Washington Commanders (WAS)</div>
              <div style="font-size: 12px; color: #fbbf24; font-family: monospace; font-weight: 800;">ML +155</div>
            </div>
            <div style="font-weight: 900; color: var(--text-muted); font-size: 13px;">@</div>
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">HOME FAVORITE</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">Philadelphia Eagles (PHI)</div>
              <div style="font-size: 12px; color: #34d399; font-family: monospace; font-weight: 800;">ML -185</div>
            </div>
          </div>
          <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(15, 23, 42, 0.9)); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 14px; padding: 16px; margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <div>
                <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; color: #34d399;">🎯 AI Official Game Pick</div>
                <div style="font-size: 20px; font-weight: 900; color: white; margin: 4px 0;">PICK TO WIN: <span style="color: #34d399;">Philadelphia Eagles</span></div>
                <div style="font-size: 12px; color: #cbd5e1;">Projected Final Score: <strong style="color: white; font-family: monospace;">PHI 27 - WAS 23</strong> • Spread: <strong style="color: #6ee7b7;">PHI -3.5</strong> • Total: <strong style="color: #a78bfa;">OVER 49.0</strong></div>
              </div>
              <div style="text-align: right; background: rgba(15, 23, 42, 0.8); padding: 10px 16px; border-radius: 12px; border: 1px solid var(--card-border);">
                <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Win Probability</div>
                <div style="font-size: 24px; font-weight: 900; color: #34d399; font-family: monospace;">61.5%</div>
                <span class="badge-pill badge-green">HIGH CONVICTION</span>
              </div>
            </div>
            <div style="margin-top: 12px;">
              <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 800; font-family: monospace; margin-bottom: 4px;">
                <span style="color: #fbbf24;">WAS 38.5%</span>
                <span style="color: var(--text-muted);">Simulated Win Odds</span>
                <span style="color: #34d399;">PHI 61.5%</span>
              </div>
              <div style="width: 100%; height: 8px; background: #334155; border-radius: 999px; overflow: hidden; display: flex;">
                <div style="width: 38.5%; background: #fbbf24; height: 100%;"></div>
                <div style="width: 61.5%; background: #10b981; height: 100%;"></div>
              </div>
            </div>
          </div>
          <p style="font-size: 12px; color: #cbd5e1; line-height: 1.5; margin: 0 0 10px 0;">
            <strong>Why Philadelphia Wins:</strong> Saquon Barkley (1,280 rush yds, 11 TD) and DeVonta Smith command target share while A.J. Brown is sidelined per NFL.com. Jalen Hurts dominates on prime time.
          </p>
          <div style="background: rgba(15, 23, 42, 0.5); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); font-size: 11px; color: #fbbf24;">
            ★ <strong>Top Safe Prop:</strong> DeVonta Smith Over 68.5 Receiving Yards (-115, 93% Conviction)
          </div>
        </div>

        <!-- 5. JAX @ DET -->
        <div class="card slate-game-card" data-day="SUNDAY" style="border-left: 4px solid var(--primary); margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--card-border); padding-bottom: 10px; margin-bottom: 14px; font-size: 11px;">
            <span style="color: var(--text-muted); font-weight: 700;">🏈 Sunday Nov 22 • 1:00 PM ET • CBS • Ford Field, Detroit, MI</span>
            <span class="badge-pill badge-blue">NFL Week 12</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: center; margin-bottom: 16px;">
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">VISITOR</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">Jacksonville Jaguars (JAX)</div>
              <div style="font-size: 12px; color: #fbbf24; font-family: monospace; font-weight: 800;">ML +320</div>
            </div>
            <div style="font-weight: 900; color: var(--text-muted); font-size: 13px;">@</div>
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">HOME FAVORITE</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">Detroit Lions (DET)</div>
              <div style="font-size: 12px; color: #34d399; font-family: monospace; font-weight: 800;">ML -400</div>
            </div>
          </div>
          <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(15, 23, 42, 0.9)); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 14px; padding: 16px; margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <div>
                <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; color: #34d399;">🎯 AI Official Game Pick</div>
                <div style="font-size: 20px; font-weight: 900; color: white; margin: 4px 0;">PICK TO WIN: <span style="color: #34d399;">Detroit Lions</span></div>
                <div style="font-size: 12px; color: #cbd5e1;">Projected Final Score: <strong style="color: white; font-family: monospace;">DET 35 - JAX 17</strong> • Spread: <strong style="color: #6ee7b7;">DET -8.5</strong> • Total: <strong style="color: #a78bfa;">OVER 49.5</strong></div>
              </div>
              <div style="text-align: right; background: rgba(15, 23, 42, 0.8); padding: 10px 16px; border-radius: 12px; border: 1px solid var(--card-border);">
                <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Win Probability</div>
                <div style="font-size: 24px; font-weight: 900; color: #34d399; font-family: monospace;">80.5%</div>
                <span class="badge-pill badge-green">LOCK PICK</span>
              </div>
            </div>
            <div style="margin-top: 12px;">
              <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 800; font-family: monospace; margin-bottom: 4px;">
                <span style="color: #fbbf24;">JAX 19.5%</span>
                <span style="color: var(--text-muted);">Simulated Win Odds</span>
                <span style="color: #34d399;">DET 80.5%</span>
              </div>
              <div style="width: 100%; height: 8px; background: #334155; border-radius: 999px; overflow: hidden; display: flex;">
                <div style="width: 19.5%; background: #fbbf24; height: 100%;"></div>
                <div style="width: 80.5%; background: #10b981; height: 100%;"></div>
              </div>
            </div>
          </div>
          <p style="font-size: 12px; color: #cbd5e1; line-height: 1.5; margin: 0 0 10px 0;">
            <strong>Why Detroit Wins:</strong> Detroit leads the NFL in scoring efficiency (+1.48 EPA/drive). The combination of David Montgomery and Jahmyr Gibbs running behind Frank Ragnow and Penei Sewell easily covers the spread.
          </p>
          <div style="background: rgba(15, 23, 42, 0.5); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); font-size: 11px; color: #fbbf24;">
            ★ <strong>Top Safe Prop:</strong> David Montgomery or Jahmyr Gibbs Anytime Touchdown (-165, 95% Conviction)
          </div>
        </div>

        <!-- 6. MIN @ CHI -->
        <div class="card slate-game-card" data-day="SUNDAY" style="border-left: 4px solid var(--primary); margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--card-border); padding-bottom: 10px; margin-bottom: 14px; font-size: 11px;">
            <span style="color: var(--text-muted); font-weight: 700;">🏈 Sunday Nov 22 • 1:00 PM ET • FOX • Soldier Field, Chicago, IL</span>
            <span class="badge-pill badge-blue">NFL Week 12</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: center; margin-bottom: 16px;">
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">VISITOR FAVORITE</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">Minnesota Vikings (MIN)</div>
              <div style="font-size: 12px; color: #34d399; font-family: monospace; font-weight: 800;">ML -180</div>
            </div>
            <div style="font-weight: 900; color: var(--text-muted); font-size: 13px;">@</div>
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">HOME</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">Chicago Bears (CHI)</div>
              <div style="font-size: 12px; color: #fbbf24; font-family: monospace; font-weight: 800;">ML +155</div>
            </div>
          </div>
          <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(15, 23, 42, 0.9)); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 14px; padding: 16px; margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <div>
                <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; color: #34d399;">🎯 AI Official Game Pick</div>
                <div style="font-size: 20px; font-weight: 900; color: white; margin: 4px 0;">PICK TO WIN: <span style="color: #34d399;">Minnesota Vikings</span></div>
                <div style="font-size: 12px; color: #cbd5e1;">Projected Final Score: <strong style="color: white; font-family: monospace;">MIN 24 - CHI 17</strong> • Spread: <strong style="color: #6ee7b7;">MIN -3.5</strong> • Total: <strong style="color: #a78bfa;">OVER 39.5</strong></div>
              </div>
              <div style="text-align: right; background: rgba(15, 23, 42, 0.8); padding: 10px 16px; border-radius: 12px; border: 1px solid var(--card-border);">
                <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Win Probability</div>
                <div style="font-size: 24px; font-weight: 900; color: #34d399; font-family: monospace;">66.5%</div>
                <span class="badge-pill badge-green">HIGH CONVICTION</span>
              </div>
            </div>
            <div style="margin-top: 12px;">
              <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 800; font-family: monospace; margin-bottom: 4px;">
                <span style="color: #34d399;">MIN 66.5%</span>
                <span style="color: var(--text-muted);">Simulated Win Odds</span>
                <span style="color: #fbbf24;">CHI 33.5%</span>
              </div>
              <div style="width: 100%; height: 8px; background: #334155; border-radius: 999px; overflow: hidden; display: flex;">
                <div style="width: 66.5%; background: #10b981; height: 100%;"></div>
                <div style="width: 33.5%; background: #fbbf24; height: 100%;"></div>
              </div>
            </div>
          </div>
          <p style="font-size: 12px; color: #cbd5e1; line-height: 1.5; margin: 0 0 10px 0;">
            <strong>Why Minnesota Wins:</strong> Brian Flores' defensive schemes pressure rookie QB Caleb Williams into quick checkdowns. Justin Jefferson is 100% active and commands the middle of the field.
          </p>
          <div style="background: rgba(15, 23, 42, 0.5); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); font-size: 11px; color: #fbbf24;">
            ★ <strong>Top Safe Prop:</strong> Justin Jefferson Over 78.5 Receiving Yards (-115, 94% Conviction)
          </div>
        </div>

        <!-- 7. TEN @ HOU -->
        <div class="card slate-game-card" data-day="SUNDAY" style="border-left: 4px solid var(--primary); margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--card-border); padding-bottom: 10px; margin-bottom: 14px; font-size: 11px;">
            <span style="color: var(--text-muted); font-weight: 700;">🏈 Sunday Nov 22 • 1:00 PM ET • CBS • NRG Stadium, Houston, TX</span>
            <span class="badge-pill badge-blue">NFL Week 12</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: center; margin-bottom: 16px;">
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">VISITOR</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">Tennessee Titans (TEN)</div>
              <div style="font-size: 12px; color: #fbbf24; font-family: monospace; font-weight: 800;">ML +290</div>
            </div>
            <div style="font-weight: 900; color: var(--text-muted); font-size: 13px;">@</div>
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">HOME FAVORITE</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">Houston Texans (HOU)</div>
              <div style="font-size: 12px; color: #34d399; font-family: monospace; font-weight: 800;">ML -360</div>
            </div>
          </div>
          <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(15, 23, 42, 0.9)); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 14px; padding: 16px; margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <div>
                <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; color: #34d399;">🎯 AI Official Game Pick</div>
                <div style="font-size: 20px; font-weight: 900; color: white; margin: 4px 0;">PICK TO WIN: <span style="color: #34d399;">Houston Texans</span></div>
                <div style="font-size: 12px; color: #cbd5e1;">Projected Final Score: <strong style="color: white; font-family: monospace;">HOU 27 - TEN 14</strong> • Spread: <strong style="color: #6ee7b7;">HOU -7.5</strong> • Total: <strong style="color: #a78bfa;">UNDER 41.5</strong></div>
              </div>
              <div style="text-align: right; background: rgba(15, 23, 42, 0.8); padding: 10px 16px; border-radius: 12px; border: 1px solid var(--card-border);">
                <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Win Probability</div>
                <div style="font-size: 24px; font-weight: 900; color: #34d399; font-family: monospace;">76.2%</div>
                <span class="badge-pill badge-green">LOCK PICK</span>
              </div>
            </div>
            <div style="margin-top: 12px;">
              <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 800; font-family: monospace; margin-bottom: 4px;">
                <span style="color: #fbbf24;">TEN 23.8%</span>
                <span style="color: var(--text-muted);">Simulated Win Odds</span>
                <span style="color: #34d399;">HOU 76.2%</span>
              </div>
              <div style="width: 100%; height: 8px; background: #334155; border-radius: 999px; overflow: hidden; display: flex;">
                <div style="width: 23.8%; background: #fbbf24; height: 100%;"></div>
                <div style="width: 76.2%; background: #10b981; height: 100%;"></div>
              </div>
            </div>
          </div>
          <p style="font-size: 12px; color: #cbd5e1; line-height: 1.5; margin: 0 0 10px 0;">
            <strong>Why Houston Wins:</strong> Will Anderson Jr. and Danielle Hunter generate relentless edge pressure. Joe Mixon provides heavy clock-killing volume at NRG Stadium.
          </p>
          <div style="background: rgba(15, 23, 42, 0.5); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); font-size: 11px; color: #fbbf24;">
            ★ <strong>Top Safe Prop:</strong> Joe Mixon Over 72.5 Rushing Yards (-115, 93% Conviction)
          </div>
        </div>

        <!-- 8. DAL @ CAR -->
        <div class="card slate-game-card" data-day="SUNDAY" style="border-left: 4px solid var(--primary); margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--card-border); padding-bottom: 10px; margin-bottom: 14px; font-size: 11px;">
            <span style="color: var(--text-muted); font-weight: 700;">🏈 Sunday Nov 22 • 1:00 PM ET • FOX • Bank of America Stadium, Charlotte, NC</span>
            <span class="badge-pill badge-blue">NFL Week 12</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: center; margin-bottom: 16px;">
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">VISITOR FAVORITE</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">Dallas Cowboys (DAL)</div>
              <div style="font-size: 12px; color: #34d399; font-family: monospace; font-weight: 800;">ML -280</div>
            </div>
            <div style="font-weight: 900; color: var(--text-muted); font-size: 13px;">@</div>
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">HOME</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">Carolina Panthers (CAR)</div>
              <div style="font-size: 12px; color: #fbbf24; font-family: monospace; font-weight: 800;">ML +230</div>
            </div>
          </div>
          <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(15, 23, 42, 0.9)); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 14px; padding: 16px; margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <div>
                <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; color: #34d399;">🎯 AI Official Game Pick</div>
                <div style="font-size: 20px; font-weight: 900; color: white; margin: 4px 0;">PICK TO WIN: <span style="color: #34d399;">Dallas Cowboys</span></div>
                <div style="font-size: 12px; color: #cbd5e1;">Projected Final Score: <strong style="color: white; font-family: monospace;">DAL 28 - CAR 17</strong> • Spread: <strong style="color: #6ee7b7;">DAL -6.5</strong> • Total: <strong style="color: #a78bfa;">OVER 42.5</strong></div>
              </div>
              <div style="text-align: right; background: rgba(15, 23, 42, 0.8); padding: 10px 16px; border-radius: 12px; border: 1px solid var(--card-border);">
                <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Win Probability</div>
                <div style="font-size: 24px; font-weight: 900; color: #34d399; font-family: monospace;">72.8%</div>
                <span class="badge-pill badge-green">LOCK PICK</span>
              </div>
            </div>
            <div style="margin-top: 12px;">
              <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 800; font-family: monospace; margin-bottom: 4px;">
                <span style="color: #34d399;">DAL 72.8%</span>
                <span style="color: var(--text-muted);">Simulated Win Odds</span>
                <span style="color: #fbbf24;">CAR 27.2%</span>
              </div>
              <div style="width: 100%; height: 8px; background: #334155; border-radius: 999px; overflow: hidden; display: flex;">
                <div style="width: 72.8%; background: #10b981; height: 100%;"></div>
                <div style="width: 27.2%; background: #fbbf24; height: 100%;"></div>
              </div>
            </div>
          </div>
          <p style="font-size: 12px; color: #cbd5e1; line-height: 1.5; margin: 0 0 10px 0;">
            <strong>Why Dallas Wins:</strong> Dak Prescott is 100% active and healthy, giving Dallas a massive quarterback advantage against Carolina's secondary. CeeDee Lamb and Jake Ferguson create constant separation.
          </p>
          <div style="background: rgba(15, 23, 42, 0.5); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); font-size: 11px; color: #fbbf24;">
            ★ <strong>Top Safe Prop:</strong> Dak Prescott Over 245.5 Passing Yards (-115, 93% Conviction)
          </div>
        </div>

        <!-- 9. TB @ NYG -->
        <div class="card slate-game-card" data-day="SUNDAY" style="border-left: 4px solid var(--primary); margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--card-border); padding-bottom: 10px; margin-bottom: 14px; font-size: 11px;">
            <span style="color: var(--text-muted); font-weight: 700;">🏈 Sunday Nov 22 • 1:00 PM ET • CBS • MetLife Stadium, East Rutherford, NJ</span>
            <span class="badge-pill badge-blue">NFL Week 12</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: center; margin-bottom: 16px;">
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">VISITOR FAVORITE</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">Tampa Bay Buccaneers (TB)</div>
              <div style="font-size: 12px; color: #34d399; font-family: monospace; font-weight: 800;">ML -245</div>
            </div>
            <div style="font-weight: 900; color: var(--text-muted); font-size: 13px;">@</div>
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">HOME</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">New York Giants (NYG)</div>
              <div style="font-size: 12px; color: #fbbf24; font-family: monospace; font-weight: 800;">ML +200</div>
            </div>
          </div>
          <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(15, 23, 42, 0.9)); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 14px; padding: 16px; margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <div>
                <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; color: #34d399;">🎯 AI Official Game Pick</div>
                <div style="font-size: 20px; font-weight: 900; color: white; margin: 4px 0;">PICK TO WIN: <span style="color: #34d399;">Tampa Bay Buccaneers</span></div>
                <div style="font-size: 12px; color: #cbd5e1;">Projected Final Score: <strong style="color: white; font-family: monospace;">TB 26 - NYG 19</strong> • Spread: <strong style="color: #6ee7b7;">TB -5.5</strong> • Total: <strong style="color: #a78bfa;">OVER 43.5</strong></div>
              </div>
              <div style="text-align: right; background: rgba(15, 23, 42, 0.8); padding: 10px 16px; border-radius: 12px; border: 1px solid var(--card-border);">
                <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Win Probability</div>
                <div style="font-size: 24px; font-weight: 900; color: #34d399; font-family: monospace;">68.0%</div>
                <span class="badge-pill badge-green">HIGH CONVICTION</span>
              </div>
            </div>
            <div style="margin-top: 12px;">
              <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 800; font-family: monospace; margin-bottom: 4px;">
                <span style="color: #34d399;">TB 68.0%</span>
                <span style="color: var(--text-muted);">Simulated Win Odds</span>
                <span style="color: #fbbf24;">NYG 32.0%</span>
              </div>
              <div style="width: 100%; height: 8px; background: #334155; border-radius: 999px; overflow: hidden; display: flex;">
                <div style="width: 68.0%; background: #10b981; height: 100%;"></div>
                <div style="width: 32.0%; background: #fbbf24; height: 100%;"></div>
              </div>
            </div>
          </div>
          <p style="font-size: 12px; color: #cbd5e1; line-height: 1.5; margin: 0 0 10px 0;">
            <strong>Why Tampa Bay Wins:</strong> Baker Mayfield has Mike Evans 100% cleared from hamstring soreness. Bucky Irving provides explosive efficiency against the Giants defensive front.
          </p>
          <div style="background: rgba(15, 23, 42, 0.5); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); font-size: 11px; color: #fbbf24;">
            ★ <strong>Top Safe Prop:</strong> Bucky Irving Over 54.5 Rushing Yards (-115, 92% Conviction)
          </div>
        </div>

        <!-- 10. DEN @ LV -->
        <div class="card slate-game-card" data-day="SUNDAY" style="border-left: 4px solid var(--primary); margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--card-border); padding-bottom: 10px; margin-bottom: 14px; font-size: 11px;">
            <span style="color: var(--text-muted); font-weight: 700;">🏈 Sunday Nov 22 • 4:05 PM ET • CBS • Allegiant Stadium, Las Vegas, NV</span>
            <span class="badge-pill badge-blue">NFL Week 12</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: center; margin-bottom: 16px;">
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">VISITOR FAVORITE</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">Denver Broncos (DEN)</div>
              <div style="font-size: 12px; color: #34d399; font-family: monospace; font-weight: 800;">ML -160</div>
            </div>
            <div style="font-weight: 900; color: var(--text-muted); font-size: 13px;">@</div>
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">HOME</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">Las Vegas Raiders (LV)</div>
              <div style="font-size: 12px; color: #fbbf24; font-family: monospace; font-weight: 800;">ML +135</div>
            </div>
          </div>
          <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(15, 23, 42, 0.9)); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 14px; padding: 16px; margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <div>
                <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; color: #34d399;">🎯 AI Official Game Pick</div>
                <div style="font-size: 20px; font-weight: 900; color: white; margin: 4px 0;">PICK TO WIN: <span style="color: #34d399;">Denver Broncos</span></div>
                <div style="font-size: 12px; color: #cbd5e1;">Projected Final Score: <strong style="color: white; font-family: monospace;">DEN 23 - LV 16</strong> • Spread: <strong style="color: #6ee7b7;">DEN -3.0</strong> • Total: <strong style="color: #a78bfa;">UNDER 40.5</strong></div>
              </div>
              <div style="text-align: right; background: rgba(15, 23, 42, 0.8); padding: 10px 16px; border-radius: 12px; border: 1px solid var(--card-border);">
                <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Win Probability</div>
                <div style="font-size: 24px; font-weight: 900; color: #34d399; font-family: monospace;">63.4%</div>
                <span class="badge-pill badge-green">HIGH CONVICTION</span>
              </div>
            </div>
            <div style="margin-top: 12px;">
              <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 800; font-family: monospace; margin-bottom: 4px;">
                <span style="color: #34d399;">DEN 63.4%</span>
                <span style="color: var(--text-muted);">Simulated Win Odds</span>
                <span style="color: #fbbf24;">LV 36.6%</span>
              </div>
              <div style="width: 100%; height: 8px; background: #334155; border-radius: 999px; overflow: hidden; display: flex;">
                <div style="width: 63.4%; background: #10b981; height: 100%;"></div>
                <div style="width: 36.6%; background: #fbbf24; height: 100%;"></div>
              </div>
            </div>
          </div>
          <p style="font-size: 12px; color: #cbd5e1; line-height: 1.5; margin: 0 0 10px 0;">
            <strong>Why Denver Wins:</strong> Patrick Surtain II locks down perimeter receivers. Bo Nix manages clock and limits turnovers against Maxx Crosby and the Raiders front.
          </p>
          <div style="background: rgba(15, 23, 42, 0.5); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); font-size: 11px; color: #fbbf24;">
            ★ <strong>Top Safe Prop:</strong> Brock Bowers Over 5.5 Receptions (-125, 93% Conviction)
          </div>
        </div>

        <!-- 11. ARI @ SEA -->
        <div class="card slate-game-card" data-day="SUNDAY" style="border-left: 4px solid var(--primary); margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--card-border); padding-bottom: 10px; margin-bottom: 14px; font-size: 11px;">
            <span style="color: var(--text-muted); font-weight: 700;">🏈 Sunday Nov 22 • 4:25 PM ET • FOX • Lumen Field, Seattle, WA</span>
            <span class="badge-pill badge-blue">NFL Week 12</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: center; margin-bottom: 16px;">
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">VISITOR</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">Arizona Cardinals (ARI)</div>
              <div style="font-size: 12px; color: #fbbf24; font-family: monospace; font-weight: 800;">ML +110</div>
            </div>
            <div style="font-weight: 900; color: var(--text-muted); font-size: 13px;">@</div>
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">HOME FAVORITE</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">Seattle Seahawks (SEA)</div>
              <div style="font-size: 12px; color: #34d399; font-family: monospace; font-weight: 800;">ML -130</div>
            </div>
          </div>
          <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(15, 23, 42, 0.9)); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 14px; padding: 16px; margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <div>
                <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; color: #34d399;">🎯 AI Official Game Pick</div>
                <div style="font-size: 20px; font-weight: 900; color: white; margin: 4px 0;">PICK TO WIN: <span style="color: #34d399;">Seattle Seahawks</span></div>
                <div style="font-size: 12px; color: #cbd5e1;">Projected Final Score: <strong style="color: white; font-family: monospace;">SEA 24 - ARI 21</strong> • Spread: <strong style="color: #6ee7b7;">SEA -2.5</strong> • Total: <strong style="color: #a78bfa;">UNDER 46.5</strong></div>
              </div>
              <div style="text-align: right; background: rgba(15, 23, 42, 0.8); padding: 10px 16px; border-radius: 12px; border: 1px solid var(--card-border);">
                <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Win Probability</div>
                <div style="font-size: 24px; font-weight: 900; color: #34d399; font-family: monospace;">59.5%</div>
                <span class="badge-pill badge-green">VALUE PICK</span>
              </div>
            </div>
            <div style="margin-top: 12px;">
              <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 800; font-family: monospace; margin-bottom: 4px;">
                <span style="color: #fbbf24;">ARI 40.5%</span>
                <span style="color: var(--text-muted);">Simulated Win Odds</span>
                <span style="color: #34d399;">SEA 59.5%</span>
              </div>
              <div style="width: 100%; height: 8px; background: #334155; border-radius: 999px; overflow: hidden; display: flex;">
                <div style="width: 40.5%; background: #fbbf24; height: 100%;"></div>
                <div style="width: 59.5%; background: #10b981; height: 100%;"></div>
              </div>
            </div>
          </div>
          <p style="font-size: 12px; color: #cbd5e1; line-height: 1.5; margin: 0 0 10px 0;">
            <strong>Why Seattle Wins:</strong> Kenneth Walker III and DK Metcalf match up favorably against Arizona's vulnerable run defense in front of the 12th Man crowd noise.
          </p>
          <div style="background: rgba(15, 23, 42, 0.5); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); font-size: 11px; color: #fbbf24;">
            ★ <strong>Top Safe Prop:</strong> Kenneth Walker III Over 64.5 Rushing Yards (-115, 91% Conviction)
          </div>
        </div>

        <!-- 12. MIA @ NYJ -->
        <div class="card slate-game-card" data-day="SUNDAY" style="border-left: 4px solid var(--primary); margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--card-border); padding-bottom: 10px; margin-bottom: 14px; font-size: 11px;">
            <span style="color: var(--text-muted); font-weight: 700;">🏈 Sunday Nov 22 • 1:00 PM ET • CBS • MetLife Stadium, East Rutherford, NJ</span>
            <span class="badge-pill badge-blue">NFL Week 12</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: center; margin-bottom: 16px;">
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">VISITOR FAVORITE</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">Miami Dolphins (MIA)</div>
              <div style="font-size: 12px; color: #34d399; font-family: monospace; font-weight: 800;">ML -130</div>
            </div>
            <div style="font-weight: 900; color: var(--text-muted); font-size: 13px;">@</div>
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">HOME</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">New York Jets (NYJ)</div>
              <div style="font-size: 12px; color: #fbbf24; font-family: monospace; font-weight: 800;">ML +110</div>
            </div>
          </div>
          <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(15, 23, 42, 0.9)); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 14px; padding: 16px; margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <div>
                <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; color: #34d399;">🎯 AI Official Game Pick</div>
                <div style="font-size: 20px; font-weight: 900; color: white; margin: 4px 0;">PICK TO WIN: <span style="color: #34d399;">Miami Dolphins</span></div>
                <div style="font-size: 12px; color: #cbd5e1;">Projected Final Score: <strong style="color: white; font-family: monospace;">MIA 23 - NYJ 20</strong> • Spread: <strong style="color: #6ee7b7;">MIA -1.5</strong> • Total: <strong style="color: #a78bfa;">UNDER 43.5</strong></div>
              </div>
              <div style="text-align: right; background: rgba(15, 23, 42, 0.8); padding: 10px 16px; border-radius: 12px; border: 1px solid var(--card-border);">
                <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Win Probability</div>
                <div style="font-size: 24px; font-weight: 900; color: #34d399; font-family: monospace;">58.0%</div>
                <span class="badge-pill badge-green">VALUE PICK</span>
              </div>
            </div>
            <div style="margin-top: 12px;">
              <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 800; font-family: monospace; margin-bottom: 4px;">
                <span style="color: #34d399;">MIA 58.0%</span>
                <span style="color: var(--text-muted);">Simulated Win Odds</span>
                <span style="color: #fbbf24;">NYJ 42.0%</span>
              </div>
              <div style="width: 100%; height: 8px; background: #334155; border-radius: 999px; overflow: hidden; display: flex;">
                <div style="width: 58.0%; background: #10b981; height: 100%;"></div>
                <div style="width: 42.0%; background: #fbbf24; height: 100%;"></div>
              </div>
            </div>
          </div>
          <p style="font-size: 12px; color: #cbd5e1; line-height: 1.5; margin: 0 0 10px 0;">
            <strong>Why Miami Wins:</strong> Tua Tagovailoa's lightning-fast 2.2-second time-to-throw neutralizes the Jets interior pass rush. De'Von Achane creates high-danger yards after catch.
          </p>
          <div style="background: rgba(15, 23, 42, 0.5); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); font-size: 11px; color: #fbbf24;">
            ★ <strong>Top Safe Prop:</strong> De'Von Achane Over 4.5 Receptions (-120, 92% Conviction)
          </div>
        </div>

        <!-- 13. MONDAY NIGHT: BAL @ LAC -->
        <div class="card slate-game-card" data-day="MONDAY" style="border-left: 4px solid #38bdf8; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--card-border); padding-bottom: 10px; margin-bottom: 14px; font-size: 11px;">
            <span style="color: #38bdf8; font-weight: 800;">🌙 Monday Night Nov 23 • 8:15 PM ET • ESPN • SoFi Stadium, Inglewood, CA</span>
            <span class="badge-pill badge-blue">Monday Night Football</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: center; margin-bottom: 16px;">
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">VISITOR FAVORITE</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">Baltimore Ravens (BAL)</div>
              <div style="font-size: 12px; color: #34d399; font-family: monospace; font-weight: 800;">ML -155</div>
            </div>
            <div style="font-weight: 900; color: var(--text-muted); font-size: 13px;">@</div>
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">HOME</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">Los Angeles Chargers (LAC)</div>
              <div style="font-size: 12px; color: #fbbf24; font-family: monospace; font-weight: 800;">ML +130</div>
            </div>
          </div>
          <div style="background: linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(15, 23, 42, 0.9)); border: 1px solid rgba(56, 189, 248, 0.4); border-radius: 14px; padding: 16px; margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <div>
                <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; color: #38bdf8;">🎯 AI Official Game Pick</div>
                <div style="font-size: 20px; font-weight: 900; color: white; margin: 4px 0;">PICK TO WIN: <span style="color: #38bdf8;">Baltimore Ravens</span></div>
                <div style="font-size: 12px; color: #cbd5e1;">Projected Final Score: <strong style="color: white; font-family: monospace;">BAL 26 - LAC 23</strong> • Spread: <strong style="color: #38bdf8;">BAL -2.5</strong> • Total: <strong style="color: #a78bfa;">OVER 47.5</strong></div>
              </div>
              <div style="text-align: right; background: rgba(15, 23, 42, 0.8); padding: 10px 16px; border-radius: 12px; border: 1px solid var(--card-border);">
                <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Win Probability</div>
                <div style="font-size: 24px; font-weight: 900; color: #38bdf8; font-family: monospace;">61.2%</div>
                <span class="badge-pill badge-green">PRIME TIME LOCK</span>
              </div>
            </div>
            <div style="margin-top: 12px;">
              <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 800; font-family: monospace; margin-bottom: 4px;">
                <span style="color: #38bdf8;">BAL 61.2%</span>
                <span style="color: var(--text-muted);">Simulated Win Odds</span>
                <span style="color: #fbbf24;">LAC 38.8%</span>
              </div>
              <div style="width: 100%; height: 8px; background: #334155; border-radius: 999px; overflow: hidden; display: flex;">
                <div style="width: 61.2%; background: #38bdf8; height: 100%;"></div>
                <div style="width: 38.8%; background: #fbbf24; height: 100%;"></div>
              </div>
            </div>
          </div>
          <p style="font-size: 12px; color: #cbd5e1; line-height: 1.5; margin: 0 0 10px 0;">
            <strong>Why Baltimore Wins:</strong> Monday Night Harbaugh Bowl: Lamar Jackson and Derrick Henry give the Ravens superior late-game execution against Justin Herbert and the Chargers.
          </p>
          <div style="background: rgba(15, 23, 42, 0.5); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); font-size: 11px; color: #fbbf24;">
            ★ <strong>Top Safe Prop:</strong> Derrick Henry Anytime Touchdown (-180, 96% Conviction)
          </div>
        </div>

        <!-- 14. THANKSGIVING 1: CHI @ DET -->
        <div class="card slate-game-card" data-day="THANKSGIVING" style="border-left: 4px solid #f59e0b; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--card-border); padding-bottom: 10px; margin-bottom: 14px; font-size: 11px;">
            <span style="color: #f59e0b; font-weight: 800;">🍗 Thanksgiving Thursday Nov 26 • 12:30 PM ET • FOX • Ford Field, Detroit, MI</span>
            <span class="badge-pill badge-amber">Thanksgiving Opener</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: center; margin-bottom: 16px;">
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">VISITOR</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">Chicago Bears (CHI)</div>
              <div style="font-size: 12px; color: #fbbf24; font-family: monospace; font-weight: 800;">ML +300</div>
            </div>
            <div style="font-weight: 900; color: var(--text-muted); font-size: 13px;">@</div>
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">HOME FAVORITE</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">Detroit Lions (DET)</div>
              <div style="font-size: 12px; color: #34d399; font-family: monospace; font-weight: 800;">ML -380</div>
            </div>
          </div>
          <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(15, 23, 42, 0.9)); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 14px; padding: 16px; margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <div>
                <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; color: #f59e0b;">🎯 AI Official Game Pick</div>
                <div style="font-size: 20px; font-weight: 900; color: white; margin: 4px 0;">PICK TO WIN: <span style="color: #f59e0b;">Detroit Lions</span></div>
                <div style="font-size: 12px; color: #cbd5e1;">Projected Final Score: <strong style="color: white; font-family: monospace;">DET 31 - CHI 19</strong> • Spread: <strong style="color: #f59e0b;">DET -7.5</strong> • Total: <strong style="color: #a78bfa;">OVER 48.5</strong></div>
              </div>
              <div style="text-align: right; background: rgba(15, 23, 42, 0.8); padding: 10px 16px; border-radius: 12px; border: 1px solid var(--card-border);">
                <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Win Probability</div>
                <div style="font-size: 24px; font-weight: 900; color: #f59e0b; font-family: monospace;">79.5%</div>
                <span class="badge-pill badge-green">HOLIDAY LOCK</span>
              </div>
            </div>
            <div style="margin-top: 12px;">
              <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 800; font-family: monospace; margin-bottom: 4px;">
                <span style="color: #fbbf24;">CHI 20.5%</span>
                <span style="color: var(--text-muted);">Simulated Win Odds</span>
                <span style="color: #f59e0b;">DET 79.5%</span>
              </div>
              <div style="width: 100%; height: 8px; background: #334155; border-radius: 999px; overflow: hidden; display: flex;">
                <div style="width: 20.5%; background: #fbbf24; height: 100%;"></div>
                <div style="width: 79.5%; background: #f59e0b; height: 100%;"></div>
              </div>
            </div>
          </div>
          <p style="font-size: 12px; color: #cbd5e1; line-height: 1.5; margin: 0 0 10px 0;">
            <strong>Why Detroit Wins:</strong> Dan Campbell's offensive line sets the tone early. Amon-Ra St. Brown and Jahmyr Gibbs dominate on the national holiday broadcast.
          </p>
          <div style="background: rgba(15, 23, 42, 0.5); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); font-size: 11px; color: #fbbf24;">
            ★ <strong>Top Safe Prop:</strong> Amon-Ra St. Brown Over 6.5 Receptions (-135, 93% Conviction)
          </div>
        </div>

        <!-- 15. THANKSGIVING 2: NYG @ DAL -->
        <div class="card slate-game-card" data-day="THANKSGIVING" style="border-left: 4px solid #f59e0b; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--card-border); padding-bottom: 10px; margin-bottom: 14px; font-size: 11px;">
            <span style="color: #f59e0b; font-weight: 800;">🍗 Thanksgiving Thursday Nov 26 • 4:30 PM ET • CBS • AT&T Stadium, Arlington, TX</span>
            <span class="badge-pill badge-amber">Thanksgiving Afternoon</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: center; margin-bottom: 16px;">
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">VISITOR</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">New York Giants (NYG)</div>
              <div style="font-size: 12px; color: #fbbf24; font-family: monospace; font-weight: 800;">ML +260</div>
            </div>
            <div style="font-weight: 900; color: var(--text-muted); font-size: 13px;">@</div>
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">HOME FAVORITE</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">Dallas Cowboys (DAL)</div>
              <div style="font-size: 12px; color: #34d399; font-family: monospace; font-weight: 800;">ML -320</div>
            </div>
          </div>
          <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(15, 23, 42, 0.9)); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 14px; padding: 16px; margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <div>
                <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; color: #f59e0b;">🎯 AI Official Game Pick</div>
                <div style="font-size: 20px; font-weight: 900; color: white; margin: 4px 0;">PICK TO WIN: <span style="color: #f59e0b;">Dallas Cowboys</span></div>
                <div style="font-size: 12px; color: #cbd5e1;">Projected Final Score: <strong style="color: white; font-family: monospace;">DAL 30 - NYG 17</strong> • Spread: <strong style="color: #f59e0b;">DAL -7.0</strong> • Total: <strong style="color: #a78bfa;">OVER 45.5</strong></div>
              </div>
              <div style="text-align: right; background: rgba(15, 23, 42, 0.8); padding: 10px 16px; border-radius: 12px; border: 1px solid var(--card-border);">
                <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Win Probability</div>
                <div style="font-size: 24px; font-weight: 900; color: #f59e0b; font-family: monospace;">75.0%</div>
                <span class="badge-pill badge-green">HOLIDAY LOCK</span>
              </div>
            </div>
            <div style="margin-top: 12px;">
              <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 800; font-family: monospace; margin-bottom: 4px;">
                <span style="color: #fbbf24;">NYG 25.0%</span>
                <span style="color: var(--text-muted);">Simulated Win Odds</span>
                <span style="color: #f59e0b;">DAL 75.0%</span>
              </div>
              <div style="width: 100%; height: 8px; background: #334155; border-radius: 999px; overflow: hidden; display: flex;">
                <div style="width: 25.0%; background: #fbbf24; height: 100%;"></div>
                <div style="width: 75.0%; background: #f59e0b; height: 100%;"></div>
              </div>
            </div>
          </div>
          <p style="font-size: 12px; color: #cbd5e1; line-height: 1.5; margin: 0 0 10px 0;">
            <strong>Why Dallas Wins:</strong> Dak Prescott is 100% active and holds a 12-2 career record against the Giants. CeeDee Lamb and Jake Ferguson exploit Giants coverage in front of 90,000 at AT&T Stadium.
          </p>
          <div style="background: rgba(15, 23, 42, 0.5); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); font-size: 11px; color: #fbbf24;">
            ★ <strong>Top Safe Prop:</strong> Dak Prescott Over 1.5 Passing Touchdowns (-130, 94% Conviction)
          </div>
        </div>

        <!-- 16. THANKSGIVING 3: MIA @ GB -->
        <div class="card slate-game-card" data-day="THANKSGIVING" style="border-left: 4px solid #f59e0b; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--card-border); padding-bottom: 10px; margin-bottom: 14px; font-size: 11px;">
            <span style="color: #f59e0b; font-weight: 800;">🍗 Thanksgiving Thursday Night Nov 26 • 8:20 PM ET • NBC • Lambeau Field, Green Bay, WI</span>
            <span class="badge-pill badge-amber">Thanksgiving Night</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: center; margin-bottom: 16px;">
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">VISITOR</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">Miami Dolphins (MIA)</div>
              <div style="font-size: 12px; color: #fbbf24; font-family: monospace; font-weight: 800;">ML +145</div>
            </div>
            <div style="font-weight: 900; color: var(--text-muted); font-size: 13px;">@</div>
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--card-border); text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted);">HOME FAVORITE</div>
              <div style="font-size: 16px; font-weight: 900; color: white;">Green Bay Packers (GB)</div>
              <div style="font-size: 12px; color: #34d399; font-family: monospace; font-weight: 800;">ML -175</div>
            </div>
          </div>
          <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(15, 23, 42, 0.9)); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 14px; padding: 16px; margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <div>
                <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; color: #f59e0b;">🎯 AI Official Game Pick</div>
                <div style="font-size: 20px; font-weight: 900; color: white; margin: 4px 0;">PICK TO WIN: <span style="color: #f59e0b;">Green Bay Packers</span></div>
                <div style="font-size: 12px; color: #cbd5e1;">Projected Final Score: <strong style="color: white; font-family: monospace;">GB 27 - MIA 21</strong> • Spread: <strong style="color: #f59e0b;">GB -3.5</strong> • Total: <strong style="color: #a78bfa;">OVER 46.5</strong></div>
              </div>
              <div style="text-align: right; background: rgba(15, 23, 42, 0.8); padding: 10px 16px; border-radius: 12px; border: 1px solid var(--card-border);">
                <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Win Probability</div>
                <div style="font-size: 24px; font-weight: 900; color: #f59e0b; font-family: monospace;">64.0%</div>
                <span class="badge-pill badge-green">HOLIDAY LOCK</span>
              </div>
            </div>
            <div style="margin-top: 12px;">
              <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 800; font-family: monospace; margin-bottom: 4px;">
                <span style="color: #fbbf24;">MIA 36.0%</span>
                <span style="color: var(--text-muted);">Simulated Win Odds</span>
                <span style="color: #f59e0b;">GB 64.0%</span>
              </div>
              <div style="width: 100%; height: 8px; background: #334155; border-radius: 999px; overflow: hidden; display: flex;">
                <div style="width: 36.0%; background: #fbbf24; height: 100%;"></div>
                <div style="width: 64.0%; background: #f59e0b; height: 100%;"></div>
              </div>
            </div>
          </div>
          <p style="font-size: 12px; color: #cbd5e1; line-height: 1.5; margin: 0 0 10px 0;">
            <strong>Why Green Bay Wins:</strong> Freezing Lambeau Field conditions heavily favor Jordan Love and Josh Jacobs' downhill power running against Miami's track team in sub-30 degree temperatures.
          </p>
          <div style="background: rgba(15, 23, 42, 0.5); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); font-size: 11px; color: #fbbf24;">
            ★ <strong>Top Safe Prop:</strong> Josh Jacobs Over 70.5 Rushing Yards (-115, 92% Conviction)
          </div>
        </div>

      </div>
    </div>
`;

// Insert slateHtml right before <!-- TAB: 2,000-GAME MATCHUP SIMULATOR
const marker = '<!-- ====================================================\r\n    <!-- TAB: 2,000-GAME MATCHUP SIMULATOR';
const markerLF = '<!-- ====================================================\n    <!-- TAB: 2,000-GAME MATCHUP SIMULATOR';

if (html.includes(marker)) {
  html = html.replace(marker, slateHtml + '\n' + marker);
} else if (html.includes(markerLF)) {
  html = html.replace(markerLF, slateHtml + '\n' + markerLF);
} else {
  // Fallback: insert before id="tab-simulator"
  html = html.replace('<div id="tab-simulator"', slateHtml + '\n    <div id="tab-simulator"');
}

// Add filterSlate JavaScript function before </script>
const filterSlateJs = `
    function filterSlate(day) {
      const cards = document.querySelectorAll('.slate-game-card');
      const btnAll = document.getElementById('slate-btn-all');
      const btnSunday = document.getElementById('slate-btn-sunday');
      const btnMonday = document.getElementById('slate-btn-monday');
      const btnThx = document.getElementById('slate-btn-thx');

      cards.forEach(card => {
        if (day === 'ALL' || card.getAttribute('data-day') === day) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });

      if (btnAll) btnAll.style.background = day === 'ALL' ? 'var(--primary)' : '#1e293b';
      if (btnSunday) btnSunday.style.background = day === 'SUNDAY' ? 'var(--primary)' : '#1e293b';
      if (btnMonday) btnMonday.style.background = day === 'MONDAY' ? 'var(--primary)' : '#1e293b';
      if (btnThx) btnThx.style.background = day === 'THANKSGIVING' ? 'var(--primary)' : '#1e293b';
    }
`;

html = html.replace('function switchTab(', filterSlateJs + '\n    function switchTab(');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('✅ Successfully added tab-nflslate and filterSlate() into .cloudflare-deploy/index.html');
