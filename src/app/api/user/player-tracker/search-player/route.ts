import axios from "@/utils/axios"
import { config } from "@/utils/config"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get("query")
    if (!query) {
      return NextResponse.json({ error: "Missing query parameter" }, { status: 400 })
    }
    const cookieValue = req.cookies.get("USSQ-API-SESSION")?.value
    const response = await axios.get(
      `${config.API_URL}/resources/res/players/search?query=${encodeURIComponent(query)}&isAdmin=N&restrictToAffiliatedOrganizations=0`,
      {
        headers: {
          Cookie: `USSQ-API-SESSION=${cookieValue}`,
        },
      }
    )
    return NextResponse.json(response.data)
  } catch (error) {
    // Log the error response from US Squash API if available
    console.error((error as any).response?.data || error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
