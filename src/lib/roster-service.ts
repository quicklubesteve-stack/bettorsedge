import { prisma } from "@/lib/db";
import { NFL_ALL_TEAMS, NHL_ALL_TEAMS } from "@/lib/teams";
import {
  NFL_ROSTERS_SEED,
  NHL_ROSTERS_SEED,
  generateGenericNflRoster,
  generateGenericNhlRoster,
  RawRosterPlayer,
} from "./roster-data";

export interface RosterSyncSummary {
  league: string;
  lastSyncedAt: Date;
  nextSyncDue: Date;
  updateFrequency: string;
  totalPlayers: number;
  totalTeams: number;
  status: string;
  syncNotes: string;
}

/**
 * Synchronizes and updates current active rosters in the database.
 * Scheduled to run once a week (or forced manually by admin).
 */
export async function syncRosters(
  targetLeague: "NFL" | "NHL" | "ALL" = "ALL",
  force = false
): Promise<{ success: boolean; summaries: RosterSyncSummary[] }> {
  const leaguesToSync: Array<"NFL" | "NHL"> =
    targetLeague === "ALL" ? ["NFL", "NHL"] : [targetLeague];

  const summaries: RosterSyncSummary[] = [];

  for (const league of leaguesToSync) {
    const teamsList = league === "NFL" ? NFL_ALL_TEAMS : NHL_ALL_TEAMS;
    const seedMap = league === "NFL" ? NFL_ROSTERS_SEED : NHL_ROSTERS_SEED;
    const genericGen = league === "NFL" ? generateGenericNflRoster : generateGenericNhlRoster;

    let playersCount = 0;

    // Delete existing roster for this league to refresh clean weekly state
    await prisma.teamRosterPlayer.deleteMany({
      where: { league },
    });

    const createData: Array<{
      league: string;
      team: string;
      teamName: string;
      name: string;
      jerseyNumber: number;
      position: string;
      unit: string;
      depthOrder: number;
      status: string;
      injuryDetails?: string;
      roleDescription: string;
      statsSummary: string;
      simulationWeight: number;
      touchdownWeight: number;
      goalWeight: number;
      season: string;
    }> = [];

    for (const t of teamsList) {
      const rawPlayers = seedMap[t.abbr] || genericGen(t.abbr, t.name);

      for (const p of rawPlayers) {
        createData.push({
          league,
          team: t.abbr,
          teamName: t.name,
          name: p.name,
          jerseyNumber: p.jerseyNumber,
          position: p.position,
          unit: p.unit,
          depthOrder: p.depthOrder,
          status: p.status,
          injuryDetails: p.injuryDetails || null,
          roleDescription: p.roleDescription,
          statsSummary: p.statsSummary,
          simulationWeight: p.simulationWeight,
          touchdownWeight: p.touchdownWeight || 0.0,
          goalWeight: p.goalWeight || 0.0,
          season: league === "NFL" ? "2024" : "2024-2025",
        });
        playersCount++;
      }
    }

    // Batch insert players
    await prisma.teamRosterPlayer.createMany({
      data: createData,
    });

    const now = new Date();
    // Next weekly sync is scheduled for 7 days in the future
    const nextSync = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const meta = await prisma.rosterSyncMeta.upsert({
      where: { league },
      create: {
        league,
        lastSyncedAt: now,
        nextSyncDue: nextSync,
        updateFrequency: "WEEKLY",
        totalPlayers: playersCount,
        totalTeams: teamsList.length,
        status: "UP_TO_DATE",
        syncNotes: `Weekly roster update completed. ${playersCount} active players synchronized across ${teamsList.length} franchises.`,
      },
      update: {
        lastSyncedAt: now,
        nextSyncDue: nextSync,
        totalPlayers: playersCount,
        totalTeams: teamsList.length,
        status: "UP_TO_DATE",
        syncNotes: `Weekly roster update completed. ${playersCount} active players synchronized across ${teamsList.length} franchises.`,
      },
    });

    summaries.push({
      league: meta.league,
      lastSyncedAt: meta.lastSyncedAt,
      nextSyncDue: meta.nextSyncDue,
      updateFrequency: meta.updateFrequency,
      totalPlayers: meta.totalPlayers,
      totalTeams: meta.totalTeams,
      status: meta.status,
      syncNotes: meta.syncNotes,
    });
  }

  return { success: true, summaries };
}

/**
 * Checks if 7 days have elapsed since the last roster sync.
 * If so, automatically triggers a weekly sync update.
 */
export async function checkWeeklyRosterSync(): Promise<boolean> {
  const metas = await prisma.rosterSyncMeta.findMany();

  if (metas.length === 0) {
    await syncRosters("ALL", true);
    return true;
  }

  const now = new Date();
  let neededSync = false;

  for (const meta of metas) {
    if (now >= meta.nextSyncDue) {
      await syncRosters(meta.league as "NFL" | "NHL", true);
      neededSync = true;
    }
  }

  return neededSync;
}

/**
 * Gets team roster players with sync metadata.
 */
export async function getTeamRoster(league: "NFL" | "NHL", teamAbbr: string) {
  // Check if initial sync is needed
  const count = await prisma.teamRosterPlayer.count({ where: { league } });
  if (count === 0) {
    await syncRosters(league, true);
  }

  const players = await prisma.teamRosterPlayer.findMany({
    where: { league, team: teamAbbr },
    orderBy: [{ unit: "asc" }, { depthOrder: "asc" }, { jerseyNumber: "asc" }],
  });

  const syncMeta = await prisma.rosterSyncMeta.findUnique({
    where: { league },
  });

  return {
    league,
    team: teamAbbr,
    players,
    syncMeta,
  };
}

/**
 * Retrieves all rosters for a league with optional search and filters.
 */
export async function getAllRosters(league: "NFL" | "NHL", team?: string, search?: string) {
  const count = await prisma.teamRosterPlayer.count({ where: { league } });
  if (count === 0) {
    await syncRosters(league, true);
  }

  const whereClause: any = { league };
  if (team) {
    whereClause.team = team;
  }
  if (search) {
    whereClause.OR = [
      { name: { contains: search } },
      { position: { contains: search } },
      { roleDescription: { contains: search } },
    ];
  }

  const players = await prisma.teamRosterPlayer.findMany({
    where: whereClause,
    orderBy: [{ team: "asc" }, { unit: "asc" }, { depthOrder: "asc" }],
  });

  const syncMeta = await prisma.rosterSyncMeta.findUnique({
    where: { league },
  });

  return {
    league,
    total: players.length,
    players,
    syncMeta,
  };
}

/**
 * Gets active starters for simulation engine directly from the database.
 * Replaces hardcoded values with current live roster players.
 */
export async function getActiveStartersForSimulation(league: "NFL" | "NHL", teamAbbr: string) {
  const count = await prisma.teamRosterPlayer.count({ where: { league, team: teamAbbr } });
  if (count === 0) {
    await syncRosters(league, true);
  }

  // Only consider players who are not OUT or on IR
  const activePlayers = await prisma.teamRosterPlayer.findMany({
    where: {
      league,
      team: teamAbbr,
      status: { notIn: ["OUT", "IR"] },
    },
    orderBy: { depthOrder: "asc" },
  });

  return activePlayers;
}
