export default async function handler(req, res) {
  try {
    const { prompt, mode } = JSON.parse(req.body);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a Senior Architect. Return ONLY a JSON object. NO MARKDOWN. NO BACKTICKS. Use these EXACT keys: district, max_height, parking_exemptions, ibc_occupancy, strategic_play. Provide real architectural data for the address provided."
          },
          { role: "user", content: `Analyze this project: ${prompt}. Mode: ${mode}.` }
        ],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    
    // Check if OpenAI actually sent a message back
    if (data.choices && data.choices[0].message.content) {
      const aiContent = JSON.parse(data.choices[0].message.content);
      res.status(200).json(aiContent);
    } else {
      throw new Error("OpenAI returned an empty response.");
    }
  } catch (error) {
    console.error("API Error:", error.message);
    res.status(500).json({ error: error.message });
  }
}
