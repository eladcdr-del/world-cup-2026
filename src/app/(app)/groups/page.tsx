import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GROUP_LETTERS } from "@/lib/utils/constants";
import { getTeamsByGroup } from "@/data/teams";
import { TeamFlag } from "@/components/shared/team-badge";
import { Grid3X3, ChevronLeft } from "lucide-react";

export default function GroupsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Grid3X3 className="size-6 text-primary" />
          בתים
        </h1>
        <p className="text-muted-foreground mt-1">
          12 בתים, 48 קבוצות
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GROUP_LETTERS.map((letter) => {
          const teams = getTeamsByGroup(letter);
          return (
            <Link key={letter} href={`/groups/${letter}`}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">
                    בית {letter}
                  </CardTitle>
                  <ChevronLeft className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {teams.map((team) => (
                      <div
                        key={team.short_code}
                        className="flex items-center gap-2"
                      >
                        <TeamFlag
                          flagUrl={team.flag_url}
                          name={team.name_he}
                          size="sm"
                        />
                        <span className="text-sm font-medium">
                          {team.name_he}
                        </span>
                        <span className="text-xs text-muted-foreground mr-auto">
                          {team.short_code}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
