import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TeamFlag } from "@/components/shared/team-badge";
import { ScoreDisplay } from "@/components/shared/score-input";
import { GROUP_LETTERS } from "@/lib/utils/constants";
import { getTeamsByGroup } from "@/data/teams";
import type { TeamSeed } from "@/data/teams";
import { ArrowRight, Trophy } from "lucide-react";

interface GroupStanding {
  team: TeamSeed;
  gp: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
}

function calculateStandings(teams: TeamSeed[]): GroupStanding[] {
  // Default standings - all zeros (no matches played yet)
  return teams.map((team) => ({
    team,
    gp: 0,
    w: 0,
    d: 0,
    l: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    pts: 0,
  }));
}

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ letter: string }>;
}) {
  const { letter } = await params;

  if (!GROUP_LETTERS.includes(letter as typeof GROUP_LETTERS[number])) {
    notFound();
  }

  const teams = getTeamsByGroup(letter);
  const standings = calculateStandings(teams);

  // TODO: Fetch group matches from Supabase
  const groupMatches: {
    id: string;
    match_number: number;
    home_team_name: string;
    away_team_name: string;
    home_score_90min: number | null;
    away_score_90min: number | null;
    status: string;
    kickoff_time: string;
  }[] = [];

  return (
    <div className="space-y-6">
      <Link
        href="/groups"
        className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
      >
        <ArrowRight className="size-4" />
        חזרה לבתים
      </Link>

      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="size-6 text-primary" />
          בית {letter}
        </h1>
      </div>

      {/* Standings table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">טבלה</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8" />
                <TableHead>קבוצה</TableHead>
                <TableHead className="text-center w-10">מש</TableHead>
                <TableHead className="text-center w-10">נצ</TableHead>
                <TableHead className="text-center w-10">ת</TableHead>
                <TableHead className="text-center w-10">הפ</TableHead>
                <TableHead className="text-center w-10">בעד</TableHead>
                <TableHead className="text-center w-10">נגד</TableHead>
                <TableHead className="text-center w-10">הפ&apos;</TableHead>
                <TableHead className="text-center w-12 font-bold">נק</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {standings.map((row, idx) => (
                <TableRow key={row.team.short_code}>
                  <TableCell className="text-center text-xs text-muted-foreground">
                    {idx + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TeamFlag
                        flagUrl={row.team.flag_url}
                        name={row.team.name_he}
                        size="sm"
                      />
                      <span className="font-medium text-sm">
                        {row.team.name_he}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center tabular-nums">
                    {row.gp}
                  </TableCell>
                  <TableCell className="text-center tabular-nums">
                    {row.w}
                  </TableCell>
                  <TableCell className="text-center tabular-nums">
                    {row.d}
                  </TableCell>
                  <TableCell className="text-center tabular-nums">
                    {row.l}
                  </TableCell>
                  <TableCell className="text-center tabular-nums">
                    {row.gf}
                  </TableCell>
                  <TableCell className="text-center tabular-nums">
                    {row.ga}
                  </TableCell>
                  <TableCell className="text-center tabular-nums">
                    {row.gd}
                  </TableCell>
                  <TableCell className="text-center tabular-nums font-bold">
                    {row.pts}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Group matches */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">משחקי הבית</CardTitle>
        </CardHeader>
        <CardContent>
          {groupMatches.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              משחקי הבית ייטענו מבסיס הנתונים
            </div>
          ) : (
            <div className="space-y-2">
              {groupMatches.map((match) => (
                <Link key={match.id} href={`/matches/${match.id}`}>
                  <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground font-mono">
                        #{match.match_number}
                      </span>
                      <span className="text-sm font-medium">
                        {match.home_team_name}
                      </span>
                      <span className="text-xs text-muted-foreground">vs</span>
                      <span className="text-sm font-medium">
                        {match.away_team_name}
                      </span>
                    </div>
                    {match.status === "finished" ? (
                      <ScoreDisplay
                        home={match.home_score_90min}
                        away={match.away_score_90min}
                        size="sm"
                      />
                    ) : (
                      <Badge variant="outline">
                        {new Date(match.kickoff_time).toLocaleDateString("he-IL")}
                      </Badge>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
