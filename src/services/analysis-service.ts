import { getGeminiResponse } from "@/utils/gemini"
import { EnhancedDataService } from "./enhanced-data-service"
import { DataService } from "./data-service" // Import DataService
import {
  createPerformanceAnalysisPrompt,
  createOpponentAnalysisPrompt,
  createTournamentStrategyPrompt,
  createImprovementPlanPrompt,
  createRatingPredictionPrompt,
  createCustomAnalysisPrompt,
  createOverallAnalysisPrompt,
  createEnhancedOpponentAnalysisPrompt,
  createPlayerComparisonPrompt, // New import
} from "@/utils/prompts"

export class AnalysisService {
  static async generatePerformanceAnalysis(userData: any) {
    const prompt = createPerformanceAnalysisPrompt(userData)
    return await getGeminiResponse(prompt)
  }

  static async generateOpponentAnalysis(userData: any, sessionCookie?: string) {
    console.log("=== STARTING OPPONENT ANALYSIS ===")
    console.log("Session cookie available:", !!sessionCookie)
    console.log("User matches available:", !!userData.matches?.matches?.length)
    console.log("Total matches:", userData.matches?.matches?.length || 0)

    // Always try to fetch enhanced opponent data if we have matches
    if (userData.matches?.matches?.length > 0) {
      try {
        console.log("Attempting to fetch enhanced opponent data...")

        // Get user ID from profile
        const userId = userData.profile?.id?.toString() || userData.profile?.PlayerId?.toString()
        console.log("User ID identified:", userId)

        if (!userId) {
          console.error("Could not identify user ID from profile data")
          throw new Error("User ID not found")
        }

        // Fetch opponent profiles with session cookie
        const opponentProfiles = await EnhancedDataService.fetchOpponentProfiles(
          userData.matches.matches,
          sessionCookie || "",
        )
        console.log("✅ Opponent profiles fetched:", opponentProfiles.length)

        // Fetch head-to-head records
        const headToHeadRecords = await EnhancedDataService.fetchHeadToHeadRecords(userId, userData.matches.matches)
        console.log("✅ Head-to-head records processed:", Object.keys(headToHeadRecords).length)

        // Analyze match contexts
        const matchContexts = EnhancedDataService.analyzeMatchContexts(userData.matches.matches)
        console.log("✅ Match contexts analyzed")

        // Calculate performance against different opponent types
        const opponentTypePerformance = EnhancedDataService.calculateOpponentTypePerformance(
          userData.matches.matches,
          opponentProfiles,
          userId,
        )
        console.log("✅ Opponent type performance calculated")

        // Create enhanced data object
        const enhancedData = {
          ...userData,
          opponentProfiles,
          headToHeadRecords,
          matchContexts,
          opponentTypePerformance,
        }

        console.log("=== ENHANCED DATA SUMMARY ===")
        console.log("- Opponent profiles:", opponentProfiles.length)
        console.log("- Head-to-head opponents:", Object.keys(headToHeadRecords).length)
        console.log("- Tournament levels:", Object.keys(matchContexts.tournamentLevels || {}).length)
        console.log("- Rating ranges analyzed:", Object.keys(opponentTypePerformance.byRatingRange || {}).length)

        // Generate enhanced analysis
        console.log("Generating enhanced opponent analysis...")
        const prompt = createEnhancedOpponentAnalysisPrompt(enhancedData)
        const result = await getGeminiResponse(prompt)

        console.log("✅ Enhanced opponent analysis completed successfully")
        return result
      } catch (error) {
        console.error("❌ Enhanced opponent analysis failed:", error)
        console.log("Falling back to basic opponent analysis...")

        // Fall back to basic analysis
        const prompt = createOpponentAnalysisPrompt(userData)
        return await getGeminiResponse(prompt)
      }
    } else {
      console.log("No matches available, using basic opponent analysis")
      const prompt = createOpponentAnalysisPrompt(userData)
      return await getGeminiResponse(prompt)
    }
  }

  static async generateTournamentStrategy(userData: any) {
    const prompt = createTournamentStrategyPrompt(userData)
    return await getGeminiResponse(prompt)
  }

  static async generateImprovementPlan(userData: any) {
    const prompt = createImprovementPlanPrompt(userData)
    return await getGeminiResponse(prompt)
  }

  static async generateRatingPrediction(userData: any) {
    const prompt = createRatingPredictionPrompt(userData)
    return await getGeminiResponse(prompt)
  }

  static async generateCustomAnalysis(userData: any, customPrompt: string) {
    const prompt = createCustomAnalysisPrompt(userData, customPrompt)
    return await getGeminiResponse(prompt)
  }

  static async generateOverallAnalysis(userData: any) {
    const prompt = createOverallAnalysisPrompt(userData)
    return await getGeminiResponse(prompt)
  }

  // New method for player comparison analysis
  static async generatePlayerComparisonAnalysis(
    currentUserId: string,
    comparisonPlayerId: number,
    sessionCookie: string,
  ) {
    console.log(`=== STARTING PLAYER COMPARISON ANALYSIS for user ${currentUserId} vs player ${comparisonPlayerId} ===`)

    if (!sessionCookie) {
      throw new Error("Authentication required for player comparison")
    }

    try {
      // 1. Fetch current user's comprehensive data
      const currentUserData = await DataService.fetchUserData(currentUserId, sessionCookie)
      if (!currentUserData) {
        throw new Error("Failed to fetch current user data for comparison")
      }
      console.log("✅ Current user data fetched for comparison")

      // 2. Fetch comparison player's comprehensive data
      const comparisonPlayerData = await EnhancedDataService.fetchPlayerComprehensiveData(
        comparisonPlayerId,
        sessionCookie,
      )
      if (!comparisonPlayerData) {
        throw new Error("Failed to fetch comparison player data")
      }
      console.log("✅ Comparison player data fetched")

      // 3. Find head-to-head matches between current user and comparison player
      const allUserMatches = currentUserData.matches?.matches || []
      const headToHeadRecords = await EnhancedDataService.fetchHeadToHeadRecords(currentUserId, allUserMatches)

      const comparisonPlayerNameKey = `${comparisonPlayerId}_${
        comparisonPlayerData.profile?.name?.replace(/\s+/g, "_") || ""
      }`
      const headToHeadMatches = headToHeadRecords[comparisonPlayerNameKey] || []
      console.log(`✅ Found ${headToHeadMatches.length} head-to-head matches`)

      // 4. Generate analysis using the new prompt
      const prompt = createPlayerComparisonPrompt(currentUserData, comparisonPlayerData, headToHeadMatches)
      const result = await getGeminiResponse(prompt)

      console.log("✅ Player comparison analysis completed successfully")
      console.log("Full analysis object:", result)

      return result
    } catch (error) {
      console.error("❌ Player comparison analysis failed:", error)
      throw error // Re-throw to be caught by the API route
    }
  }
}
