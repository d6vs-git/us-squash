import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { searchParams } = new URL(req.url)
    const divisionIds = searchParams.get("divisionIds") // e.g. "3,4,5"
    const { id: tournamentId } = await params

    if (!tournamentId) {
      return NextResponse.json({ error: "Missing tournamentId" }, { status: 400 })
    }

    // If no divisionIds provided, try to get all entrants
    let apiUrl = `https://api.ussquash.com/resources/tournaments/${tournamentId}/entrants`
    if (divisionIds) {
      apiUrl += `?divisionIds=${encodeURIComponent(divisionIds)}`
    }

    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch entrants: ${response.statusText}`)
    }

    const entrants = await response.json()
    return NextResponse.json(entrants)
  } catch (error) {
    console.error("Error fetching entrants:", error)
    return NextResponse.json({ error: "Failed to fetch entrants" }, { status: 500 })
  }
}
