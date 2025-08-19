export const createImprovementPlanPrompt = (userData: any) => `
You are an expert squash coach and performance analyst. Create a personalized improvement plan for this player.

COMPLETE PLAYER DATA ANALYSIS:

PROFILE:
${JSON.stringify(userData.profile, null, 2)}

CURRENT PERFORMANCE:
Ratings: ${JSON.stringify(userData.ratings, null, 2)}
Rankings: ${JSON.stringify(userData.rankings, null, 2)}
Record: ${JSON.stringify(userData.record, null, 2)}

MATCH ANALYSIS:
Recent Matches: ${JSON.stringify(userData.matches?.matches?.slice(0, 30), null, 2)}

HISTORICAL PROGRESSION:
Ratings History: ${JSON.stringify(userData["ratings-history"]?.slice(0, 15), null, 2)}

COMPETITIVE ACTIVITY:
Tournaments: ${JSON.stringify(userData.tournaments?.tournaments?.slice(0, 10), null, 2)}
Ladders: ${JSON.stringify(userData.ladders?.slice(0, 5), null, 2)}
Leagues: ${JSON.stringify(userData.leagues?.slice(0, 5), null, 2)}

Create a comprehensive improvement plan in this exact JSON format:
{
  "currentLevel": {
    "assessment": "detailed assessment of player's current level",
    "strengths": ["current strength 1", "current strength 2"],
    "limitations": ["current limitation 1", "current limitation 2"]
  },
  "improvementPotential": {
    "rating": "high/medium/low",
    "explanation": "realistic assessment of improvement potential with reasoning",
    "timeframe": "realistic timeline for significant improvement"
  },
  "goals": {
    "shortTerm": {
      "3months": [
        "specific measurable goal 1",
        "specific measurable goal 2"
      ],
      "metrics": ["how to measure progress"]
    },
    "longTerm": {
      "12months": [
        "specific measurable goal 1", 
        "specific measurable goal 2"
      ],
      "metrics": ["how to measure progress"]
    }
  },
  "focusAreas": {
    "technical": [
      "specific technical skill 1",
      "specific technical skill 2"
    ],
    "tactical": [
      "specific tactical improvement 1",
      "specific tactical improvement 2"
    ],
    "physical": [
      "specific fitness area 1",
      "specific conditioning need 2"
    ],
    "mental": [
      "specific mental game aspect 1",
      "specific psychological skill 2"
    ]
  },
  "practiceStructure": {
    "frequency": "recommended practice frequency",
    "duration": "recommended session length",
    "structure": "how to structure practice sessions",
    "priorities": ["practice priority 1", "practice priority 2"]
  },
  "competitionSchedule": {
    "matches": "recommended match frequency",
    "tournaments": "recommended tournament schedule",
    "progression": "how to gradually increase competition level"
  },
  "progressMetrics": [
    "specific metric to track 1",
    "specific metric to track 2",
    "specific metric to track 3"
  ],
  "timeline": {
    "month1": "focus for first month",
    "months2-3": "focus for months 2-3",
    "months4-6": "focus for months 4-6",
    "months7-12": "focus for months 7-12"
  },
  "resources": [
    "recommended resource 1",
    "recommended resource 2"
  ]
}

Base all recommendations on actual performance data and be specific about measurable outcomes.
`
