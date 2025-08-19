export const createTournamentStrategyPrompt = (userData: any) => `
You are an expert squash tournament strategist. Create a comprehensive tournament strategy for this player.

PLAYER PROFILE:
${JSON.stringify(userData.profile, null, 2)}

TOURNAMENT HISTORY:
${JSON.stringify(userData.tournaments, null, 2)}

CURRENT RATINGS & RANKINGS:
Ratings: ${JSON.stringify(userData.ratings, null, 2)}
Rankings: ${JSON.stringify(userData.rankings, null, 2)}

RECENT PERFORMANCE (Last 20 matches):
${JSON.stringify(userData.matches?.matches?.slice(0, 20), null, 2)}

CURRENT RECORD:
${JSON.stringify(userData.record, null, 2)}

AFFILIATIONS & CLUBS:
${JSON.stringify(userData.affiliations?.slice(0, 5), null, 2)}

Provide a comprehensive tournament strategy in this exact JSON format:
{
  "tournamentReadiness": {
    "currentLevel": "assessment of readiness level 1-10",
    "explanation": "detailed explanation of current tournament readiness"
  },
  "optimalTournamentLevel": {
    "recommended": "specific tournament levels to target",
    "reasoning": "why these levels are optimal"
  },
  "entryStrategy": {
    "timing": "when to enter tournaments",
    "frequency": "how often to compete",
    "selection": "how to choose which tournaments"
  },
  "preparationPlan": [
    "specific preparation step 1",
    "specific preparation step 2",
    "specific preparation step 3"
  ],
  "expectedResults": {
    "realistic": "realistic tournament expectations",
    "optimistic": "best case scenarios",
    "timeline": "expected improvement timeline"
  },
  "pointsStrategy": {
    "approach": "how to maximize ranking points",
    "priorities": ["priority 1", "priority 2"]
  },
  "riskAssessment": {
    "risks": ["potential risk 1", "potential risk 2"],
    "rewards": ["potential reward 1", "potential reward 2"],
    "mitigation": ["how to minimize risks"]
  },
  "timeline": {
    "shortTerm": "next 3 months tournament plan",
    "mediumTerm": "3-6 months tournament plan", 
    "longTerm": "6-12 months tournament plan"
  },
  "focusAreas": [
    "specific area to focus on before next tournament",
    "specific skill to develop",
    "specific tactical improvement"
  ]
}

Base recommendations on actual tournament history and current performance level.
`
