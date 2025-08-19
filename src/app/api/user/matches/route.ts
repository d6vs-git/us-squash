import axios from "@/utils/axios"
import { config } from "@/utils/config"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId")
    const pageSize = req.nextUrl.searchParams.get("pageSize") || "10"
    const sportId = req.nextUrl.searchParams.get("sportId")
    const page = req.nextUrl.searchParams.get("page") || "1"

    let url = `${config.API_URL}/resources/res/user/${userId}/matches_profile/page/${page}?pageSize=${pageSize}`
    if (sportId) {
      url += `&sportId=${sportId}`
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
