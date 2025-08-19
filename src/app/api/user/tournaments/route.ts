import { type NextRequest, NextResponse } from "next/server"
import axios from "@/utils/axios"
import { config } from "@/utils/config"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  try {
    const sessionCookie = request.cookies.get("USSQ-API-SESSION")?.value

    if (!sessionCookie) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const response = await axios.get(`${config.API_URL}/resources/res/players/${userId}/tournament-scores`, {
      headers: {
        Cookie: `USSQ-API-SESSION=${sessionCookie}`,
      },
    })

    // Filter out all tournaments with "doubles" in name, title, or description
    const filteredTournaments = (response.data?.tournaments || []).filter((tournament: any) => {
      const nameCheck = !tournament.tournamentName?.toLowerCase().includes("double")
      const titleCheck = !tournament.title?.toLowerCase().includes("double")
      const eventCheck = !tournament.eventTypeDescr?.toLowerCase().includes("double")
      const sportCheck = tournament.sportId === 3 // Only squash singles

      return nameCheck && titleCheck && eventCheck && sportCheck
    })

    return NextResponse.json({
      tournaments: filteredTournaments,
      numWeeksOfHistory: response.data?.numWeeksOfHistory || null,
    })
  } catch (error) {
    console.error("Error fetching tournaments:", error)
    return NextResponse.json({ error: "Failed to fetch tournaments" }, { status: 500 })
  }
}
