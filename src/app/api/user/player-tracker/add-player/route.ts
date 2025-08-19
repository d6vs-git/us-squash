import axios from "@/utils/axios"
import { config } from "@/utils/config"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { playerId } = body
    if (!playerId) {
      return NextResponse.json({ error: "Missing playerId in request body" }, { status: 400 })
    }
    const response = await axios.post(
      `${config.API_URL}/resources/res/player_tracker/add`,
      { playerId },
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: `USSQ-API-SESSION=${req.cookies.get("USSQ-API-SESSION")?.value}`,
        },
      }
    )
    return NextResponse.json(response.data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
