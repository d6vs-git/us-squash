"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Target,
  CheckCircle,
  Calculator,
  BarChart3,
  TrendingUp,
  Award,
  Brain,
  ArrowRight,
  Zap,
  User,
  TrendingDown,
  Download,
  ExternalLink,
  MapPin,
  Calendar,
  DollarSign,
  AlertTriangle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { downloadPDF, generateTournamentRecommendationsPDF, generateTournamentRecommendationsPDFFilename } from "@/utils/pdf-generator"

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

interface TournamentSequenceItem {
  sequenceNumber: number
  tournament: Tournament
  strategy: {
    requiredFinishPosition: number
    estimatedDivisionEntrants: number
    tournamentType: "JCT" | "Gold" | "Silver" | "Bronze"
    pointsFromFinish: number
    reasoning: string
  }
  pointsProgression: {
    pointsEarned: number
    newTotalPoints: number
    newExposures: number
    newDivisor: number
    newAveragedPoints: number
    averagedPointsProgress: string
    remainingGap: number
  }
}

interface TournamentRecommendation {
  currentAnalysis: {
    currentRanking: number
    currentTotalPoints: number
    currentExposures: number
    currentAveragedPoints: number
    targetRanking: number
    targetPlayerName: string
    targetPlayerAveragedPoints: number
    averagedPointsGap: number
    divisionName: string
  }
  tournamentSequence: TournamentSequenceItem[]
  summary: {
    totalTournaments: number
    totalPointsToEarn: number
    finalProjectedAveragedPoints: number
    targetPlayerToSurpass: string
    projectedFinalRanking: number
    timelineMonths: number
    successProbability: "high" | "medium" | "low"
  }
}

interface UserGoal {
  type: string
  description: string
  timeframe: string
  targetRating?: number
  targetRanking?: number
  specificTournaments?: string[]
}

export default function TournamentRecommendations() {
  const [recommendations, setRecommendations] = useState<TournamentRecommendation | null>(null)
  const [loadingRecommendations, setLoadingRecommendations] = useState(false)
  const [showGoalInput, setShowGoalInput] = useState(false)
  const [userGoal, setUserGoal] = useState<UserGoal>({
    type: "",
    description: "",
    timeframe: "",
    targetRating: undefined,
    targetRanking: undefined,
    specificTournaments: [],
  })
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loadingTournaments, setLoadingTournaments] = useState(false)

  // Fetch user ID on mount
  useEffect(() => {
    fetchUserId()
    fetchTournaments()
  }, [])

  const fetchUserId = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/user")

      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.status}`)
      }

      const userData = await response.json()

      if (!userData || !userData.id) {
        throw new Error("Invalid user data received")
      }

      setUserId(userData.id)
    } catch (error) {
      console.error("Error fetching user ID:", error)
      setError(error instanceof Error ? error.message : "Failed to load user data")
    } finally {
      setLoading(false)
    }
  }

  // 1. First, ensure your tournament data structure matches the Tournament interface
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
  // ... other optional fields
}

// 2. Transform your array data to match the interface
const transformTournamentData = (rawData: any[]): Tournament[] => {
  return rawData.map(item => ({
    TournamentID: item.TournamentID,
    TournamentName: item.TournamentName || `Tournament #${item.TournamentID}`,
    StartDate: item.StartDate || new Date().toISOString(),
    EndDate: item.EndDate || new Date().toISOString(),
    Entry_Open: item.Entry_Open,
    Entry_Close: item.Entry_Close,
    Registration_Deadline: item.Registration_Deadline,
    SiteCity: item.SiteCity,
    State: item.State,
    EventType: item.EventType,
    EventTypeCode: item.EventTypeCode,
    MaxRating: item.MaxRating,
    MinRating: item.MinRating,
    AgeRestrictions: item.AgeRestrictions,
    regularFee: item.regularFee ? {
      price: Number(item.regularFee.price) || 0
    } : undefined,
    RankingPoints: item.RankingPoints,
    Unsanctioned: item.Unsanctioned,
    RegistrationOpen: item.RegistrationOpen,
    ClubLockerUrl: item.ClubLockerUrl,
    Description: item.Description,
    TournamentContact: item.TournamentContact,
    ContactEmail: item.ContactEmail,
    OrganizerOrganization: item.OrganizerOrganization,
    URL: item.URL,
    VenueId: item.VenueId,
    RankingPeriod: item.RankingPeriod,
    NumPlayers: item.NumPlayers,
    PlayersOnDraw: item.PlayersOnDraw,
    EntryForm: item.EntryForm,
    NumMatches: item.NumMatches,
    CreateDate: item.CreateDate,
    UpdateDate: item.UpdateDate,
    SeasonID: item.SeasonID,
    LogoImageUrl: item.LogoImageUrl,
    OrganizerLogoUrl: item.OrganizerLogoUrl,
    StartingTimesID: item.StartingTimesID,
    Pictures_URL: item.Pictures_URL,
    OrganizationLat: item.OrganizationLat,
    OrganizationLong: item.OrganizationLong,
    OrganizationDistance: item.OrganizationDistance,
    VenueName: item.VenueName
  }));
};

  const fetchTournaments = async () => {
    try {
      setLoadingTournaments(true)
      
      // Fetch upcoming tournaments
      const response = await fetch("/api/tournaments")
      
      if (response.ok) {
        const data = await response.json()
        setTournaments(transformTournamentData(data) || [])
        console.log(`Loaded ${data.tournaments?.length || 0} tournaments`)
      } else {
        console.warn("Failed to fetch tournaments, using empty list")
        setTournaments([])
      }
    } catch (error) {
      console.error("Error fetching tournaments:", error)
      setTournaments([])
    } finally {
      setLoadingTournaments(false)
    }
  }

  const generateStrategicRecommendations = async () => {
    // Validate all required fields
    if (
      !userGoal.targetRanking ||
      userGoal.targetRanking <= 0 ||
      !userGoal.type ||
      !userGoal.timeframe
    ) {
      setShowGoalInput(true);
      setError("Please fill all required fields: Goal Type, Timeframe, and Target Ranking.");
      return;
    }
    if (!userId) {
      setError("User not loaded. Please try again.");
      return;
    }

    try {
      setLoadingRecommendations(true);
      setError(null);

      const response = await fetch("/api/ai/tournament-recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId,
          tournaments, // This will now have actual tournament data
          userGoal,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API response error:", response.status, errorData);
        
        // Provide user-friendly error messages
        let errorMessage = "Failed to generate recommendations";
        if (response.status === 401) {
          errorMessage = "Authentication expired. Please refresh the page and try again.";
        } else if (response.status === 400) {
          errorMessage = errorData.details || errorData.error || "Invalid request parameters";
        } else if (response.status === 500) {
          errorMessage = errorData.details || "Server error while generating recommendations";
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (data.success && data.recommendations) {
        // Validate the recommendations structure
        if (!data.recommendations.currentAnalysis) {
          throw new Error("Invalid recommendations: missing current analysis data");
        }
        if (!data.recommendations.tournamentSequence || !Array.isArray(data.recommendations.tournamentSequence)) {
          throw new Error("Invalid recommendations: missing tournament sequence data");
        }
        if (!data.recommendations.summary) {
          throw new Error("Invalid recommendations: missing summary data");
        }
        
        setRecommendations(data.recommendations);
        setShowGoalInput(false);
      } else {
        throw new Error(data.details || "Invalid recommendations data received from API");
      }
    } catch (error) {
      console.error("Error generating recommendations:", error);
      setError(error instanceof Error ? error.message : "Failed to generate recommendations");
    } finally {
      setLoadingRecommendations(false);
    }
  }

  const exportTournamentPlanToPDF = async () => {
    if (!recommendations || !userId) {
      setError("No tournament recommendations to export. Please generate a plan first.")
      return
    }

    setPdfGenerating(true)

    try {
      const blob = await generateTournamentRecommendationsPDF({
        userId: userId,
        recommendations: recommendations,
        userGoal: userGoal,
        timestamp: new Date().toISOString(),
        metadata: {
          keywords: `tournament strategy, squash, ranking, ${userGoal.type}, target ranking ${userGoal.targetRanking}`,
          subject: `Tournament Strategy Plan: Target Ranking #${userGoal.targetRanking}`,
        }
      })

      const filename = generateTournamentRecommendationsPDFFilename(userId, userGoal.targetRanking)
      downloadPDF(blob, filename)
    } catch (error) {
      console.error("Failed to export tournament plan PDF:", error)
      setError("Failed to export tournament plan PDF. Please try again.")
    } finally {
      setPdfGenerating(false)
    }
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return "Invalid Date"
    }
  }

  const getTournamentTypeColor = (type: string) => {
    switch (type) {
      case "JCT":
        return "bg-accent text-accent-foreground"
      case "Gold":
        return "bg-warning text-warning-foreground"
      case "Silver":
        return "bg-muted text-muted-foreground"
      case "Bronze":
        return "bg-secondary text-secondary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getSuccessProbabilityColor = (probability: string) => {
    switch (probability) {
      case "high":
        return "text-success"
      case "medium":
        return "text-warning"
      case "low":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {(loading || loadingTournaments) && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 animate-pulse" />
                <span>Loading tournament data...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tournament Data Status */}
      {!loading && !loadingTournaments && (
        <Card className="animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              {tournaments.length > 0 ? (
                <>
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm">
                    {tournaments.length} tournaments loaded for analysis
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <span className="text-sm text-warning">
                    No tournament data available. Recommendations will be based on historical patterns.
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goal Input Section */}
      {showGoalInput && (
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Set Your Ranking Goal
            </CardTitle>
            <CardDescription>
              Enter your target ranking to get a strategic tournament plan based on the current player at that position
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goalType">Goal Type</Label>
                <Select value={userGoal.type} onValueChange={(value) => setUserGoal({ ...userGoal, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your primary goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ranking-improvement">Improve Ranking</SelectItem>
                    <SelectItem value="rating-improvement">Improve Rating</SelectItem>
                    <SelectItem value="championship-qualification">Championship Qualification</SelectItem>
                    <SelectItem value="points-accumulation">Points Accumulation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select
                  value={userGoal.timeframe}
                  onValueChange={(value) => setUserGoal({ ...userGoal, timeframe: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3-months">Next 3 Months</SelectItem>
                    <SelectItem value="6-months">Next 6 Months</SelectItem>
                    <SelectItem value="1-year">Next Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetRanking">Target Ranking *</Label>
              <Input
                id="targetRanking"
                type="number"
                placeholder="e.g., 20"
                value={userGoal.targetRanking || ""}
                onChange={(e) =>
                  setUserGoal({ ...userGoal, targetRanking: Number.parseInt(e.target.value) || undefined })
                }
              />
              <p className="text-xs text-muted-foreground">
                Enter the ranking position you want to achieve (e.g., 20 for top 20)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goalDescription">Additional Notes (Optional)</Label>
              <Textarea
                id="goalDescription"
                placeholder="Any specific preferences, constraints, or additional goals..."
                value={userGoal.description}
                onChange={(e) => setUserGoal({ ...userGoal, description: e.target.value })}
                rows={3}
              />
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                onClick={generateStrategicRecommendations}
                disabled={!userGoal.targetRanking || loadingRecommendations || loading || loadingTournaments}
                className="transition-all-smooth hover-lift"
              >
                {loadingRecommendations ? (
                  <>
                    <Brain className="h-4 w-4 animate-pulse mr-2" />
                    Analyzing Rankings...
                  </>
                ) : (
                  <>
                    <Calculator className="h-4 w-4 mr-2" />
                    Generate Tournament Plan
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowGoalInput(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Strategic Planning Section */}
      {!loading && !loadingTournaments && (
        <Card className="animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Tournament Strategy Planner</h3>
                <p className="text-sm text-muted-foreground">
                  Generate a customized tournament plan to achieve your ranking goals
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (
                      !userGoal.targetRanking ||
                      userGoal.targetRanking <= 0 ||
                      !userGoal.type ||
                      !userGoal.timeframe
                    ) {
                      setShowGoalInput(true);
                      setError("Please fill all required fields: Goal Type, Timeframe, and Target Ranking.");
                    } else {
                      generateStrategicRecommendations();
                    }
                  }}
                  disabled={loadingRecommendations}
                  className="transition-all-smooth hover-lift"
                >
                  {loadingRecommendations ? (
                    <>
                      <Brain className="h-4 w-4 animate-pulse mr-2" />
                      Analyzing Rankings...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Strategic Tournament Plan
                    </>
                  )}
                </Button>

                {recommendations && (
                  <Button 
                    onClick={exportTournamentPlanToPDF} 
                    variant="outline"
                    disabled={pdfGenerating}
                    className="transition-all-smooth hover-lift"
                  >
                    {pdfGenerating ? (
                      <>
                        <Download className="h-4 w-4 animate-pulse mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Export Plan
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {userGoal.targetRanking && (
              <div className="mt-4 p-4 bg-accent/20 rounded-lg border border-accent/30">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium text-accent-foreground">Target Ranking Goal</h4>
                    <p className="text-sm text-accent-foreground/80 mt-1">
                      Aiming for ranking #{userGoal.targetRanking} in your division
                    </p>
                    {userGoal.description && (
                      <p className="text-sm text-accent-foreground/80 mt-1">{userGoal.description}</p>
                    )}
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => setShowGoalInput(true)}
                      className="text-accent-foreground p-0 h-auto"
                    >
                      Edit Goal
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tournament Sequence Recommendations */}
      {recommendations && (
        <div className="space-y-6">
          {/* Current Analysis Overview */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Current Analysis & Target Player
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Player Stats */}
                <div className="space-y-4 p-4 bg-surface rounded-lg">
                  <h3 className="font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Your Current Position
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        #{recommendations.currentAnalysis.currentRanking}
                      </div>
                      <div className="text-sm text-muted-foreground">Current Ranking</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {recommendations.currentAnalysis.currentAveragedPoints}
                      </div>
                      <div className="text-sm text-muted-foreground">Averaged Points</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground text-center">
                    Division: {recommendations.currentAnalysis.divisionName}
                  </div>
                </div>

                {/* Target Player Stats */}
                <div className="space-y-4 p-4 bg-surface rounded-lg">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Target Player to Surpass
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        #{recommendations.currentAnalysis.targetRanking}
                      </div>
                      <div className="text-sm text-muted-foreground">Target Ranking</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {recommendations.currentAnalysis.targetPlayerAveragedPoints}
                      </div>
                      <div className="text-sm text-muted-foreground">Their Averaged Points</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground text-center">
                    Player: {recommendations.currentAnalysis.targetPlayerName}
                  </div>
                </div>
              </div>

              {/* Gap Analysis */}
              <div className="mt-6 p-4 bg-warning/10 rounded-lg border border-warning/20">
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-warning">
                      +{recommendations.currentAnalysis.averagedPointsGap}
                    </div>
                    <div className="text-sm text-muted-foreground">Averaged Points Gap to Close</div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-warning" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-success">{recommendations.summary.timelineMonths}mo</div>
                    <div className="text-sm text-muted-foreground">Projected Timeline</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tournament Sequence */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-semibold">Tournament Sequence Plan</h2>
              <Badge variant="secondary">{recommendations.tournamentSequence.length} tournaments</Badge>
            </div>

            {/* Tournament Cards */}
            <div className="space-y-4">
              {recommendations.tournamentSequence.map((item, index) => {
                const tournament = item.tournament
                const location =
                  tournament.SiteCity && tournament.State
                    ? `${tournament.SiteCity}, ${tournament.State}`
                    : tournament.SiteCity || tournament.State || "Location TBD"
                const entryFee = tournament.regularFee?.price ? `${tournament.regularFee.price}` : "N/A"
                const registrationLink = tournament.ClubLockerUrl || tournament.URL || ""

                return (
                  <Card key={item.sequenceNumber} className="transition-all-smooth hover-lift">
                    <div className="h-1 bg-gradient-to-r from-primary to-accent rounded-t-lg"></div>
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{tournament.TournamentName}</CardTitle>
                          <CardDescription className="flex flex-wrap items-center gap-4 mt-2">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(tournament.StartDate)}
                            </span>
                            {entryFee && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                {entryFee}
                              </span>
                            )}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <Badge className={`${getTournamentTypeColor(item.strategy.tournamentType)} mb-2`}>
                            {item.strategy.tournamentType}
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            {item.strategy.estimatedDivisionEntrants} entrants
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Strategy Section */}
                      <div className="bg-surface rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Target className="h-4 w-4" />
                          <span className="font-semibold">Tournament Strategy</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">
                              Required Finish:
                            </span>
                            <div className="text-2xl font-bold">
                              #{item.strategy.requiredFinishPosition}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">
                              Points Available:
                            </span>
                            <div className="text-2xl font-bold text-success">{item.strategy.pointsFromFinish}</div>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">
                              Tournament Type:
                            </span>
                            <div className="text-lg font-semibold">{item.strategy.tournamentType}</div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-3">{item.strategy.reasoning}</p>
                      </div>

                      {/* Points Progression */}
                      <div className="bg-success/5 rounded-lg p-4 border border-success/10">
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp className="h-4 w-4 text-success" />
                          <span className="font-semibold">Points Progression</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">
                              Points Earned:
                            </span>
                            <div className="text-xl font-bold text-success">
                              +{Math.round(item.pointsProgression.pointsEarned)}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">New Total:</span>
                            <div className="text-xl font-bold text-success">
                              {Math.round(item.pointsProgression.newTotalPoints)}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">
                              New Exposures:
                            </span>
                            <div className="text-xl font-bold text-success">
                              {item.pointsProgression.newExposures}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">
                              New Avg Points:
                            </span>
                            <div className="text-xl font-bold text-success">
                              {Math.round(item.pointsProgression.newAveragedPoints)}
                            </div>
                          </div>
                        </div>

                        {/* Progress toward target */}
                        <div className="mt-4 p-3 bg-surface rounded-lg border">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Award className="h-4 w-4 text-success" />
                              <span className="font-medium">Progress Update:</span>
                            </div>
                            <div className="text-right">
                              {item.pointsProgression.remainingGap > 0 ? (
                                <div className="flex items-center gap-1">
                                  <TrendingDown className="h-4 w-4 text-warning" />
                                  <span className="text-sm font-medium text-warning">
                                    {Math.round(item.pointsProgression.remainingGap)} points remaining
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="h-4 w-4 text-success" />
                                  <span className="text-sm font-medium text-success">Target Reached!</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {item.pointsProgression.averagedPointsProgress}
                          </p>
                        </div>
                      </div>

                      {/* Registration Button */}
                      {registrationLink && (
                        <Button
                          className="w-full"
                          onClick={() => window.open(registrationLink, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Register for Tournament #{item.sequenceNumber}
                        </Button>
                      )}

                      {/* Arrow to next tournament */}
                      {index < recommendations.tournamentSequence.length - 1 && (
                        <div className="flex justify-center pt-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <div className="h-px bg-border flex-1"></div>
                            <ArrowRight className="h-4 w-4" />
                            <div className="h-px bg-border flex-1"></div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Summary */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Tournament Plan Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 p-4 bg-surface rounded-lg">
                  <h3 className="font-semibold">Plan Overview</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{recommendations.summary.totalTournaments}</div>
                      <div className="text-sm text-muted-foreground">Total Tournaments</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">
                        +{recommendations.summary.totalPointsToEarn}
                      </div>
                      <div className="text-sm text-muted-foreground">Points to Earn</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 p-4 bg-surface rounded-lg">
                  <h3 className="font-semibold">Expected Outcome</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {recommendations.summary.finalProjectedAveragedPoints}
                      </div>
                      <div className="text-sm text-muted-foreground">Final Avg Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        #{recommendations.summary.projectedFinalRanking}
                      </div>
                      <div className="text-sm text-muted-foreground">Projected Ranking</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-surface rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Target Player to Surpass:</h4>
                    <p className="text-muted-foreground">{recommendations.summary.targetPlayerToSurpass}</p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-lg font-bold ${getSuccessProbabilityColor(recommendations.summary.successProbability)}`}
                    >
                      {recommendations.summary.successProbability.toUpperCase()}
                    </div>
                    <div className="text-sm text-muted-foreground">Success Probability</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}