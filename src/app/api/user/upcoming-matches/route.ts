import { type NextRequest, NextResponse } from "next/server"
import axios from "@/utils/axios"
import { config } from "@/utils/config"

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId")

    try {
      const response = await axios.get(`${config.API_URL}/resources/res/user/${userId}/upcoming_matches/0`, {
        headers: {
          Cookie: `USSQ-API-SESSION=${req.cookies.get("USSQ-API-SESSION")?.value}`,
        },
      })
      return NextResponse.json(response.data)
    } catch (error) {
      // Return empty array if endpoint returns 404 or any other error
  console.error(`Upcoming matches endpoint returned error for user ${userId}, returning empty array`)
      return NextResponse.json([])
    }
  } catch (error) {
    console.error("Upcoming matches API error:", error)
    return NextResponse.json([])
  }
}
