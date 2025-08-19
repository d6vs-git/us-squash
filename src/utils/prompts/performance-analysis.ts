export const createPerformanceAnalysisPrompt = (userData: any) => `
You are an expert squash analyst. Analyze this player's SINGLES performance data and provide detailed insights.

PLAYER PROFILE:
Name: ${userData.profile?.name || "Unknown"}
Category: ${userData.profile?.category || "Unknown"}
Location: ${userData.profile?.city}, ${userData.profile?.state}
Gender: ${userData.profile?.gender}

CURRENT SINGLES RATINGS:
${JSON.stringify(
  userData.ratings?.filter(
    (r: any) => r.ratingTypeName?.includes("Singles") || r.ratingTypeName?.includes("Universal"),
  ),
  null,
  2,
)}

SINGLES MATCH RECORD:
${JSON.stringify(
  userData.record?.filter((r: any) => r.type === "S"),
  null,
  2,
)}

RECENT SINGLES MATCHES (Last 20):
${JSON.stringify(userData.matches?.matches?.filter((m: any) => m.Sportid === 3)?.slice(0, 20), null, 2)}

SINGLES RATINGS HISTORY (Last 10):
${JSON.stringify(
  userData["ratings-history"]
    ?.filter((r: any) => r.RatingGroup?.includes("Singles") || r.RatingGroup?.includes("Universal"))
    ?.slice(0, 10),
  null,
  2,
)}

CURRENT RANKINGS:
${JSON.stringify(userData.rankings, null, 2)}

TOURNAMENT HISTORY:
${JSON.stringify(userData.tournaments?.tournaments?.slice(0, 10), null, 2)}

Provide a comprehensive SINGLES performance analysis in this exact JSON format:
{
  "overallPerformance": {
    "rating": "1-10",
    "explanation": "detailed explanation of overall singles performance"
  },
  "strengths": [
    "specific singles strength 1",
    "specific singles strength 2",
    "specific singles strength 3"
  ],
  "weaknesses": [
    "specific singles weakness 1", 
    "specific singles weakness 2",
    "specific singles weakness 3"
  ],
  "trendAnalysis": "detailed analysis of recent singles performance trends over time",
  "ratingProgression": "analysis of how singles ratings have changed and why",
  "competitiveLevel": "assessment of current singles competitive level and standing",
  "recommendations": [
    "specific actionable singles recommendation 1",
    "specific actionable singles recommendation 2", 
    "specific actionable singles recommendation 3"
  ],
  "keyMetrics": {
    "winRate": "calculated percentage from singles matches only",
    "ratingTrend": "up/down/stable with explanation for singles",
    "averageOpponentLevel": "description of typical singles opponent strength"
  },
  "nextSteps": [
    "immediate singles action 1",
    "immediate singles action 2"
  ]
}

Focus ONLY on singles squash performance. Do not mention doubles at all. Base all insights on singles match data only.
`
