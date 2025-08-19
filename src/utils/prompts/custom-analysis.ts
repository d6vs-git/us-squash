export const createCustomAnalysisPrompt = (userData: any, customPrompt: string) => `
You are an expert squash analyst. The user has requested a custom analysis with the following prompt:

USER REQUEST: "${customPrompt}"

COMPLETE PLAYER DATA:
${JSON.stringify(userData, null, 2)}

Provide a detailed analysis that directly addresses the user's request. Use the comprehensive player data to give specific, actionable insights.

Structure your response as a JSON object with relevant sections based on the user's request. Always include:
- A summary of what was analyzed
- Specific findings based on the data
- Actionable recommendations
- Supporting evidence from the player data

Format your response as valid JSON.
`
