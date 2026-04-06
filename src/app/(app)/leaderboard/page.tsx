"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MedalCount } from "@/components/shared/medal-icon";
import { formatRankChange } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import { Trophy, Search, ChevronLeft } from "lucide-react";
import type { ParticipantWithRank } from "@/lib/types/database";

// TODO: Replace with real data from Supabase
const EMPTY_PARTICIPANTS: ParticipantWithRank[] = [];

// TODO: Get from auth session
const CURRENT_USER_ID = "";

export default function LeaderboardPage() {
  const [search, setSearch] = useState("");

  const participants = EMPTY_PARTICIPANTS;

  const filtered = participants.filter((p) => {
    if (!search) return true;
    return p.display_name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="size-6 text-yellow-600" />
          טבלת דירוג
        </h1>
        <p className="text-muted-foreground mt-1">
          דירוג כל המשתתפים בטורניר
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="חיפוש לפי שם..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-9"
        />
      </div>

      {/* Leaderboard table */}
      {participants.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Trophy className="mx-auto size-12 text-muted-foreground/30" />
            <p className="mt-4 text-muted-foreground">
              טבלת הדירוג תתעדכן לאחר שיוזנו תוצאות המשחקים.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {/* Desktop table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16 text-center">#</TableHead>
                    <TableHead>שם</TableHead>
                    <TableHead className="text-center">נקודות</TableHead>
                    <TableHead className="text-center">
                      <span className="text-yellow-600">זהב</span>
                    </TableHead>
                    <TableHead className="text-center">
                      <span className="text-gray-500">כסף</span>
                    </TableHead>
                    <TableHead className="text-center">
                      <span className="text-orange-600">ארד</span>
                    </TableHead>
                    <TableHead className="text-center">
                      <span className="text-blue-400">אלומיניום</span>
                    </TableHead>
                    <TableHead className="text-center">
                      <span className="text-gray-300">פלסטיק</span>
                    </TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p) => {
                    const isCurrentUser = p.user_id === CURRENT_USER_ID;
                    const rankChange = formatRankChange(p.rank_change ?? 0);

                    return (
                      <TableRow
                        key={p.id}
                        className={cn(
                          isCurrentUser && "bg-primary/5",
                          "hover:bg-muted/50"
                        )}
                      >
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="font-bold">{p.current_rank}</span>
                            {p.rank_change !== undefined && p.rank_change !== 0 && (
                              <span className={cn("text-xs", rankChange.className)}>
                                {rankChange.text}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/leaderboard/${p.id}`}
                            className="font-medium hover:underline"
                          >
                            {p.display_name}
                            {isCurrentUser && (
                              <span className="text-xs text-primary mr-1">(אתה)</span>
                            )}
                          </Link>
                        </TableCell>
                        <TableCell className="text-center font-bold text-lg">
                          {p.total_points}
                        </TableCell>
                        <TableCell className="text-center tabular-nums">
                          {p.medals_gold}
                        </TableCell>
                        <TableCell className="text-center tabular-nums">
                          {p.medals_silver}
                        </TableCell>
                        <TableCell className="text-center tabular-nums">
                          {p.medals_bronze}
                        </TableCell>
                        <TableCell className="text-center tabular-nums">
                          {p.medals_aluminum}
                        </TableCell>
                        <TableCell className="text-center tabular-nums">
                          {p.medals_plastic}
                        </TableCell>
                        <TableCell>
                          <Link href={`/leaderboard/${p.id}`}>
                            <ChevronLeft className="size-4 text-muted-foreground" />
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile list */}
            <div className="md:hidden divide-y">
              {filtered.map((p) => {
                const isCurrentUser = p.user_id === CURRENT_USER_ID;
                const rankChange = formatRankChange(p.rank_change ?? 0);

                return (
                  <Link
                    key={p.id}
                    href={`/leaderboard/${p.id}`}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors",
                      isCurrentUser && "bg-primary/5"
                    )}
                  >
                    {/* Rank */}
                    <div className="text-center w-10 shrink-0">
                      <span className="text-lg font-bold">{p.current_rank}</span>
                      {p.rank_change !== undefined && p.rank_change !== 0 && (
                        <div className={cn("text-xs", rankChange.className)}>
                          {rankChange.text}
                        </div>
                      )}
                    </div>

                    {/* Name & medals */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {p.display_name}
                        {isCurrentUser && (
                          <span className="text-xs text-primary mr-1">(אתה)</span>
                        )}
                      </p>
                      <MedalCount
                        gold={p.medals_gold}
                        silver={p.medals_silver}
                        bronze={p.medals_bronze}
                        aluminum={p.medals_aluminum}
                        plastic={p.medals_plastic}
                        compact
                      />
                    </div>

                    {/* Points */}
                    <div className="text-center shrink-0">
                      <span className="text-xl font-bold">{p.total_points}</span>
                      <p className="text-xs text-muted-foreground">נקודות</p>
                    </div>

                    <ChevronLeft className="size-4 text-muted-foreground shrink-0" />
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
