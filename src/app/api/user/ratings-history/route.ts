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

    const response = await axios.get(`${config.API_URL}/resources/res/user/${userId}/ratings_history`, {
      headers: {
        Cookie: `USSQ-API-SESSION=${sessionCookie}`,
      },
    })

    // Filter out all doubles-related ratings
    const filteredData = (response.data || []).filter(
      (rating: any) =>
        !rating.RatingGroup?.toLowerCase().includes("double") &&
        (rating.RatingGroup?.includes("Singles") || rating.RatingGroup?.includes("Universal")),
    )

    return NextResponse.json(filteredData)
  } catch (error) {
    console.error("Error fetching ratings history:", error)
    return NextResponse.json({ error: "Failed to fetch ratings history" }, { status: 500 })
  }
}
