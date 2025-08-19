"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Trophy,
  Clock,
  Search,
  ExternalLink,
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

const parseDate = (dateString: string | undefined): Date | null => {
  if (!dateString) return null;
  if (dateString.includes("-") && dateString.split("-")[0].length === 2) {
    const [month, day, year] = dateString.split("-");
    return new Date(
      Number.parseInt(year),
      Number.parseInt(month) - 1,
      Number.parseInt(day)
    );
  }
  return new Date(dateString);
};

const getDaysLeftInfo = (deadlineString?: string, isOpen?: boolean) => {
  const deadline = parseDate(deadlineString);
  if (!deadline) {
    return {
      text: isOpen ? "Registration Open" : "Registration Closed",
      isClosed: !isOpen,
    };
  }

  const today = new Date();
  const diffTime = deadline.getTime() - today.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysLeft <= 0) {
    return { text: "Registration Closed", isClosed: true };
  }
  if (daysLeft === 1) {
    return { text: "Closes Today", isClosed: false };
  }
  return { text: `${daysLeft} days left`, isClosed: false };
};

interface Tournament {
  TournamentID: number;
  TournamentName: string;
  StartDate: string;
  EndDate: string;
  Entry_Open?: string;
  Entry_Close?: string;
  Registration_Deadline?: string;
  SiteCity?: string;
  State?: string;
  EventType?: string;
  EventTypeCode?: number;
  MaxRating?: number;
  MinRating?: number;
  AgeRestrictions?: string;
  regularFee?: {
    price: number;
  };
  RankingPoints?: number;
  Unsanctioned?: number;
  RegistrationOpen?: boolean;
  ClubLockerUrl?: string;
  Description?: string;
  TournamentContact?: string;
  ContactEmail?: string;
  OrganizerOrganization?: number;
  URL?: string;
  AllowAdminEntries?: boolean;
  Breaks_On?: string;
  Resumes_On?: string;
  Entry_Close_Time?: string;
  EarlyBirdRegistrationDeadline?: string;
  Membership_Usage?: string;
  events?: string;
  VenueId?: number;
  RankingPeriod?: string;
  NumPlayers?: number;
  PlayersOnDraw?: number;
  EntryForm?: string;
  NumMatches?: number;
  CreateDate?: string;
  UpdateDate?: string;
  SeasonID?: number;
  LogoImageUrl?: string;
  OrganizerLogoUrl?: string;
  StartingTimesID?: number;
  Pictures_URL?: string;
  OrganizationLat?: string;
  OrganizationLong?: string;
  OrganizationDistance?: number;
  VenueName?: string;
}

export const TournamentList = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/tournaments?topRecords=500");
      if (!response.ok) {
        throw new Error(
          `Failed to fetch tournaments: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      let tournamentsArray: any[] = [];

      if (Array.isArray(data)) {
        tournamentsArray = data;
      } else if (data.tournaments && Array.isArray(data.tournaments)) {
        tournamentsArray = data.tournaments;
      } else if (data.data && Array.isArray(data.data)) {
        tournamentsArray = data.data;
      } else {
        throw new Error("Invalid tournament data structure received");
      }

      const processedTournaments = tournamentsArray
        .filter((tournament) => tournament && tournament.TournamentID)
        .map((tournament: any) => ({
          TournamentID: tournament.TournamentID,
          TournamentName: tournament.TournamentName || "Unnamed Tournament",
          StartDate: tournament.StartDate,
          EndDate: tournament.EndDate,
          Entry_Open: tournament.Entry_Open,
          Entry_Close: tournament.Entry_Close,
          Registration_Deadline: tournament.Registration_Deadline,
          SiteCity: tournament.SiteCity || "",
          State: tournament.State || "",
          EventType: tournament.EventType || "Tournament",
          EventTypeCode: tournament.EventTypeCode,
          MaxRating: tournament.MaxRating,
          MinRating: tournament.MinRating,
          AgeRestrictions: tournament.AgeRestrictions,
          regularFee: tournament.regularFee,
          RankingPoints: tournament.RankingPoints,
          Unsanctioned: tournament.Unsanctioned,
          RegistrationOpen: tournament.RegistrationOpen !== false,
          ClubLockerUrl:
            tournament.ClubLockerUrl ||
            `https://clublocker.com/tournaments/${tournament.TournamentID}/sign-up`,
          Description: tournament.Description,
          TournamentContact: tournament.TournamentContact,
          ContactEmail: tournament.ContactEmail,
          OrganizerOrganization: tournament.OrganizerOrganization,
          URL: tournament.URL,
          AllowAdminEntries: tournament.AllowAdminEntries,
          Breaks_On: tournament.Breaks_On,
          Resumes_On: tournament.Resumes_On,
          Entry_Close_Time: tournament.Entry_Close_Time,
          EarlyBirdRegistrationDeadline:
            tournament.EarlyBirdRegistrationDeadline,
          Membership_Usage: tournament.Membership_Usage,
          events: tournament.events,
          VenueId: tournament.VenueId,
          RankingPeriod: tournament.RankingPeriod,
          NumPlayers: tournament.NumPlayers,
          PlayersOnDraw: tournament.PlayersOnDraw,
          EntryForm: tournament.EntryForm,
          NumMatches: tournament.NumMatches,
          CreateDate: tournament.CreateDate,
          UpdateDate: tournament.UpdateDate,
          SeasonID: tournament.SeasonID,
          LogoImageUrl: tournament.LogoImageUrl,
          OrganizerLogoUrl: tournament.OrganizerLogoUrl,
          StartingTimesID: tournament.StartingTimesID,
          Pictures_URL: tournament.Pictures_URL,
          OrganizationLat: tournament.OrganizationLat,
          OrganizationLong: tournament.OrganizationLong,
          OrganizationDistance: tournament.OrganizationDistance,
          VenueName: tournament.VenueName,
        }))
        .filter(Boolean) as Tournament[];

      setTournaments(processedTournaments);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load tournaments"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const getEventTypeColor = (eventType: string) => {
    const type = eventType?.toLowerCase() || "";
    if (type.includes("championship"))
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (type.includes("gold"))
      return "bg-orange-100 text-orange-800 border-orange-200";
    if (type.includes("silver"))
      return "bg-gray-100 text-gray-800 border-gray-200";
    if (type.includes("bronze"))
      return "bg-amber-100 text-amber-800 border-amber-200";
    if (type.includes("professional"))
      return "bg-purple-100 text-purple-800 border-purple-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getRegistrationStatusColor = (statusText: string) => {
    if (statusText.includes("Closed"))
      return "bg-red-100 text-red-800 border-red-200";
    if (statusText.includes("Today"))
      return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  // Filter tournaments based on search term
  const filteredTournaments = searchTerm
    ? tournaments.filter(
        (tournament) =>
          tournament.TournamentName?.toLowerCase().includes(
            searchTerm.toLowerCase()
          ) ||
          tournament.SiteCity?.toLowerCase().includes(
            searchTerm.toLowerCase()
          ) ||
          tournament.State?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : tournaments;

  // Pagination logic
  const totalPages = Math.ceil(filteredTournaments.length / pageSize);
  const paginatedTournaments = filteredTournaments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
            <Button variant="outline" onClick={loadTournaments}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Upcoming Tournament List</h1>
        <p className="text-muted-foreground">
          Browse and register for upcoming tournaments (
          {filteredTournaments.length} available)
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tournaments by name or location..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="pl-10"
          />
        </div>

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

      {/* Tournament List */}
      <div className="space-y-4">
        {paginatedTournaments.length > 0 ? (
          paginatedTournaments.map((tournament, index) => {
            const location =
              tournament.SiteCity && tournament.State
                ? `${tournament.SiteCity}, ${tournament.State}`
                : tournament.SiteCity || tournament.State || "Location TBD";

            const registrationDeadline =
              tournament.Registration_Deadline || tournament.Entry_Close;
            const { text: daysLeftText, isClosed } = getDaysLeftInfo(
              registrationDeadline,
              tournament.RegistrationOpen
            );
            const buttonText = isClosed ? "View Details" : "Register Now";
            const buttonUrl = isClosed
              ? `https://clublocker.com/tournaments/${tournament.TournamentID}`
              : tournament.ClubLockerUrl;

            return (
              <motion.div
                key={tournament.TournamentID}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      {/* Tournament logo and status */}
                      <div className="flex flex-col items-center gap-2 min-w-[120px]">
                        {tournament.LogoImageUrl && (
                          <img
                            src={tournament.LogoImageUrl}
                            alt="Tournament Logo"
                            className="w-16 h-16 rounded-lg object-cover border"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        )}
                        <Badge
                          className={`w-full justify-center ${getRegistrationStatusColor(
                            daysLeftText
                          )}`}
                        >
                          {daysLeftText}
                        </Badge>
                        {tournament.regularFee?.price && (
                          <Badge
                            variant="secondary"
                            className="w-full justify-center"
                          >
                            ${tournament.regularFee.price}
                          </Badge>
                        )}
                      </div>

                      {/* Tournament details */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {tournament.TournamentName}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge
                              variant="outline"
                              className={getEventTypeColor(
                                tournament.EventType || ""
                              )}
                            >
                              {tournament.EventType || "Tournament"}
                            </Badge>
                            {tournament.RankingPoints && (
                              <Badge variant="outline">
                                {tournament.RankingPoints} Ranking Points
                              </Badge>
                            )}
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
                                {formatDate(tournament.StartDate)}
                                {tournament.EndDate &&
                                  tournament.EndDate !==
                                    tournament.StartDate && (
                                    <span>
                                      {" "}
                                      - {formatDate(tournament.EndDate)}
                                    </span>
                                  )}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Location
                              </p>
                              <p className="font-medium">{location}</p>
                            </div>
                          </div>

                          {tournament.VenueName && (
                            <div className="flex items-center gap-3">
                              <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Venue
                                </p>
                                <p className="font-medium">
                                  {tournament.VenueName}
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Registration Deadline
                              </p>
                              <p className="font-medium">
                                {registrationDeadline
                                  ? formatDate(registrationDeadline)
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Register button */}
                      <div className="flex items-center justify-end md:justify-start min-w-[120px]">
                        <Button
                          onClick={() => window.open(buttonUrl, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          {buttonText}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
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
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "No tournaments are currently available."}
              </p>
              <Button
                onClick={loadTournaments}
                variant="outline"
                className="mt-4"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Refresh Tournaments
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {filteredTournaments.length > pageSize && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filteredTournaments.length)} of{" "}
            {filteredTournaments.length} tournaments
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
