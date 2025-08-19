"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  Star,
  Target,
  Activity,
  ExternalLink,
  User,
  UserMinus,
  GitCompare,
  Loader2,
  X,
  AlertCircle,
  Download,
} from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ExpandablePlayerCard } from "@/components/dashboard/player-tracker/expandable-player-card"
import Loading from "@/components/ui/loading"
import { generatePlayerComparisonPDF, downloadPDF, generateComparisonPDFFilename } from "@/utils/pdf-generator"

interface TrackedPlayer {
  id: number
  name: string
  profilePictureUrl: string
  matchType: string
  matchStatus: string
  matchOpponent: string | null
  matchDate: string | null
  matchEvent: string | null
  matchEventDivision: string | null
  matchScore: string
  nextMatchWonOpponent: string
  nextMatchWonDate: string | null
  nextMatchWonEvent: string | null
}

interface SearchPlayer {
  IMISID: string
  id: number
  FullPlayerName: string
  fullDetails: string
  playername: string
  mainAffiliation: string
  country: string
  state: string | null
  AdultJunior: string
  rating: number | null
  Gender: string
  fname: string
  lname: string
  city: string
  ProfilePictureUrl: string | null
}

interface PlayerComparisonAnalysis {
  comparisonSummary: string
  currentUserAnalysis: {
    strengths: string[]
    weaknesses: string[]
    playingStyle: string
  }
  comparisonPlayerAnalysis: {
    strengths: string[]
    weaknesses: string[]
    playingStyle: string
  }
  headToHeadAnalysis: {
    exists: boolean
    record: string
    insights: string
    keyTacticsObserved: string[]
  }
  strategicRecommendations: string[]
  keyTakeaways: string[]
}

export default function PlayerTrackerPage() {
  const [trackedPlayers, setTrackedPlayers] = useState<TrackedPlayer[]>([])
  const [searchResults, setSearchResults] = useState<SearchPlayer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [maxPlayersAllowed, setMaxPlayersAllowed] = useState(3)
  const [userId, setUserId] = useState<string | null>(null)
  const [removingPlayerId, setRemovingPlayerId] = useState<number | null>(null)
  const [addingPlayerId, setAddingPlayerId] = useState<number | null>(null)

  // New state for player comparison
  const [comparisonPlayer, setComparisonPlayer] = useState<SearchPlayer | null>(null)
  const [comparisonAnalysis, setComparisonAnalysis] = useState<PlayerComparisonAnalysis | null>(null)
  const [loadingComparison, setLoadingComparison] = useState(false)
  const [comparisonError, setComparisonError] = useState<string | null>(null)
  const [pdfGenerating, setPdfGenerating] = useState(false)

  const router = useRouter()

  useEffect(() => {
    fetchUserAndTrackedPlayers()
  }, [])

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        searchPlayers()
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(delayedSearch)
  }, [searchTerm])

  const fetchUserAndTrackedPlayers = async () => {
    try {
      setLoading(true)

      // First get user data
      const userResponse = await fetch("/api/user")
      if (!userResponse.ok) {
        if (userResponse.status === 401) {
          router.push("/login")
          return
        }
        throw new Error("Failed to fetch user data")
      }

      const userData = await userResponse.json()
      const currentUserId = userData.id.toString()
      setUserId(currentUserId)

      // Then fetch tracked players
      const response = await fetch(`/api/user/player-tracker?userId=${currentUserId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch tracked players")
      }
      const data = await response.json()

      setTrackedPlayers(data.trackedPlayers || [])
      setMaxPlayersAllowed(data.numberOfPlayersAllowed || 3)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const searchPlayers = async () => {
    if (!searchTerm.trim()) return

    try {
      setSearching(true)
      const encodedQuery = encodeURIComponent(searchTerm.trim())
      const response = await fetch(`/api/user/player-tracker/search-player?query=${encodedQuery}`)

      if (!response.ok) {
        throw new Error("Failed to search players")
      }

      const data = await response.json()
      setSearchResults(data || [])
    } catch (err) {
      console.error("Error searching players:", err)
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

  const addPlayerToTracker = async (playerId: number) => {
    try {
      setAddingPlayerId(playerId)
      const response = await fetch("/api/user/player-tracker/add-player", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playerId }),
      })

      if (!response.ok) {
        throw new Error("Failed to add player to tracker")
      }

      // Refresh tracked players
      await fetchUserAndTrackedPlayers()
      setSearchTerm("")
      setSearchResults([])
    } catch (err) {
      console.error("Error adding player to tracker:", err)
    } finally {
      setAddingPlayerId(null)
    }
  }

  const removePlayerFromTracker = async (playerId: number) => {
    try {
      setRemovingPlayerId(playerId)
      const response = await fetch("/api/user/player-tracker/remove-player", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playerId }),
      })

      if (!response.ok) {
        throw new Error("Failed to remove player from tracker")
      }

      // Refresh tracked players
      await fetchUserAndTrackedPlayers()
    } catch (err) {
      console.error("Error removing player from tracker:", err)
    } finally {
      setRemovingPlayerId(null)
    }
  }

  const handleSelectForComparison = (player: SearchPlayer) => {
    setComparisonPlayer(player)
    setComparisonAnalysis(null) // Clear previous analysis
    setComparisonError(null) // Clear previous error
    setSearchTerm("") // Clear search term
    setSearchResults([]) // Clear search results
  }

  const generateComparisonAnalysis = async () => {
    if (!comparisonPlayer || !userId) {
      setComparisonError("Please select a player to compare.")
      return
    }

    try {
      setLoadingComparison(true)
      setComparisonError(null)
      setComparisonAnalysis(null)

      const response = await fetch("/api/ai/player-comparison", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          comparisonPlayerId: comparisonPlayer.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || "Failed to generate comparison analysis")
      }

      const data = await response.json()
      setComparisonAnalysis(data.analysis)
    } catch (err) {
      console.error("Error generating comparison analysis:", err)
      setComparisonError(err instanceof Error ? err.message : "An unknown error occurred during analysis.")
    } finally {
      setLoadingComparison(false)
    }
  }

  const viewPlayerProfile = (playerId: number) => {
    window.open(`https://clublocker.com/users/${playerId}`, "_blank")
  }

  const exportComparisonToPDF = async () => {
    if (!comparisonAnalysis || !comparisonPlayer || !userId) {
      setComparisonError("No comparison analysis to export.")
      return
    }

    setPdfGenerating(true)

    try {
      const blob = await generatePlayerComparisonPDF({
        userId: userId,
        comparisonPlayer: comparisonPlayer,
        comparisonAnalysis: comparisonAnalysis,
        timestamp: new Date().toISOString(),
        metadata: {
          keywords: `player comparison, squash, analysis, ${comparisonPlayer.fname} ${comparisonPlayer.lname}`,
          subject: `Player Comparison Analysis: ${comparisonPlayer.fname} ${comparisonPlayer.lname}`,
        }
      })

      const filename = generateComparisonPDFFilename(
        userId, 
        comparisonPlayer.fname, 
        comparisonPlayer.lname
      )
      downloadPDF(blob, filename)
    } catch (error) {
      console.error("Failed to export PDF:", error)
      setComparisonError("Failed to export PDF. Please try again.")
    } finally {
      setPdfGenerating(false)
    }
  }

  if(loading){
    return <Loading/>
  }

  const TrackedPlayerCard = ({ player }: { player: TrackedPlayer }) => (
    <Card className="hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={player.profilePictureUrl} />
              <AvatarFallback className="bg-secondary">
                {player.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{player.name}</h3>
              {player.matchEventDivision && (
                <Badge variant="outline" className="text-xs mt-1">
                  {player.matchEventDivision}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => viewPlayerProfile(player.id)}>
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => removePlayerFromTracker(player.id)}
              disabled={removingPlayerId === player.id}
            >
              {removingPlayerId === player.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserMinus className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {player.matchType !== "none" && (
          <div className="mt-3 pt-3 border-t">
            <div className="text-sm">
              <span className="font-medium">Last Match:</span>
              <div className="mt-1">
                {player.matchOpponent && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>vs {player.matchOpponent}</span>
                    {player.matchStatus && (
                      <Badge variant={player.matchStatus === "win" ? "default" : "destructive"} className="ml-2">
                        {player.matchStatus}
                      </Badge>
                    )}
                  </div>
                )}
                {player.matchEvent && <div className="text-xs text-muted-foreground mt-1">{player.matchEvent}</div>}
                {player.matchScore && <div className="text-xs text-muted-foreground mt-1">Score: {player.matchScore}</div>}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  // Comparison Analysis Section Component
  const ComparisonAnalysisSection = ({ 
    analysis,
    comparisonPlayer 
  }: {
    analysis: PlayerComparisonAnalysis,
    comparisonPlayer: SearchPlayer
  }) => (
    <div className="space-y-4">
      <Card className="border-0 bg-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Comparison Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{analysis.comparisonSummary}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Your Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <span className="font-medium text-sm">Playing Style:</span>
              <p className="text-sm text-muted-foreground mt-1">{analysis.currentUserAnalysis.playingStyle}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-success mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                Strengths
              </h4>
              <ul className="space-y-1">
                {analysis.currentUserAnalysis.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-success rounded-full mt-2 flex-shrink-0"></div>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-destructive mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-destructive rounded-full"></div>
                Areas to Improve
              </h4>
              <ul className="space-y-1">
                {analysis.currentUserAnalysis.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {comparisonPlayer.fname}'s Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <span className="font-medium text-sm">Playing Style:</span>
              <p className="text-sm text-muted-foreground mt-1">{analysis.comparisonPlayerAnalysis.playingStyle}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-success mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                Strengths
              </h4>
              <ul className="space-y-1">
                {analysis.comparisonPlayerAnalysis.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-success rounded-full mt-2 flex-shrink-0"></div>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-destructive mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-destructive rounded-full"></div>
                Weaknesses
              </h4>
              <ul className="space-y-1">
                {analysis.comparisonPlayerAnalysis.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {analysis.headToHeadAnalysis.exists && (
        <Card className="border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Head-to-Head Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Match Record</span>
              <Badge variant="outline" className="font-bold">
                {analysis.headToHeadAnalysis.record}
              </Badge>
            </div>
            
            <div className="p-3 bg-muted rounded-lg">
              <span className="font-medium text-sm">Insights:</span>
              <p className="text-sm text-muted-foreground mt-1">{analysis.headToHeadAnalysis.insights}</p>
            </div>
            
            {analysis.headToHeadAnalysis.keyTacticsObserved.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">Key Tactics Observed:</h4>
                <ul className="space-y-1">
                  {analysis.headToHeadAnalysis.keyTacticsObserved.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Strategic Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.strategicRecommendations.map((rec: string, i: number) => (
              <div key={i} className="flex gap-3 p-4 bg-muted rounded-lg">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <span className="text-sm">{rec}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Key Takeaways
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analysis.keyTakeaways.map((takeaway: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-sm p-3 bg-accent rounded-lg">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                {takeaway}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Main render with updated UI
  return (
    <div className="container mx-auto py-6 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="border-0">
          <CardHeader>
            <CardTitle>Player Tracker</CardTitle>
            <CardDescription>
              Track and analyze other players ({trackedPlayers.length}/{maxPlayersAllowed} slots used)
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="tracked">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tracked" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Tracked
            </TabsTrigger>
            <TabsTrigger value="discover" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="compare" className="flex items-center gap-2">
              <GitCompare className="h-4 w-4" />
              Compare
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracked" className="pt-4">
            {trackedPlayers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trackedPlayers.map(player => (
                  <TrackedPlayerCard key={player.id} player={player} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <Activity className="mx-auto h-8 w-8 mb-4" />
                  <h3 className="font-medium">No players tracked yet</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Discover players to add to your tracker
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="discover" className="pt-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search players..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />
              )}
            </div>

            {searchTerm.length >= 2 ? (
              searchResults.length > 0 ? (
                <ExpandablePlayerCard
                  players={searchResults}
                  trackedPlayers={trackedPlayers}
                  maxPlayersAllowed={maxPlayersAllowed}
                  onAddPlayer={addPlayerToTracker}
                  addingPlayerId={addingPlayerId}
                  onSelectForComparison={handleSelectForComparison}
                />
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Search className="mx-auto h-8 w-8 mb-4" />
                    <h3 className="font-medium">No players found</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      No results for "{searchTerm}"
                    </p>
                  </CardContent>
                </Card>
              )
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <Target className="mx-auto h-8 w-8 mb-4" />
                  <h3 className="font-medium">Search for players</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Enter at least 2 characters to search
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="compare" className="pt-4">
            <Card className="border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitCompare className="h-5 w-5" />
                  Player Comparison
                </CardTitle>
                <CardDescription>
                  Compare yourself with any US Squash player
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {comparisonPlayer ? (
                  <div className="flex items-center gap-4 p-4 border rounded-lg bg-accent">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={comparisonPlayer.ProfilePictureUrl ?? undefined} />
                      <AvatarFallback>
                        {comparisonPlayer.fname[0]}{comparisonPlayer.lname[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {comparisonPlayer.fname} {comparisonPlayer.lname}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {comparisonPlayer.city}, {comparisonPlayer.state}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {comparisonPlayer.rating && (
                          <Badge variant="secondary" className="text-xs">
                            Rating: {comparisonPlayer.rating.toFixed(1)}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {comparisonPlayer.mainAffiliation}
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        setComparisonPlayer(null)
                        setComparisonAnalysis(null)
                        setComparisonError(null)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-lg border-dashed">
                    <GitCompare className="mx-auto h-8 w-8 mb-4 text-muted-foreground" />
                    <h4 className="font-medium">No player selected</h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      Select a player from the Discover tab to begin comparison
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button 
                    className="flex-1" 
                    onClick={generateComparisonAnalysis}
                    disabled={!comparisonPlayer || loadingComparison}
                  >
                    {loadingComparison ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <GitCompare className="h-4 w-4 mr-2" />
                        Generate Analysis
                      </>
                    )}
                  </Button>

                  {comparisonAnalysis && (
                    <Button 
                      variant="outline"
                      onClick={exportComparisonToPDF}
                      disabled={pdfGenerating}
                    >
                      {pdfGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Generating PDF...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Export PDF
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {comparisonError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{comparisonError}</AlertDescription>
                  </Alert>
                )}

                {comparisonAnalysis && comparisonPlayer && (
                  <ComparisonAnalysisSection 
                    analysis={comparisonAnalysis}
                    comparisonPlayer={comparisonPlayer}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}