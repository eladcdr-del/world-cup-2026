"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { markParticipantPaid } from "@/lib/actions/admin";
import { formatCurrency } from "@/lib/utils/format";
import {
  Users,
  Search,
  CreditCard,
  UserCheck,
  DollarSign,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import type { ParticipantStatus } from "@/lib/types/database";

// Placeholder until DB connected
interface ParticipantRow {
  id: string;
  display_name: string;
  email: string;
  status: ParticipantStatus;
  is_paid: boolean;
  total_points: number;
  current_rank: number;
  created_at: string;
}

function statusBadge(status: ParticipantStatus) {
  switch (status) {
    case "registered":
      return <Badge variant="outline">נרשם</Badge>;
    case "paid":
      return <Badge className="bg-green-600">שילם</Badge>;
    case "active":
      return <Badge variant="secondary">פעיל</Badge>;
    case "disqualified":
      return <Badge variant="destructive">פסול</Badge>;
  }
}

function PayButton({ participantId }: { participantId: string }) {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  function handlePay() {
    startTransition(async () => {
      const result = await markParticipantPaid(participantId);
      if (result.success) setDone(true);
    });
  }

  if (done) {
    return (
      <span className="text-green-600 flex items-center gap-1 text-xs">
        <CheckCircle2 className="size-3.5" />
        שולם
      </span>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1 text-xs h-7"
      onClick={handlePay}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="size-3 animate-spin" />
      ) : (
        <CreditCard className="size-3" />
      )}
      סמן כשילם
    </Button>
  );
}

export default function AdminParticipantsPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"rank" | "name" | "date">("rank");

  // TODO: Fetch from Supabase
  const participants: ParticipantRow[] = [];

  const totalRegistered = participants.length;
  const totalPaid = participants.filter((p) => p.is_paid).length;
  const prizePool = totalPaid * 100;

  const filtered = participants
    .filter((p) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        p.display_name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.display_name.localeCompare(b.display_name, "he");
        case "date":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "rank":
        default:
          return a.current_rank - b.current_rank;
      }
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="size-6 text-primary" />
          ניהול משתתפים
        </h1>
        <p className="text-muted-foreground mt-1">
          צפייה ועדכון סטטוס משתתפים
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="rounded-lg bg-blue-100 p-2">
              <Users className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">סה&quot;כ נרשמים</p>
              <p className="text-2xl font-bold">{totalRegistered}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="rounded-lg bg-green-100 p-2">
              <UserCheck className="size-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">שילמו</p>
              <p className="text-2xl font-bold">{totalPaid}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="rounded-lg bg-yellow-100 p-2">
              <DollarSign className="size-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">קופת פרסים</p>
              <p className="text-2xl font-bold">{formatCurrency(prizePool)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="חיפוש לפי שם או אימייל..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-9"
          />
        </div>
        <div className="flex gap-2">
          {(
            [
              ["rank", "דירוג"],
              ["name", "שם"],
              ["date", "תאריך"],
            ] as const
          ).map(([key, label]) => (
            <Button
              key={key}
              variant={sortBy === key ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy(key)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {participants.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="mx-auto size-12 text-muted-foreground/30" />
              <p className="mt-4 text-muted-foreground">
                אין משתתפים להצגה. הנתונים ייטענו מבסיס הנתונים.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead>שם</TableHead>
                  <TableHead className="hidden sm:table-cell">אימייל</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead className="hidden sm:table-cell">תשלום</TableHead>
                  <TableHead className="text-center">נקודות</TableHead>
                  <TableHead className="w-28">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-sm">
                      {p.current_rank || "-"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {p.display_name}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                      {p.email}
                    </TableCell>
                    <TableCell>{statusBadge(p.status)}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {p.is_paid ? (
                        <Badge className="bg-green-600">שולם</Badge>
                      ) : (
                        <Badge variant="outline">טרם שילם</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center font-bold">
                      {p.total_points}
                    </TableCell>
                    <TableCell>
                      {!p.is_paid && <PayButton participantId={p.id} />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
