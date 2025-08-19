"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import Loading from "@/components/ui/loading"
import { AIAnalysis } from "@/components/dashboard/ai-analysis/ai-analysis"

export default function AIAnalysisPage() {
  const [userId, setUserId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUserId()
  }, [])

  const fetchUserId = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/user")

      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.status}`)
      }

      const userData = await response.json()

      if (!userData || !userData.id) {
        throw new Error("Invalid user data received")
      }

      setUserId(userData.id)
    } catch (error) {
      console.error("Error fetching user ID:", error)
      setError(error instanceof Error ? error.message : "Failed to load user data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Please log in to view AI analysis.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AIAnalysis userId={userId} />
    </div>
  )
}