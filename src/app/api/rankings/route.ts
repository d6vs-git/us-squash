import axios from "@/utils/axios"
import { config } from "@/utils/config"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const pageNumber = searchParams.get("pageNumber")
    const divisionId = searchParams.get("divisions")

    // If divisionId and pageNumber are provided, get public rankings from US Squash API
    if (divisionId && pageNumber) {
      const url = `${config.API_URL}/resources/rankings/1/current?divisions=${divisionId}&pageNumber=${pageNumber}`
      const res = await fetch(url, { next: { revalidate: 3600 } })
      if (!res.ok) {
        return NextResponse.json({ error: "Failed to fetch rankings" }, { status: res.status })
      }
      const data = await res.json()
      return NextResponse.json(data)
    }

    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
  } catch (error) {
    console.error("Rankings API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
