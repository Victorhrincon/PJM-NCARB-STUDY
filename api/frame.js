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
            content: "You are a Senior Architect. Analyze the address. You MUST return a JSON object with these EXACT keys: district, max_height, parking_exemptions, ibc_occupancy, strategic_play. Fill them with real data."
          },
          { role: "user", content: `Analyze: ${prompt} in ${mode} mode.` }
        ],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    console.log("AI RESPONSE RAW:", data.choices[0].message.content); // THIS IS THE TRUTH LOG
    
    const aiContent = JSON.parse(data.choices[0].message.content);
    res.status(200).json(aiContent);
  } catch (error) {
    console.error("DETAILED ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
}
