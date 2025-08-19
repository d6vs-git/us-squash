import { type NextRequest, NextResponse } from "next/server"
import { AnalysisService } from "@/services/analysis-service"

export async function POST(req: NextRequest) {
  try {
    const { userId, comparisonPlayerId } = await req.json()

    if (!userId || !comparisonPlayerId) {
      return NextResponse.json({ error: "Missing required parameters: userId and comparisonPlayerId" }, { status: 400 })
    }

    console.log(`Starting player comparison analysis for user ${userId} against player ${comparisonPlayerId}`)

    // Get session cookie for API calls
    const sessionCookie = req.cookies.get("USSQ-API-SESSION")?.value

    if (!sessionCookie) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const analysis = await AnalysisService.generatePlayerComparisonAnalysis(userId, comparisonPlayerId, sessionCookie)

    console.log(`Completed player comparison analysis for user ${userId} against player ${comparisonPlayerId}`)

    return NextResponse.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Player Comparison API error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate player comparison analysis",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
