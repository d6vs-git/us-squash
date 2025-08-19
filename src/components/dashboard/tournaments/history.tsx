"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Calendar,
  Target,
  Award,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loading from "@/components/ui/loading";

interface Tournament {
  tournamentId: number;
  divisionId: number;
  tournamentName: string;
  startDate: string;
  title: string;
  eventTypeDescr: string;
  eventTypeCode: number;
  points: number;
  pointsDate: string;
  finishPosition: string;
  dropOffDate: string;
  activePoints: number;
  activeCode: string;
  accreditationType: number;
  location: string;
  cartItemId: number;
  sportId: number;
  sportName: string;
}

interface TournamentData {
  tournaments: Tournament[];
  numWeeksOfHistory: number | null;
}

export const History = () => {
  const [tournamentData, setTournamentData] = useState<TournamentData | null>(
    null
  );
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const router = useRouter();

  useEffect(() => {
    fetchUserAndTournaments();
  }, []);

  const fetchUserAndTournaments = async () => {
    try {
      const userResponse = await fetch("/api/user");
      if (!userResponse.ok) {
        if (userResponse.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch user data");
      }

      const userData = await userResponse.json();
      setUserId(userData.id);

      const response = await fetch(
        `/api/user/tournaments?userId=${userData.id}`
      );
      if (!response.ok) throw new Error("Failed to fetch tournaments");
      const data = await response.json();

      const filteredTournaments = (data?.tournaments || []).filter(
        (tournament: Tournament) => {
          const nameCheck = !tournament.tournamentName
            .toLowerCase()
            .includes("double");
          const titleCheck = !tournament.title.toLowerCase().includes("double");
          const eventCheck = !tournament.eventTypeDescr
            .toLowerCase()
            .includes("double");
          const sportCheck = tournament.sportId === 3;
          return nameCheck && titleCheck && eventCheck && sportCheck;
        }
      );

      setTournamentData({
        tournaments: filteredTournaments,
        numWeeksOfHistory: data?.numWeeksOfHistory || null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPositionBadgeVariant = (position: string) => {
    if (position === "1" || position === "1st") return "default";
    if (position === "2" || position === "2nd") return "secondary";
    if (position === "3" || position === "3rd") return "secondary";
    if (position.includes("-")) return "destructive";
    return "outline";
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case "u.s. championship":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "junior championship (jct)":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "junior gold":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "junior silver":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAveragePointsEarned = () => {
    if (!tournamentData?.tournaments || tournamentData.tournaments.length === 0)
      return 0;
    const totalPoints = tournamentData.tournaments.reduce(
      (sum, t) => sum + (t.points || 0),
      0
    );
    return totalPoints / tournamentData.tournaments.length;
  };

  const getTotalTournaments = () => {
    return tournamentData?.tournaments?.length || 0;
  };

  const getWins = () => {
    if (!tournamentData?.tournaments) return 0;
    return tournamentData.tournaments.filter(
      (t) => t.finishPosition === "1" || t.finishPosition === "1st"
    ).length;
  };

  const getTopFinishes = () => {
    if (!tournamentData?.tournaments) return 0;
    return tournamentData.tournaments.filter((t) => {
      const pos = t.finishPosition;
      return (
        pos === "1" ||
        pos === "2" ||
        pos === "3" ||
        pos === "1st" ||
        pos === "2nd" ||
        pos === "3rd"
      );
    }).length;
  };

  // Pagination logic
  const totalPages = Math.ceil(
    (tournamentData?.tournaments?.length || 0) / pageSize
  );
  const paginatedTournaments =
    tournamentData?.tournaments?.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    ) || [];

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" onClick={fetchUserAndTournaments}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!tournamentData?.tournaments || tournamentData.tournaments.length === 0) {
    return (
      <div className="container py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Tournament History
          </h1>
          <p className="text-muted-foreground">
            Your tournament participation and results
          </p>
        </div>

        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-foreground">
              No tournaments found
            </h3>
            <p className="text-muted-foreground mt-1">
              Your tournament history will appear here once you participate in
              events
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Tournament History
        </h1>
        <p className="text-muted-foreground">
          Your tournament participation and results (
          {tournamentData.tournaments.length} total tournaments)
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tournaments
            </CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalTournaments()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tournament Wins
            </CardTitle>
            <Award className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getWins()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Top 3 Finishes
            </CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTopFinishes()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Points Earned
            </CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getAveragePointsEarned().toFixed(1)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-4">
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Page size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tournaments List */}
      <div className="space-y-4">
        {paginatedTournaments.length > 0 ? (
          paginatedTournaments
            .sort(
              (a, b) =>
                new Date(b.startDate).getTime() -
                new Date(a.startDate).getTime()
            )
            .map((tournament, index) => (
              <motion.div
                key={tournament.cartItemId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      {/* Tournament result and points */}
                      <div className="flex flex-col items-center gap-2 min-w-[100px]">
                        <Badge
                          variant={getPositionBadgeVariant(
                            tournament.finishPosition
                          )}
                          className="w-full justify-center"
                        >
                          {tournament.finishPosition === "-"
                            ? "Withdrew"
                            : `${tournament.finishPosition} Place`}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="w-full justify-center"
                        >
                          {tournament.points?.toFixed(1) || "0"} pts
                        </Badge>
                      </div>

                      {/* Tournament details */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {tournament.tournamentName}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge
                              variant="outline"
                              className={getEventTypeColor(
                                tournament.eventTypeDescr
                              )}
                            >
                              {tournament.eventTypeDescr}
                            </Badge>
                            <Badge variant="outline">{tournament.title}</Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Date
                              </p>
                              <p className="font-medium">
                                {formatDate(tournament.startDate)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Location
                              </p>
                              <p className="font-medium">
                                {tournament.location || "N/A"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Trophy className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Active Points
                              </p>
                              <p className="font-medium">
                                {tournament.activePoints?.toFixed(1) || "0"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Points Drop Off
                              </p>
                              <p className="font-medium">
                                {formatDate(tournament.dropOffDate)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-foreground">
                No tournaments found
              </h3>
              <p className="text-muted-foreground mt-1">
                Your tournament history will appear here once you participate in
                events
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {tournamentData.tournaments.length > pageSize && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(
              currentPage * pageSize,
              tournamentData.tournaments.length
            )}{" "}
            of {tournamentData.tournaments.length} tournaments
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground px-3">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
