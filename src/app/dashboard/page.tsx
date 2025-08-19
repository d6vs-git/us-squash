"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import {
  Trophy,
  Target,
  Users,
  Calendar,
  Award,
  MapPin,
  BarChart3,
  Search,
  Brain,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import Loading from "@/components/ui/loading";

interface UserData {
  id: number;
  name: string;
  email: string;
  profilePictureUrl: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  cellPhone: string;
  birthDate: string;
  gender: string;
  category: string;
  mainAffiliation: {
    descr: string;
    City: string;
  };
}

interface QuickStats {
  totalMatches: number;
  winPercentage: number;
  currentRating: number;
  bestRanking: number;
  upcomingMatches: number;
  activeTournaments: number;
  activeLeagues: number;
  activeLadders: number;
}

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [quickStats, setQuickStats] = useState<QuickStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user");

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/");
          return;
        }
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();

      const processedData = {
        id: data.id || 0,
        name:
          data.name ||
          `${data.firstName || ""} ${data.lastName || ""}`.trim() ||
          "Unknown User",
        email: data.email || "",
        profilePictureUrl: data.profilePictureUrl || "",
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        country: data.country || "",
        cellPhone: data.cellPhone || "",
        birthDate: data.birthDate || "",
        gender: data.gender || "",
        category: data.category || "",
        mainAffiliation: data.mainAffiliation || { descr: "", City: "" },
      };

      setUserData(processedData);

      if (data.id) {
        await fetchQuickStats(data.id);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchQuickStats = async (userId: number) => {
    try {
      const [
        recordRes,
        ratingsRes,
        rankingsRes,
        upcomingRes,
        tournamentsRes,
        leaguesRes,
        laddersRes,
      ] = await Promise.allSettled([
        fetch(`/api/user/record?userId=${userId}`),
        fetch(`/api/user/ratings?userId=${userId}`),
        fetch(`/api/user/rankings?userId=${userId}`),
        fetch(`/api/user/upcoming-matches?userId=${userId}`),
        fetch(`/api/user/tournaments?userId=${userId}`),
        fetch(`/api/user/leagues?userId=${userId}`),
        fetch(`/api/user/ladders?userId=${userId}`),
      ]);

      const recordData =
        recordRes.status === "fulfilled" && recordRes.value.ok
          ? await recordRes.value.json()
          : [];
      const ratingsData =
        ratingsRes.status === "fulfilled" && ratingsRes.value.ok
          ? await ratingsRes.value.json()
          : [];
      const rankingsData =
        rankingsRes.status === "fulfilled" && rankingsRes.value.ok
          ? await rankingsRes.value.json()
          : [];
      const upcomingData =
        upcomingRes.status === "fulfilled" && upcomingRes.value.ok
          ? await upcomingRes.value.json()
          : [];
      const tournamentsData =
        tournamentsRes.status === "fulfilled" && tournamentsRes.value.ok
          ? await tournamentsRes.value.json()
          : null;
      const leaguesData =
        leaguesRes.status === "fulfilled" && leaguesRes.value.ok
          ? await leaguesRes.value.json()
          : [];
      const laddersData =
        laddersRes.status === "fulfilled" && laddersRes.value.ok
          ? await laddersRes.value.json()
          : [];

      // Filter to only US Squash data and singles
      const singlesRecord = Array.isArray(recordData)
        ? recordData.filter((r: any) => r.type === "S")
        : [];
      const singlesRatings = Array.isArray(ratingsData)
        ? ratingsData.filter(
            (r: any) =>
              (r.ratingTypeName?.includes("Singles") ||
                r.ratingTypeName?.includes("Universal")) &&
              !r.ratingTypeName?.includes("PSRA")
          )
        : [];

      // Filter rankings to only US Squash
      const usSquashRankings = Array.isArray(rankingsData)
        ? rankingsData.filter((r: any) => !r.RatingGroupDescr?.includes("PSRA"))
        : [];

      const totalWins = singlesRecord.reduce(
        (sum: number, r: any) => sum + (r.matchesWon || 0),
        0
      );
      const totalLosses = singlesRecord.reduce(
        (sum: number, r: any) => sum + (r.matchesLost || 0),
        0
      );
      const totalMatches = totalWins + totalLosses;
      const winPercentage =
        totalMatches > 0 ? Math.round((totalWins / totalMatches) * 100) : 0;

      const currentRating =
        singlesRatings.length > 0 ? singlesRatings[0].rating || 0 : 0;
      const bestRanking =
        Array.isArray(usSquashRankings) && usSquashRankings.length > 0
          ? usSquashRankings.reduce((best: any, current: any) =>
              !best || (current.Ranking && current.Ranking < best.Ranking)
                ? current
                : best
            )?.Ranking || 0
          : 0;

      setQuickStats({
        totalMatches,
        winPercentage,
        currentRating,
        bestRanking,
        upcomingMatches: Array.isArray(upcomingData) ? upcomingData.length : 0,
        activeTournaments: tournamentsData?.tournaments?.length || 0,
        activeLeagues: Array.isArray(leaguesData) ? leaguesData.length : 0,
        activeLadders: Array.isArray(laddersData) ? laddersData.length : 0,
      });
    } catch (error) {
      console.error("Error fetching quick stats:", error);
      setQuickStats({
        totalMatches: 0,
        winPercentage: 0,
        currentRating: 0,
        bestRanking: 0,
        upcomingMatches: 0,
        activeTournaments: 0,
        activeLeagues: 0,
        activeLadders: 0,
      });
    }
  };

  const dashboardItems = [
    {
      title: "Profile",
      description: "View your personal information and account information",
      link: "/dashboard/profile",
      icon: <User className="h-6 w-6" />,
    },
    {
      title: "Performance Statistics",
      description: "View detailed statistics and performance analytics",
      link: "/dashboard/statistics",
      icon: <BarChart3 className="h-6 w-6" />,
    },
    {
      title: "Match History",
      description: "Browse your complete match history and results",
      link: "/dashboard/matches",
      icon: <Target className="h-6 w-6" />,
    },
    {
      title: "Tournament History",
      description: "View your tournament participation and results",
      link: "/dashboard/tournaments",
      icon: <Trophy className="h-6 w-6" />,
    },
    {
      title: "Tournament Schedule",
      description: "Find and register for upcoming tournaments",
      link: "/dashboard/tournament-schedule",
      icon: <Calendar className="h-6 w-6" />,
    },
    {
      title: "Player Tracker",
      description: "Track and monitor other player's progress",
      link: "/dashboard/player-tracker",
      icon: <Search className="h-6 w-6" />,
    },
    {
      title: "AI Analysis",
      description: "Get AI-powered insights and recommendations",
      link: "/dashboard/ai-analysis",
      icon: <Brain className="h-6 w-6" />,
    },
  ];

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md border-destructive animate-fade-in">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md animate-fade-in">
          <CardContent className="pt-6 text-center">
            <p className="mb-4 text-foreground">No user data found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in min-h-screen">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-primary/20 shadow-xl hover-lift">
              <AvatarImage
                src={userData.profilePictureUrl || "/placeholder.svg"}
                alt={userData.name}
              />
              <AvatarFallback className="text-lg sm:text-2xl bg-primary text-primary-foreground font-bold">
                {userData.firstName?.[0] || "U"}
                {userData.lastName?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
          </motion.div>
          <div className="flex-1 text-center sm:text-left">
            <motion.h1
              className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-card-foreground"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {userData.name}
            </motion.h1>
            <motion.div
              className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4 text-card-foreground/70 mb-2 sm:mb-4 text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {userData.city && userData.state && (
                <div className="flex items-center gap-2 hover-lift">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {userData.city}, {userData.state}
                  </span>
                </div>
              )}
              {userData.mainAffiliation?.descr && (
                <div className="flex items-center gap-2 hover-lift">
                  <Users className="h-4 w-4" />
                  <span className="truncate max-w-32 sm:max-w-none">
                    {userData.mainAffiliation.descr}
                  </span>
                </div>
              )}
              {userData.category && (
                <div className="flex items-center gap-2 hover-lift">
                  <Award className="h-4 w-4" />
                  <span>{userData.category}</span>
                </div>
              )}
            </motion.div>
          </div>
          {quickStats && (
            <motion.div
              className="grid grid-cols-2 gap-2 sm:gap-4 text-center w-full sm:w-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.div
                className="glass-effect rounded-xl p-3 sm:p-4 border border-border hover-lift"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-xl sm:text-3xl font-bold text-primary">
                  {quickStats.currentRating.toFixed(1)}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  US Squash Rating
                </div>
              </motion.div>
              <motion.div
                className="glass-effect rounded-xl p-3 sm:p-4 border border-border hover-lift"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-xl sm:text-3xl font-bold text-primary">
                  #{quickStats.bestRanking || "N/A"}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Best US Ranking
                </div>
              </motion.div>
              <motion.div
                className="glass-effect rounded-xl p-3 sm:p-4 border border-border hover-lift"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-xl sm:text-3xl font-bold text-primary">
                  {quickStats.totalMatches}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Total Matches
                </div>
              </motion.div>
              <motion.div
                className="glass-effect rounded-xl p-3 sm:p-4 border border-border hover-lift"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-xl sm:text-3xl font-bold text-primary">
                  {quickStats.winPercentage}%
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Win Rate
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Navigation Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <HoverEffect items={dashboardItems} />
      </motion.div>
    </div>
  );
}
