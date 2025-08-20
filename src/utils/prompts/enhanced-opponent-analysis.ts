export const createEnhancedOpponentAnalysisPrompt = (userData: any) => {
    const playerName =
      userData.profile?.name || userData.profile?.firstName + " " + userData.profile?.lastName || "Unknown"
    const currentRating = userData.ratings?.[0]?.rating || "N/A"
    const totalMatches = userData.matches?.matches?.length || 0
    const opponentCount = userData.opponentProfiles?.length || 0
  
  
    return `
  You are an expert squash analyst. Analyze this player's performance against different types of opponents.
  
  PLAYER INFORMATION:
  - Name: ${playerName}
  - Current Rating: ${currentRating}
  - Total Matches Analyzed: ${totalMatches}
  - Opponent Profiles Available: ${opponentCount}
  
  COMPLETE MATCH HISTORY (All matches provided):
  ${JSON.stringify(userData.matches?.matches || [], null, 2)}
  
  OPPONENT PROFILES WITH DETAILED DATA:
  ${JSON.stringify(userData.opponentProfiles || [], null, 2)}
  
  HEAD-TO-HEAD PERFORMANCE RECORDS:
  ${JSON.stringify(userData.headToHeadRecords || {}, null, 2)}
  
  PERFORMANCE BY OPPONENT RATING RANGES:
  ${JSON.stringify(userData.opponentTypePerformance?.byRatingRange || {}, null, 2)}
  
  PERFORMANCE BY OPPONENT AGE GROUPS:
  ${JSON.stringify(userData.opponentTypePerformance?.byAge || {}, null, 2)}
  
  MATCH CONTEXT ANALYSIS:
  ${JSON.stringify(userData.matchContexts || {}, null, 2)}
  
  PLAYER'S CURRENT RANKINGS:
  ${JSON.stringify(userData.rankings || [], null, 2)}
  
  PLAYER'S WIN/LOSS RECORD:
  ${JSON.stringify(userData.record || [], null, 2)}
  
  Based on this comprehensive data, provide a detailed opponent analysis in the following JSON format:
  
  {
    "opponentAnalysis": {
      "vsHigherRated": {
        "winRate": "X%",
        "totalMatches": X,
        "insights": "Detailed analysis of performance against higher-rated opponents with specific examples"
      },
      "vsLowerRated": {
        "winRate": "X%", 
        "totalMatches": X,
        "insights": "Analysis of performance against lower-rated opponents"
      },
      "vsSimilarRated": {
        "winRate": "X%",
        "totalMatches": X, 
        "insights": "Analysis of performance against similarly-rated opponents"
      }
    },
    "headToHeadAnalysis": {
      "strongestRivals": [
        {
          "name": "Opponent name",
          "record": "W-L",
          "lastMatch": "Date",
          "analysis": "Why this opponent is challenging"
        }
      ],
      "favorableMatchups": [
        {
          "name": "Opponent name", 
          "record": "W-L",
          "analysis": "Why this matchup works well"
        }
      ]
    },
    "playingStyle": "Comprehensive analysis of playing style based on opponent matchups and match patterns",
    "mentalGame": {
      "assessment": "Strong/Average/Needs Work",
      "evidence": ["Specific examples from close matches, comebacks, or pressure situations"]
    },
    "consistency": {
      "rating": "High/Medium/Low",
      "explanation": "Analysis based on performance variance against similar opponents"
    },
    "upsetPotential": {
      "rating": "High/Medium/Low",
      "explanation": "Ability to beat higher-rated opponents with specific examples"
    },
    "tacticalRecommendations": [
      "Specific tactical advice for different opponent types",
      "Areas to focus on in training",
      "Mental game improvements"
    ],
    "tournamentStrategy": [
      "Recommendations for tournament preparation",
      "Optimal tournament level selection",
      "Draw management strategies"
    ]
  }
  
  IMPORTANT: 
  1. Calculate actual win rates and match statistics from ALL matches provided above.
  2. Use specific opponent names and match results in your analysis
  3. Reference actual tournaments, dates, and scores when possible
  4. Provide actionable insights based on real performance patterns
  5. If no opponent data is available, clearly state this limitation
  
  Return ONLY the JSON object, no additional text or markdown formatting.
  `
  }
  