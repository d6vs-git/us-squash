import axios from "@/utils/axios"
import { config } from "@/utils/config"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId")
    const highest = req.nextUrl.searchParams.get("highest")
    
    let url = `${config.API_URL}/resources/res/user/${userId}/rankings`
    if (highest) {
      url += `?highest=${highest}`
    }
    
    const response = await axios.get(url, {
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
