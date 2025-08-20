import { type NextRequest, NextResponse } from "next/server"
import { TournamentRecommendationService } from "@/services/tournament-recommendation-service"
import { DataService } from "@/services/data-service"

export async function POST(req: NextRequest) {
  try {
    const { userId, tournaments, userGoal } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 })
    }

    if (!userGoal || !userGoal.targetRanking) {
      return NextResponse.json({ error: "Missing userGoal or targetRanking" }, { status: 400 })
    }





    // Get session cookie for API calls
    const sessionCookie = req.cookies.get("USSQ-API-SESSION")?.value
    if (!sessionCookie) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Fetch comprehensive user data

    const userData = await DataService.fetchUserData(userId, sessionCookie)

    if (!userData || !userData.profile) {
      return NextResponse.json({ error: "Failed to fetch user data" }, { status: 400 })
    }



    // Fetch upcoming tournaments if none provided
    let tournamentsToUse = tournaments || []
    if (!tournamentsToUse || tournamentsToUse.length === 0) {

      try {
        // Fetch upcoming tournaments from your API
        const tournamentsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tournaments`, {
          headers: {
            'Cookie': `USSQ-API-SESSION=${sessionCookie}`
          }
        })
        
        if (tournamentsResponse.ok) {
          const tournamentsData = await tournamentsResponse.json()
          tournamentsToUse = tournamentsData.tournaments || []

        } else {
          console.warn("Failed to fetch upcoming tournaments, proceeding with empty list")
        }
      } catch (fetchError) {
        console.warn("Error fetching tournaments:", fetchError)
        // Continue with empty array - the service should handle this gracefully
      }
    }

    // Generate recommendations - service handles all data fetching internally

    const recommendations = await TournamentRecommendationService.generateRecommendations(
      userData,
      tournamentsToUse,
      sessionCookie,
      userGoal,
    )

    // Validate the response structure
    if (!recommendations) {
      throw new Error("No recommendations generated")
    }

    if (!recommendations.currentAnalysis) {
      throw new Error("Missing currentAnalysis in response. The AI service may have returned an error instead of recommendations.")
    }

    if (!recommendations.tournamentSequence || !Array.isArray(recommendations.tournamentSequence)) {
      throw new Error("Missing or invalid tournamentSequence in response")
    }

    if (!recommendations.summary) {
      throw new Error("Missing summary in response")
    }

    return NextResponse.json({
      success: true,
      recommendations,
      userGoal,
      userId,
      timestamp: new Date().toISOString(),
      hasCurrentAnalysis: !!recommendations.currentAnalysis,
      tournamentSequenceCount: recommendations.tournamentSequence?.length || 0,
      hasSummary: !!recommendations.summary,
    })
  } catch (error) {
    console.error("Tournament recommendation generation failed:", error)

    const errorDetails = {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : "UnknownError",
    }

    // Provide more specific error messages based on the error type
    let userFriendlyMessage = "Failed to generate tournament recommendations"
    
    if (errorDetails.message.includes("currentAnalysis")) {
      userFriendlyMessage = "The recommendation system couldn't generate a valid plan. This might be due to insufficient tournament data or ranking information."
    } else if (errorDetails.message.includes("tournament data")) {
      userFriendlyMessage = "No suitable tournaments found for your goal. Please try adjusting your timeframe or target ranking."
    } else if (errorDetails.message.includes("Authentication")) {
      userFriendlyMessage = "Authentication expired. Please refresh the page and try again."
    }

    return NextResponse.json(
      {
        error: userFriendlyMessage,
        details: errorDetails.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}