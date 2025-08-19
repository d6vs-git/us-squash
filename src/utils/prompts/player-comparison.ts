export const createPlayerComparisonPrompt = (userData: any, comparisonPlayerData: any, headToHeadMatches: any[]) => `
You are an expert squash analyst. Your task is to compare the current user's squash profile and performance against a specific comparison player. Provide a detailed analysis, highlighting strengths, weaknesses, and strategic insights.

**CURRENT USER'S PROFILE:**
${JSON.stringify(
  {
    profile: userData.profile,
    ratings: userData.ratings,
    rankings: userData.rankings,
    record: userData.record,
    recentMatches: userData.matches?.matches?.slice(0, 20), // Limit recent matches for prompt size
  },
  null,
  2,
)}

**COMPARISON PLAYER'S PROFILE:**
${JSON.stringify(
  {
    profile: comparisonPlayerData.profile,
    ratings: comparisonPlayerData.ratings,
    rankings: comparisonPlayerData.rankings,
    recentMatches: comparisonPlayerData.matches?.matches?.slice(0, 20), // Limit recent matches for prompt size
  },
  null,
  2,
)}

**HEAD-TO-HEAD MATCHES (if any, between current user and comparison player):**
${JSON.stringify(headToHeadMatches, null, 2)}

**INSTRUCTIONS:**
1.  **Overall Comparison**: Provide a high-level comparison of their current ratings, rankings, and general playing styles.
2.  **Strengths & Weaknesses**: Identify key strengths and weaknesses for both the current user and the comparison player based on their profiles and recent match data.
3.  **Head-to-Head Analysis (if applicable)**:
    *   If head-to-head matches exist, analyze the patterns, scores, and outcomes of those specific matches.
    *   Explain why one player might have had an advantage in those encounters.
    *   Highlight any trends or specific tactics that were effective or ineffective.
4.  **Strategic Recommendations for Current User**: Based on the comparison, provide actionable strategic recommendations for the current user if they were to play against this comparison player in the future. Include tactical advice, mental game tips, and areas to exploit or defend.
5.  **Key Takeaways**: Summarize the most important insights from this comparison.

**Output the analysis in the following JSON format:**
{
  "comparisonSummary": "Overall high-level comparison of the two players.",
  "currentUserAnalysis": {
    "strengths": ["Strength 1", "Strength 2"],
    "weaknesses": ["Weakness 1", "Weakness 2"],
    "playingStyle": "Description of current user's playing style."
  },
  "comparisonPlayerAnalysis": {
    "strengths": ["Strength 1", "Strength 2"],
    "weaknesses": ["Weakness 1", "Weakness 2"],
    "playingStyle": "Description of comparison player's playing style."
  },
  "headToHeadAnalysis": {
    "exists": true | false,
    "record": "e.g., 3-2 in favor of Current User",
    "insights": "Analysis of patterns, key moments, and why matches were won/lost.",
    "keyTacticsObserved": ["Tactic 1", "Tactic 2"]
  },
  "strategicRecommendations": [
    "Recommendation 1 (e.g., 'Exploit their backhand drop')",
    "Recommendation 2 (e.g., 'Focus on consistent length to their forehand')",
    "Recommendation 3 (e.g., 'Maintain high intensity in rallies')"
  ],
  "keyTakeaways": ["Takeaway 1", "Takeaway 2"]
}

Ensure all analysis is grounded in the provided data. If specific data points are missing, state that the analysis is based on available information.
`
