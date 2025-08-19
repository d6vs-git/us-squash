import { type NextRequest, NextResponse } from "next/server"
import { AnalysisService } from "@/services/analysis-service"
import { DataService } from "@/services/data-service"

export async function POST(req: NextRequest) {
  try {
    const { userId, analysisType } = await req.json()

    if (!userId || !analysisType) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    console.log(`Starting ${analysisType} analysis for user ${userId}`)

    // Get session cookie for API calls
    const sessionCookie = req.cookies.get("USSQ-API-SESSION")?.value

    if (!sessionCookie) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Fetch comprehensive user data
    const userData = await DataService.fetchUserData(userId, sessionCookie)

    if (!userData) {
      return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
    }

    console.log(`Fetched user data for ${analysisType} analysis`)

    let analysis
    switch (analysisType) {
      case "performance":
        analysis = await AnalysisService.generatePerformanceAnalysis(userData)
        break
      case "opponent":
        // Pass session cookie for enhanced opponent analysis
        analysis = await AnalysisService.generateOpponentAnalysis(userData, sessionCookie)
        break
      case "tournament":
        analysis = await AnalysisService.generateTournamentStrategy(userData)
        break
      case "improvement":
        analysis = await AnalysisService.generateImprovementPlan(userData)
        break
      case "prediction":
        analysis = await AnalysisService.generateRatingPrediction(userData)
        break
      default:
        return NextResponse.json({ error: "Invalid analysis type" }, { status: 400 })
    }

    console.log(`Completed ${analysisType} analysis`)

    return NextResponse.json({
      success: true,
      analysis,
      analysisType,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Analysis API error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate analysis",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
