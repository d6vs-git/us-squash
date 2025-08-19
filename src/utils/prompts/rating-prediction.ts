export const createRatingPredictionPrompt = (userData: any) => `
You are an expert squash statistician and performance analyst. Predict future SINGLES rating progression for this player using data analysis.

COMPREHENSIVE SINGLES RATINGS HISTORY:
${JSON.stringify(
  userData["ratings-history"]?.filter(
    (r: any) => r.RatingGroup?.includes("Singles") || r.RatingGroup?.includes("Universal"),
  ),
  null,
  2,
)}

CURRENT SINGLES PERFORMANCE METRICS:
Current Singles Ratings: ${JSON.stringify(
  userData.ratings?.filter(
    (r: any) => r.ratingTypeName?.includes("Singles") || r.ratingTypeName?.includes("Universal"),
  ),
  null,
  2,
)}
Singles Match Record: ${JSON.stringify(
  userData.record?.filter((r: any) => r.type === "S"),
  null,
  2,
)}
Current Rankings: ${JSON.stringify(userData.rankings, null, 2)}

RECENT SINGLES MATCH PERFORMANCE (Last 30 matches):
${JSON.stringify(userData.matches?.matches?.filter((m: any) => m.Sportid === 3)?.slice(0, 30), null, 2)}

COMPETITIVE ACTIVITY:
Tournament Results: ${JSON.stringify(userData.tournaments?.tournaments?.slice(0, 15), null, 2)}
Active Competitions: 
- Ladders: ${JSON.stringify(userData.ladders?.slice(0, 3), null, 2)}
- Leagues: ${JSON.stringify(userData.leagues?.slice(0, 3), null, 2)}

PLAYER CONTEXT:
Age Category: ${userData.profile?.category}
Experience Level: Based on match history and affiliations

Use statistical analysis and performance trends to make realistic SINGLES rating predictions.

Provide predictions in this exact JSON format:
{
  "currentTrajectory": {
    "trend": "upward/downward/stable",
    "analysis": "detailed analysis of current singles rating trend with specific data points",
    "momentum": "strong/moderate/weak",
    "evidence": ["specific evidence from recent singles performance"]
  },
  "predictions": {
    "3months": {
      "singlesRating": "predicted singles rating with decimal precision",
      "confidence": "high/medium/low",
      "reasoning": "specific reasoning for this singles prediction"
    },
    "6months": {
      "singlesRating": "predicted singles rating with decimal precision",
      "confidence": "high/medium/low", 
      "reasoning": "specific reasoning for this singles prediction"
    },
    "12months": {
      "singlesRating": "predicted singles rating with decimal precision",
      "confidence": "high/medium/low",
      "reasoning": "specific reasoning for this singles prediction"
    }
  },
  "factors": {
    "positive": ["factor that will help singles rating improvement"],
    "negative": ["factor that may hinder singles rating improvement"],
    "neutral": ["factor with unclear impact on singles rating"]
  },
  "scenarios": {
    "optimistic": {
      "description": "best case scenario with specific singles rating targets",
      "requirements": ["what needs to happen for this singles scenario"]
    },
    "realistic": {
      "description": "most likely scenario with specific singles rating targets", 
      "requirements": ["what needs to happen for this singles scenario"]
    },
    "pessimistic": {
      "description": "worst case scenario with specific singles rating targets",
      "risks": ["what could cause this singles scenario"]
    }
  },
  "recommendations": [
    "specific action to achieve positive singles trajectory 1",
    "specific action to achieve positive singles trajectory 2",
    "specific action to achieve positive singles trajectory 3"
  ],
  "keyMilestones": [
    "singles milestone to watch for in 3 months",
    "singles milestone to watch for in 6 months", 
    "singles milestone to watch for in 12 months"
  ]
}

Base all predictions on statistical analysis of SINGLES data only. Do not mention doubles. Be realistic and specific about singles performance.
`
