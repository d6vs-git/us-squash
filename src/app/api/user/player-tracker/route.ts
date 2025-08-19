import axios from "@/utils/axios"
import { config } from "@/utils/config"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId")
    const response = await axios.get(`${config.API_URL}/resources/res/player_tracker/list?userId=${userId}`, {
      headers: {
        Cookie: `USSQ-API-SESSION=${req.cookies.get("USSQ-API-SESSION")?.value}`,
      },
    })

    return NextResponse.json(response.data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
} 