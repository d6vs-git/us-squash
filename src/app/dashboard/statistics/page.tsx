"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trophy, Target, TrendingUp, Activity, Star } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MatchAnalysis } from "@/components/dashboard/statistics/match-analysis";
import { RatingsHistoryChart } from "@/components/dashboard/statistics/rating-history-chart";

interface Rating {
  rating: number;
  ratingTypeName: string;
}

interface Ranking {
  DivisionName: string;
  Ranking: number;
  Rating: number;
  RatingGroupDescr: string;
}

interface Record {
  type: string;
  matchesWon: number;
  matchesLost: number;
}

interface Match {
  Score: string;
  Winner: string;
  Sportid: number;
  SportDescr: string;
  wid1: number;
  wid2: number;
  oid1: number;
  oid2: number;
  hplayer1: string;
  hplayer2: string;
  vplayer1: string;
  vplayer2: string;
}

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

export default function StatisticsPage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUserAndStats();
  }, []);

  const fetchUserAndStats = async () => {
    try {
      // First get user data to get userId
      const userResponse = await fetch("/api/user");
      if (!userResponse.ok) {
        if (userResponse.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch user data");
      }

      const userData = await userResponse.json();
      const currentUserId = userData.id;
      setUserId(currentUserId);

      // Then fetch all stats
      const [ratingsRes, rankingsRes, recordsRes, matchesRes] =
        await Promise.all([
          fetch(`/api/user/ratings?userId=${currentUserId}`),
          fetch(`/api/user/rankings?userId=${currentUserId}`),
          fetch(`/api/user/record?userId=${currentUserId}`),
          fetch(
            `/api/user/matches?userId=${currentUserId}&pageSize=500&sportId=3`
          ),
        ]);

      const [ratingsData, rankingsData, recordsData, matchesData] =
        await Promise.all([
          ratingsRes.json(),
          rankingsRes.json(),
          recordsRes.json(),
          matchesRes.json(),
        ]);

      const filteredRatings = (ratingsData || []).filter(
        (rating: any) =>
          rating.ratingTypeName?.includes("Singles") ||
          rating.ratingTypeName?.includes("Universal")
      );

      const filteredRecords = (recordsData || []).filter(
        (record: any) => record.type === "S"
      );

      setRatings(filteredRatings);
      setRankings(rankingsData || []);
      setRecords(filteredRecords);
      setMatches(
        matchesData?.matches?.filter((match: any) => match.Sportid === 3) || []
      );
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  const analyzeMatchesByGames = () => {
    const relevantMatches = matches.filter((match) => match.Sportid === 3);

    const wins = { "3": 0, "4": 0, "5": 0 };
    const losses = { "3": 0, "4": 0, "5": 0 };

    relevantMatches.forEach((match) => {
      const userIsHome = match.wid1 === userId || match.wid2 === userId;
      const userIsVisitor = match.oid1 === userId || match.oid2 === userId;

      let userWon = false;
      if (userIsHome && match.Winner === "H") userWon = true;
      if (userIsVisitor && match.Winner === "V") userWon = true;

      const score = match.Score || "";
      const cleanScore = score.replace(/[^\d,\-\s]/g, "").trim();
      const gameScores = cleanScore.split(/[,;]/).filter((game) => {
        const trimmed = game.trim();
        return trimmed.includes("-") && /^\d+-\d+$/.test(trimmed);
      });

      const gameCount = gameScores.length;

      if (gameCount >= 3 && gameCount <= 5) {
        const category = gameCount.toString() as "3" | "4" | "5";

        if (userWon) {
          wins[category]++;
        } else {
          losses[category]++;
        }
      }
    });

    return { wins, losses };
  };

  const calculateWinPercentage = (won: number, lost: number) => {
    const total = won + lost;
    return total > 0 ? Math.round((won / total) * 100) : 0;
  };

  const getBestUSRanking = () => {
    const usSquashRankings = rankings.filter(
      (r) => !r.RatingGroupDescr?.includes("PSRA")
    );
    if (!usSquashRankings.length) return null;
    return usSquashRankings.reduce((best, current) =>
      !best || current.Ranking < best.Ranking ? current : best
    );
  };

  const getSinglesRecord = () => {
    return (
      records.find((r) => r.type === "S") || { matchesWon: 0, matchesLost: 0 }
    );
  };

  const getTotalMatches = () => {
    return records.reduce(
      (total, record) => total + record.matchesWon + record.matchesLost,
      0
    );
  };

  const getTotalWins = () => {
    return records.reduce((total, record) => total + record.matchesWon, 0);
  };

  const getTotalLosses = () => {
    return records.reduce((total, record) => total + record.matchesLost, 0);
  };

  const getSinglesRating = () => {
    return (
      ratings.find(
        (r) =>
          r.ratingTypeName.includes("Singles") ||
          r.ratingTypeName.includes("Universal")
      )?.rating || 0
    );
  };

  const CustomPieChart = ({
    data,
    title,
    variant = "default",
  }: {
    data: PieChartData[];
    title: string;
    variant?: "default" | "success" | "destructive";
  }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    if (total === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-48">
          <div className="w-24 h-24 rounded-full border-4 border-border flex items-center justify-center bg-muted">
            <span className="text-muted-foreground text-sm font-medium">
              No Data
            </span>
          </div>
          <h4 className="font-medium text-center mt-4 text-foreground">
            {title}
          </h4>
        </div>
      );
    }

    const CustomTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        const data = payload[0];
        return (
          <div className="bg-popover p-3 border border-border rounded-lg shadow-lg">
            <p className="font-medium text-foreground">
              {data.name}: {data.value}
            </p>
            <p className="text-sm text-muted-foreground">
              {((data.value / total) * 100).toFixed(1)}%
            </p>
          </div>
        );
      }
      return null;
    };

    const CustomLabel = ({
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      value,
      index,
    }: any) => {
      const RADIAN = Math.PI / 180;
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      return (
        <text
          x={x}
          y={y}
          fill="hsl(var(--primary-foreground))"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          fontSize="12"
          fontWeight="bold"
        >
          {value}
        </text>
      );
    };

    const variantColors = {
      default: [
        "hsl(var(--primary))",
        "hsl(var(--primary)/0.8)",
        "hsl(var(--primary)/0.6)",
      ],
      success: [
        "hsl(var(--success))",
        "hsl(var(--success)/0.8)",
        "hsl(var(--success)/0.6)",
      ],
      destructive: [
        "hsl(var(--destructive))",
        "hsl(var(--destructive)/0.8)",
        "hsl(var(--destructive)/0.6)",
      ],
    };

    const colors = variantColors[variant];

    return (
      <div className="flex flex-col items-center">
        <h4 className="font-medium text-center mb-4 text-foreground">
          {title}
        </h4>
        <div className="w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomLabel}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2 w-full">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
              <span className="font-medium text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 text-center">
          <p className="text-sm text-muted-foreground">Total: {total}</p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container py-8 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-4 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-4 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-8 md:grid-cols-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <Skeleton className="h-5 w-32 mb-4" />
                  <Skeleton className="w-48 h-48 rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 space-y-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">
              {error || "Failed to load statistics"}
            </p>
            <Button
              variant="outline"
              className="mt-4 border-destructive text-destructive hover:bg-destructive/10"
              onClick={fetchUserAndStats}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const bestUSRanking = getBestUSRanking();
  const totalMatches = getTotalMatches();
  const totalWins = getTotalWins();
  const totalLosses = getTotalLosses();
  const overallWinPercentage = calculateWinPercentage(totalWins, totalLosses);

  const singlesRecord = getSinglesRecord();
  const singlesWinRate = calculateWinPercentage(
    singlesRecord.matchesWon,
    singlesRecord.matchesLost
  );

  const singlesAnalysis = analyzeMatchesByGames();

  const singlesWinsData: PieChartData[] = [
    {
      name: "3 Games",
      value: singlesAnalysis.wins["3"],
      color: "hsl(var(--success))",
    },
    {
      name: "4 Games",
      value: singlesAnalysis.wins["4"],
      color: "hsl(var(--success)/0.8)",
    },
    {
      name: "5 Games",
      value: singlesAnalysis.wins["5"],
      color: "hsl(var(--success)/0.6)",
    },
  ].filter((item) => item.value > 0);

  const singlesLossesData: PieChartData[] = [
    {
      name: "3 Games",
      value: singlesAnalysis.losses["3"],
      color: "hsl(var(--destructive))",
    },
    {
      name: "4 Games",
      value: singlesAnalysis.losses["4"],
      color: "hsl(var(--destructive)/0.8)",
    },
    {
      name: "5 Games",
      value: singlesAnalysis.losses["5"],
      color: "hsl(var(--destructive)/0.6)",
    },
  ].filter((item) => item.value > 0);

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Performance Statistics
        </h1>
        <p className="text-lg text-muted-foreground">
          Detailed analytics and performance insights
        </p>
      </div>

      {/* Key Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Singles Rating
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <Target className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {getSinglesRating().toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Current rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Best US Ranking
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <Trophy className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              #{bestUSRanking?.Ranking || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {bestUSRanking?.DivisionName || "No ranking available"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Matches
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <Activity className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {totalMatches}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalWins}W - {totalLosses}L
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Win Rate Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overall Win Rate
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {overallWinPercentage}%
            </div>
            <p className="text-xs text-muted-foreground">All singles matches</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Singles Performance
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <Star className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {singlesWinRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              {singlesRecord.matchesWon}W - {singlesRecord.matchesLost}L
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Match Analysis */}
      <MatchAnalysis
        wins={singlesAnalysis.wins}
        losses={singlesAnalysis.losses}
        totalWins={singlesRecord.matchesWon}
        totalLosses={singlesRecord.matchesLost}
      />

      {/* Ratings History Chart */}
      {userId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <RatingsHistoryChart userId={userId.toString()} />
        </motion.div>
      )}
    </div>
  );
}
