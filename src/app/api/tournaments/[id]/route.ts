import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: tournamentId } = await params

    const apiUrl = `https://api.ussquash.com/resources/tournaments/${tournamentId}`

    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch tournament details: ${response.statusText}`)
    }

    const tournamentDetails = await response.json()

    return NextResponse.json(tournamentDetails)
  } catch (error) {
    console.error("Error fetching tournament details:", error)
    return NextResponse.json({ error: "Failed to fetch tournament details" }, { status: 500 })
  }
}
