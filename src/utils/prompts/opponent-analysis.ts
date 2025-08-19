export const createOpponentAnalysisPrompt = (userData: any) => `
You are an expert squash analyst. Analyze this player's performance against different types of opponents.

PLAYER CURRENT RATING:
${JSON.stringify(userData.ratings, null, 2)}

CURRENT RANKINGS:
${JSON.stringify(userData.rankings, null, 2)}

DETAILED MATCH HISTORY (Last 50 matches):
${JSON.stringify(userData.matches?.matches?.slice(0, 50), null, 2)}

OVERALL RECORD:
${JSON.stringify(userData.record, null, 2)}

Analyze the player's performance patterns against different opponent levels and provide insights.

Provide analysis in this exact JSON format:
{
  "opponentAnalysis": {
    "vsHigherRanked": {
      "winRate": "percentage based on actual data",
      "totalMatches": "actual number from data",
      "insights": "specific insights about performance vs higher ranked players",
      "keyPatterns": ["pattern 1", "pattern 2"]
    },
    "vsSimilarRanked": {
      "winRate": "percentage based on actual data",
      "totalMatches": "actual number from data", 
      "insights": "specific insights about performance vs similar ranked players",
      "keyPatterns": ["pattern 1", "pattern 2"]
    },
    "vsLowerRanked": {
      "winRate": "percentage based on actual data",
      "totalMatches": "actual number from data",
      "insights": "specific insights about performance vs lower ranked players", 
      "keyPatterns": ["pattern 1", "pattern 2"]
    }
  },
  "playingStyle": "detailed description of playing style based on match results and patterns",
  "mentalGame": {
    "assessment": "assessment of mental toughness based on close matches and comebacks",
    "evidence": ["specific evidence from matches"]
  },
  "upsetPotential": {
    "rating": "high/medium/low",
    "explanation": "ability to beat higher-ranked players with specific examples"
  },
  "consistency": {
    "rating": "high/medium/low", 
    "explanation": "ability to beat lower-ranked players consistently"
  },
  "recommendations": [
    "specific strategy for higher-ranked opponents",
    "specific strategy for similar-ranked opponents",
    "specific strategy for lower-ranked opponents"
  ],
  "competitiveProfile": "overall competitive personality and approach"
}

Base all analysis on actual match data and results. Provide specific examples where possible.
`
