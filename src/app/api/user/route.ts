import axios from "@/utils/axios"
import { config } from "@/utils/config"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId")
    
    // If userId is provided, get specific user details, otherwise get current user
    const endpoint = userId 
      ? `${config.API_URL}/resources/res/user/${userId}`
      : `${config.API_URL}/resources/res/user`
    
    const response = await axios.get(endpoint, {
        headers: {
          Cookie: `USSQ-API-SESSION=${req.cookies.get("USSQ-API-SESSION")?.value}`,
        },
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error(error)
    
    // Return 401 if authentication failed
    if (error?.response?.status === 401) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
} 