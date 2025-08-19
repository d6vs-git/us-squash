import axios from "@/utils/axios"
import { config } from "@/utils/config"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const { playerId } = body

    if (!playerId) {
      return NextResponse.json({ error: "Missing playerId in request body" }, { status: 400 })
    }

    const response = await axios.delete(`${config.API_URL}/resources/res/player_tracker/${playerId}`, {
      headers: {
        "Content-Type": "application/json",
        Cookie: `USSQ-API-SESSION=${req.cookies.get("USSQ-API-SESSION")?.value}`,
      },
    })

    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Error removing player from tracker:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
