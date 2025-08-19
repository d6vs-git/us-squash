export const createOverallAnalysisPrompt = (userData: any) => `
You are an expert squash analyst. Provide a comprehensive overall analysis of this player.

COMPLETE PLAYER DATA:
${JSON.stringify(userData, null, 2)}

Provide a comprehensive analysis in this exact JSON format:
{
  "playerSummary": "comprehensive overall assessment of the player including key characteristics",
  "currentStatus": {
    "competitiveLevel": "current competitive status and level",
    "trajectory": "where the player is heading",
    "position": "standing in squash community"
  },
  "keyInsights": [
    "most important insight about this player 1",
    "most important insight about this player 2", 
    "most important insight about this player 3"
  ],
  "opportunities": [
    "biggest opportunity for improvement 1",
    "biggest opportunity for improvement 2",
    "biggest opportunity for improvement 3"
  ],
  "challenges": [
    "main challenge facing the player 1",
    "main challenge facing the player 2"
  ],
  "nextSteps": [
    "immediate next step 1",
    "immediate next step 2",
    "immediate next step 3"
  ],
  "longTermOutlook": {
    "potential": "assessment of long-term potential",
    "timeline": "realistic timeline for achieving potential",
    "requirements": ["what's needed to reach potential"]
  },
  "competitiveProfile": "detailed description of player's competitive personality and approach"
}

Base all analysis on the actual data provided. Be specific and actionable.
`
