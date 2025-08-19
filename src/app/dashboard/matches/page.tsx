"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Users, MapPin, ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react"
import { motion } from "framer-motion"
import Loading from "@/components/ui/loading"

interface Match {
  Matchid: number
  MatchDate: string
  Descr: string
  Score: string
  Status: string
  WhatKind: string
  wid1: number
  wid2: number
  oid1: number
  oid2: number
  hplayer1: string
  hplayer2: string
  vplayer1: string
  vplayer2: string
  Winner: string
  DivisionDescr: string
  RoundDescr: string
  ClubName: string
  Sportid: number
  SportDescr: string
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [userId, setUserId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const router = useRouter()

  useEffect(() => {
    fetchUserAndMatches()
  }, [])

  const fetchUserAndMatches = async () => {
    setLoading(true)
    try {
      const userResponse = await fetch("/api/user")
      if (!userResponse.ok) {
        if (userResponse.status === 401) {
          router.push("/login")
          return
        }
        throw new Error("Failed to fetch user data")
      }

      const userData = await userResponse.json()
      setUserId(userData.id)

      const response = await fetch(`/api/user/matches?userId=${userData.id}&pageSize=500&sportId=3`)
      if (!response.ok) throw new Error("Failed to fetch matches")
      const data = await response.json()

      setMatches((data.matches || []).filter((match: Match) => match.Sportid === 3))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getMatchResult = (match: Match) => {
    if (!userId) return "Unknown"
    const userIsHome = match.wid1 === userId || match.wid2 === userId
    const userIsVisitor = match.oid1 === userId || match.oid2 === userId

    if (userIsHome && match.Winner === "H") return "Won"
    if (userIsVisitor && match.Winner === "V") return "Won"
    if (userIsHome && match.Winner === "V") return "Lost"
    if (userIsVisitor && match.Winner === "H") return "Lost"
    return "Unknown"
  }

  const getOpponentName = (match: Match) => {
    if (!userId) return "Unknown"
    const userIsHome = match.wid1 === userId || match.wid2 === userId
    return userIsHome ? match.vplayer1 : match.hplayer1
  }

  const getMatchTypeLabel = (whatKind: string) => {
    switch (whatKind) {
      case "T": return "Tournament"
      case "L": return "League"
      case "F": return "Friendly"
      default: return "Other"
    }
  }

  // Pagination logic
  const totalPages = Math.ceil(matches.length / pageSize)
  const paginatedMatches = matches.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  if (loading) {
    return (
     <Loading/>
    )
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
            <Button variant="outline" onClick={fetchUserAndMatches}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Match History</h1>
        <p className="text-muted-foreground">
          View your complete match history and results ({matches.length} total matches)
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-4">
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value))
              setCurrentPage(1)
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

      {/* Matches List */}
      {paginatedMatches.length > 0 ? (
        <div className="space-y-4">
          {paginatedMatches.map((match, index) => {
            const result = getMatchResult(match)
            const opponentName = getOpponentName(match)

            return (
              <motion.div
                key={match.Matchid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      {/* Match result and type */}
                      <div className="flex flex-col items-center gap-2 min-w-[100px]">
                        <Badge
                          variant={result === "Won" ? "default" : result === "Lost" ? "destructive" : "outline"}
                          className="w-full justify-center"
                        >
                          {result}
                        </Badge>
                        <Badge variant="secondary" className="w-full justify-center">
                          {getMatchTypeLabel(match.WhatKind)}
                        </Badge>
                      </div>

                      {/* Match details */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg">{match.Descr}</h3>
                          {match.DivisionDescr && (
                            <p className="text-sm text-muted-foreground">{match.DivisionDescr}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <Users className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-sm text-muted-foreground">Opponent</p>
                              <p className="font-medium">{opponentName}</p>
                            </div>
                          </div>

                          {match.Score && (
                            <div className="flex items-center gap-3">
                              <Trophy className="h-5 w-5 text-primary" />
                              <div>
                                <p className="text-sm text-muted-foreground">Score</p>
                                <p className="font-medium">{match.Score}</p>
                              </div>
                            </div>
                          )}

                          {match.ClubName && (
                            <div className="flex items-center gap-3">
                              <MapPin className="h-5 w-5 text-primary" />
                              <div>
                                <p className="text-sm text-muted-foreground">Venue</p>
                                <p className="font-medium">{match.ClubName}</p>
                              </div>
                            </div>
                          )}

                          {match.RoundDescr && (
                            <div className="flex items-center gap-3">
                              <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Round</p>
                                <p className="font-medium">{match.RoundDescr}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Date/time */}
                      <div className="flex flex-col items-end min-w-[120px]">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">{formatDate(match.MatchDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">{formatTime(match.MatchDate)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-foreground">No matches found</h3>
            <p className="text-muted-foreground mt-1">
              Your match history will appear here once you start playing
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {matches.length > pageSize && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, matches.length)} of{" "}
            {matches.length} matches
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
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}