import { config } from "./config";

export const getGeminiResponse = async (prompt: string): Promise<any> => {
  const apiKey = config.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 3000,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Clean and parse response for JSON
  text = text.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to parse JSON response:", text);
    // Return structured fallback
    return {
      analysis: text,
      error: "Response was not valid JSON",
      rawResponse: text,
    };
  }
};
