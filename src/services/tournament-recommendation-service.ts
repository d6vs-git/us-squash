import { getGeminiResponse } from "@/utils/gemini"
import { createTournamentRecommendationPrompt } from "@/utils/prompts/tournament-recommendations"

interface Tournament {
  TournamentID: number
  TournamentName: string
  StartDate: string
  EndDate: string
  Entry_Open?: string
  Entry_Close?: string
  Registration_Deadline?: string
  SiteCity?: string
  State?: string
  EventType?: string
  EventTypeCode?: number
  MaxRating?: number
  MinRating?: number
  AgeRestrictions?: string
  regularFee?: {
    price: number
  }
  RankingPoints?: number
  Unsanctioned?: number
  RegistrationOpen?: boolean
  ClubLockerUrl?: string
  Description?: string
  TournamentContact?: string
  ContactEmail?: string
  OrganizerOrganization?: number
  URL?: string
  AllowAdminEntries?: boolean
  Breaks_On?: string
  Resumes_On?: string
  Entry_Close_Time?: string
  EarlyBirdRegistrationDeadline?: string
  Membership_Usage?: string
  events?: string
  VenueId?: number
  RankingPeriod?: string
  NumPlayers?: number
  PlayersOnDraw?: number
  EntryForm?: string
  NumMatches?: number
  CreateDate?: string
  UpdateDate?: string
  SeasonID?: number
  LogoImageUrl?: string
  OrganizerLogoUrl?: string
  StartingTimesID?: number
  Pictures_URL?: string
  OrganizationLat?: string
  OrganizationLong?: string
  OrganizationDistance?: number
  VenueName?: string
  entrants?: any[]
  totalEntrants?: number
  averageRating?: number
  competitionLevel?: string
  winProbability?: number
  topPlayers?: string[]
  estimatedDivisionEntrants?: number
}

interface UserGoal {
  type: string
  description: string
  timeframe: string
  targetRating?: number
  targetRanking?: number
  specificTournaments?: string[]
}

interface RankingData {
  ranking: number
  firstName: string
  lastName: string
  averagedPoints: number
  totalPoints: number
  exposures: number
  playerId: number
  state?: string
  city?: string
  homeClub?: string
  rating?: number
}

interface UserRankingInfo {
  currentRanking: number
  currentTotalPoints: number
  currentExposures: number
  currentDivisor: number
  currentAveragedPoints: number
  divisionName: string
  divisionId: number
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
    rankingGap?: number
    divisionName: string
    strategicApproach?: string
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
    strategicNote?: string
  }
}

// US Squash Division Mapping
const DIVISION_MAP = [
  { divisionId: 1, divisionName: "All Women" },
  { divisionId: 2, divisionName: "All Men" },
  { divisionId: 3, divisionName: "BU11 Singles" },
  { divisionId: 4, divisionName: "BU13 Singles" },
  { divisionId: 5, divisionName: "BU15 Singles" },
  { divisionId: 6, divisionName: "BU17 Singles" },
  { divisionId: 7, divisionName: "BU19 Singles" },
  { divisionId: 10, divisionName: "GU11 Singles" },
  { divisionId: 11, divisionName: "GU13 Singles" },
  { divisionId: 12, divisionName: "GU15 Singles" },
  { divisionId: 13, divisionName: "GU17 Singles" },
  { divisionId: 14, divisionName: "GU19 Singles" },
  { divisionId: 18, divisionName: "Men 25+ Singles" },
  { divisionId: 21, divisionName: "Men 30+ Singles" },
  { divisionId: 22, divisionName: "Men 35+ Singles" },
  { divisionId: 25, divisionName: "Men 40+ Singles" },
  { divisionId: 26, divisionName: "Men 45+ Singles" },
  { divisionId: 29, divisionName: "Men 50+ Singles" },
  { divisionId: 30, divisionName: "Men 55+ Singles" },
  { divisionId: 33, divisionName: "Men 60+ Singles" },
  { divisionId: 34, divisionName: "Men 65+ Singles" },
  { divisionId: 35, divisionName: "Men 70+ Singles" },
  { divisionId: 36, divisionName: "Men 75+ Singles" },
  { divisionId: 37, divisionName: "Men 80+ Singles" },
  { divisionId: 42, divisionName: "Women 25+ Singles" },
  { divisionId: 45, divisionName: "Women 30+ Singles" },
  { divisionId: 46, divisionName: "Women 35+ Singles" },
  { divisionId: 49, divisionName: "Women 40+ Singles" },
  { divisionId: 50, divisionName: "Women 45+ Singles" },
  { divisionId: 53, divisionName: "Women 50+ Singles" },
  { divisionId: 178, divisionName: "Women 55+ Singles" },
  { divisionId: 179, divisionName: "Women 60+ Singles" },
  { divisionId: 180, divisionName: "Women 65+ Singles" },
  { divisionId: 181, divisionName: "Men 85+ Singles" },
  { divisionId: 239, divisionName: "Men 19+ Singles" },
  { divisionId: 329, divisionName: "Women 19+ Singles" },
  { divisionId: 330, divisionName: "Women 70+ Singles" },
  { divisionId: 331, divisionName: "Women 75+ Singles" },
  { divisionId: 332, divisionName: "Women 80+ Singles" },
]

export class TournamentRecommendationService {
  /**
   * Calculate the divisor for averaged points based on US Squash exposure rules
   */
  static calculateDivisor(exposures: number): number {
    if (exposures <= 4) {
      return 4
    }
    const excessExposures = exposures - 4
    const additionalDivisor = Math.floor(excessExposures / 2)
    return 4 + additionalDivisor
  }

  /**
   * Calculate averaged points using US Squash formula
   */
  static calculateAveragedPoints(totalPoints: number, exposures: number): number {
    const divisor = this.calculateDivisor(exposures)
    return Math.round(totalPoints / divisor)
  }

  /**
   * Estimate division-specific entrants based on tournament data and division
   */
  private static estimateDivisionEntrants(tournament: Tournament, divisionName: string): number {
    // If we have actual entrants data for the division, use it
    if (tournament.entrants && Array.isArray(tournament.entrants)) {
      return tournament.entrants.length
    }

    // Otherwise, estimate based on tournament type and total entrants
    const totalEntrants = tournament.NumPlayers || tournament.totalEntrants || 32

    // Estimation factors based on division popularity and tournament type
    const divisionFactors: { [key: string]: number } = {
      "All Men": 0.4,
      "All Women": 0.25,
      "Men 19+ Singles": 0.35,
      "Women 19+ Singles": 0.2,
      "Men 25+ Singles": 0.3,
      "Women 25+ Singles": 0.15,
      "Men 30+ Singles": 0.25,
      "Women 30+ Singles": 0.12,
      "Men 35+ Singles": 0.2,
      "Women 35+ Singles": 0.1,
      "Men 40+ Singles": 0.18,
      "Women 40+ Singles": 0.08,
      "Men 45+ Singles": 0.15,
      "Women 45+ Singles": 0.06,
      "Men 50+ Singles": 0.12,
      "Women 50+ Singles": 0.05,
      "Men 55+ Singles": 0.1,
      "Women 55+ Singles": 0.04,
      "BU19 Singles": 0.15,
      "GU19 Singles": 0.08,
      "BU17 Singles": 0.12,
      "GU17 Singles": 0.06,
      "BU15 Singles": 0.1,
      "GU15 Singles": 0.05,
      "BU13 Singles": 0.08,
      "GU13 Singles": 0.04,
      "BU11 Singles": 0.06,
      "GU11 Singles": 0.03,
    }

    // Adjust factor based on tournament type
    const eventType = tournament.EventType?.toLowerCase() || ""
    let typeFactor = 1.0
    if (eventType.includes("championship") || eventType.includes("jct")) {
      typeFactor = 1.5 // Championships attract more players
    } else if (eventType.includes("gold")) {
      typeFactor = 1.2
    } else if (eventType.includes("silver")) {
      typeFactor = 1.0
    } else if (eventType.includes("bronze")) {
      typeFactor = 0.8
    }

    const baseFactor = divisionFactors[divisionName] || 0.2 // Default 20% if division not found
    const adjustedFactor = baseFactor * typeFactor
    const estimatedEntrants = Math.round(totalEntrants * adjustedFactor)

    // Ensure minimum of 4 and maximum reasonable based on bracket sizes
    // Most junior divisions will have 8-16 players in Silver tournaments
    return Math.max(4, Math.min(estimatedEntrants, 24))
  }

  /**
   * Determine tournament type and priority based on event details
   */
  private static determineTournamentType(tournament: Tournament): { type: string; priority: number } {
    const name = tournament.TournamentName?.toLowerCase() || ""
    const eventType = tournament.EventType?.toLowerCase() || ""
    const description = tournament.Description?.toLowerCase() || ""

    // US Junior Open (highest priority)
    if (name.includes("us junior open") || name.includes("junior open")) {
      return { type: "USJuniorOpen", priority: 1 }
    }

    // JCT and Super JCT (highest priority)
    if (name.includes("jct") || eventType.includes("jct") || name.includes("championship")) {
      if (name.includes("super")) {
        return { type: "SuperJCT", priority: 1 }
      }
      return { type: "JCTandJuniorNationals", priority: 2 }
    }

    // Gold tournaments
    if (name.includes("gold") || eventType.includes("gold") || name.includes("national")) {
      return { type: "JuniorGold", priority: 3 }
    }

    // Silver tournaments
    if (name.includes("silver") || eventType.includes("silver")) {
      if (name.includes("national")) {
        return { type: "SilverNationals", priority: 4 }
      }
      return { type: "JuniorSilver", priority: 5 }
    }

    // Bronze tournaments
    if (name.includes("bronze") || eventType.includes("bronze")) {
      if (name.includes("national")) {
        return { type: "BronzeNationals", priority: 6 }
      }
      return { type: "JuniorBronze", priority: 7 }
    }

    // Default to Silver if unclear
    return { type: "JuniorSilver", priority: 5 }
  }

  /**
   * Fetch actual entrants for a tournament division
   */
  private static async fetchTournamentEntrants(
    tournamentId: number,
    divisionId: number,
    sessionCookie: string,
  ): Promise<number> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      const response = await fetch(`${baseUrl}/api/tournaments/${tournamentId}/entrants?divisionIds=${divisionId}`, {
        headers: {
          Cookie: `USSQ-API-SESSION=${sessionCookie}`,
        },
      })

      if (!response.ok) {
        console.log(`Failed to fetch entrants for tournament ${tournamentId}, division ${divisionId}`)
        return 0
      }

      const entrants = await response.json()
      return Array.isArray(entrants) ? entrants.length : 0
    } catch (error) {
      console.error(`Error fetching entrants for tournament ${tournamentId}:`, error)
      return 0
    }
  }

  /**
   * Enhance tournaments with actual entrant data and tournament type classification
   */
  private static async enhanceTournamentsWithData(
    tournaments: Tournament[],
    userDivision: { divisionId: number; divisionName: string },
    sessionCookie: string,
  ): Promise<Tournament[]> {
    console.log("=== ENHANCING TOURNAMENTS WITH ACTUAL DATA ===")

    const enhancedTournaments = await Promise.all(
      tournaments.map(async (tournament) => {
        // Determine tournament type and priority
        const { type, priority } = this.determineTournamentType(tournament)

        // Fetch actual entrants for the user's division
        const actualEntrants = await this.fetchTournamentEntrants(
          tournament.TournamentID,
          userDivision.divisionId,
          sessionCookie,
        )

        return {
          ...tournament,
          tournamentType: type,
          priority,
          actualDivisionEntrants: actualEntrants,
          estimatedDivisionEntrants:
            actualEntrants > 0 ? actualEntrants : this.estimateDivisionEntrants(tournament, userDivision.divisionName),
        }
      }),
    )

    // Sort by priority (lower number = higher priority) and then by start date
    const sortedTournaments = enhancedTournaments.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority
      }
      return new Date(a.StartDate).getTime() - new Date(b.StartDate).getTime()
    })

    console.log("=== TOURNAMENT ENHANCEMENT COMPLETE ===")
    console.log(`Enhanced ${sortedTournaments.length} tournaments`)

    // Log tournament type distribution
    const typeDistribution = sortedTournaments.reduce(
      (acc, t) => {
        acc[t.tournamentType || "Unknown"] = (acc[t.tournamentType || "Unknown"] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    console.log("Tournament type distribution:", typeDistribution)

    return sortedTournaments
  }

  /**
   * Determine user's division based on age and gender
   */
  private static getUserDivision(profile: any): { divisionId: number; divisionName: string } | null {
    if (!profile || !profile.birthDate || !profile.gender) {
      console.warn("User profile is missing birthDate or gender. Cannot determine division.")
      return null
    }

    try {
      const birthDate = new Date(profile.birthDate)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      const gender = profile.gender?.toUpperCase()

      // Junior divisions (18 and under)
      if (age <= 18) {
        const genderPrefix = gender === "M" ? "B" : "G"
        let ageGroup = ""

        if (age <= 10) ageGroup = "U11"
        else if (age <= 12) ageGroup = "U13"
        else if (age <= 14) ageGroup = "U15"
        else if (age <= 16) ageGroup = "U17"
        else if (age <= 18) ageGroup = "U19"

        const divisionName = `${genderPrefix}${ageGroup} Singles`
        const division = DIVISION_MAP.find((d) => d.divisionName === divisionName)
        if (division) {
          return division
        }
      }

      // Adult divisions - find the most appropriate age group
      const adultDivisions = DIVISION_MAP.filter((d) => {
        const name = d.divisionName.toLowerCase()
        return (gender === "M" && name.includes("men")) || (gender === "F" && name.includes("women"))
      })

      if (adultDivisions.length === 0) {
        // Fallback to general divisions
        const fallbackDivision =
          gender === "M"
            ? DIVISION_MAP.find((d) => d.divisionName === "All Men")
            : DIVISION_MAP.find((d) => d.divisionName === "All Women")
        return fallbackDivision || null
      }

      // Sort by age appropriateness
      const sortedDivisions = adultDivisions.sort((a, b) => {
        const ageA = Number.parseInt(a.divisionName.match(/\d+/)?.[0] || "0")
        const ageB = Number.parseInt(b.divisionName.match(/\d+/)?.[0] || "0")

        if (age >= ageA && age >= ageB) {
          return ageB - ageA // Prefer higher age group if eligible
        }
        return Math.abs(age - ageA) - Math.abs(age - ageB)
      })

      return sortedDivisions[0] || null
    } catch (error) {
      console.error("Error in getUserDivision:", error)
      return null
    }
  }

  /**
   * Fetch rankings data for a specific division and find user's actual ranking
   */
  private static async fetchUserRankingInfo(
    divisionId: number,
    userId: string,
    userName: string,
    sessionCookie: string,
  ): Promise<{ userRanking: RankingData | null; allRankings: RankingData[] }> {
    const allRankings: RankingData[] = []
    let userRanking: RankingData | null = null
    let page = 1
    const maxPages = 20

    console.log(`=== SEARCHING FOR USER IN RANKINGS ===`)
    console.log(`User Name: "${userName}"`)
    console.log(`User ID: "${userId}"`)
    console.log(`Division ID: ${divisionId}`)

    while (page <= maxPages && !userRanking) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        const response = await fetch(`${baseUrl}/api/rankings?divisions=${divisionId}&pageNumber=${page}`, {
          headers: {
            Cookie: `USSQ-API-SESSION=${sessionCookie}`,
          },
        })

        if (!response.ok) {
          console.log(`Rankings API returned ${response.status} for page ${page}`)
          break
        }

        const data = await response.json()

        // The API returns an array directly, not wrapped in a rankings property
        if (Array.isArray(data) && data.length > 0) {
          const pageRankings = data.map((r: any) => ({
            ranking: r.ranking,
            firstName: r.firstName,
            lastName: r.lastName,
            averagedPoints: r.averagedPoints,
            totalPoints: r.totalPoints,
            exposures: r.exposures,
            playerId: r.playerId,
            state: r.state,
            city: r.city,
            homeClub: r.homeClub,
            rating: r.rating,
          }))

          allRankings.push(...pageRankings)

          // Look for the user in this page
          const foundUser = pageRankings.find((r: RankingData) => {
            const fullName = `${r.firstName} ${r.lastName}`.toLowerCase()
            const nameMatch =
              fullName.includes(userName.toLowerCase()) ||
              userName.toLowerCase().includes(r.firstName.toLowerCase()) ||
              userName.toLowerCase().includes(r.lastName.toLowerCase())
            const idMatch = r.playerId === Number.parseInt(userId)

            return nameMatch || idMatch
          })

          if (foundUser) {
            userRanking = foundUser
            console.log(`FOUND USER:`, foundUser)
            break
          }

          // If page has fewer than expected items, we might be at the end
          if (data.length < 50) {
            console.log(`Page ${page} has only ${data.length} items, might be last page`)
          }
        } else {
          console.log(`Page ${page} returned no data or invalid format`)
          break
        }

        page++
      } catch (error) {
        console.error(`Failed to fetch rankings page ${page}:`, error)
        break
      }
    }

    console.log(`=== RANKING SEARCH COMPLETE ===`)
    console.log(`User found: ${!!userRanking}`)
    console.log(`Total rankings fetched: ${allRankings.length}`)

    return { userRanking, allRankings: allRankings.sort((a, b) => a.ranking - b.ranking) }
  }

  /**
   * Get user's actual ranking information from US Squash rankings
   */
  private static async getUserRankingInfo(userData: any, sessionCookie: string): Promise<UserRankingInfo | null> {
    const userProfile = userData.profile
    if (!userProfile || !userProfile.name) {
      console.error("User profile or name not found")
      return null
    }

    // Determine user's division
    const userDivision = this.getUserDivision(userProfile)
    if (!userDivision) {
      console.error("Could not determine user division")
      return null
    }

    console.log(`Determined user division: ${userDivision.divisionName} (ID: ${userDivision.divisionId})`)

    // Fetch rankings data and find user
    const { userRanking, allRankings } = await this.fetchUserRankingInfo(
      userDivision.divisionId,
      userData.profile.id || userData.profile.userId || "",
      userProfile.name,
      sessionCookie,
    )

    if (!userRanking) {
      console.warn(`User not found in division ${userDivision.divisionName} rankings`)
      // Return default values if user not found in rankings
      return {
        currentRanking: 999, // Unranked
        currentTotalPoints: 0,
        currentExposures: 4,
        currentDivisor: 4,
        currentAveragedPoints: 0,
        divisionName: userDivision.divisionName,
        divisionId: userDivision.divisionId,
      }
    }

    return {
      currentRanking: userRanking.ranking,
      currentTotalPoints: userRanking.totalPoints,
      currentExposures: userRanking.exposures,
      currentDivisor: this.calculateDivisor(userRanking.exposures),
      currentAveragedPoints: userRanking.averagedPoints,
      divisionName: userDivision.divisionName,
      divisionId: userDivision.divisionId,
    }
  }

  /**
   * Fetch complete rankings data for target analysis
   */
  private static async fetchCompleteRankingsData(
    divisionId: number,
    targetRanking: number,
    sessionCookie: string,
  ): Promise<RankingData[]> {
    const rankings: RankingData[] = []
    const maxPage = Math.ceil(targetRanking / 50) + 2 // Get a bit more than target

    console.log(`Fetching rankings data up to rank ${targetRanking} (${maxPage} pages)`)

    for (let page = 1; page <= maxPage; page++) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        const response = await fetch(`${baseUrl}/api/rankings?divisions=${divisionId}&pageNumber=${page}`, {
          headers: {
            Cookie: `USSQ-API-SESSION=${sessionCookie}`,
          },
        })

        if (!response.ok) {
          console.log(`Rankings API returned ${response.status} for page ${page}`)
          continue
        }

        const data = await response.json()
        if (Array.isArray(data) && data.length > 0) {
          rankings.push(
            ...data.map((r: any) => ({
              ranking: r.ranking,
              firstName: r.firstName,
              lastName: r.lastName,
              averagedPoints: r.averagedPoints,
              totalPoints: r.totalPoints,
              exposures: r.exposures,
              playerId: r.playerId,
              state: r.state,
              city: r.city,
              homeClub: r.homeClub,
              rating: r.rating,
            })),
          )

          // If page has fewer items than expected, we might be at the end
          if (data.length < 50) {
            break
          }
        } else {
          break
        }
      } catch (error) {
        console.error(`Failed to fetch rankings page ${page}:`, error)
      }
    }

    const sortedRankings = rankings.sort((a, b) => a.ranking - b.ranking)
    console.log(`Fetched ${sortedRankings.length} total rankings`)

    // Log the target player info
    const targetPlayer = sortedRankings.find((r) => r.ranking === targetRanking)
    if (targetPlayer) {
      console.log(
        `Target player at rank ${targetRanking}: ${targetPlayer.firstName} ${targetPlayer.lastName} with ${targetPlayer.averagedPoints} averaged points`,
      )
    } else {
      console.log(`No player found at exact rank ${targetRanking}`)
    }

    return sortedRankings
  }

  /**
   * Parse AI response and clean it from markdown or extra text
   */
  private static parseAIResponse(aiResponse: any): any {
    console.log("=== PARSING AI RESPONSE ===")
    console.log("Response type:", typeof aiResponse)

    // If already an object, return it
    if (typeof aiResponse === "object" && aiResponse !== null) {
      console.log("Response is already an object")
      return aiResponse
    }

    if (typeof aiResponse !== "string") {
      throw new Error(`Expected string or object, got ${typeof aiResponse}`)
    }

    let cleanedResponse = aiResponse.trim()
    console.log("Original response preview:", cleanedResponse.substring(0, 200) + "...")

    // Strategy 1: Remove common markdown patterns
    const markdownPatterns = [/^```json\s*/, /^```\s*/, /\s*```$/, /^`+/, /`+$/]

    for (const pattern of markdownPatterns) {
      cleanedResponse = cleanedResponse.replace(pattern, "")
    }

    // Strategy 2: Find JSON boundaries
    const jsonStart = cleanedResponse.indexOf("{")
    const jsonEnd = cleanedResponse.lastIndexOf("}")

    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
      console.error("No valid JSON boundaries found")
      console.log("Cleaned response:", cleanedResponse)
      throw new Error("No valid JSON object found in response")
    }

    cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd + 1)
    console.log("Extracted JSON preview:", cleanedResponse.substring(0, 200) + "...")

    // Strategy 3: Try parsing with multiple approaches
    const parseAttempts = [
      // Direct parse
      () => JSON.parse(cleanedResponse),

      // Fix common JSON issues
      () => {
        const fixed = cleanedResponse
          .replace(/,\s*}/g, "}") // Remove trailing commas
          .replace(/,\s*]/g, "]") // Remove trailing commas in arrays
          .replace(/\n/g, " ") // Replace newlines with spaces
          .replace(/\r/g, "") // Remove carriage returns
          .replace(/\t/g, " ") // Replace tabs with spaces
          .replace(/\s+/g, " ") // Collapse multiple spaces
        return JSON.parse(fixed)
      },

      // Try to fix quotes
      () => {
        const fixed = cleanedResponse
          .replace(/'/g, '"') // Replace single quotes with double quotes
          .replace(/([{,]\s*)(\w+):/g, '$1"$2":') // Add quotes to unquoted keys
        return JSON.parse(fixed)
      },
    ]

    for (let i = 0; i < parseAttempts.length; i++) {
      try {
        console.log(`Parse attempt ${i + 1}...`)
        const result = parseAttempts[i]()
        console.log("Successfully parsed on attempt", i + 1)

        // Validate tournament sequence
        if (result.tournamentSequence && Array.isArray(result.tournamentSequence)) {
          // Ensure exactly 4 tournaments
          if (result.tournamentSequence.length > 4) {
            console.log(`Trimming tournament sequence from ${result.tournamentSequence.length} to 4`)
            result.tournamentSequence = result.tournamentSequence.slice(0, 4)
            result.summary.totalTournaments = 4
          }

          // Remove duplicates by TournamentID
          const seen = new Set()
          const uniqueTournaments = []
          for (const tournament of result.tournamentSequence) {
            const id = tournament.tournament?.TournamentID
            if (id && !seen.has(id)) {
              seen.add(id)
              uniqueTournaments.push(tournament)
            }
          }

          if (uniqueTournaments.length !== result.tournamentSequence.length) {
            console.log(`Removed ${result.tournamentSequence.length - uniqueTournaments.length} duplicate tournaments`)
            result.tournamentSequence = uniqueTournaments
            result.summary.totalTournaments = uniqueTournaments.length
          }
        }

        return result
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.log(`Parse attempt ${i + 1} failed:`, errorMessage)
        if (i === parseAttempts.length - 1) {
          console.error("All parse attempts failed")
          console.log("Final cleaned response:", cleanedResponse)
          throw new Error(`Failed to parse AI response after ${parseAttempts.length} attempts: ${errorMessage}`)
        }
      }
    }
  }

  /**
   * Validate that the recommendations actually reach the target ranking
   */
  private static validateRecommendations(
    recommendations: TournamentRecommendation,
    targetRanking: number,
    targetAveragedPoints: number,
  ): void {
    const finalAveragedPoints = recommendations.summary.finalProjectedAveragedPoints
    const projectedRanking = recommendations.summary.projectedFinalRanking

    console.log("=== VALIDATING RECOMMENDATIONS ===")
    console.log(`Target ranking: ${targetRanking}`)
    console.log(`Target averaged points: ${targetAveragedPoints}`)
    console.log(`Projected final averaged points: ${finalAveragedPoints}`)
    console.log(`Projected final ranking: ${projectedRanking}`)

    // Validate exactly 4 tournaments
    if (recommendations.tournamentSequence.length !== 4) {
      console.warn(`WARNING: Expected exactly 4 tournaments, got ${recommendations.tournamentSequence.length}`)
    }

    // Validate no duplicate tournaments
    const tournamentIds = recommendations.tournamentSequence.map((t) => t.tournament.TournamentID)
    const uniqueIds = new Set(tournamentIds)
    if (uniqueIds.size !== tournamentIds.length) {
      console.warn(`WARNING: Duplicate tournaments detected. IDs: ${tournamentIds.join(", ")}`)
    }

    // Check if the recommendations actually reach the goal
    if (finalAveragedPoints < targetAveragedPoints * 0.95) {
      // Allow 5% tolerance
      console.warn(
        `WARNING: Final averaged points (${finalAveragedPoints}) may not reach target (${targetAveragedPoints})`,
      )
    }

    // Fix ranking projection logic
    if (finalAveragedPoints >= targetAveragedPoints) {
      if (projectedRanking > targetRanking) {
        console.warn(`WARNING: Ranking projection inconsistent - averaged points reached but ranking not improved`)
      }
    } else {
      if (projectedRanking <= targetRanking) {
        console.warn(`WARNING: Ranking projection too optimistic - averaged points not reached`)
      }
    }

    console.log("=== VALIDATION COMPLETE ===")
  }
  /**
   * Extract basic constraint information for filtering
   */
  private static parseBasicConstraints(
    userGoal?: UserGoal,
    additionalNotes?: string,
  ): {
    maxDistance?: number
    budgetLimit?: number
    userNotes: string
  } {
    const constraints = {
      maxDistance: undefined as number | undefined,
      budgetLimit: undefined as number | undefined,
      userNotes: `${userGoal?.description || ""} ${additionalNotes || ""}`.trim(),
    }

    const combinedText = constraints.userNotes.toLowerCase()

    // Only parse objective constraints that need pre-filtering
    const distanceMatch = combinedText.match(/within (\d+) miles?|max (\d+) miles?|under (\d+) miles?/)
    if (distanceMatch) {
      constraints.maxDistance = Number.parseInt(distanceMatch[1] || distanceMatch[2] || distanceMatch[3])
    }

    const budgetMatch = combinedText.match(/budget \$?(\d+)|under \$?(\d+)|max \$?(\d+)|limit \$?(\d+)/)
    if (budgetMatch) {
      constraints.budgetLimit = Number.parseInt(budgetMatch[1] || budgetMatch[2] || budgetMatch[3] || budgetMatch[4])
    }

    if (combinedText.includes("no travel") || combinedText.includes("local only")) {
      constraints.maxDistance = 50
    }

    return constraints
  }

  /**
   * Filter tournaments based only on objective constraints (distance, budget)
   */
  private static filterTournamentsByObjectiveConstraints(
    tournaments: Tournament[],
    constraints: {
      maxDistance?: number
      budgetLimit?: number
      userNotes: string
    },
  ): Tournament[] {
    return tournaments.filter((tournament) => {
      // Only filter objective constraints that can't be handled by AI
      if (
        constraints.maxDistance &&
        tournament.OrganizationDistance &&
        tournament.OrganizationDistance > constraints.maxDistance
      ) {
        console.log(
          `Excluding tournament ${tournament.TournamentName} due to distance: ${tournament.OrganizationDistance} > ${constraints.maxDistance}`,
        )
        return false
      }

      if (
        constraints.budgetLimit &&
        tournament.regularFee?.price &&
        tournament.regularFee.price > constraints.budgetLimit
      ) {
        console.log(
          `Excluding tournament ${tournament.TournamentName} due to budget: $${tournament.regularFee.price} > $${constraints.budgetLimit}`,
        )
        return false
      }

      return true
    })
  }
  /**
   * Main method to generate tournament recommendations
   */
  static async generateRecommendations(
    userData: any,
    tournaments: Tournament[],
    sessionCookie: string,
    userGoal?: UserGoal,
    additionalNotes?: string,
  ): Promise<TournamentRecommendation> {
    try {
      console.log("=== STARTING TOURNAMENT RECOMMENDATION ANALYSIS ===")
      // Parse only basic objective constraints

      const basicConstraints = this.parseBasicConstraints(userGoal, additionalNotes)
      // Get user's actual ranking information from US Squash rankings
      const userRankingInfo = await this.getUserRankingInfo(userData, sessionCookie)
      console.log("User ranking info:", userRankingInfo)

      // Determine user's division
      const userDivision = this.getUserDivision(userData.profile)
      console.log("Determined user division:", userDivision)

      // Fetch rankings data if we have a division and target ranking
      let rankingsData: RankingData[] = []
      if (userDivision && userGoal?.targetRanking) {
        try {
          rankingsData = await this.fetchCompleteRankingsData(
            userDivision.divisionId,
            userGoal.targetRanking,
            sessionCookie,
          )
          console.log(`Fetched ${rankingsData.length} rankings for division ${userDivision.divisionName}`)
        } catch (error) {
          console.error("Failed to fetch rankings data:", error)
        }
      }

      // Filter tournaments to only upcoming and eligible ones
      const upcomingTournaments = this.filterUpcomingTournaments(tournaments).filter((t) => {
        const name = t.TournamentName?.toLowerCase() || ""
        const desc = t.Description?.toLowerCase() || ""
        return !name.includes("rollback") && !desc.includes("rollback")
      })
      console.log("Upcoming tournaments:", upcomingTournaments.length)

      // Enhance tournaments with actual entrant data and tournament type classification
      if (!userDivision) {
        throw new Error("Could not determine user division. Please ensure your profile has birth date and gender information.")
      }
      
      const enhancedTournaments = await this.enhanceTournamentsWithData(
        upcomingTournaments,
        userDivision,
        sessionCookie,
      )

      // Prioritize higher-level tournaments for the AI
      // Apply only objective constraints (distance, budget)

      const constrainedTournaments = this.filterTournamentsByObjectiveConstraints(enhancedTournaments, basicConstraints)

      // Create strategic analysis with enhanced tournament data
      const strategicAnalysis = {
        tournaments: constrainedTournaments.slice(0, 100),
        totalTournaments: upcomingTournaments.length,
        eligibleTournaments: upcomingTournaments.filter((t) => this.isEligible(t, userData)).length,
        constrainedTournaments: constrainedTournaments.length,
        userConstraints: basicConstraints.userNotes, // Just pass the raw notes
        averageCompetitionLevel: "medium",
        tournamentTypeDistribution: constrainedTournaments.reduce(
          (acc, t) => {
            const tournamentType = (t as any).tournamentType || "Unknown"
            acc[tournamentType] = (acc[tournamentType] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        ),
      }

      // Create enhanced user data with actual ranking info
      const enhancedUserData = {
        ...userData,
        currentRankingInfo: userRankingInfo,
      }

      // Generate AI recommendations
      console.log("=== GENERATING AI RECOMMENDATIONS ===")
      const prompt = createTournamentRecommendationPrompt(enhancedUserData, strategicAnalysis, userGoal, rankingsData)

      const aiRecommendations = await getGeminiResponse(prompt)
      console.log("=== AI RESPONSE RECEIVED ===")

      // Parse AI response with bulletproof parsing
      const parsedRecommendations = this.parseAIResponse(aiRecommendations)
      console.log("=== AI RESPONSE PARSED SUCCESSFULLY ===")

      // Validate the structure
      if (!parsedRecommendations || typeof parsedRecommendations !== "object") {
        throw new Error("Parsed response is not an object")
      }

      if (!parsedRecommendations.currentAnalysis) {
        throw new Error("Missing currentAnalysis in response")
      }

      if (!parsedRecommendations.tournamentSequence || !Array.isArray(parsedRecommendations.tournamentSequence)) {
        throw new Error("Missing or invalid tournamentSequence in response")
      }

      if (!parsedRecommendations.summary) {
        throw new Error("Missing summary in response")
      }

      // Override with actual user data if we have it
      if (userRankingInfo) {
        console.log("Overriding AI analysis with actual user ranking data")
        parsedRecommendations.currentAnalysis = {
          ...parsedRecommendations.currentAnalysis,
          currentRanking: userRankingInfo.currentRanking,
          currentTotalPoints: userRankingInfo.currentTotalPoints,
          currentExposures: userRankingInfo.currentExposures,
          currentAveragedPoints: userRankingInfo.currentAveragedPoints,
          divisionName: userRankingInfo.divisionName,
        }
      }

      // Validate that recommendations actually reach the target
      if (userGoal?.targetRanking) {
        const targetPlayer = rankingsData.find((r) => r.ranking === userGoal.targetRanking)
        if (targetPlayer) {
          this.validateRecommendations(parsedRecommendations, userGoal.targetRanking, targetPlayer.averagedPoints)
        }
      }

      console.log("=== TOURNAMENT RECOMMENDATIONS GENERATED SUCCESSFULLY ===")
      return parsedRecommendations as TournamentRecommendation
    } catch (error) {
      console.error("=== TOURNAMENT RECOMMENDATION GENERATION FAILED ===")
      console.error("Error:", error)
      throw error
    }
  }

  // Helper methods
  private static filterUpcomingTournaments(tournaments: Tournament[]): Tournament[] {
    const now = new Date()
    const sixMonthsFromNow = new Date()
    sixMonthsFromNow.setMonth(now.getMonth() + 6)

    return tournaments.filter((tournament) => {
      const startDate = this.parseDate(tournament.StartDate)
      const registrationDeadline = this.parseDate(
        tournament.Registration_Deadline || tournament.Entry_Close || tournament.StartDate,
      )
      return startDate > now && startDate <= sixMonthsFromNow && registrationDeadline > now
    })
  }

  private static parseDate(dateString: string): Date {
    if (!dateString) return new Date()
    if (dateString.includes("-") && dateString.split("-")[0].length === 2) {
      const [month, day, year] = dateString.split("-")
      return new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
    }
    return new Date(dateString)
  }

  private static isEligible(tournament: any, userData: any): boolean {
    const userRating = userData.ratings?.find((r: any) => r.ratingTypeName?.includes("Singles"))?.rating || 0
    if (tournament.MaxRating && userRating > tournament.MaxRating) return false
    if (tournament.MinRating && userRating < tournament.MinRating) return false
    return true
  }
}
