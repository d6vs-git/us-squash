import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const topRecords = searchParams.get("topRecords") || "500"
    const ngbId = searchParams.get("ngbId") || "10000"
    const organizerType = searchParams.get("organizerType") || "1"
    const sanctioned = searchParams.get("sanctioned") || "1"
    const status = searchParams.get("status") || "1"
    const state = searchParams.get("state") || "0"

    const apiUrl = `https://api.ussquash.com/resources/tournaments?TopRecords=${topRecords}&ngbId=${ngbId}&OrganizerType=${organizerType}&Sanctioned=${sanctioned}&Status=${status}&State=${state}`

    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch tournaments: ${response.statusText}`)
    }

    const tournaments = await response.json()

    return NextResponse.json(tournaments)
  } catch (error) {
    console.error("Error fetching tournaments:", error)
    return NextResponse.json({ error: "Failed to fetch tournaments" }, { status: 500 })
  }
}
