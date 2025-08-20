export class EnhancedDataService {
  /**
   * Fetch detailed opponent profiles from recent matches
   */
  static async fetchOpponentProfiles(matches: any[], sessionCookie: string) {
    if (!matches || matches.length === 0) {
      return []
    }

    // Filter to only singles matches
  const singlesMatches = matches.filter((match) => match.Sportid === 3)

    // Extract unique opponent IDs from singles matches only
    const opponentIds = new Set<number>()
    const userIdCandidates = new Map<number, number>()

    // Analyze all singles matches to identify the current user ID
    singlesMatches.forEach((match) => {
      // Count occurrences of each player ID to identify the current user
      if (match.wid1) userIdCandidates.set(match.wid1, (userIdCandidates.get(match.wid1) || 0) + 1)
      if (match.wid2) userIdCandidates.set(match.wid2, (userIdCandidates.get(match.wid2) || 0) + 1)
      if (match.oid1) userIdCandidates.set(match.oid1, (userIdCandidates.get(match.oid1) || 0) + 1)
      if (match.oid2) userIdCandidates.set(match.oid2, (userIdCandidates.get(match.oid2) || 0) + 1)
    })

    // The user ID that appears most frequently is the current user
  const currentUserId = Array.from(userIdCandidates.entries()).reduce((a, b) => (a[1] > b[1] ? a : b))[0]

    // Now collect all opponent IDs from singles matches
    singlesMatches.forEach((match) => {
      const allIds = [match.wid1, match.wid2, match.oid1, match.oid2].filter((id) => id && id !== currentUserId)
      allIds.forEach((id) => {
        if (id) opponentIds.add(id)
      })
    })


    // Rest of the function remains the same...
    if (opponentIds.size === 0) {
      return []
    }

    // Continue with existing logic but note we're only processing singles opponents
  const limitedOpponentIds = Array.from(opponentIds).slice(0, 15)

    const opponentData = await Promise.allSettled(
      limitedOpponentIds.map(async (opponentId) => {
        try {

          const [profileRes, ratingsRes, matchesRes, rankingsRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/user?userId=${opponentId}`, {
              headers: { Cookie: `USSQ-API-SESSION=${sessionCookie}` },
            }),
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/user/ratings?userId=${opponentId}`, {
              headers: { Cookie: `USSQ-API-SESSION=${sessionCookie}` },
            }),
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/user/matches?userId=${opponentId}&pageSize=10`, {
              headers: { Cookie: `USSQ-API-SESSION=${sessionCookie}` },
            }),
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/user/rankings?userId=${opponentId}`, {
              headers: { Cookie: `USSQ-API-SESSION=${sessionCookie}` },
            }),
          ])

          const [profile, ratings, matches, rankings] = await Promise.all([
            profileRes.ok ? profileRes.json() : null,
            ratingsRes.ok ? ratingsRes.json() : null,
            matchesRes.ok ? matchesRes.json() : null,
            rankingsRes.ok ? rankingsRes.json() : null,
          ])


          return {
            id: opponentId,
            profile,
            ratings,
            matches,
            rankings,
            fetchedAt: new Date().toISOString(),
          }
        } catch (error) {
          console.error(`❌ Failed to fetch data for opponent ${opponentId}:`, error)
          return {
            id: opponentId,
            profile: null,
            ratings: null,
            matches: null,
            rankings: null,
            error: error instanceof Error ? error.message : "Unknown error",
          }
        }
      }),
    )

    // Filter successful results
    const successfulResults = opponentData
      .filter((result): result is PromiseFulfilledResult<any> => result.status === "fulfilled")
      .map((result) => result.value)
      .filter((data) => data.profile !== null)


    // Log opponent names for verification
  // ...existing code...

    return successfulResults
  }

  /**
   * Fetch comprehensive data for a single player (profile, ratings, matches, rankings).
   * This is useful for specific player lookups, e.g., for comparison.
   */
  static async fetchPlayerComprehensiveData(playerId: number, sessionCookie: string) {
    try {

      const [profileRes, ratingsRes, matchesRes, rankingsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/user?userId=${playerId}`, {
          headers: { Cookie: `USSQ-API-SESSION=${sessionCookie}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/user/ratings?userId=${playerId}`, {
          headers: { Cookie: `USSQ-API-SESSION=${sessionCookie}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/user/matches?userId=${playerId}&pageSize=50`, {
          // Fetch more matches for comparison analysis
          headers: { Cookie: `USSQ-API-SESSION=${sessionCookie}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/user/rankings?userId=${playerId}`, {
          headers: { Cookie: `USSQ-API-SESSION=${sessionCookie}` },
        }),
      ])

      const [profile, ratings, matches, rankings] = await Promise.all([
        profileRes.ok ? profileRes.json() : null,
        ratingsRes.ok ? ratingsRes.json() : null,
        matchesRes.ok ? matchesRes.json() : null,
        rankingsRes.ok ? rankingsRes.json() : null,
      ])

      if (!profile) {
        throw new Error(`Profile not found for player ${playerId}`)
      }


      return {
        id: playerId,
        profile,
        ratings,
        matches,
        rankings,
        fetchedAt: new Date().toISOString(),
      }
    } catch (error) {
      console.error(`❌ Failed to fetch comprehensive data for player ${playerId}:`, error)
      throw error // Re-throw to be caught by the API route
    }
  }

  /**
   * Fetch head-to-head records between user and specific opponents
   */
  static async fetchHeadToHeadRecords(userId: string, matches: any[]) {
    const headToHeadData: Record<string, any[]> = {}

    if (!userId || !matches?.length) {
      return headToHeadData
    }

    // Filter to only singles matches
  const singlesMatches = matches.filter((match) => match.Sportid === 3)

    const userIdNum = Number.parseInt(userId)

    singlesMatches.forEach((match) => {
      let opponentId: number | null = null
      let opponentName = ""
      let userWon = false

      // Determine opponent and result based on match structure (singles only)
      if (match.wid1 === userIdNum || match.wid2 === userIdNum) {
        // User is in winner position
        opponentId = match.oid1 || match.oid2
        opponentName = match.vplayer1 // Only singles, no doubles concatenation
        userWon = match.Winner === "H"
      } else if (match.oid1 === userIdNum || match.oid2 === userIdNum) {
        // User is in opponent position
        opponentId = match.wid1 || match.wid2
        opponentName = match.hplayer1 // Only singles, no doubles concatenation
        userWon = match.Winner === "V"
      }

      if (opponentId && opponentName) {
        const key = `${opponentId}_${opponentName.replace(/\s+/g, "_")}`
        if (!headToHeadData[key]) {
          headToHeadData[key] = []
        }
        headToHeadData[key].push({
          ...match,
          opponentId,
          opponentName,
          userWon,
        })
      }
    })


    // Log head-to-head summary
  // ...existing code...

    return headToHeadData
  }

  /**
   * Analyze match patterns and contexts
   */
  static analyzeMatchContexts(matches: any[]) {

    const contexts = {
      tournamentLevels: new Map<string, number>(),
      surfaces: new Map<string, number>(),
      timeOfDay: new Map<string, number>(),
      matchTypes: new Map<string, number>(),
      venues: new Map<string, number>(),
      recentForm: matches.slice(0, 10),
      seasonalPatterns: new Map<string, number>(),
    }

    matches.forEach((match) => {
      // Tournament levels
      if (match.WhatKind === "T") {
        const level = this.categorizeTournamentLevel(match.Descr)
        contexts.tournamentLevels.set(level, (contexts.tournamentLevels.get(level) || 0) + 1)
      }

      // Match types
      const type = match.WhatKind === "T" ? "Tournament" : match.WhatKind === "L" ? "League" : "Other"
      contexts.matchTypes.set(type, (contexts.matchTypes.get(type) || 0) + 1)

      // Venues
      if (match.ClubName) {
        contexts.venues.set(match.ClubName, (contexts.venues.get(match.ClubName) || 0) + 1)
      }

      // Time patterns
      if (match.MatchDate) {
        const matchDate = new Date(match.MatchDate)
        const hour = matchDate.getHours()
        const timeSlot = hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening"
        contexts.timeOfDay.set(timeSlot, (contexts.timeOfDay.get(timeSlot) || 0) + 1)

        // Seasonal patterns
        const month = matchDate.getMonth()
        const season = month < 3 || month === 11 ? "Winter" : month < 6 ? "Spring" : month < 9 ? "Summer" : "Fall"
        contexts.seasonalPatterns.set(season, (contexts.seasonalPatterns.get(season) || 0) + 1)
      }
    })

    const result = {
      tournamentLevels: Object.fromEntries(contexts.tournamentLevels),
      surfaces: Object.fromEntries(contexts.surfaces),
      timeOfDay: Object.fromEntries(contexts.timeOfDay),
      matchTypes: Object.fromEntries(contexts.matchTypes),
      venues: Object.fromEntries(contexts.venues),
      recentForm: contexts.recentForm,
      seasonalPatterns: Object.fromEntries(contexts.seasonalPatterns),
    }


    return result
  }

  /**
   * Categorize tournament level based on description
   */
  private static categorizeTournamentLevel(description: string): string {
    if (!description) return "Unknown"

    const desc = description.toLowerCase()

    if (desc.includes("u.s. championship") || desc.includes("national")) return "National Championship"
    if (desc.includes("junior championship") || desc.includes("jct")) return "Junior Championship"
    if (desc.includes("junior gold")) return "Junior Gold"
    if (desc.includes("junior silver")) return "Junior Silver"
    if (desc.includes("junior bronze")) return "Junior Bronze"
    if (desc.includes("open")) return "Open Tournament"
    if (desc.includes("regional")) return "Regional"
    if (desc.includes("state")) return "State"
    if (desc.includes("local") || desc.includes("club")) return "Local/Club"

    return "Other Tournament"
  }

  /**
   * Calculate performance metrics against different opponent types
   */
  static calculateOpponentTypePerformance(matches: any[], opponentProfiles: any[], userId: string) {

    // Filter to only singles matches
    const singlesMatches = matches.filter((match) => match.Sportid === 3)
    const userIdNum = Number.parseInt(userId)

    const performance = {
      byRatingRange: new Map<string, { wins: number; losses: number; matches: any[] }>(),
      byAge: new Map<string, { wins: number; losses: number; matches: any[] }>(),
      byPlayingStyle: new Map<string, { wins: number; losses: number; matches: any[] }>(),
      byRankingLevel: new Map<string, { wins: number; losses: number; matches: any[] }>(),
    }

    singlesMatches.forEach((match) => {
      const userWon =
        ((match.wid1 === userIdNum || match.wid2 === userIdNum) && match.Winner === "H") ||
        ((match.oid1 === userIdNum || match.oid2 === userIdNum) && match.Winner === "V")

      // Find opponent profile
      const opponentId =
        match.wid1 === userIdNum || match.wid2 === userIdNum ? match.oid1 || match.oid2 : match.wid1 || match.wid2

      const opponentProfile = opponentProfiles.find((p) => p.id === opponentId)

      if (opponentProfile?.ratings) {
        // Rating range analysis - only for singles (sportId === 3)
        const opponentRating =
          opponentProfile.ratings.find(
            (r: any) => r.ratingTypeName?.includes("Singles") || r.ratingTypeName?.includes("Universal"),
          )?.rating || 0

        const ratingRange = this.getRatingRange(opponentRating)

        if (!performance.byRatingRange.has(ratingRange)) {
          performance.byRatingRange.set(ratingRange, { wins: 0, losses: 0, matches: [] })
        }
        const rangeStats = performance.byRatingRange.get(ratingRange)!
        if (userWon) rangeStats.wins++
        else rangeStats.losses++
        rangeStats.matches.push(match)

        // Age analysis
        if (opponentProfile.profile?.birthDate) {
          const age = this.calculateAge(opponentProfile.profile.birthDate)
          const ageRange = this.getAgeRange(age)

          if (!performance.byAge.has(ageRange)) {
            performance.byAge.set(ageRange, { wins: 0, losses: 0, matches: [] })
          }
          const ageStats = performance.byAge.get(ageRange)!
          if (userWon) ageStats.wins++
          else ageStats.losses++
          ageStats.matches.push(match)
        }
      }
    })

    const result = {
      byRatingRange: Object.fromEntries(performance.byRatingRange),
      byAge: Object.fromEntries(performance.byAge),
      byPlayingStyle: Object.fromEntries(performance.byPlayingStyle),
      byRankingLevel: Object.fromEntries(performance.byRankingLevel),
    }


    return result
  }

  private static getRatingRange(rating: number): string {
    if (rating >= 7.0) return "7.0+"
    if (rating >= 6.5) return "6.5-6.9"
    if (rating >= 6.0) return "6.0-6.4"
    if (rating >= 5.5) return "5.5-5.9"
    if (rating >= 5.0) return "5.0-5.4"
    if (rating >= 4.5) return "4.5-4.9"
    if (rating >= 4.0) return "4.0-4.4"
    return "Under 4.0"
  }

  private static calculateAge(birthDate: string): number {
    const birth = new Date(birthDate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  private static getAgeRange(age: number): string {
    if (age < 13) return "U13"
    if (age < 15) return "U15"
    if (age < 17) return "U17"
    if (age < 19) return "U19"
    if (age < 25) return "19-24"
    if (age < 35) return "25-34"
    if (age < 45) return "35-44"
    if (age < 55) return "45-54"
    return "55+"
  }
}
